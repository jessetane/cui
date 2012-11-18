#!/usr/bin/env node

/*
 *  cui.js
 *
 */
 

require("coffee-script");  // just in case you use CS

var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;
var util = require("./util");
var ui = require("./ui");
var args = null;
var cache, cachedir;
var results = [];
var sequence = [];
var currentView = null;


if (require.main === module) {  // we are main - find nearest package.json & check for a "cui" entry
  findPackageJSON(process.cwd(), function (err, packageJSON, dir) {
    if (!err && packageJSON.cui) {
      require(dir + "/" + packageJSON.cui);
    } else {
      console.log("Could not load cui:", err);
    }
  });
} else {  // parent is the first cuifile
  var cuifile = module.parent.filename;
  cachedir = cuifile.slice(0, cuifile.lastIndexOf("/"));
  loadCache();
}


exports.__defineGetter__("args", function () { return args });
exports.__defineSetter__("args", function (a) { args = a });
exports.__defineGetter__("cache", function () { return cache });
exports.__defineSetter__("cache", function (c) { cache = c });
exports.__defineGetter__("results", function () { return results });
exports.__defineSetter__("results", function (r) { results = r });
exports.push = push;
exports.last = last;
exports.save = save;


function findPackageJSON (dir, cb) {
  try {
    var packageJSON = path.normalize(dir + "/package");
    cb(null, require(packageJSON), dir);
  } catch (err) {
    if (dir !== "/" && err.code === "MODULE_NOT_FOUND" && err.message.search("/package") > -1) {
      findPackageJSON(path.normalize(dir + "/.."), cb);
    } else {
      cb(err);
    }
  }
}

function loadCache () {
  try {
    var data = fs.readFileSync(cachedir + "/.cui", "utf8");
    cache = JSON.parse(data);
  } catch (err) {
    // we should probably check for JSON parse errors here
  }
}

function push (v) {
  if (currentView === null && sequence.length === 0) {
    process.nextTick(run);
  }
  sequence.push(v);
}

function last (index) {
  return results.slice(-index)[0];
}

function run () {
  if (!args) args = process.argv.slice(2);
  if (currentView) sequence.shift();
  if (sequence.length === 0) return done();
  currentView = sequence[0];
  if (typeof currentView === "function") {
    currentView(function (err) {
      if (err) done(err);
      else next();
    });
  } else {
    switch (currentView.type) {
      case "buttons":
        getButtonSelection(currentView);
        break;
      case "fields":
        getFieldInputs(currentView);
        break;
      default:
        done(new Error("Unrecognized operation type \"" + currentView.type + "\""));
    }
  }
}

function next () {
  if (currentView.action) {
    currentView.action(function (err) {
      if (err) return done(err);
      run();
    });
  } else {
    run();
  }
}

function getButtonSelection () {
  util.evaluateDynamicData(currentView.data, function (err, buttons) {
    if (err) return done(err);
    var arg = (args.length) ? args.shift() : null;
    if (arg) {
      var selection = util.selectButton(buttons, currentView.properties, arg);
      if (selection) {
        results.push(selection);
        next();
      } else {
        //args.unshift(undefined);  // placeholder
        args = []; // clear
        getButtonSelection(currentView);
      }
    } else {
      ui.showTitle(currentView);
      ui.showButtons(buttons, currentView.properties);
      ui.getButtonSelection(buttons, currentView.properties, function (selection) {
        results.push(selection);
        next();
      });
    }
  });
}

function getFieldInputs () {
  util.evaluateDynamicData(currentView.data, function (err, fields) {
    if (err) return done(err);
    if (typeof fields === "string") fields = [ fields ];
    var hash = (fields instanceof Array) ? null : {};
    var fieldsWithArg = 0;
    for (var f in fields) {
      var arg = (args.length) ? args.shift() : null;
      if (arg) {
        if (hash) {
          hash[f] = arg;
        } else {
          results.push(arg);
        }
      } else {
        break;
      }
      fieldsWithArg++;
    }
    for (var i=0; i<fieldsWithArg; i++) fields.shift();   // this is less than ideal because it can permanently disfigure the view
    if (fields.length === 0) {
      next();
    } else {
      if (fieldsWithArg === 0) ui.showTitle(currentView);
      ui.getFieldInputs(fields, function (inputs) {
        if (hash) {
          for (var key in inputs) hash[key] = inputs[key];
          results.push(hash);
        } else {
          results = results.concat(inputs);
        }
        next();
      });
    }
  });
}

function save (cb) {
  fs.writeFile(cachedir + "/.cui", JSON.stringify(cache), cb);
}

function done (err) {
  currentView = null;
  if (err) {
    console.log("Error:", err.message);
  } else if (cache) {
    save(function (err) {
      if (err) {
        console.log("Failed to save cache");
      }
    });
  }
}
