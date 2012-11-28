#!/usr/bin/env node

/*
 *  exactButtonMatch.js
 *
 */


var cui = require("../lib/cui");
var assert = require("assert");

cui.push({
  title: "Exact button label matching",
  type: "buttons",
  data: [
    "Ones",
    "One.a-b-c-d",
    "One.a-b-c",
    "One.a-b",
    "One.a",
    "One"
  ],
  action: function (cb) {
    console.log("Result:", cui.last(1));
    cb();
  }
});
