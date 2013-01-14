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
Command line programs can be hard to learn / use / build.

## How
cui is a preinstantiated object that can be `require()`'d by multiple files and maintain its state. Use `cui.push()` or `cui.splice()` to add views or actions (see the Usage section) to a sequence of frames. Users of your program only need to know the name of your program - cui can walk them through providing the rest of the arguments on its own. If a user *does* know the full command, they can still type it out of course, for example running the basic example any of the following ways is valid:  
* `example/basic`  
* `example/basic Three`  
* `example/basic Three hi!`

## Install
`npm install cui`

## Examples
The examples are all executable scripts - try cd'ing into the example folder and typing `./all`

## Usage
This code below is essentially the same as in example/basic:
```javascript
var cui = require('cui')

cui.push({
  title: 'This is a very basic example.',
  type: 'buttons',
  data: [
    'One',
    'Two',
    'Three'
  ]
})

cui.push(function(cb) {
	if (cui.last(1) === 'Three') {
	  cui.splice({
	    title: 'Three is a special choice!',
	    type: 'fields',
	    data: 'Please type a word and press ENTER: '
	  })
	}
	cb()
})

cui.push(function(cb) {
  console.log('You could do something now with: "' + cui.results.join('" and "') + '"')
	cb()
})
```

## Properties
* `args` any arguments passed
* `results` an array of results collected by views or manually augmented by actions
* `cache` a cache object that will be automatically loaded & saved if not null (as a json file named '.cui')

## Methods
* `push()` add a view or function to the end of the sequence
* `splice()` add a view or function after the current frame
* `last(n)` return `cui.results[results.length - n]`
* `print()` basically `console.log()` but with the same indentation level as specified in `lib/ui`
* `save()` persist the cache now - useful if your script may encounter future errors and exit early

## License
MIT
