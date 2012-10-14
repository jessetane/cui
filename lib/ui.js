/*
 *  ui.js
 *
 */


exports.prompt = prompt;
exports.listOptions = listOptions;
exports.chooseOption = chooseOption;
exports.askQuestions = askQuestions;


function prompt (operations, hasArgs) {
  if (auto) return;
  switch (operations.type) {
    case "question":
      if (operations.prompt) console.log(operations.prompt);
      break;
    case "choice":
      if (operations.prompt) console.log("• " + operations.prompt);
      else console.log("• ");
  }
}

function listOptions (options, props, auto) {
  if (auto) return;
  options.forEach(function (option, i) {
    var bracket = (i === options.length-1) ? "└─" : "├─";
    console.log(bracket + "[ " + (i+1) + " ]─ " + makeOptionLabel(option, props));
  });
}

function chooseOption (options, props, cb) {
  var rl = readline();
  rl.question("Enter a number [1-" + options.length + "]: ", function (i) {
    rl.close();
    var choice = selectNumericalOption(options, props, i);
    if (choice) {
      var label = makeOptionLabel(choice, props);
      if (!preChoosen) console.log("You chose \"" + label + "\"");
      cb(choice);
    } else {
      console.log("Invalid choice");
      chooseOption(options, props, null, cb);
    }
  });
}

function askQuestions (questions, cb) {
  if (!questions.forEach) { // if the questions are in a hash, wrap the cb to deal with it
    var keys = Object.keys(questions);
    var wrapped = cb;
    cb = function (answers) {
      var hash = {};
      keys.forEach(function (key, i) { if (answers[i]) hash[key] = answers[i] });
      wrapped(hash);
    }
    questions = _.values(questions);
  }
  var answers = [];
  if (typeof questions == "string") questions = [ questions ];
  ask = function () {
    if (!questions || questions.length === 0) {
      cb(answers);
    } else {
      var rl = readline();
      rl.question("• " + questions.shift(), function (answer) {
        answers.push(answer || undefined);
        rl.close();
        ask();
      });
    }
  }
  ask();
}

function selectNumericalOption (options, props, choice) {
  var n = Number(choice);
  if (isNaN(n) || n > options.length || n < 1) {
    return null;
  } else {
    return options[Math.floor(n)-1];
  }
}

function readline () {
  var readline = require("readline");
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}
