/*
 *  ui.js
 *
 */


util = require("./util");


exports.print = print;
exports.showTitle = showTitle;
exports.showButtons = showButtons;
exports.getButtonSelection = getButtonSelection;
exports.getFieldInputs = getFieldInputs;


var spacing = "  ";

function print (msg) {
  console.log(spacing + (msg || ""));
}

function showTitle (view) {
  print();
  util.evaluateDynamicData(view.title, function (err, title) {
    switch (view.type) {
      case "buttons":
        if (title) print("┌ " + title);
        else print("╷ ");
        break;
      case "fields":
        if (title) print(title);
    }
  });
}

function showButtons (buttons, view, auto) {
  var buttonsArray = (Array.isArray(buttons)) ? buttons : Object.keys(buttons);
  var categories = view.categories;
  if (categories) {
    var buttonsCategorized = {};
    for (var b in buttons) {
      var button = buttons[b];
      var pointer = buttonsCategorized;
      for (var c in categories) {
        var category = categories[c];
        var buttonCategory = button[category];
        pointer = pointer[buttonCategory] || 
                  (pointer[buttonCategory] = (c < categories.length-1) ? {} : []);
        if (Array.isArray(pointer)) {
          pointer.push(button);
        }
      }
    }
  }
  
  /*    
  buttonsArray.forEach(function (button, i) {
    var bracket = (i === buttonsArray.length-1) ? "└─" : "├─";
    print(bracket + "[ " + (i+1) + " ]─ " + util.generateButtonLabel(button, view.properties));
  });
  */
}

function getButtonSelection (buttons, view, cb) {
  print();
  var rl = readline();
  var buttonsArray = (Array.isArray(buttons)) ? buttons : Object.keys(buttons);
  rl.question(spacing + "Enter a number [1-" + buttonsArray.length + "]: ", function (selection) {
    rl.close();
    selection = util.selectButton(buttons, view, selection);
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
      var label = util.generateButtonLabel(selectedButton, view.properties);
      print("You chose '" + label + "'\n");
      cb(selection);
    } else {
      print("Invalid choice");
      getButtonSelection(buttons, view, cb);
    }
  });
}

function getFieldInputs (fields, cb) {
  if (Array.isArray(fields) === false) {   // if the questions aren't in an Array, handle it in a callback wrapper
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
      rl.question(spacing + "─ " + fields.shift(), function (input) {
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
    print();  // newline if we are mid command
    process.exit(0);
  });
  return readline;
}
