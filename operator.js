#!/usr/bin/env node

/*
 *  operator.js
 *
 */


var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var _ = require("underscore");
var args = process.argv.slice(2);
var sequence = [];
var operator = { results: [] };
require("coffee-script");


module.exports = load;

if (require.main == module) {
  findOperations(process.cwd(), function (err, dir, operations) {
    if (!err) {
      load(operations, dir);
    } else {
      console.log("Could not load operations:", err);
    }
  });
}


function load (operations, cacheDir) {
  if (!cacheDir) cacheDir = process.cwd();
  fs.readFile(".operator", "utf8", function (err, data) {
    if (!err) operator.cache = JSON.parse(data);
    processOperations(operations(operator));
  });
}

function findOperations (dir, cb) {
  try {
    var filename = path.normalize(dir + "/operations");
    var operations = require(filename);
    cb(null, dir, operations);
  } catch (err) {
    if (dir !== "/" && err.code === "MODULE_NOT_FOUND") {
      findOperations(path.normalize(dir + "/.."), cb);
    } else {
      cb(err);
    }
  }
}

function processOperations (operations) {
  switch (operations.type) {
    case "sequence":
      if (operations.prompt) console.log(operations.prompt);
      sequence = operations.data.concat(sequence);
      sequencer();
      break;
    case "executable":
      var cb = function (err, result) {
        if (err) return done(err);
        operator.results.push(result);
        sequencer();
      };
      var result = operations.data(cb);
      if (result) cb(null, result);
      break;
    case "question":
      getDynamicData(operations.data, function (err, questions) {
        if (err) return done(err);
        if (operations.prompt) console.log(operations.prompt);
        askQuestions(questions, function (answers) {
          operator.results = operator.results.concat(answers);
          sequencer();
        });
      });
      break;
    case "choice":
      getDynamicData(operations.data, function (err, options) {
        if (err) return done(err);
        if (operations.prompt) console.log("• " + operations.prompt);
        else console.log("• ");
        listOptions(options, operations.properties);
        chooseOption(options, operations.properties, function (choice) {
          operator.results.push(choice);
          sequencer();
        });
      });
      break;
    default:
      done(new Error("Unrecognized operation type \"" + operations.type + "\""));
      break;
  }
}

function getDynamicData (f, cb) {
  if (typeof f == "function") {
    var result = f(cb);
    if (result) {
      if (cb) {
        cb(null, result);
      } else {
        return result;
      }
    }
  } else {
    if (cb) {
      cb(null, f);
    } else {
      return f;
    }
  }
}

function sequencer () {
  if (sequence.length) {
    processOperations(sequence.shift());
  } else if (operator.results.length) {
    var result = operator.results.slice(-1)[0];
    if (result && result.type && result.data) {
      processOperations(result);
    } else {
      done();
    }
  } else {
    done();
  }
}

function done (err) {
  if (err) {
    console.log("Operation failed:", err.message);
  } else if (operator.cache) {
    fs.writeFile(".operator", JSON.stringify(operator.cache), function (err) {
      if (err) console.log("Failed to save cache");
    });
  }
}

function listOptions (options, props) {
  options.forEach(function (option, i) {
    var bracket = (i === options.length-1) ? "└─" : "├─";
    console.log(bracket + "[ " + (i+1) + " ]─ " + makeOptionLabel(option, props));
  });
}

function chooseOption (options, props, cb) {
  var rl = readline()
  rl.question("Enter a number [1-" + options.length + "]: ", function (i) {
    rl.close();
    var choice = selectNumericalOption(options, i);
    if (choice) {
      var label = makeOptionLabel(choice, props);
      console.log("You chose \"" + label + "\"");
      cb(choice);
    } else {
      console.log("Invalid choice");
      chooseOption(options, props, cb);
    }
  });
}

function makeOptionLabel(option, props) {
  var label = option;
  if (typeof option !== "string") {
    if (props) {
      if (typeof props === "string") {
        label = option[props];
      } else {
        label = props.map(function (prop) { return option[prop] });
        label = label.join(" ─ ");
      }
    } else {
      label = getDynamicData(option.name);
    }
  }
  return label;
}

function selectNumericalOption (options, choice) {
  var choice = Number(choice);
  if (choice === NaN || choice > options.length || choice < 1) {
    return null;
  } else {
    return options[Math.floor(choice)-1];
  }
}

function askQuestions (questions, cb) {
  if (!questions.forEach) { // if the questions are in a hash, wrap the cb to deal with it
    var keys = Object.keys(questions);
    var wrapped = cb;
    cb = function (answers) {
      var hash = {};
      keys.forEach(function (key, i) { if (answers[i]) hash[key] = answers[i] });
      wrapped(hash);
    }
    questions = _.values(questions);
  }
  var answers = [];
  if (typeof questions == "string") questions = [ questions ];
  ask = function () {
    if (!questions || questions.length === 0) {
      cb(answers);
    } else {
      var rl = readline();
      rl.question("• " + questions.shift(), function (answer) {
        answers.push(answer || undefined);
        rl.close();
        ask();
      });
    }
  }
  ask();
}

function readline () {
  var readline = require("readline");
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}
