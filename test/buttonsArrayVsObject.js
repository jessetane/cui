#!/usr/bin/env node

/*
 *  buttonsArrayVsObject.js
 *
 */


var cui = require('../')
var assert = require('assert')

cui.push({
  title: 'This tests buttons in an Array',
  type: 'buttons',
  data: [
    'One',
    'Two',
    'Three'
  ]
})

cui.push(function(cb) {
  console.log('Results:', cui.results)
  assert.ok(cui.results.length === 1)
  cb()
})

cui.push({
  title: 'This tests buttons in an Object',
  type: 'buttons',
  data: {
    'One': 1,
    'Two': 2,
    'Three': 3
  }
})

cui.push(function(cb) {
  console.log('Results:', cui.results)
  assert.ok(cui.results.length === 2 && typeof cui.results[1] === 'number')
  cb()
})
