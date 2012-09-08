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

exports.listItems = function (items) {
  console.log("TODO: LIST OF CHOICES");
}

exports.pickItem = function (prompt, items, props, cb) {
  var pick = function () {
    var rl = exports.readline()
    rl.question(prompt + "[1-" + items.length + "] ", function (i) {
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
        answers.push(answer);
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
