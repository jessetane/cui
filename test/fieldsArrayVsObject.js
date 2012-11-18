#!/usr/bin/env node

/*
 *  fieldsArrayVsObject.js
 *
 */


var cui = require("../lib/cui");
var assert = require("assert");

cui.push({
  title: "This tests fields in an Array",
  type: "fields",
  data: [
    "One: ",
    "Two: ",
    "Three: "
  ],
  action: function (cb) {
    console.log("Results:", cui.results);
    assert.ok(cui.results.length === 3);
    cb();
  }
});

cui.push({
  title: "This tests fields in an Object",
  type: "fields",
  data: {
    one: "One: ",
    two: "Two: ",
    three: "Three: "
  },
  action: function (cb) {
    console.log("Results:", cui.results);
    assert.ok(cui.results.length === 4 && cui.results[3].toString() === {}.toString());
    cb();
  }
});
