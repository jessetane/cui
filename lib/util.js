/*
 *  util.js
 *
 */


exports.evaluateDynamicData = evaluateDynamicData;
exports.generateButtonLabel = generateButtonLabel;
exports.selectButton = selectButton;


function evaluateDynamicData (data, cb) {
  if (typeof data === "function") {
    data(cb);
  } else {
    cb(null, data);
  }
}

function generateButtonLabel (button, props) {
  var label = button;
  if (typeof button !== "string") {
    props = props || "name";
    if (typeof props === "string") {
      label = button[props];
    } else {
      label = props.map(function (prop) { return button[prop] });
      label = label.join(" ─ ");
    }
  }
  return label;
}

function normalizeButtons (buttons, view) {
  var listed = (Array.isArray(buttons)) ? buttons : Object.keys(buttons);
  var categories = view.categories;
  if (categories) {
    var array = [];
    var categorized = {};
    for (var b in buttons) {
      var button = buttons[b];
      var pointer = categorized;
      for (var c in categories) {
        var category = categories[c];
        var buttonCategory = button[category];
        pointer = pointer[buttonCategory] || 
                  (pointer[buttonCategory] = (c < categories.length-1) ? {} : []);
        if (Array.isArray(pointer)) {
          pointer.push(button);
          listed.push(button);
        }
      }
    }
  }
  return {
    listed: listed,
    categorized: categorized
    raw: buttons
  }
}

categories: [ "make" ]
data = {
  "one": {
    make: "toyota",
    year: 1111
  },
  "two": {
    make: "honda",
    year: 2222
  }
  "three": {
    make: "subaru",
    year: 3333
  }
}


|- honda
|--[ 1 ]- one
|- toyota
|--[ 2 ]- two
|- subaru
---[ 3 ]- three

function selectButton (buttons, view, selection) {
  var buttons = normalizeButtons(buttons, view);
  var n = Number(selection);
  if (isNaN(n)) {
    
    /*
    var temp = null;
    for (var b in buttonsArray) {
      var label = generateButtonLabel(buttonsArray[b], view.properties);
      if (label.toLowerCase().indexOf(selection.toLowerCase()) === 0) {
        if (label.length === selection.length) {
          temp = buttonsArray[b];
          break;
        } else if (temp === null) {
          temp = buttonsArray[b];
        }
      }
    }
    selection = (buttons !== buttonsArray) ? buttons[temp] : temp;
    */
    
  } else if (n > 0 && n <= normal.array.length) {
    
    selection = buttons.listed[Math.floor(n)-1];
    if (buttons.listed !== buttons.raw) selection = buttons.raw[selection];
    
  } else {
    selection = null;
  }
  return selection;
}
