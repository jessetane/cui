/*
 *  ui.js
 *
 */


util = require("./util");

exports.showTitle = showTitle;
exports.showButtons = showButtons;
exports.getButtonPress = getButtonPress;
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

function showButtons (options, props, auto) {
  buttons.forEach(function (button, i) {
    var bracket = (i === buttons.length-1) ? "└─" : "├─";
    console.log(bracket + "[ " + (i+1) + " ]─ " + util.generateButtonLabel(button, props));
  });
}

function getButtonPress (buttons, props, cb) {
  var rl = readline();
  rl.question("Enter a number [1-" + buttons.length + "]: ", function (i) {
    rl.close();
    var button = selectButtonNumerically(buttons, props, i);
    if (button) {
      var label = util.generateButtonLabel(button, props);
      console.log("You chose \"" + label + "\"");
      cb(button);
    } else {
      console.log("Invalid choice");
      getButtonPress(buttons, props, cb);
    }
  });
}

function selectButtonNumerically (buttons, props, i) {
  i = Number(i);
  if (isNaN(i) || i > buttons.length || i < 1) {
    return null;
  } else {
    return buttons[Math.floor(i)-1];
  }
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
        inputs.push(input || undefined);
        rl.close();
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
