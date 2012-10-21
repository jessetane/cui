#!/usr/bin/env node

/*
 *  cui.js
 *
 */
 

var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;
var cache, cachedir;
var history = [];
var sequence = [];
var running = false;
var view = null;


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


exports.cache = cache;
exports.history = history;
exports.sequence = sequence;
exports.push = push;


function findPackageJSON (dir, cb) {
  try {
    var packageJSON = path.normalize(dir + "/package");
    cb(null, require(packageJSON), dir);
  } catch (err) {
    if (dir !== "/" && err.code === "MODULE_NOT_FOUND" && err.message.search("/package") > -1) {
      find(path.normalize(dir + "/.."), cb);
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

function push () {
  sequence.push(arguments);
  if (!running) {
    running = true;
    process.nextTick(run);
  }
}

function run () {
  if (sequence.length === 0) {
    done();
    return;
  }
  var view = sequence.shift();
  if (typeof view === "function") {
    view(function (err, result) {
      if (err) return done(err);
      history.push(result);
      run();
    });
  } else {
    switch (view.type) {
      case "buttons":
        getButtonPress(view);
        break;
      case "fields":
        getFieldInputs(view);
        break;
      default:
        done(new Error("Unrecognized operation type \"" + operations.type + "\""));
    }
  }
}

function getButtonPress (view) {
  util.evaluateDynamicData(view.main, function (err, buttons) {
    if (err) return done(err);
    var arg = (args.length) ? args.shift() : null;
    if (arg) {
      var n = Number(arg);
      if (isNaN(n)) {
        var temp = null;
        for (var b in buttons) {
          var label = util.generateButtonLabel(buttons[b], view.properties).toLowerCase();
          if (label.search(arg.toLowerCase()) > -1) {
            temp = buttons[b];
            break;
          }
        }
        arg = temp;
      } else if (n > buttons.length || n < 1) {
        arg = null;
      } else {
        arg = buttons[Math.floor(b)-1];
      }
      if (arg) {
        history.push(arg);
        next();
      } else {
        getButtonPress(view);
      }
    } else {
      ui.showTitle(view);
      ui.showButtons(buttons, view.properties);
      ui.getButtonPress(buttons, view.properties, function (buttonPress) {
        history.push(buttonPress);
        next();
      });
    }
  });
}

function getFieldInputs (view) {
  util.evaluateDynamicData(view.main, function (err, fields) {
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
          history.push(arg);
        }
      } else {
        break;
      }
      fieldsWithArg++;
    }
    for (var i=0; i<fieldsWithArg; i++) fields.shift();
    if (fields.length === 0) {
      next();
    } else {
      if (fieldsWithArg === 0) ui.showTitle(view);
      ui.getFieldInputs(fields, function (inputs) {
        if (hash) {
          for (var key in inputs) hash[key] = inputs[key];
          history = history.push(hash);
        } else {
          history = history.concat(inputs);
        }
        run();
      });
    }
  });
}

function done (err) {
  if (err) {
    console.log("Error:", err.message);
  } else if (cache) {
    fs.writeFile(cachedir + "/.cui", JSON.stringify(cache), function (err) {
      if (err) console.log("Failed to save cache");
    });
  }
}
