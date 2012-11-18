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
Command line tools are fast, but they can be hard to use. cui allows you to create optional (and potentially dynamic) views for each parameter your tool requires.

## How
Views are pushed to a sequence, and can display either buttons or fields. After each view collects input, the results are stored and the sequence advances. Views can include an action that executes after the results are stored, but before the sequence advances. Usually a tool's primary "work" is performed in the last view's action.

## Install
```npm install cui```

## Examples
The examples are all executable scripts - try cd'ing into the example folder and typing ```./all```

## Usage
This code below is essentially the same as in example/basic:
```javascript
var cui = require("cui");
cui.push({
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
