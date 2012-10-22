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
Views are arranged in a sequence, and can display either "buttons" or "fields". After each view collects input, the results are stored and the sequence advances. Views can include an action that executes after results are stored, but before the sequence advances - usually the last view in the sequence performs the main "work" in its action.

## Install
npm install cui

## Usage
This code below is essentially the same as ```example/basic:```
```javascript
var cui = require("cui");
cui.view({
  title: "This is a very basic example.",
	type: "buttons",
	data: [
	  "One",
	  "Two",
	  "Three"
	],
	action: function () {
    console.log("You could do something now with: \"" + cui.results[0] + "\"");
  }
});
```
