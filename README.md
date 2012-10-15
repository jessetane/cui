```
                                   __                
  ____ ______   ________________ _/  |_  ___________ 
 /  _ \\____ \_/ __ \_  __ \__  \\   __\/  _ \_  __ \
(  <_> )  |_> >  ___/|  | \// __ \|  | (  <_> )  | \/
 \____/|   __/ \___  >__|  (____  /__|  \____/|__|   
       |__|        \/           \/

```
Operator is a tool for building command line interfaces (with Node) that are easy to use AND to learn.

## Install
I haven't published this to npm yet so for now you can do the following:
```bash
git clone https://github.com/jessetane/operator.git
cd operator
npm install -g
```

## Use
There are two ways to use operator:  
1) by putting your operations in a file called operations.js (or coffee) and typing ```operator``` in the same directory  
2) by using it in your own executable ```require("operator").load(myOperations)```

## Example
There are two examples, demonstrating both usage styles in the example directory. Cd into it and try typing ```operator``` or ```./custom-tool```. Note that once you've learned a command, you can enter your arguments all at once: ```operator advanced 03 09 1985 years```

## Philosophy
Command line tools are easy to use. The problem with them is that they're really hard to _learn_. You need a manual (or a patient instructor) just to get an idea of what a tool can do, and then you need to memorize its commands precisely before you can actually use it. It's often said that a tool with a well designed graphical user interface is "easy to use". I think what's really meant is that the tool is easy to learn - GUIs teach people how to use tools while they use them, which mostly eliminates the need for manuals and memorization. Operator proposes a way to build interfaces that retain traditional command line advantages, yet are every bit as easy to learn as their graphical counterparts.