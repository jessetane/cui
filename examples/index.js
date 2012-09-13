/*
 *  intermediate.js
 *


BASIC
-----------------------------------------------
$prompt > operator
Welcome to the example suite.

• Choose an example:
├─[ 1 ]─ Basic
├─[ 2 ]─ Intermediate
└─[ 3 ]─ Advanced
Enter a number [1-3]: 1
You chose "Basic"
Hello World, from the Basic example!
$prompt >


INTERMEDIATE
-----------------------------------------------
$prompt > operator
Welcome to the example suite.

• Choose an example:
├─[ 1 ]─ Basic
├─[ 2 ]─ Intermediate
└─[ 3 ]─ Advanced
Enter a number [1-3]: 2
You chose "Intermediate"
This example will attempt to determine your age.

• What year were you born? [YYYY]: 1985
• What month were you born? [MM]: 03
• What day were you born? [DD]: 09
You were born March 9th, in 1985.

• Choose the units to display your age in:
├─[ 1 ]─ Years
├─[ 2 ]─ Days
└─[ 3 ]─ Hours
Enter a number [1-3]: 3
You chose "Hours"
You are 1431516 hours old.
$prompt >


ADVANCED
-----------------------------------------------


 */


exports.operator = function (operator) {
  return {
    name: "Welcome to the example suite.",
    type: "choices",
    prompt: "Choose an example:",
    operations: [
      {
        name: "Basic",
        type: "executable",
        operations: function (cb) { console.log("Hello World, from the Basic example!"); cb(); }
      }, {
        name: "Intermediate",
        prompt: "This example will attempt to determine your age.",
        operations: [
          {
            type: "question",
            operations: [
              "What year were you born? [YYYY] ",
              "What month were you born? [MM] ",
              "What day were you born? [DD] "
            ],
          }, {
            type: "executable",
            operations: function (cb) {
              var results = operator.results.slice(-3);
              bday = new Date(results[2] + "/" + results[1] + "/" + results[0]);
              console.log("You were born " + bday.toString());
              cb(null, bday);
            },
          }, {
            type: "choices",
            operations: [
              "Years",
              "Days",
              "Hours"
            ]
          }, {
            type: "executable",
            operations: function () {}
          }
        ] 
      }, {
        name: "Advanced",
        type: "executable",
        executable: function (cb) { console.log("Hello World, from the Advanced example!"); cb(); }
      }
    ]
  }
}
