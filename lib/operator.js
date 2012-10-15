#!/usr/bin/env node

/*
 *  operator.js
 *
 */


require("coffee-script");  // support operations written in CS

var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var args = process.argv.slice(2);
var operator = { results: [], sequence: [], ui: require("./ui") };


exports.load = load;
exports.generateOptionLabel = generateOptionLabel;  // ui modules should use this

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
    case "sequence": runSequence(operations); break;
    case "executable": runExecutable(operations); break;
    case "question": runQuestion(operations); break;
    case "choice": runChoice(operations); break;
    default:
      done(new Error("Unrecognized operation type \"" + operations.type + "\""));
      break;
  }
}

function runSequence (operations) {
  if (operations.prompt) console.log(operations.prompt);
  operator.sequence = operations.data.concat(operator.sequence);
  next();
}

function runExecutable (operations) {
  var cb = function (err, result) {
    if (err) return done(err);
    operator.results.push(result);
    next();
  };
  var result = operations.data(cb);
  if (result) cb(null, result);
}

function runQuestion (operations) {
  checkForDynamicData(operations.data, function (err, questions) {
    if (err) return done(err);
    var answers = checkForAnswersTo(questions);
    if (answers) {
      var hash = (questions instanceof Array) ? null : {};
      var i = 0;
      for (var q in questions) {
        if (hash) {
          hash[q] = answers[i];
        } else {
          operator.results.push(answers[i]);
        }
        i++;
      }
      next();
    } else {
      operator.ui.prompt(operations);
      operator.ui.askQuestions(questions, function (answers) {
        operator.results = operator.results.concat(answers);
        next();
      });
    }
  });
}

function runChoice (operations) {
  checkForDynamicData(operations.data, function (err, options) {
    if (err) return done(err);
    var choice = checkForChoiceOf(options);
    if (choice) {
      var n = Number(choice);
      if (isNaN(n)) {
        var temp = null;
        for (var o in options) {
          var label = generateOptionLabel(options[o], operations.properties).toLowerCase();
          if (label.search(choice.toLowerCase()) > -1) {
            temp = options[o];
            break;
          }
        }
        choice = temp;
      } else if (n > options.length || n < 1) {
        choice = null;
      } else {
        choice = options[Math.floor(n)-1];
      }
      if (choice) {
        operator.results.push(choice);
        next();
      } else {
        runChoice(operations);
      }
    } else {
      operator.ui.prompt(operations);
      operator.ui.listOptions(options, operations.properties);
      operator.ui.chooseOption(options, operations.properties, function (choice) {
        operator.results.push(choice);
        next();
      });
    }
  });
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

function done (err) {
  if (err) {
    console.log("Operation failed:", err.message);
  } else if (operator.cache) {
    fs.writeFile(".operator", JSON.stringify(operator.cache), function (err) {
      if (err) console.log("Failed to save operator cache");
    });
  }
}

function checkForDynamicData (data, cb) {
  if (typeof data == "function") {
    var result = data(cb);
    if (result) {
      if (cb) {
        cb(null, result);
      } else {
        return result;
      }
    }
  } else {
    if (cb) {
      cb(null, data);
    } else {
      return data;
    }
  }
}

function checkForAnswersTo (questions) {
  var answers = null;
  if (args.length) {
    answers = args.slice(0, questions.length);
    args = args.slice(questions.length);
  }
  return answers;
}

function checkForChoiceOf (options) {
  var choice = null;
  if (args.length >= 1) {
    choice = args.shift();
  }
  return choice;
}

function generateOptionLabel (option, props) {
  var label = option;
  if (typeof option !== "string") {
    props = props || "name";
    if (typeof props === "string") {
      label = option[props];
    } else {
      label = props.map(function (prop) { return option[prop] });
      label = label.join(" ─ ");
    }
  }
  return label;
}
