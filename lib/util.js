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

function selectButton (buttons, props, selection) {
  var n = Number(selection);
  var buttonsArray = (buttons instanceof Array) ? buttons : Object.keys(buttons);
  if (isNaN(n)) {
    var temp = null;
    for (var b in buttonsArray) {
      var label = generateButtonLabel(buttonsArray[b], props);
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
  } else if (n > 0 && n <= buttonsArray.length) {
    selection = buttonsArray[Math.floor(n)-1];
    if (buttons !== buttonsArray) selection = buttons[selection];
  } else {
    selection = null;
  }
  return selection;
}
