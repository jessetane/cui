/*
 *  operations.js
 *
 */


var operator;

module.exports = function (o) {
  operator = o;
  return {
    prompt: "Pick one:",
    type: "choice",
    data: [
      basic,
      intermediate,
      advanced
    ]
  }
}


/*
 *  hello world
 *
 */
var basic = {
  name: "Basic",
  type: "executable",
  data: function () { console.log("Hello World"); }
};


/*
 *  what's your bday
 *
 */
var intermediate = {
  name: "Intermediate",
  type: "sequence",
  prompt: "This example will print your birthday.",
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
    }
  ]
};


/*
 *  calculate your age in various units
 *
 */
var advanced = {
  name: "Advanced",
  type: "sequence",
  prompt: "This example will attempt to determine your age.",
  data: intermediate.data.concat([
    {
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
        console.log("Your are " + age.toFixed(2) + " " + units + " old");
        cb();
      }
    }
  ])
};
