<p align="center">
<img alt="JUL" src="https://zonebuilder.github.io/media/ela100.png" width="133" height="100" />
</p>

JUL - The JavaScript UI Language
================================

About
-----

The JavaScript UI Language (JUL) is a configuration and instantiation module 
for the JavaScript frameworks.
It can be used with any framework that accepts a configuration object 
as a constructor parameter, or with a custom factory for the other frameworks.

License
-------
 
 Licensed under GNU GPLv2 or later and under GNU LGPLv3 or later.
 
Browser support
---------------

JUL supports all major browsers including FF4+, IE8+, Safari4+, Chrome1+, Opera10+.
JUL also works in various mobile browsers and in Node.js. 

Install the Node module
-----------------------

Local:

`npm install jul`

Global:

`npm install -g jul`


Usage the Node’s way
--------------------

```javascript
var jul = require('jul');
// a configuration object
var tree = {name: 'Main', id: 'global.NS.tree', size: 5,
	children: [{name: 'Child1', left: 2, top: 2}, {name: 'Child2', widths: [4, 8, 12]}]
};
// create a parser
var parser = jul.parser();
// instantiate the configuration object
parser.create(tree);
// create a JUL.Ref reference to the exported variable NS.tree
var ref = jul.ref(NS, 'tree');
// print the instantiated object
console.log(parser.obj2str(ref.val()));
````

Usage the JUL’s way
-------------------

```javascript
// Add "jul.js" as an external JS in the web page, or require('jul') in Node.
// JUL & tools always remain global namespaces.

// a configuration object
var oTree = {name: 'Main', id: 'global.NS.tree', size: 5,
	children: [{name: 'Child1', left: 2, top: 2}, {name: 'Child2', widths: [4, 8, 12]}]
};
// create a parser
var oParser = new JUL.UI.Parser();
// instantiate the configuration object
oParser.create(oTree);
// create a JUL.Ref reference to the exported variable NS.tree
var oRef = new JUL.Ref(NS, 'tree');
// print the instantiated object
console.log(oParser.obj2str(oRef.val()));
````

Examples & documentation
------------------------

[Documentation page](https://zonebuilder.github.io/jul/index.html)

Build & install from source
---------------------------

Install [Node.js](https://nodejs.org/) in your system.
Clone the repository:

`git clone https://github.com/zonebuilder/jul-javascript.git`

Run the following shell commands in order:

```bash
	npm install
	npm run make
```
The release will be in the 'build' folder. The Node module will be in the 'build_node' folder.

Downloads & user support
------------------------

[jul-javascript project on SourceForge](http://sourceforge.net/projects/jul-javascript/)

