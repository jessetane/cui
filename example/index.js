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
    prompt: "Choose an example:",
    type: "choice",
    data: [
      {
        name: "Basic",
        type: "executable",
        data: function (cb) { console.log("Hello World, from the Basic example!"); cb(); }
      }, {
        name: "Intermediate",
        type: "sequence",
        prompt: "This example will attempt to determine your age.",
        data: [
          {
            type:"question",
            data: [
              "What month were you born? [MM] ",
              "What day were you born? [DD] ",
              "What year were you born? [YYYY] "
            ]
          }, {
            type: "executable",
            data: function (cb) {
              var results = operator.results.slice(-3);
              var str = results[0] + "/" + results[1] + "/" + results[2];
              bday = new Date(str);
              if (bday == "Invalid Date") {
                cb(new Error(str + " is not a valid date."));
              } else {
                console.log("You were born " + bday.toDateString());
                cb(null, bday);
              }
            }
          }, {
            type: "choice",
            prompt: "Choose units to display your age in:",
            data: [
              "Years",
              "Days",
              "Hours"
            ]
          }, {
            type: "executable",
            data: function (cb) {
              var results = operator.results.slice(-2);
              var units = results[1];
              var bday = results[0].getTime();
              var today = new Date().getTime();
              var age = today-bday;
              switch (units) {
                case "Years":
                  age = age/1000/60/60/24/365;
                  break;
                case "Days":
                  age = age/1000/60/60/24;
                  break;
                case "Hours":
                  age = age/1000/60/60;
                  break;
              }
              console.log("Your are " + age + " " + units + " old");
              cb();
            }
          }
        ]
      }, {
        name: "Advanced",
        type: "sequence",
        data: [
          {
            type: "sequence",
            data: [
              {
                type: "executable",
                data: function (cb) { console.log("Hello,"); cb() }
              }, {
                type: "executable",
                data: function (cb) { console.log("ROY"); cb() }
              }
            ]
          }, {
            type: "executable",
            data: function (cb) { console.log("boom"); cb() }
          }
        ]
      }
    ]
  }
}
