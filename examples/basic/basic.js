/*
 *  basic.js
 *
 *  For a module to expose its functionality to an operator, it must export a special function
 *  named "operator" which returns an Array of possible functions and their usage instructions.
 *
 */
 
 
fs = require("fs");


exports.operator = function () {
  return [
    {
      name: "ls",
      operation: fs.readdirSync
    }, {
      name: "touch",
      operation: fs.openSync
    }, {
      name: "mkdir",
      operation: fs.mkdirSync,
      params: [ "Directory name? " ],
      help: "This operation creates a new empty directory."
    }
  ]
}
