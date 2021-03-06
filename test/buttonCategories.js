#!/usr/bin/env node

/*
 *  buttonCategories.js
 *
 */


var cui = require('../')
//var assert = require('assert')

cui.push({
  title: 'Cars!',
  type: 'buttons',
  categories: [ 'make', 'model' ],
  properties: [ 'year', 'make', 'model' ],
  data: [
    {
      make: 'Toyota',
      model: 'Camry',
      year: 1987,
    }, {
      make: 'Subaru',
      model: 'Loyale',
      year: 1991
    }, {
      make: 'Subaru',
      model: 'Forrester',
      year: 2004
    }, {
      make: 'Subaru',
      model: 'Loyale',
      year: 1993
    }, {
      make: 'Subaru',
      model: 'Legacy',
      year: 1996
    }, {
      make: 'Toyota',
      model: 'Carolla',
      year: 1996
    }, {
      make: 'Toyota',
      model: 'Landcruiser',
      year: 1997
    }, {
      make: 'Subaru',
      model: 'Legacy',
      year: 2003
    }, {
      make: 'Toyota',
      model: 'Camry',
      year: 1991
    }, {
      make: 'Toyota',
      model: 'Carolla',
      year: 2007
    }
  ]
})

cui.push(function(cb) {
  console.log(cui.last(1))
  cb()
})
