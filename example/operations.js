/*
 *  operations.js
 *
 */


var operator;

module.exports = function (op) {
  operator = op;
  console.log("Some examples.");
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


// hello world
var basic = {
  name: "Basic",
  type: "executable",
  data: function (cb) { console.log("Hello World"); cb(); }
};


// calculates your age in various units
var intermediate = {
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
        console.log("Your are " + age.toFixed(2) + " " + units + " old");
        cb();
      }
    }
  ]
};


// for now just testing nested sequences
var advanced = {
  name: "Advanced",
  type: "sequence",
  data: [
    {
      type: "sequence",
      data: [
        {
          type: "executable",
          data: function (cb) { console.log("just,"); cb() }
        }, {
          type: "executable",
          data: function (cb) { console.log("like,"); cb() }
        }
      ]
    }, {
      type: "executable",
      data: function (cb) { console.log("that."); cb() }
    }
  ]
};
