/*
	JUL - The JavaScript UI Language version 1.3.9
	Copyright (c) 2012 - 2017 The Zonebuilder <zone.builder@gmx.com>
	http://sourceforge.net/projects/jul-javascript/
	Licenses: GNU GPLv2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-javascript/wiki/License/)
 */
/* jshint browser: true, curly: true, eqeqeq: true, evil: true, expr: true, funcscope: true, immed: true, latedef: true, loopfunc: true,  
	onevar: true, newcap: true, noarg: true, node: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals JUL  */
'use strict';
require('./source/jul.js');
/* expose several JUL tools as loading module members */
JUL.apply(exports, JUL);
/* remove unneeded local members */
delete exports.version;
delete exports.Ref;
delete exports.UI;
/* put needed methods in the JUL scope */
for (var sItem in exports) {
	if (exports.hasOwnProperty(sItem) && typeof exports[sItem] === 'function') {
		exports[sItem] = JUL.makeCaller(JUL, exports[sItem]);
	}
}
JUL.apply(exports, {
	/* JUL.Ref factory as a local method */
	ref: JUL.Ref,
	/* JUL.UI.Parser factory as a local method */
	parser: JUL.UI.Parser
});
/* Note: This is just a Node's way convenience. JUL tools global namespaces continue to exist. */
