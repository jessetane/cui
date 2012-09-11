/*
 *  website.js
 *
 */


exports.operator = function (operator) {
  aws = require("aws").operator(operator);
  return {
    operations: {
      serve: exports.serve,
      deploy: [
        exports.environments,
        aws.operations.configure,
        aws.operations.show,
        exports.deploy
      ]
    }
  }
}

exports.serve = function () {
  server = require("./server");
}

exports.environments = function () {
  fs = require("fs");
  fs.readdir(__dirname + "/environments", function (err, data) {
    console.log(data);
  });
}

exports.deploy = function () {
  
}
