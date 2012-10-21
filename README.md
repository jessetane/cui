```
             .__ 
  ____  __ __|__|
_/ ___\|  |  \  |
\  \___|  |  /  |
 \___  >____/|__|
     \/

```
GUIs for the command line.

## Why
Command line tools are fast - the problem is that they can be hard to use. cui allows you to create optional (and potentially dynamic) views for each parameter your tool requires.

## How
Views are arranged in a sequence, and can display either "buttons" or "fields". After each view collects a selection or input, the results are stored and the sequence advances. Views can include a callback that executes after results are stored, but before the sequence advances - usually the last view in the sequence performs the main "work" in its callback.

## Install
npm install cui

## Usage
This code is from example/basic:
```javascript
cui = require("../lib/cui");

cui.view({
	title: "This is a very basic example.",
	type: "buttons",
	main: [
		"One",
		"Two",
		"Three"
	],
	callback: function () {
		console.log("You could do something now with: \"" + cui.results[0] + "\"");
	}
});
```
