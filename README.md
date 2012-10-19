```
             .__ 
  ____  __ __|__|
_/ ___\|  |  \  |
\  \___|  |  /  |
 \___  >____/|__|
     \/

```
Create command line apps with GUIs

## Install
npm install cui

## Usage
Basic
```javascript
cui = require("cui");
cui.buttons({ 
	"Hi": function () {
		console.log("Hello world");
	}
});
```

Simple
```javascript
cui = require("cui");
cui.buttons({
	"One": function () {
		console.log("One");
	},
	"Two": function () {
		console.log("Two");
	},
	"Three": function () {
		console.log("Three");
	}
});
```

Interesting
```javascript
cui = require("cui");
cui.buttons(function () {
	fs = require("fs");
	
});
```
