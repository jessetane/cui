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
      var label = generateButtonLabel(buttonsArray[b], props).toLowerCase();
      if (label.search(selection.toLowerCase()) > -1) {
        temp = buttons[b];
        break;
      }
    }
    selection = temp;
  } else if (n > buttonsArray.length || n < 1) {
    selection = null;
  } else {
    selection = buttonsArray[Math.floor(n)-1];
    if (buttons !== buttonsArray) selection = buttons[selection];
  }
  return selection;
}
