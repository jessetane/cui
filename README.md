```
             .__ 
  ____  __ __|__|
_/ ___\|  |  \  |
\  \___|  |  /  |
 \___  >____/|__|
     \/

```
Command line GUIs.

## Install
npm install cui

## Usage
Basic
```javascript
cui = require("cui");
cui.view({
	buttons: {
		"One": function () {
			console.log("One");
		},
		"Two": function () {
			console.log("Two");
		},
		"Three": function () {
			console.log("Three");
		}
	}
});
```

Interesting
```javascript
cui = require("cui");
cui.view({
	title: "Pick a file: "
	buttons: function (cb) {
		fs = require("fs");
		fs.readdir(process.cwd(), function (err, filenames) {
			this.buttons = filenames;
			cb(err);
		});
	}
});

var rename = cui.View

cui.view({
	buttons: {
		"Stat": function () {
			fs.stat(cui.history[0], function (err, data) {
				console.log(data || err);
			});
		},
		"Rename": cui.views.
	}
})

```
