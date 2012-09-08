#!/usr/bin/env node

/*
 *  operator.js
 *
 */


var util = require("./util/util");
var args = process.argv.slice(2);
var operator = {};


// load operations starting from the cwd
loadOperations(process.cwd(), function (err, operations) {
  if (!operations) {
    console.log("No operations found", err);
  } else {
    operator.operations = operations;
    util.listItems(operations);
    util.pickItem("Pick an operation:", operations, "name", function (choice) {
      operation = choice.operation;
      questions = choice.params || util.introspectParams(operation).map(function (param) { return param + "? " });
      util.answerQuestions(questions, function (answers) {
        var val = operation.apply(operator, answers);
        if (val) console.log(val);
      });
    });
  }
});


// look for a package.json file
// require the "main" entry and
// execute the operator function
function loadOperations (dir, cb) {
  var packageJSON;
  try {
    packageJSON = null;
    packageJSON = require(dir + "/package");
    var main = dir + "/" + (packageJSON.main || "index");
    var operations = require(main).operator(operator);
  } catch (err) {
    if (!packageJSON && err === "MODULE_NOT_FOUND") {
      loadOperations(dir);
      return;
    } else {
      cb(err);
    }
  }
  cb(null, operations);
}
