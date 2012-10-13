#!/usr/bin/env node

/*
 *  operator.js
 *
 */


require("coffee-script");  // support operations written in CS

var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var _ = require("underscore");
var ui = require("./ui");
var args = process.argv.slice(2);
var operator = { results: [], sequence: [] };


module.exports = load;

if (require.main == module) {
  find(process.cwd(), function (err, dir, operations) {
    if (!err) {
      load(operations, dir);
    } else {
      console.log("Could not load operations:", err);
    }
  });
}

function find (dir, cb) {
  try {
    var filename = path.normalize(dir + "/operations");
    var operations = require(filename);
    cb(null, dir, operations);
  } catch (err) {
    if (dir !== "/" && err.code === "MODULE_NOT_FOUND" && err.message.search("/operations") > -1) {
      find(path.normalize(dir + "/.."), cb);
    } else {
      cb(err);
    }
  }
}

function load (operations, cacheDir) {
  if (!cacheDir) cacheDir = process.cwd();
  fs.readFile(".operator", "utf8", function (err, data) {
    if (!err) operator.cache = JSON.parse(data);
    run(operations(operator));
  });
}

function run (operations) {
  switch (operations.type) {
    case "sequence":
      if (operations.prompt) console.log(operations.prompt);
      operator.sequence = operations.data.concat(operator.sequence);
      next();
      break;
    case "executable":
      var cb = function (err, result) {
        if (err) return done(err);
        operator.results.push(result);
        next();
      };
      var result = operations.data(cb);
      if (result) cb(null, result);
      break;
    case "question":
      getDynamicData(operations.data, function (err, questions) {
        if (err) return done(err);
        ui.prompt(operations);
        ui.askQuestions(questions, getAnswersFor(questions), function (answers) {
          operator.results = operator.results.concat(answers);
          next();
        });
      });
      break;
    case "choice":
      getDynamicData(operations.data, function (err, options) {
        if (err) return done(err);
        ui.prompt(operations);
        ui.listOptions(options, operations.properties);
        ui.chooseOption(options, operations.properties, getChoiceFor(options), function (choice) {
          operator.results.push(choice);
          next();
        });
      });
      break;
    default:
      done(new Error("Unrecognized operation type \"" + operations.type + "\""));
      break;
  }
}

function next () {
  if (operator.sequence.length) {
    run(operator.sequence.shift());
  } else if (operator.results.length) {
    var result = operator.results.slice(-1)[0];
    if (result && result.type && result.data) {
      run(result);
    } else {
      done();
    }
  } else {
    done();
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

function getAnswersFor (questions) {
  var answers = null;
  if (args.length >= questions.length) {
    answers = args.slice(0, questions.length);
    args = args.slice(questions.length);
  }
  return answers;
}

function getChoiceFor (options) {
  var choice = null;
  if (args.length >= 1) {
    choice = args.shift();
  }
  return choice;
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
