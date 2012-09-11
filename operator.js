#!/usr/bin/env node

/*
 *  operator.js
 *
 */


var util = require("./util/util");
var args = process.argv.slice(2);
var operator = {};
var module = {};
var choices = [];
var position = 0;




// main - load the current module
loadModule(process.cwd(), function (err, module) {
  if (!module) {
    console.log("No compatible module found", err);
  } else {
    if (module.greeting) console.log(module.greeting + "\n");
    choose(module.operations, module.prompt, function (choice) {
      console.log("Done");
    });
  }
});

//
function choose (items, props, cb) {
  if (module.prompt) console.log(" • " + module.prompt);
  else console.log(" • ");
  util.listItems(items, props);
  util.pickItem(items, props, cb);
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

/*
//
function interrogate (questions, cb) {
  util.answerQuestions(questions, cb);
}


//
function operates (subject) {
  if (subject.operations) {
    makeChoices(subject.operations, function (err, choice) {
      choices.push(choice);
      operate(subject.operations[choice]);
    });
  } else if (subject.sequence) {
    if (position < subject.sequence.length-1) {
      execute(subject.sequence[position]);
      position++;
    }
  } else if (subject.operation) {
    execute(subject.operation);
  }
}

//
function askQuestions () {
  
}

//
function makeChoices (items, cb) {
  util.listItems(items);
  util.pickItem(null, operations, "name", function (choice) {
    operation = choice.operation;
    questions = choice.params || util.introspectParams(operation).map(function (param) { return param + "? " });
    util.answerQuestions("Answer the following questions:", questions, function (answers) {
      var val = operation.apply(operator, answers);
      if (val) console.log(val);
    });
  });
}

//
function execute (operation) {
  var params;
  if (results.length) params = results.slice(-1)[0].params
  params.push(function () {
    p();
    
  });
  operation.apply(this, params);
}

//
function p (subject) {
  if (subject.prompt) console.log(" • " + subject.prompt);
  else console.log(" • ");
}
*/
