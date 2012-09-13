#!/usr/bin/env node

/*
 *  operator.js
 *
 */


var util = require("./util/util");
var args = process.argv.slice(2);
var operator = { results: [] };
var module = {};
var operations = [];


// main
loadModule(process.cwd(), function (err, module) {
  if (!module) {
    console.log("No compatible module found", err);
  } else {
    if (module.name) console.log(module.name + "\n");
    operate(module);
  }
});


function operate (operation) {
  var operations = operation.operations || operation;
  switch (operation.type) {
    case "executable":
      
      break;
    case "question":
      break;
    case "choices":
      var chosen = function (err, options) {
        if (err) throw err;
        if (operation.prompt) console.log("• " + operation.prompt);
        else console.log("• ");
        listOptions(options, operation.properties);
        chooseOption(options, operation.properties, function (choice) {
          operator.results.push(choice);
          if (choice.operations) operator(choice);
          else operator(operations);
        });
      };
      if (typeof operations == "function") {
        var options = operations(chosen);
        if (options) chosen(null, options);
      }
      break;
    default:
      
      break;
  }
}

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
      loadModule(dir);
      return;
    } else {
      cb(err);
    }
  }
  cb(null, module);
}

function listOptions (options, props) {
  options.forEach(function (option, i) {
    var bracket = (i === options.length-1) ? "└─" : "├─";
    console.log(bracket + "[ " + (i+1) + " ]─ " + makeChoiceLabel(item, props));
  });
}

function chooseOption (options, props, cb) {
  var rl = exports.readline()
  rl.question("Enter a number [1-" + options.length + "]: ", function (i) {
    rl.close();
    var choice = exports.selectNumericalOption(options, i);
    if (choice) {
      var label = makeOptionLabel(choice, props);
      console.log("You chose \"" + label + "\"");
      cb(choice);
    } else {
      console.log("Invalid choice");
      choose(options, props, cb);
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
  var answers = []
  ask = function () {
    if (!questions || questions.length === 0) {
      cb(null, answers);
    } else {
      var rl = exports.readline();
      var bracket = (questions.length === 1) ? " └─ " : " ├─ ";
      rl.question(bracket + questions.shift(), function (answer) {
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
