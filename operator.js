#!/usr/bin/env node

/*
 *  operator.js
 *
 */


var fs = require("fs");
var crypto = require("crypto");
var util = require("./util/util");
var args = process.argv.slice(2);
var cacheFile;
var module = {};
var sequence = [];
var operator = { results: [] };
require("coffee-script");


// main
loadModule(process.cwd(), function (err, module) {
  if (!module) {
    console.log("No compatible module found:", err.message);
  } else {
    if (module.name) console.log(module.name);
    operate(module);
  }
});

// look for a package.json file
// require the "main" entry and
// execute the operator function
function loadModule (dir, cb) {
  var packageJSON;
  try {
    packageJSON = null;
    packageJSON = require(dir + "/package");
    var main = dir + "/" + (packageJSON.main || "index");
    var module = require(main).operator(operator);
  } catch (err) {
    if (!packageJSON && err === "MODULE_NOT_FOUND") {
      return loadModule(dir, cb);
    } else {
      return cb(err);
    }
  }
  cacheFile = crypto.createHash("md5").update(dir).digest("hex");
  cacheFile = __dirname + "/caches/" + cacheFile;
  fs.readFile(cacheFile, "utf8", function (err, data) {
    if (!err) operator.cache = JSON.parse(data);
    cb(null, module);
  });
}

function operate (operation) {
  switch (operation.type) {
    case "sequence":
      if (operation.prompt) console.log(operation.prompt);
      sequence = operation.data.concat(sequence);
      sequencer();
      break;
    case "executable":
      var cb = function (err, result) {
        if (err) return done(err);
        operator.results.push(result);
        sequencer();
      };
      var result = operation.data(cb);
      if (result) cb(null, result);
      break;
    case "question":
      getDynamicData(operation.data, function (err, questions) {
        if (err) return done(err);
        if (operation.prompt) console.log(operation.prompt);
        askQuestions(questions, function (answers) {
          operator.results = operator.results.concat(answers);
          sequencer();
        });
      });
      break;
    case "choice":
      getDynamicData(operation.data, function (err, options) {
        if (err) return done(err);
        if (operation.prompt) console.log("• " + operation.prompt);
        else console.log("• ");
        listOptions(options, operation.properties);
        chooseOption(options, operation.properties, function (choice) {
          operator.results.push(choice);
          sequencer();
        });
      });
      break;
    default:
      done(new Error("Unrecognized operation type \"" + operation.type + "\""));
      break;
  }
}

function getDynamicData (f, cb) {
  if (typeof f == "function") {
    var result = f(chosen);
    if (result) cb(null, result);
  } else {
    cb(null, f);
  }
}

function sequencer () {
  if (sequence.length) {
    operate(sequence.shift());
  } else if (operator.results.length) {
    var result = operator.results.slice(-1)[0];
    if (result && result.type && result.data) {
      operate(result);
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
    fs.writeFile(cacheFile, JSON.stringify(operator.cache), function (err) {
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
      label = option.name;
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
