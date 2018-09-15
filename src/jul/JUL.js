/*
	JUL - The JavaScript UI Language version 1.5.5
	Copyright (c) 2012 - 2018 The Zonebuilder <zone.builder@gmx.com>
	http://sourceforge.net/projects/jul-javascript/
	Licenses: GNU GPL2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-javascript/wiki/License/)
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

(function(global) {
'use strict';
/* initialize JUL global namespace */
global.JUL = {};

/* generated by JCS version 1.3.6 */

/**
	JUL global namespace
	@namespace	It holds the utility methods used by JUL
*/
JUL = {
	/**
		This allows setting a default root namespace instead of the global one
		@type	Object
	*/
	nsRoot: null,
	/**
		JUL version
		@type	String
	*/
	version: '1.5.5',
	/**
		Creates instances of the JUL global, which can be used as local variables.
		E.g. <code>var oInstance = new JUL.Instance({nsRoot: myLocalVar});</code>
		Special members of an instance:<ul>
		<li>ui - instance of JUL.UI.Parser with JUL.UI defaults applied</li>
		<li>ref - the same as JUL.Ref() factory</li>
		<li>parser - shortcut to this.ui.Parser() factory</li></ul>
		@class	A class for creating instances of the main JUL object
		@param	{Object}	[oConfig]	Configuration object
	*/
	Instance: function(oConfig) {
		if (!(this instanceof JUL.Instance)) { return new JUL.Instance(oConfig); }
		JUL.apply(this, oConfig || {});
		var oThis = this;
		var fInstance = function() { return oThis; };
		var FRef = function(oRef, sKey) {
			if (!(this instanceof FRef)) { return new FRef(oRef, sKey); }
			JUL.Ref.call(this, oRef, sKey);
		};
		FRef. prototype = new JUL.Ref();
		FRef.prototype.constructor = FRef;
		FRef.prototype._getJulInstance = fInstance;
		this.ref = FRef;
		this.ui = new JUL.UI.Parser();
		this.ui._getJulInstance = fInstance;
		this.parser = this.ui.Parser;
	},
	/**
		Applies an object or an array of objects to a given object
		@param	{Object}	oSource	The source object to apply to
		@param	{Object}	oAdd	An Object or array of Objects to apply
		@param	{Boolean}	bDontReplace	Set it to true to don't replace existing members
		@param	{Array}	[aFilterOut]	If not null, the keys in this array will not be applied over
		@param	{Array}	[aFilterIn]	If not null, only the keys in this array will be applied over
		@returns	{Object}	The source object with the applied members
	*/
	apply: function(oSource, oAdd, bDontReplace, aFilterOut, aFilterIn) {
		if (!oAdd || typeof oAdd !== 'object') { return oSource; }
		if (aFilterOut) { aFilterOut = [].concat(aFilterOut); }
		if (aFilterIn) { aFilterIn = [].concat(aFilterIn); }
		var oNew = bDontReplace ? {} : oSource;
		var aMembers = [].concat(oAdd);
		for (var i = 0; i < aMembers.length; i++) {
			oAdd = aMembers[i];
			for (var sItem in oAdd) {
				if (oAdd.hasOwnProperty(sItem) &&
					(!aFilterOut || aFilterOut.indexOf(sItem) < 0) && (!aFilterIn || aFilterIn.indexOf(sItem) > -1)) {
					oNew[sItem] = oAdd[sItem];
				}
			}
		}
		if (!bDontReplace) { return oSource; }
		for (sItem in oNew) {
			if (oNew.hasOwnProperty(sItem) && typeof oSource[sItem] === 'undefined') { oSource[sItem] = oNew[sItem]; }
		}
		return oSource;
	},
	/**
		Retrieves a member specified by a dotted path
		@param	{String}	sPath	The dotted path or object reference to retrieve
		@param	{Object}	[oRoot]	An optional object where to start the search from
		@returns	{Object}	The requested member or undefined if not found
	*/
	get: function(sPath, oRoot) {
		var oCurrent = oRoot || this.nsRoot || global;
		if (!sPath) { return oCurrent; }
		if (typeof sPath !== 'string') { return sPath; }
		var aNames = sPath.replace(/\\\./g, ':::::').split('.');
		if (!oRoot && aNames.length > 1 && ('window' === aNames[0] || 'global' === aNames[0])) {
			aNames.shift();
			oCurrent = global;
		}
		var sItem = '';
		while (aNames.length) {
			sItem = aNames.shift().replace(/:{5}/g, '.');
			if (!sItem) { continue; }
			if (typeof oCurrent[sItem] === 'undefined') { return oCurrent[sItem]; }
			oCurrent = oCurrent[sItem];
		}
		return oCurrent;
	},
	/**
		Gets the JUL instance associated with a child object (e.g. a parser, a reference)
		@param	{Object}	oChild	Child object
		@returns	{Object}	JUL instance or null if not available
	*/
	getInstance: function(oChild) {
		if (oChild instanceof JUL.Ref || oChild instanceof JUL.UI.Parser) {
			return oChild._getJulInstance ? oChild._getJulInstance() : JUL;
		}
		else {
			return oChild === JUL.UI ? JUL : null;
		}
	},
	/**
		Creates a wrapper that will call a certain function in a specific scope.
		Useful for ensuring that a callback will get the desired scope.
		@param	{Object}	oScope	The scope to call the given function in
		@param	{Mixed}	fCall	The function to be called. If a string or an index, it will be the oScope method with that name.
		@param	{Boolean}	[bAppendThis]	If true, the actual calling context will be added as the last parameter of the called function
		@returns	{Function}	The caller function
	*/
	makeCaller: function(oScope, fCall, bAppendThis) {
		if (!oScope || (!fCall && fCall !== 0)) { return null; }
		if (typeof fCall !== 'function') {
			fCall = oScope[fCall];
			if (typeof fCall !== 'function') { return null; }
		}
		bAppendThis = (bAppendThis || false) && true;
		/* try checking for duplicates */
		this._callers = this._callers || [];
		for (var i = 0; i < this._callers.length; i++) {
			if (oScope === this._callers[i][0] && fCall === this._callers[i][1] && bAppendThis === this._callers[i][2]) { return this._callers[i][3]; }
		}
		var fCaller = bAppendThis ? function() { return fCall.apply(oScope, [].slice.call(arguments).concat([this])); } :
			function() { return fCall.apply(oScope, [].slice.call(arguments)); };
		if (this._callers.length > 16383) { this._callers = this._callers.slice(1024, 16384); }
		this._callers.push([oScope, fCall, bAppendThis, fCaller]);
		return fCaller;
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
		var oCurrent = oRoot || this.nsRoot || global;
		if (!oRoot && aNames.length > 1 && ('window' === aNames[0] || 'global' === aNames[0])) {
			aNames.shift();
			oCurrent = global;
		}
		while (aNames.length) {
			sItem = aNames.shift().replace(/:{5}/g, '.');
			if (!sItem) { continue; }
			if (typeof oCurrent[sItem] === 'undefined') { oCurrent[sItem] = aNames.length && oRe.test(aNames[0]) ? [] : {}; }
				if (!aNames.length && typeof oInit !== 'undefined') { oCurrent[sItem] = oInit; }
			oCurrent = oCurrent[sItem];
		}
		return oCurrent;
	},
	/**
		Trims a string at one or both ends
		@param	{String}	sText	The string to trim
		@param	{String}	[sWhat]	String pattern to match at the ends, it defaults to whitespace
		@param	{Boolean}	[bLeftOrRight]	If true trims left, if false trims right, if not specified trims at both ends
		@returns	{String}	Trimmed string
	*/
	trim: function(sText, sWhat, bLeftOrRight) {
		if (typeof sText !== 'string') { sText = sText.toString(); }
		if (!sText) { return sText; }
		var bUndef = typeof bLeftOrRight === 'undefined';
		if (!(bUndef || bLeftOrRight === true || bLeftOrRight === false)  || (bUndef && !(sWhat || sWhat === 0))) {
			if (typeof String.prototype.trim === 'function') {
				return sText.trim();
			}
			else {
				return sText.replace(/\s+$/, '').replace(/^\s+/, '');
			}
		}
		else {
			if (!(sWhat || sWhat === 0)) {
				if (bLeftOrRight) { return sText.replace(/^\s+/, ''); }
				else { return sText.replace(/\s+$/, ''); }
			}
			if (typeof sWhat !== 'string') { sWhat = sWhat.toString(); }
			if (bUndef || bLeftOrRight === false) {
				var nEnd = sText.length;
				while (nEnd >= sWhat.length && sText.slice(nEnd - sWhat.length, nEnd) === sWhat) { nEnd = nEnd - sWhat.length; }
				if (nEnd < sText.length) { sText = sText.slice(0, nEnd); }
			}
			if (sText.length < sWhat.length) { return sText; }
			if (bUndef || bLeftOrRight === true) {
				var nStart = 0;
				while (nStart <= sText.length - sWhat.length && sText.slice(nStart, nStart + sWhat.length) === sWhat) { nStart = nStart + sWhat.length; }
				if (nStart) { sText = sText.substr(nStart); }
			}
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
	},
	/**
		Gets the JUL instance getter function for a given namespace root, with caching
		@param	{Object}	[oNSRoot]	Namespace root
		@returns	{Function}	Instance getter
		@private
	*/
	_getAutoInstance: function(oNSRoot) {
		oNSRoot = oNSRoot || null;
		if (oNSRoot === this.nsRoot) { return this; }
		this._autoInstances = this._autoInstances || [];
		for (var i = 0; i < this._autoInstances.length; i++) {
			if (oNSRoot === this._autoInstances[i].nsRoot) { return this._autoInstances[i].getInstance; }
		}
		var oInstance = new JUL.Instance({nsRoot: oNSRoot});
		var fInstance = function() { return oInstance; };
		if (this._autoInstances.length > 1023) { this._autoInstances = this._autoInstances.slice(64, 1024); }
		this._autoInstances.push({nsRoot: oNSRoot, getInstance: fInstance});
		return fInstance;
	}
};

/* make JUL.Instance to inherit the JUL members */
JUL.apply(JUL.Instance.prototype, JUL, false, ['Instance', 'Ref', 'UI', 'version', '_getAutoInstance']);

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

})(typeof global !== 'undefined' ? global : window);

/* end JUL.js */
