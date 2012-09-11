/*
 *  util.js
 *
 */
 

exports.selectNumericalChoice = function (items, choice) {
  var choice = Number(choice);
  if (choice === NaN || choice > items.length || choice < 1) {
    return null;
  } else {
    return items[Math.floor(choice)-1];
  }
}

exports.readline = function () {
  var readline = require("readline");
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/*
if (props.map) {
  label = props.map(function (prop, n) {
    var pre, post = "─";
    if (n !== 0) pre = "─";
    else if (n === props.length-1) post = "";
    return pre + item[prop] + post;
  });
} else {
  label = item[props];
}
*/
exports.listItems = function (items, props) {
  if (!items.__proto__.forEach) items = Object.keys(items);
  items.forEach(function (item, i) {
    var bracket = (i === items.length-1) ? " └─" : " ├─";
    console.log(bracket + "[ " + (i+1) + " ]─ " + item);
  });
}

exports.pickItem = function (items, props, cb) {
  var pick = function () {
    var rl = exports.readline()
    rl.question("Enter a number [1-" + items.length + "]: ", function (i) {
      rl.close();
      var choice = exports.selectNumericalChoice(items, i);
      if (choice) {
        var msg = " • ";
        if (props) {
          if (props.forEach) {
            props.forEach(function (prop, i) {
              if (i > 0) {
                msg += " ─ " + choice[prop]
              } else {
                msg += choice[prop]
              }
            });
          } else {
            msg += choice[props];
          }
        } else {
          msg += choice;
        }
        console.log(msg);
        cb(choice);
      } else {
        console.log("Invalid choice");
        pick();
      }
    });
  }
  pick();
}

exports.answerQuestions = function (questions, cb) {
  var answers = []
  complete = function () {
    if (!questions || questions.length === 0) {
      cb(answers);
    } else {
      var rl = exports.readline();
      var bracket = (questions.length === 1) ? " └─ " : " ├─ ";
      rl.question(bracket + questions.shift(), function (answer) {
        answers.push(answer || undefined);
        rl.close();
        complete();
      });
    }
  }
  complete();
}

exports.introspectParams = function (func) {
  params = func.toString().split("(")[1].split(")")[0].split(",");
  return params.map(function (param) {
    return param.replace(" ", "");
  });
}
