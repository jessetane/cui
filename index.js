/*
 *  index.js
 *
 */

// deps
var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec
var util = require('./lib/util')
var ui = require('./lib/ui')

// exports
exports.push = push
exports.splice = splice
exports.last = last
exports.save = save
exports.print = ui.print

// getter setter properties
exports.__defineGetter__('args', function() { return args })
exports.__defineSetter__('args', function(a) { args = a })
exports.__defineGetter__('cache', function() { return cache })
exports.__defineSetter__('cache', function(c) { cache = c })
exports.__defineGetter__('results', function() { return results })
exports.__defineSetter__('results', function(r) { results = r })

// locals
var args = null
var cache, cachedir
var results = []
var sequence = []
var spliced = []
var currentView = null

// try and load the cache first thing
var main = module.parent.filename
cachedir = main.slice(0, main.lastIndexOf('/'))
load()

function load() {
  try {
    var data = fs.readFileSync(cachedir + '/.cui', 'utf8')
    cache = JSON.parse(data)
  } catch (err) {
    // console.log('Could not load cache', err)
  }
}

function save(cb) {
  fs.writeFile(cachedir + '/.cui', JSON.stringify(cache), cb)
}

function push(v) {
  if (currentView === null && sequence.length === 0) {
    process.nextTick(run)
  }
  sequence.push(v)
}

function splice(v) {
  if (currentView === null && sequence.length === 0) {
    process.nextTick(run)
  }
  spliced.push(v)
}

function last(index) {
  return results.slice(-index)[0]
}

function run() {
  if (!args) args = process.argv.slice(2)
  if (currentView) {
    sequence.shift()
    sequence = spliced.concat(sequence)
    spliced = []
  }
  if (sequence.length === 0) return done()
  currentView = sequence[0]
  if (typeof currentView === 'function') {
    currentView(function(err) {
      if (err) done(err)
      else next()
    })
  } else {
    switch (currentView.type) {
      case 'buttons':
        getButtonSelection(currentView)
        break
      case 'fields':
        getFieldInputs(currentView)
        break
      default:
        done(new Error('Unrecognized operation type \'' + currentView.type + '\''))
    }
  }
}

function next() {
  if (currentView.action) {
    currentView.action(function(err) {
      if (err) return done(err)
      run()
    })
  } else {
    run()
  }
}

function getButtonSelection() {
  util.evaluateDynamicData(currentView.data, function(err, buttons) {
    if (err) return done(err)
    var arg = (args.length) ? args.shift() : null
    if (arg) {
      var selection = util.selectButton(buttons, currentView, arg)
      if (selection) {
        results.push(selection)
        next()
      } else {
        args = []
        getButtonSelection(currentView)
      }
    } else {
      ui.showTitle(currentView)
      ui.showButtons(buttons, currentView)
      ui.getButtonSelection(buttons, currentView, function(selection) {
        results.push(selection)
        next()
      })
    }
  })
}

function getFieldInputs() {
  util.evaluateDynamicData(currentView.data, function(err, fields) {
    if (err) return done(err)
    if (typeof fields === 'string') fields = [ fields ]
    var hash = (Array.isArray(fields)) ? null : {}
    var fieldsWithArg = 0
    for (var f in fields) {
      var arg = (args.length) ? args.shift() : null
      if (arg) {
        if (hash) {
          hash[f] = arg
        } else {
          results.push(arg)
        }
      } else {
        break
      }
      fieldsWithArg++
    }
    for (var i=0; i<fieldsWithArg; i++) fields.shift()   // FIX: less than ideal as it can permanently disfigure the view
    if (fields.length === 0) {
      next()
    } else {
      if (fieldsWithArg === 0) ui.showTitle(currentView)
      ui.getFieldInputs(fields, function(inputs) {
        if (hash) {
          for (var key in inputs) hash[key] = inputs[key]
          results.push(hash)
        } else {
          results = results.concat(inputs)
        }
        next()
      })
    }
  })
}

function done(err) {
  currentView = null
  if (err) {
    console.log('Error:', err.message)
  }
}
