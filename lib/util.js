/*
 *  util.js
 *
 */


exports.evaluateDynamicData = evaluateDynamicData;
exports.generateButtonLabel = generateButtonLabel;


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
