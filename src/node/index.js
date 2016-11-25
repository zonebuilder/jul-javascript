/*
	JUL - The JavaScript UI Language version 1.3.7
	Copyright (c) 2012 - 2016 The Zonebuilder (zone.builder@gmx.com)
	http://sourceforge.net/projects/jul-javascript/
	Licenses: GNU GPLv2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-javascript/wiki/License/)
 */
'use strict';
require('./source/jul.js');
/* expose several JUL tools as loading module members */
JUL.apply(exports, [JUL, {
	/* put needed methods in the JUL scope */
	makeCaller: JUL.makeCaller(JUL, 'makeCaller'),
	/* JUL.Ref factory as a local method */
	ref: JUL.Ref,
	/* JUL.UI.Parser factory as a local method */
	parser: JUL.UI.Parser
}]);
/* remove unneeded local members */
delete exports.version;
delete exports.Ref;
delete exports.UI;
/* Note: This is just a Node's way convenience. JUL tools global namespaces continue to exist. */
