```
                                   __                
  ____ ______   ________________ _/  |_  ___________ 
 /  _ \\____ \_/ __ \_  __ \__  \\   __\/  _ \_  __ \
(  <_> )  |_> >  ___/|  | \// __ \|  | (  <_> )  | \/
 \____/|   __/ \___  >__|  (____  /__|  \____/|__|   
       |__|        \/           \/

```
Operator is a tool for building command line interfaces that are easy to use AND learn.

## Philosophy
Command line interfaces are easy to use. The problem with them is that they're really hard to _learn_. You have to read a manual to understand what a tool with a CLI does, and then you have to memorize its commands (very precisely) before you can actually do anything. It's often said that a tool with a well designed graphical user interface is "easy to use". I think what's often meant by this is that the tool is easy to learn - GUIs teach people how to use tools while they use them, which mostly eliminates the need for manuals and memorization. Operator suggests a way to build CLIs that are every bit as easy to learn as their graphical counterparts, while retaining all their traditional advantages.

## Install
I haven't published this to NPM yet so for now you can do the following:
```bash
git clone https://github.com/jessetane/operator.git
cd operator
npm install -g
```

## How to
There are two ways to use operator:
1) by putting your operations in a file called operations.js (or coffee) and typing ```operator``` in the same directory
2) by using it in your own executable ```require("operator")(myOperations)```

## Example
There are two examples, demonstrating both usage styles in the "example" directory. Try cd'ing into it and typing "operator"