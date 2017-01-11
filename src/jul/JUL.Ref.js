/*
	JUL - The JavaScript UI Language version 1.3.8
	Copyright (c) 2012 - 2017 The Zonebuilder <zone.builder@gmx.com>
	http://sourceforge.net/projects/jul-javascript/
	Licenses: GNU GPL2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-javascript/wiki/License/)
 */
/**
	@fileOverview	A class for working with references in JavaScript
*/
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, 
	onevar: true, newcap: true, noarg: true, node: true, strict: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals JUL */

(function() {
'use strict';

/* generated by JCS version 1.3.1 */

/**
	Creates a writable reference of a member of the given object
	@class	A class for working with references in JavaScript
	@param	{Object}	oRef	The object to reference or a config object with 'ref' and 'key' properties
	@param	{String}	sKey	The name of the member to reference
	@name	JUL.Ref
*/
JUL.ns('JUL.Ref');

JUL.Ref = function(oRef, sKey) {
	if (!(this instanceof JUL.Ref)) {
		return new JUL.Ref(oRef, sKey);
	}
	if (oRef instanceof JUL.Ref) {
		JUL.apply(this, oRef);
		return;
	}
	this._ref = oRef;	
	this._key = sKey;
	if (typeof oRef === 'object' && oRef.ref) {
		this._ref = oRef.ref;
		this._key = oRef.key;
		for (var sMember in oRef) {
			if (oRef.hasOwnProperty(sMember) && sMember !== 'key' && sMember !== 'ref') {
				this[sMember] = oRef[sMember];
			}
		}
	}
};

JUL.apply(JUL.Ref.prototype, /** @lends JUL.Ref.prototype */ {
	/**
		Applies JavaScript 'delete' operator on the referenced object member
		@returns	{Object}	The reference itself
	*/
	del: function() {
		delete this._ref[this._key];
		return this;
	},
	/**
		Gets or sets the name of the referenced member
		@param	{String}	[sKey]	The new name or index to set the member to. Omit to get the current one.
		@returns	{String}	The name of the referenced member
	*/
	key: function(sKey) {
		if (typeof sKey !== 'undefined') {
			this._key = sKey;
			return this;
		}
		return this._key;
	},
	/**
		Gets or sets the referenced object or the name of the referenced member
		@param	{Object}	[oRef]	The new object to reference. Omit to get the current object, set to true to get the property name
		@param	{String}	[sKey]	The new name of the member to reference
		@returns	{Mixed}	The referenced object or member name if getting, nothing if setting
	*/
	ref: function(oRef, sKey) {
		if (!oRef) { return this._ref; }
		if (oRef === true) { return this._key; }
		if (oRef) { this._ref = oRef; }
		if (typeof sKey !== 'undefined') { this._key = sKey; }
		return this;
	},
	/**
		Gets or sets the value of the referenced member
		@param	{Object}	[oVal]	The new value to set the member to. Omit to get the current value
		@returns	{Mixed}	The value of the referenced member
	*/
	val: function(oVal) {
		if (typeof oVal !== 'undefined') {
			this._ref[this._key] = oVal;
			return this;
		}
		return this._ref[this._key];
	}
});

})();

/* end JUL.Ref.js */
