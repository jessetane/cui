/*
 *  ui.js
 *
 */


util = require("./util");


exports.showTitle = showTitle;
exports.showButtons = showButtons;
exports.getButtonSelection = getButtonSelection;
exports.getFieldInputs = getFieldInputs;


function showTitle (view) {
  util.evaluateDynamicData(view.title, function (err, title) {
    switch (view.type) {
      case "buttons":
        if (title) console.log("• " + title);
        else console.log("• ");
        break;
      case "fields":
        if (title) console.log(title);
    }
  });
}

function showButtons (buttons, props, auto) {
  buttons.forEach(function (button, i) {
    var bracket = (i === buttons.length-1) ? "└─" : "├─";
    console.log(bracket + "[ " + (i+1) + " ]─ " + util.generateButtonLabel(button, props));
  });
}

function getButtonSelection (buttons, props, cb) {
  var rl = readline();
  rl.question("Enter a number [1-" + buttons.length + "]: ", function (selection) {
    rl.close();
    selection = util.selectButton(buttons, props, selection);
    if (selection) {
      var label = util.generateButtonLabel(selection, props);
      console.log("You chose \"" + label + "\"");
      cb(selection);
    } else {
      console.log("Invalid choice");
      getButtonSelection(buttons, props, cb);
    }
  });
}

function getFieldInputs (fields, cb) {
  if (fields instanceof Array === false) {   // if the questions aren't in an Array, handle it in a callback wrapper
    var keys = Object.keys(fields);
    var wrapped = cb;
    cb = function (inputs) {
      var hash = {};
      keys.forEach(function (key, i) { 
        if (inputs[i]) {
          hash[key] = inputs[i];
        }
      });
      wrapped(hash);
    }
    var temp = [];
    for (var f in fields) temp.push(fields[f]);
    fields = temp;
  }
  var inputs = [];
  if (typeof fields == "string") fields = [ fields ];
  prompt = function () {
    if (!fields || fields.length === 0) {
      cb(inputs);
    } else {
      var rl = readline();
      rl.question("• " + fields.shift(), function (input) {
        rl.close();
        inputs.push(input || undefined);
        prompt();
      });
    }
  }
  prompt();
}

function readline () {
  var readline = require("readline");
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}
