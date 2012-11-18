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
  var buttonsArray = (buttons instanceof Array) ? buttons : Object.keys(buttons);
  buttonsArray.forEach(function (button, i) {
    var bracket = (i === buttonsArray.length-1) ? "└─" : "├─";
    console.log(bracket + "[ " + (i+1) + " ]─ " + util.generateButtonLabel(button, props));
  });
}

function getButtonSelection (buttons, props, cb) {
  var rl = readline();
  var buttonsArray = (buttons instanceof Array) ? buttons : Object.keys(buttons);
  rl.question("Enter a number [1-" + buttonsArray.length + "]: ", function (selection) {
    rl.close();
    selection = util.selectButton(buttons, props, selection);
    if (selection) {
      var selectedButton = selection;
      if (buttons !== buttonsArray) {
        for (var b in buttons) {
          if (selection === buttons[b]) {
            selectedButton = b;
            break;
          }
        }
      }
      var label = util.generateButtonLabel(selectedButton, props);
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
  readline = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  readline.on("SIGINT", function () {
    console.log();  // newline if we are mid command
    process.exit(0);
  });
  return readline;
}
