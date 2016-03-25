/*
	JUL - The JavaScript UI Language module version 1.2.1
	Copyright (c) 2012 - 2016 The Zonebuilder (zone.builder@gmx.com)
	http://sourceforge.net/projects/jul-javascript/
	Licenses: GPLv2 or later; LGPLv3 or later (http://sourceforge.net/p/jul-javascript/wiki/License/)
 */
/**
	@fileOverview	
	The JavaScript UI Language (JUL) is a configuration and instantiation module for the JavaScript frameworks. 
	It can be used with any framework that accepts a configuration object as a constructor parameter, 
	or with a custom factory for the other frameworks.<br />
	JUL parses a tree of configuration objects, and creates the runtime components in the expected order and membership. 
	For the most uses, after this step, you will have your application's user interface up and running.<br>
	<br>An example of the JUL tree for a generic 'FWK.Widgets' component library:
	<pre><code>var oUiConfig = {
	    xclass: 'FWK.Widgets.DataView',
	    id: 'APP.mainView',
	    autoDraw: false,
	    overflow: 'hidden',
	    children: [{
	        xclass: 'FWK.Widgets.VLayout',
	        id:'VLayout0',
	        children: [{
	            xclass: 'FWK.Widgets.ToolStrip',
	            id: 'ToolStrip0',
	            visibilityMode: 'multiple'
	        }, {
	            xclass: 'FWK.Widgets.HLayout',
	            id: 'HLayout0',
	            children: [{
	                xclass: 'FWK.Widgets.VLayout',
	                id: 'Navigation',
	                width: 200,
	                showResizeBar: true
	                }, {
	                xclass: 'FWK.Widgets.TabSet',
	                   id: 'TabSet1',
	                tabs: [{
	                    xclass: 'FWK.Widgets.Tab',
	                    title: 'Tab1',
	                    id: 'Tab1'
	                }, {
	                    xclass: 'FWK.Widgets.Tab',
	                    title: 'Tab2',
	                    id: 'Tab2'
	                }],
	                showTabScroller:true,
	                showTabPicker:true,
	                destroyPanes:false,
	                showEdges:false
	            }]
	        }]
	    }],
	    width: '100%',
	    height: '100%'
	};
	var oParser = new JUL.UI.Parser({
	    classProperty: 'xclass',
	    childrenProperty: 'children',
	    membersProperties: ['tabs'],
	    idProperty: 'id'
	});
	oParser.create(oUiConfig);
	APP.mainView.render();</code></pre>
	Another example of the JUL tree for a XUL dialog:
	<pre><code>var oUiConfig = {
	    tag: 'dialog',
	    id: 'dialog-browse',
	    title: 'Open',
	    width: 500,
	    height: 250,
	    hidden: true,
	    children: [
	        {tag: 'listbox', id: 'listbox-browse', selType: 'single', 
	            flex: 1, children: [
	            {tag: 'listhead', children: [
	                {tag: 'listheader', label: 'Name', width: 300}
	        ]},
	            {tag: 'listbody', children: [
	                {tag: 'listitem', children: [
	                    {tag: 'listcell', label: 'File 1'}
	                ]},
	                {tag: 'listitem', children: [
	                    {tag: 'listcell', label: 'File 2'}
	                ]}
	            ]}
	        ]}
	    ],
	};
	var oParser = new JUL.UI.Parser({
	    defaultClass: 'xul',
	    useTags: true,
	    tagProperty: 'tag',
	    customFactory: 'JUL.UI.createDom',
	    topDown: true
	});
	var oDialog = oParser.create(oUiConfig);
	oDialog.show();</code></pre>
*/
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, 
	onevar: true, newcap: true, noarg: true, node: true, strict: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals JUL: true */

JUL = {};
(function(window) {
'use strict';

/* generatedBy JCS version 1.1 */

/**
	JUL global namespace
	@namespace	It holds the utility methods used by JUL
*/
JUL = {
	/**
		JUL version
		@type	String
	*/
	version: '1.2.1',
	/**
		Applies an object or an array of objects to a given object
		@param	{Object}	oSource	The source object to apply to
		@param	{Object}	oAdd	An Object or array of Objects to apply
		@param	{Boolean}	[bDontReplace]	Set it to true to don't replace existing members
		@returns	{Object}	The source object with the applied members
	*/
	apply: function(oSource, oAdd, bDontReplace) {
		if (!oAdd || typeof oAdd !== 'object') { return oSource; }
		var aMembers = [].concat(oAdd);
		for (var i = 0; i < aMembers.length; i++) {
			oAdd = aMembers[i];
			for (var sItem in oAdd) {
				if (oAdd.hasOwnProperty(sItem) && (!bDontReplace || typeof oSource[sItem] !== 'undefined')) {
					oSource[sItem] = oAdd[sItem];
				}
			}
		}
		return oSource;
	},
	/**
		Retrieves a member specified by a dotted path
		@param	{String}	sPath	The dotted path or object reference to retrieve
		@param	{Object}	[oRoot]	An optional object where to start the search from
		@returns	{Object}	The requested member or undefined if not found
	*/
	get: function (sPath, oRoot) {
		var oCurrent = oRoot || window;
		if (!sPath) { return oCurrent; }
		if (typeof sPath !== 'string') { return sPath; }
		var aNames = sPath.replace(/\\\./g, ':::::').split('.');
		var sItem = '';
		while (aNames.length) {
			sItem = aNames.shift().replace(/:{5}/g, '.');
			if (typeof oCurrent[sItem] === 'undefined') { return oCurrent[sItem]; }
			oCurrent = oCurrent[sItem];
		}
		return oCurrent;
	},
	/**
		Creates the specified namespace, and optionally initializes it
		@param	{String}	sPath	The dotted path for the namespace
		@param	{Object}	[oInit]	An optional initializer
		@param	{Object}	[oRoot]	The root object where to start from
		@returns	{Object}	The created or existing namespace
	*/
	ns: function(sPath, oInit, oRoot) {
		var aNames = sPath ? sPath.replace(/\\\./g, ':::::').split('.') : [];
		var sItem = '';
		var oRe = /^(\d|[1-9]\d+)$/;
		var oCurrent = oRoot || window;
		if (!oRoot && aNames.length && 'window' === aNames[0]) { aNames.shift(); }
		while (aNames.length) {
			sItem = aNames.shift().replace(/:{5}/g, '.');
			if (typeof oCurrent[sItem] === 'undefined') { oCurrent[sItem] = aNames.length && oRe.test(aNames[0]) ? [] : {}; }
				if (!aNames.length && typeof oInit !== 'undefined') { oCurrent[sItem] = oInit; }
			oCurrent = oCurrent[sItem];
		}
		return oCurrent;
	},
	/**
		Trims white spaces around a string
		@param	{String}	sText	The string to trim
		@param	{Mixed}	[ sWhat]	Optional string to trim at both ends
		@returns	{String}	Trimmed string
	*/
	trim: function(sText, sWhat, bFromMap) {
		if (typeof sText !== 'string') { sText = sText.toString(); }
		if (!sText) { return sText; }
		/* cope with Array.prototype.map */
		if (bFromMap) { sWhat = ''; }
		if (!sWhat && sWhat !== 0) {
			if (typeof String.prototype.trim === 'function') {
				return sText.trim();
			}
			else {
				return sText.replace(/\s+$/, '').replace(/^\s+/, '');
			}
		}
		else {
			if (typeof sWhat !== 'string') { sWhat = sWhat.toString(); }
			var nEnd = sText.length;
			while (nEnd >= sWhat.length && sText.slice(nEnd - sWhat.length, nEnd) === sWhat) { nEnd = nEnd - sWhat.length; }
			if (nEnd < sText.length) { sText = sText.slice(0, nEnd); }
			if (sText.length < sWhat.length) { return sText; }
			var nStart = 0;
			while (nStart <= sText.length - sWhat.length && sText.slice(nStart, nStart + sWhat.length) === sWhat) { nStart = nStart + sWhat.length; }
			if (nStart) { sText = sText.substr(nStart); }
			return sText;
		}
	},
	/**
		Returns the name of the object's native constructor
		@param	{Mixed}	oData	An object to get the native constructor name from
		@returns	{String}	The native constructor name
	*/
	typeOf: function(oData) {
		return ({}).toString.call(oData).match(/\w+/g)[1];
	}
};

/* add 'indexOf' Array method, if not present */
if (typeof Array.prototype.indexOf !== 'function') {
	Array.prototype.indexOf = function(oSearch, nStart) {
		for (var i = nStart || 0; i < this.length; i++) {
			if (this[i] === oSearch) { return i; }
		}
		return -1;
	};
}

/* add 'map' Array method, if not present */
if (typeof Array.prototype.map !== 'function') {
	Array.prototype.map = function(fMap, oScope) {
		if (typeof fMap !== 'function') { return null; }
		var aResult = [];
		for (var i = 0; i < this.length; i++) {
			aResult.push(oScope ? fMap.call(oScope, this[i], i, this) : fMap(this[i], i, this));
		}
		return aResult;
	};
}

})(typeof window !== 'undefined' ? window : global);

/* end JUL.js */
