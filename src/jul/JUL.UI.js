/*
	JUL - The JavaScript UI Language version 1.5.4
	Copyright (c) 2012 - 2017 The Zonebuilder <zone.builder@gmx.com>
	http://sourceforge.net/projects/jul-javascript/
	Licenses: GNU GPL2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-javascript/wiki/License/)
 */
/**
	@fileOverview	JUL tools for working with a config tree of component configs<br>
	It can be also used as an instantiator (see {@link JUL.UI.Parser} method)
*/
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, 
	onevar: true, newcap: true, noarg: true, node: true, strict: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals ample, JUL */

(function(global) {
'use strict';
// JUL & tools always remain global namespaces
var jul = JUL;

/* generated by JCS version 1.3.6 */

/**
	JUL.UI namespace
	@namespace	JUL tools for working with a config tree of component configs<br />
	It can be also used as an instantiator (see {@link JUL.UI.Parser} method)
	@name	JUL.UI
*/
jul.ns('JUL.UI');

jul.apply(jul.get('JUL.UI'), /** @lends JUL.UI */ {
	/**
		The name of the binding property in the config tree
		@type	String
	*/
	bindingProperty: 'cid',
	/**
		The name of the children property in the config tree
		@type	String
	*/
	childrenProperty: 'children',
	/**
		The name of the class property in the config tree
		@type	String
	*/
	classProperty: 'xclass',
	/**
		The name of the CSS class property in the config tree
		@type	String
	*/
	cssProperty: 'css',
	/**
		An optional custom function to instantiate a component
		@type	Function
	*/
	customFactory: null,
	/**
		The name of the default class in the config tree
		@type	String
	*/
	defaultClass: 'Object',
	/**
		The name of the inner HTML property in the config tree
		@type	String
	*/
	htmlProperty: 'html',
	/**
		The name of the ID property in the config tree
		@type	String
	*/
	idProperty: 'id',
	/**
		The name of the include property in the config tree
		@type	String
	*/
	includeProperty: 'include',
	/**
		A property that may contain a per-config list of members to instantiate
		@type	String
	*/
	instantiateProperty: 'instantiate',
	/**
		Optional mappings between the component class name and a list of members to instantiate
		@type	Object
	*/
	membersMappings: {},
	/**
		An array of names of the other 'members' properties in the config tree
		@type	Array
	*/
	membersProperties: [],
	/**
		The name of the parent property in the config tree. Used if topDown is true
		@type	String
	*/
	parentProperty: 'parent',
	/**
		The name pf the parser config property used as meta information for a branch of the config tree
		@type	String
	*/
	parserProperty: 'parserConfig',
	/**
		It allows JUL.UI.obj2str() to output the enclosed expression unquoted.
		It also applies to JUL.UI.creatDom() when setting the element attributes.
		@type	String
	*/
	referencePrefix: '=ref:',
	/**
		The name of the tag property in the config tree
		@type	String
	*/
	tagProperty: 'tag',
	/**
		Set this to true to have a top-down instantiation instead of the default bottom-up one
		@type	Boolean
	*/
	topDown: false,
	/**
		Whether to use tag property in the config tree
		@type	Boolean
	*/
	useTags: false,
	/**
		Hash containing XML namespaces for several DOM languages
		@type	Object
	*/
	xmlNS: {
		aml: 'http://www.amplesdk.com/ns/aml', aui: 'http://www.amplesdk.com/ns/aui', chart: 'http://www.amplesdk.com/ns/chart',
		 html: 'http://www.w3.org/1999/xhtml', svg: 'http://www.w3.org/2000/svg', xform: 'http://www.w3.org/2002/xforms',
		 xul: 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
	},
	/**
		Creates a new JUL.UI parser that inherits all JUL.UI members
		@class	Used to build parser objects for config trees
		@extends	JUL.UI
		@param	{Object}	[oConfig]	Parser config object to override inherited members
	*/
	Parser: function(oConfig) {
		if (!(this instanceof JUL.UI.Parser) || this.hasOwnProperty('Parser')) {
			return this && typeof this.Parser === 'function' && this.Parser.prototype instanceof JUL.UI.Parser ?
				new this.Parser(oConfig) :
				(this && this.ui && this.ui instanceof JUL.UI.Parser ?
					new this.ui.Parser(oConfig) :  new JUL.UI.Parser(oConfig));
		}
		oConfig = oConfig || {};
		if (oConfig.nsRoot) {
			this._getJulInstance = JUL._getAutoInstance(oConfig.nsRoot);
		}
		JUL.apply(this, oConfig, false, 'nsRoot');
		/* carry on the cyclic direct inheritance */
		this.Parser = function(oConfig) {
			var oReturn = JUL.UI.Parser.call(this, oConfig);
			if (typeof oReturn === 'object') { return oReturn; }
		};
		this.Parser.prototype = this;
	},
	/**
		Compacts a config tree converting suitable 'childrenProperty' items into 'membersProperties' properties
		@param	{Object}	oData	Config tree
		@param	{Boolean}	bAuto	Autodetect compactable items and add their names to the 'membersProperties' array of the parser
		@param	{Number}	[_nLength]	For internal use
		@returns	{Object}	Compacted config tree
	*/
	compact: function(oData, bAuto, _nLength) {
		if (!oData || typeof oData !== 'object') { return oData; }
		if (JUL.typeOf(oData) === 'Array') {
			var aResult = [];
			for (var u = 0; u < oData.length; u++) { aResult.push(this.compact(oData[u], bAuto, _nLength)); }
			return aResult;
		}
		oData = this.include(oData);
		if (JUL.typeOf(oData[this.childrenProperty]) !== 'Array') { return oData; }
		var aItems = [];
		var oRepeat = {};
		for (var i = 0; i < oData[this.childrenProperty].length; i++) {
			var oChild = oData[this.childrenProperty][i];
			var sClass = oChild[this.classProperty] || this.defaultClass;
			var sName = this.useTags ? sClass + ':' + oChild[this.tagProperty] : sClass;
			if (aItems.indexOf(sName) < 0) {
				aItems.push(sName);
			}
			else {
				oRepeat[sName] = true;
			}
		}
		var oNew = {};
		for (var sItem in oData) {
			if (oData.hasOwnProperty(sItem) && sItem !== this.childrenProperty) {
				oNew[sItem] = oData[sItem];
			}
		}
		var oAdd = {};
		if (typeof _nLength === 'undefined') { _nLength = (this.membersProperties || []).length; }
		for (i = 0; i < oData[this.childrenProperty].length; i++) {
			oChild = oData[this.childrenProperty][i];
			sClass = oChild[this.classProperty] || this.defaultClass;
			sName = this.useTags ? sClass + ':' + oChild[this.tagProperty] : sClass;
			var sTag = this.useTags && sClass === this.defaultClass ? oChild[this.tagProperty] : sName;
			var bCompact = typeof oChild[this.childrenProperty] === 'object' && oChild[this.childrenProperty].length;
			var iPos = (this.membersProperties || []).indexOf(sTag);
			if (bCompact && (iPos < 0 || iPos >= _nLength)) {
				if (bAuto) {
					for (sItem in oChild) {
						if (oChild.hasOwnProperty(sItem) && sItem !== this.classProperty &&
							sItem !== this.childrenProperty && !(this.useTags && sItem === this.tagProperty)) {
							bCompact = false;
							break;
						}
					}
				}
				else {
					bCompact = false;
				}
			}
			if (bCompact && !oRepeat[sName]) {
				oAdd[sTag] = oChild[this.childrenProperty];
			}
			else {
				oAdd[this.childrenProperty] = oAdd[this.childrenProperty] || [];
				oAdd[this.childrenProperty].push(oChild);
			}
		}
		for (sItem in oAdd) {
			if (oAdd.hasOwnProperty(sItem)) {
				oNew[sItem] = oAdd[sItem];
				if (sItem !== this.childrenProperty && (this.membersProperties || []).indexOf(sItem) < 0) {
					this.membersProperties = this.membersProperties || [];
					this.membersProperties.push(sItem);
				}
				for (i = 0; i < oAdd[sItem].length; i++) {
					oAdd[sItem][i] = this.compact(oAdd[sItem][i], bAuto, _nLength);
				}
			}
		}
		return oNew;
	},
	/**
		Creates a tree of runtime objects specified by a config tree<br>
		Object instances are created bottom-up by default with children instances put in the parent config, 
		or top-down with parent instance put in the children configs
		@param	{Object}	oTree	Config tree root or array of root configs
		@param	{Object|Array}	[oBindings]	Config tree logic that will apply to the corresponding nodes
		@param	{Object}	[oParent]	Optional parent object of the root instance when instantiating top-down
		@param	{Boolean}	[bSparse]	This allows parsing a ‘sparse’ tree, i.e. a tree where some component nodes are not direct children of other components.
		Every node which has a class or a tag set will be instantiated, regardless of its membership.
		The ‘defaultClass’ property of the parser does not apply in this mode.
		@returns	{Object}	Tree root instance or array of root instances
	*/
	create: function(oTree, oBindings, oParent, bSparse) {
			var sType = JUL.typeOf(oTree);
			if (['Array', 'Object'].indexOf(sType) < 0) { return null; }
			if (['Array', 'Object'].indexOf(JUL.typeOf(oBindings)) < 0) { oBindings = null; }
			if (oBindings) {
				var aBindings = [].concat(oBindings);
				oBindings = {};
				for (var m = 0; m < aBindings.length; m++) {
					var oBinding = aBindings[m];
					if (oBinding[this.includeProperty]) {
						if (!oBindings[this.includeProperty]) { oBindings[this.includeProperty] = []; }
						var aItems = [].concat(oBinding[this.includeProperty]);
						for (var p = 0; p < aItems.length; p++) {
							if (oBindings[this.includeProperty].indexOf(aItems[p]) < 0) { oBindings[this.includeProperty].push(aItems[p]); }
						}
					}
					JUL.apply(oBindings, oBinding, false, this.includeProperty);
				}
				if (oBindings[this.includeProperty]) { oBindings = this.include(oBindings); }
			}
			if (sType === 'Array') {
				return oTree.map(function(oItem) {
					return this.create(oItem, oBindings, oParent);
				}, this);
			}
			var oRoot = {root: oTree};
			var oRootParent = {root: oParent};
			var aNodes = [new JUL.Ref({ref: oRoot, key: 'root', parent: oParent ? new JUL.Ref(oRootParent, 'root') : null})];
			var aStack = aNodes;
			while (aNodes.length) {
				var aNextNodes = [];
			for (var i = 0; i < aNodes.length; i++) {
				var oCurrent = aNodes[i];
				oCurrent.config = oCurrent.val();
				sType = JUL.typeOf(oCurrent.config);
				if (sType !== 'Object' && (!bSparse || sType !== 'Array')) { continue; }
				if (sType === 'Array') {
					var aCopy = [].concat(oCurrent.config);
					for (var j = 0; j < aCopy.length; j++) {
						if (['Array', 'Object'].indexOf(JUL.typeOf(aCopy[j])) > -1) {
							aNextNodes.push(new JUL.Ref(aCopy, j));
						}
					}
					oCurrent.val(aCopy);
					oCurrent.sparse = true;
					delete oCurrent.config;
					continue;
				}
				if (oCurrent.config[this.parserProperty]) { continue; }
				var bConfig = !bSparse || oCurrent.config[this.classProperty] || (this.useTags && oCurrent.config[this.tagProperty]);
				delete oCurrent.config[this._instanceProperty];
				var oNew = bConfig ? this.include(oCurrent.config) : JUL.apply({}, oCurrent.config);
				if (bConfig) {
					if (oNew[this.bindingProperty]) {
						if (oBindings) {
							var aCid = [].concat(oNew[this.bindingProperty]);
							for (var k = 0; k < aCid.length; k++) {
								if (oBindings[aCid[k]]) { JUL.apply(oNew, oBindings[aCid[k]]); }
							}
						}
						delete oNew[this.bindingProperty];
					}
					if (oNew[this.idProperty] && oBindings && oBindings[oNew[this.idProperty]]) {
						JUL.apply(oNew, oBindings[oNew[this.idProperty]]);
					}
				}
				oCurrent.val(oNew);
				oCurrent.sparse = !bConfig;
				var aInstantiate = bConfig ? this.getMembers(oNew) : [];
				if (bConfig) { delete oNew[this.instantiateProperty]; }
				for (var sItem in oNew) {
					if (oNew.hasOwnProperty(sItem)) {
						var bInstantiate = bConfig && aInstantiate.indexOf(sItem) > -1;
						sType = JUL.typeOf(oNew[sItem]);
						if (['Array', 'Object'].indexOf(sType) > -1 && (bInstantiate || bSparse)) {
							var aMembers = [].concat(oNew[sItem]);
							if (sType === 'Array' || (bInstantiate && this.topDown)) {
								for (var n = 0; n < aMembers.length; n++) {
										if (['Array', 'Object'].indexOf(JUL.typeOf(aMembers[n])) > -1) {
											aNextNodes.push(new JUL.Ref({ref: aMembers, key: n, parent: oCurrent}));
										}
								}
							}
							else {
									aNextNodes.push(new JUL.Ref({ref: oNew, key: sItem, parent: oCurrent}));
							}
							if (bInstantiate && this.topDown) {
								delete oNew[sItem];
							}
							else {
								if (sType === 'Array') { oNew[sItem] = aMembers; }
							}
						}
					}
				}
			}
			aStack = this.topDown ? aStack.concat(aNextNodes) : aNextNodes.concat(aStack);
			aNodes = aNextNodes;
		}
		for (i = 0; i < aStack.length; i++) {
			oCurrent = aStack[i];
			if (!oCurrent.val()) { continue; }
			if (oCurrent.val()[this.parserProperty]) {
				var oBranchConfig = JUL.apply({}, oCurrent.val());
				var oBranchParser = new this.Parser(oBranchConfig[this.parserProperty]);
				delete oBranchConfig[this.parserProperty];
				oCurrent.val(oBranchParser.create(oBranchConfig, oBindings, this.topDown && oCurrent.parent ? oCurrent.parent.val() : null));
				continue;
			}
			if (!oCurrent.sparse) {
				if (this.topDown) {
					oCurrent.val()[this.parentProperty] = oCurrent.parent ? oCurrent.parent.val() : null;
				}
				oCurrent.val(this.createComponent(oCurrent.val()));
			}
			if (this._keepInstance && oCurrent.config) {
				oCurrent.config[this._instanceProperty] = oCurrent.val();
			}
		}
		return oRoot.root;
	},
	/**
		Creates a single component given its config<br>
		If the ID property is a dotted path, the component is published (made available) under that path
		@param	{Object}	oConfig	Component config
		@returns	{Object}	Component instance
	*/
	createComponent: function(oConfig) {
		if (!oConfig[this.classProperty]) { oConfig[this.classProperty] = this.defaultClass; }
		var sNamespace = '';
		if (oConfig[this.idProperty]) {
			sNamespace = oConfig[this.idProperty].replace(/\\\./g, ':::::');
			oConfig[this.idProperty] = oConfig[this.idProperty].replace(/\\\./g, '--').replace(/\./g, '-');
			if (['window.', 'global.'].indexOf(sNamespace.substr(0, 7)) > -1) { oConfig[this.idProperty] = oConfig[this.idProperty].substr(7); }
			if (sNamespace.substr(0, 1) === '.') { oConfig[this.idProperty] = oConfig[this.idProperty].substr(1); }
		}
		var oJul = JUL.getInstance(this);
		var sClass = oConfig[this.classProperty];
		if (!this.customFactory) { delete oConfig[this.classProperty]; }
		var oNew = this.customFactory ? oJul.get(this.customFactory).call(this, oConfig) : this.factory(sClass, oConfig);
		if (sNamespace.indexOf('.') > -1) {
			return oJul.ns(sNamespace.replace(/:{5}/g, '\\.').replace(/-/g, '_'), oNew);
		}
		else {
			return oNew;
		}
	},
	/**
		Custom factory for DOM languages<br>
		To use it, set the 'customFactory' property of the parser to JUL.UI.createDom
		@param	{Object}	oConfig	Config object
		@param	{Object}	[oWidget]	Optional element instance. If present, the element will not be created, but it will be applied the passed config.
		@returns	{Object}	Element instance
	*/
	createDom: function(oConfig, oWidget) {
		if (!oConfig) { return null; }
		var oJul = JUL.getInstance(this);
		var nNS = this.useTags ? -1 : oConfig[this.classProperty].indexOf(':');
		var sNS = nNS > -1 ? oConfig[this.classProperty].substr(0, nNS) : (this.useTags ? oConfig[this.classProperty] : 'html');
		var oDocument = window.document;
		var bAmple = typeof window.ample === 'object';
		if (bAmple) { oDocument = window.ample; }
		oWidget = oWidget || (sNS === 'html' || typeof oDocument.createElementNS !== 'function' ?
			oDocument.createElement.apply(oDocument, [nNS > -1 ? oConfig[this.classProperty].substr(nNS + 1) : (this.useTags ? oConfig[this.tagProperty] : oConfig[this.classProperty])].concat(oConfig.is || [])) :
			oDocument.createElementNS.apply(oDocument, [this.xmlNS[sNS] || null, nNS > -1 ? oConfig[this.classProperty] : sNS + ':' + (this.useTags ? oConfig[this.tagProperty] : oConfig[this.classProperty])].concat(oConfig.is || [] )));
		if (!oWidget) { return null; }
		if (oConfig.listeners && typeof oConfig.listeners === 'object') {
			var oListeners = oConfig.listeners;
			var oScope = oListeners.scope ? oJul.get(oListeners.scope) : null;
			for (var sItem in oListeners) {
				if (oListeners.hasOwnProperty(sItem) && sItem !== 'scope') {
					var aAll = [].concat(oListeners[sItem]);
					for (var j = 0; j < aAll.length; j++) {
						var fListener = oJul.get(aAll[j]);
						if (fListener) {
							var oWhat = {
								fn: fListener,
								scope: oScope,
								useCapture: false
							};
							if (typeof fListener === 'object') {
								JUL.apply(oWhat, fListener);
								if (fListener.scope) { oWhat.scope = oJul.get(fListener.scope); }
							}
							if (bAmple || oWidget.addEventListener) { oWidget.addEventListener(sItem, oWhat.scope ? oJul.makeCaller(oWhat.scope, oWhat.fn, true) : oWhat.fn, oWhat.useCapture); }
							else { oWidget.attachEvent('on' + sItem, oJul.makeCaller(oWhat.scope || oWidget, oWhat.fn, true)); }
						}
					}
				}
			}
		}
		var aInstantiate = this.getMembers(oConfig);
		for (sItem in oConfig) {
			if (oConfig.hasOwnProperty(sItem) && aInstantiate.indexOf(sItem) < 0 &&
				['listeners', this.cssProperty, 'style', this.htmlProperty, this.tagProperty, this.classProperty, this.parentProperty].indexOf(sItem) < 0)
			{
				nNS = sItem.indexOf(':');
				var sAttr = ['Array', 'Date', 'Function', 'Object', 'Null', 'RegExp'].indexOf(JUL.typeOf(oConfig[sItem])) > -1 ? this.obj2str(oConfig[sItem]) : oConfig[sItem];
				if (this.referencePrefix && typeof oConfig[sItem] === 'string' &&
					sAttr.substr(0, this.referencePrefix.length) === this.referencePrefix && JUL.trim(sAttr.substr(this.referencePrefix.length))) {
					sAttr = JUL.trim(sAttr.substr(this.referencePrefix.length));
				}
				if (nNS > -1 && typeof oWidget.setAttributeNS === 'function') {
					oWidget.setAttributeNS(this.xmlNS[sItem.substr(0, nNS)] || null, sItem, sAttr);
				}
				else {
					oWidget.setAttribute(sItem, sAttr);
				}
			}
		}
		if (oConfig[this.cssProperty]) {
			oWidget.setAttribute('class', oConfig[this.cssProperty]);
		}
		if (oConfig.style) {
			if (bAmple) {
				oWidget.setAttribute('style', oConfig.style);
			}
			else {
				oWidget.style.cssText = oWidget.style.cssText +';'+ oConfig.style;
			}
		}
		if (oConfig[this.htmlProperty]) {
			if (bAmple) {
				ample.query(oWidget).append(oConfig[this.htmlProperty].substr(0, 1) === '<' && oConfig[this.htmlProperty].substr(-1) === '>' ?
					oConfig[this.htmlProperty] : '<span>' + oConfig[this.htmlProperty] + '</span>');
			}
			else {
				oWidget.innerHTML = oConfig[this.htmlProperty];
			}
		}
		for (sItem in oConfig) {
			if (oConfig.hasOwnProperty(sItem) && oConfig[sItem] && typeof oConfig[sItem] === 'object' &&
				aInstantiate.indexOf(sItem) > -1) {
				var aMembers = [].concat(oConfig[sItem]);
				var oMembersWidget =  oWidget;
				if (sItem !== this.childrenProperty) {
					nNS = sItem.indexOf(':');
					sNS = nNS > -1 ? sItem.substr(0, nNS) : (this.useTags ? this.defaultClass : 'html');
					oMembersWidget = sNS === 'html' || typeof oDocument.createElementNS !== 'function' ?
						oDocument.createElement.apply(oDocument, [nNS > -1 ? sItem.substr(nNS + 1) : sItem].concat(oConfig.is || [])) :
						oDocument.createElementNS.apply(oDocument, [this.xmlNS[sNS] || null, nNS > -1 ? sItem : sNS + ':' + sItem].concat(oConfig.is || []));
				}
				for (var k = 0; k < aMembers.length; k++) {
					oMembersWidget.appendChild(aMembers[k]);
				}
				if (sItem !== this.childrenProperty) {
					oWidget.appendChild(oMembersWidget);
				}
			}
		}
		if (this.topDown && oConfig[this.parentProperty] &&
			typeof oConfig[this.parentProperty] === 'object') {
			oConfig[this.parentProperty].appendChild(oWidget);
		}
		return oWidget;
	},
	/**
		Expands a compacted config tree converting all 'membersProperties' properties into 'childrenProperty' items
		@param	{Object}	oData	Compacted config tree
		@returns	{Object}	Expanded config tree
	*/
	expand: function(oData) {
		if (!oData || typeof oData !== 'object') { return oData; }
		if (JUL.typeOf(oData)  === 'Array') { return oData.map(this.expand, this); }
		oData = this.include(oData);
		var aChildren = [];
		var aInstantiate = this.getMembers(oData);
		delete oData[this.instantiateProperty];
		for (var sItem in oData) {
			if (oData.hasOwnProperty(sItem) && oData[sItem] && typeof oData[sItem] === 'object' &&
				aInstantiate.indexOf(sItem) > -1) {
				if (sItem === this.childrenProperty) {
					aChildren = aChildren.concat(oData[sItem]);
				}
				else {
					var oNew = {};
					if (!this.useTags && sItem !== this.defaultClass) { oNew[this.classProperty] = sItem; }
					if (this.useTags) {
						var nNS = sItem.indexOf(':');
						if (nNS > -1 && sItem.substr(0, nNS) !== this.defaultClass) { oNew[this.classProperty] = sItem.substr(0, nNS); }
						oNew[this.tagProperty] = nNS > -1 ? sItem.substr(nNS + 1) : sItem;
					}
					oNew[this.childrenProperty] = [].concat(oData[sItem]);
					delete oData[sItem];
					aChildren.push(oNew);
				}
			}
		}
		if (aChildren.length) {
			oData[this.childrenProperty] = aChildren;
			for (var i = 0; i < aChildren.length; i++) {
				aChildren[i] = this.expand(aChildren[i]);
			}
		}
		return oData;
	},
	/**
		Default factory method that creates an object of a certain class
		@param	{String}	sClass	Dotted path of the class constructor i.e. class full name
		@param	{Object}	oArgs	Constructor arguments as a config object (excluding class name)
		@returns	{Object}	The new created object
	*/
	factory: function(sClass, oArgs) {
		var FNew = JUL.getInstance(this).get(sClass);
		if (typeof FNew !== 'function') { return null; }
		if (oArgs) {
			return new (FNew)(oArgs);
		}
		else {
			return new (FNew)();
		}
	},
	/**
		Gets a list of members to instantiate that may depend on the supplied config node.
		It takes into account all members settings and mappings.
		@param	{Object}	[oConfig]	Configuration object
		@returns	{Array}	List of member names to instantiate (for the given config)
	*/
	getMembers: function(oConfig) {
		var aMembers = [].concat(this.childrenProperty, this.membersProperties || []);
		if (!oConfig) { return aMembers; }
		var aClass = [];
		if (!this.useTags || (oConfig[this.classProperty] && oConfig[this.classProperty] !== this.defaultClass)) {
			aClass.push(oConfig[this.classProperty] || this.defaultClass);
		}
		if (this.useTags) { aClass.push(oConfig[this.tagProperty]); }
		var oMappings = this.membersMappings || {};
		return aMembers.concat(oMappings[aClass.join(':')] || [], oConfig[this.instantiateProperty] || []);
	},
	/**
		Does explicit object inheritance based on a predefined object property
		@param	{Object}	oData	Config object containing an include property i.e. a dotted path to another object
		@param	{Function}	[fMerger]	Callback function to do a custom object merging. it has two parameters:<ul>
		<li>oSource - the current object to be affected</li>
		<li>oAdd - the object to be merged with oSource</li>
		</ul>If not present, the merging is done using JUL.apply()
		@returns	{Object}	Object with recursively applied inherited properties where not already present
	*/
	include: function(oData, fMerger) {
		var oNew = {};
		if (!oData[this.includeProperty]) {
			return JUL.apply(oNew, oData);
		}
		var bMerger = fMerger && typeof fMerger === 'function';
		if (!bMerger && this._includeMerger) {
			fMerger = this._includeMerger;
			bMerger = typeof fMerger === 'function';
		}
		var oJul = JUL.getInstance(this);
		var aIncludes = [].concat(oData[this.includeProperty]);
		for (var i = 0; i < aIncludes.length; i++) {
			var oInclude = oJul.get(aIncludes[i]);
			if (oInclude) {
				if (bMerger) {  fMerger.call(this, oNew, this.include(oInclude, fMerger)); }
				else { JUL.apply(oNew, this.include(oInclude)); }
			}
		}
		var aCid = oNew[this.bindingProperty] ? [].concat(oNew[this.bindingProperty]) : [];
		if (oData[this.bindingProperty] && aCid.indexOf(oData[this.bindingProperty]) < 0) {
			aCid.push(oData[this.bindingProperty]);
		}
		if (bMerger) { fMerger.call(this, oNew, oData); }
		else { JUL.apply(oNew, oData); }
		if (aCid.length) { oNew[this.bindingProperty] = aCid; }
		delete oNew[this.includeProperty];
		return oNew;
	},
	/**
		Recursively converts a config object to JavaScript or to JSON
		@param	{Object}	oData	Config object
		@param	{Boolean}	[bQuote]	Set it to true for getting valid JSON instead of JavaScript
		@param	{Function}	[fDecorator]	Postprocessing the code fragment corresponding to each inner member, up to the next delimiter. 
		Only available for the JavaScript generated code. Parameters:<ul>
		<li><b>sContent</b>: the code fragment</li>
		<li><b>sPath</b>: the dotted path to the current member relative to the root object</li>
		<li><b>sIndent</b>: the current indentation in the generated code</li>
		</ul>The call is made in the context of the root object. You should return the unchanged fragment when not processing.
		@returns	{String}	JavaScript code or JSON string
	*/
	obj2str: function(oData, bQuote, fDecorator) {
		if (typeof this._useJsonize === 'undefined') {
			var fEmpty = function() {};
			this._useJsonize = JSON.stringify({o: fEmpty}, JUL.makeCaller(JUL.UI, '_jsonReplacer')).indexOf('function') < 0;
		}
		var sData = this._useJsonize ? JSON.stringify(this._jsonize(oData)) : JSON.stringify(oData, JUL.getInstance(this).makeCaller(this, '_jsonReplacer'));
		if (!sData) { return ''; }
		var ca = '#';
		var c = '';
		var sIndent = '';
		var sResult = '';
		var sContent = '';
		var bString = false;
		var aStack = [];
		var aPath = [];
		var nStart = 0;
		var nLn = 0;
		var nLastComma = 0;
		for (var i = 0; i < sData.length; i++) {
			c = sData.substr(i, 1);
			if (c === '"' && ca !== '\\') {
				bString = !bString;
				if (bString) { nStart = i; }
			}
			if (bString) {
				if (bQuote) { sResult = sResult + c; }
				ca = c;
				continue;
			}
			if (!bQuote && ('{[,]}').indexOf(c) > -1 && (']}').indexOf(ca) < 0) {
				sResult = sResult + (fDecorator ? fDecorator.call(oData, sContent,
					aPath.map(function(sVal) { return sVal.toString().replace(/\./g, '\\.'); }).join('.'), sIndent) : sContent);
				sContent = '';
			}
			if (c === '"' && !bQuote) {
				var sItem = JSON.parse(sData.substr(nStart, i - nStart + 1));
				if (sData.substr(i + 1, 1) === ':') {
					if (fDecorator) { aPath[aPath.length - 1] = sItem; }
					sContent = sContent + (!this._regExps.keyword.test(sItem) && (this._regExps.variable.test(sItem) || this._regExps.uint.test(sItem)) ?
						sItem : (this._useDoubleQuotes ? sData.substr(nStart, i - nStart + 1) :
						"'" + sData.substr(nStart + 1, i - nStart - 1).replace(/\\"/g, '"').replace(/'/g, "\\'") + "'"));
				}
				else {
					var bPrefix = false;
					if (this._usePrefixes) {
						if (sItem.substr(0, this._jsonPrefixes.func.length) === this._jsonPrefixes.func &&
							JUL.trim(sItem.substr(this._jsonPrefixes.func.length))) {
							bPrefix = true;
							sItem = sItem.substr(this._jsonPrefixes.func.length).replace(/^\s+/, '');
						}
						else if (sItem.substr(0, this._jsonPrefixes.newop.length) === this._jsonPrefixes.newop &&
							JUL.trim(sItem.substr(this._jsonPrefixes.newop.length))) {
							bPrefix = true;
							sItem = sItem.substr(this._jsonPrefixes.newop.length).replace(/^\s+/, '');
						}
					}
					if (bPrefix || (!this._usePrefixes && (this._regExps.functionStart.test(sItem) || this._regExps.newStart.test(sItem)))) {
						var oBegin = sItem.match(/\n(\s|\t)+\}$/);
						if (oBegin) {
							oBegin = oBegin[0].substr(0, oBegin[0].length - 1);
							sItem = sItem.replace(new RegExp(oBegin, 'g'), '\n');
						}
						sItem = sItem.replace(/\t/g, this._tabString)
							.replace(/\n\r?/g, this._newlineString + sIndent);
						sContent = sContent + sItem;
						ca = '~';
						continue;
					}
					else {
						bPrefix = false;
						if (this._usePrefixes &&
							sItem.substr(0, this._jsonPrefixes.regex.length) === this._jsonPrefixes.regex &&
								JUL.trim(sItem.substr(this._jsonPrefixes.regex.length))) {
							bPrefix = true;
							sItem = sItem.substr(this._jsonPrefixes.regex.length).replace(/^\s+/, '');
						}
						if (this.referencePrefix && sItem.substr(0, this.referencePrefix.length) === this.referencePrefix &&
							JUL.trim(sItem.substr(this.referencePrefix.length))) {
							bPrefix = true;
							sItem = sItem.substr(this.referencePrefix.length).replace(/^\s+/, '');
						}
						sContent = sContent + (bPrefix || (!this._usePrefixes && this._regExps.regexp.test(sItem)) ?
							sItem : (this._useDoubleQuotes ? sData.substr(nStart, i - nStart + 1) :
							"'" + sData.substr(nStart + 1, i - nStart - 1).replace(/\\"/g, '"').replace(/'/g, "\\'") + "'"));
					}
				}
			}
			else if (c === '{' || c === '[') {
				if (!bQuote && fDecorator) { aPath.push(c === '[' ? 0 : ''); }
				aStack.push(c);
				if ((aStack.length === 1 && sData.substr(i + 1, 1) !== '}' && sData.substr(i + 1, 1) !== ']') ||
					(c === '{' && ca === ':' && sData.substr(i + 1, 1) !== '}') ||
					(c === '[' && (sData.substr(i + 1, 1) === '{' || sData.substr(i + 1, 1) === '['))) {
					sIndent = sIndent + this._tabString;
					sResult = sResult + c + this._newlineString + sIndent;
					nLn = sResult.length;
				}
				else {
					sResult = sResult + c;
				}
			}
			else if (c === ',') {
				if (this._phraseLength && nLastComma && sResult.length > nLn + this._phraseLength) {
					sResult = sResult.slice(0, nLastComma) + this._newlineString + sIndent + sResult.substr(nLastComma);
					nLn = nLastComma + this._newlineString.length + sIndent.length;
				}
				nLastComma = sResult.length + 1;
				if (!bQuote && fDecorator && aStack.length && aStack[aStack.length - 1] === '[') { aPath[aPath.length - 1]++; }
				if (aStack.length === 1 || ca === '~' || ((ca === '}' || ca === ']') &&
					sData.substr(i - 2, 1) !== '{' && sData.substr(i - 2, 1) !== '[')) {
					sResult = sResult + c + this._newlineString + sIndent;
					nLn = sResult.length;
					nLastComma = 0;
				}
				else if(!bQuote) {
					sResult = sResult + c + this._spaceString;
				}
				else {
					sResult = sResult + c;
				}
			}
			else if (c === '}' || c === ']') {
				if (this._phraseLength &&  nLastComma && sResult.length > nLn + this._phraseLength) {
					sResult = sResult.slice(0, nLastComma) + this._newlineString + sIndent + sResult.substr(nLastComma);
					nLn = nLastComma + this._newlineString.length + sIndent.length;
				}
				nLastComma = 0;
				if (!bQuote && fDecorator) { aPath.pop(); }
				aStack.pop();
				if ((!aStack.length && ca !== '{' && ca !== '[') ||
					(c === '}' && aStack.length && aStack[aStack.length - 1] === '{' && ca !== '{') ||
					(c === ']' && (ca === '}'  || ca === ']'))) {
					sIndent = sIndent.substr(this._tabString.length);
					sResult = sResult + this._newlineString + sIndent + c;
					nLn = sResult.length - 1;
				}
				else {
					sResult = sResult + c;
				}
			}
			else {
				if (bQuote) { sResult = sResult + c; }
				else { sContent = sContent + (c === ':' ? c + this._spaceString : c); }
			}
			ca = c;
		}
		if (!bQuote && sContent) {
			sResult = sResult + (fDecorator ? fDecorator.call(oData, sContent, '', sIndent) : sContent);
		}
		return sResult;
	},
	/**
		Converts a XML DOM to a JUL.UI config tree or to JavaScript code
		@param	{Object}	oXml	DOM XML object or XML string to convert
		@param	{Boolean}	[bReturnString]	Whether to serialize converted object to JavaScript code
		@returns	{Object}	JUL.UI config tree or its JavaScript code
	*/
	xml2jul: function(oXml, bReturnString) {
		if (typeof oXml !== 'object') {
			oXml = this._createXml(oXml);
		}
		if (oXml.error) {
				return bReturnString ? this.obj2str(oXml) : oXml;
		}
		if (oXml.parseError && oXml.parseError.errorCode !== 0) {
			return bReturnString ? this.obj2str({error: oXml.parseError.reason}) : {error: oXml.parseError.reason};
		}
		var oData = {};
		var dom2jul = function(oData, oNode, bNoTag) {
			if (oNode.nodeName === 'parsererror') {
				oData.error = oNode.textContent;
				return;
				}
			var nNS = oNode.nodeName.indexOf(':');
			if (!bNoTag && nNS > -1) {
				if (this.defaultClass !== oNode.nodeName.substr(0, nNS)) {
					oData[this.classProperty] = oNode.nodeName.substr(0, nNS);
				}
				oData[this.tagProperty] = oNode.nodeName.substr(nNS + 1);
			}
			else {
				if (!bNoTag || this.defaultClass !== oNode.nodeName) {
					oData[bNoTag ? this.classProperty : this.tagProperty] = oNode.nodeName;
				}
			}
			for (var i = 0; i < oNode.attributes.length; i++) {
				var oAttribute = oNode.attributes[i];
				if (oAttribute.name.substr(0, 5) !== 'xmlns') { 
					oData[oAttribute.name === 'class' ? this.cssProperty : oAttribute.name] =
						this._regExps.number.test(oAttribute.value) || this._regExps.special.test(oAttribute.value) ?
						JSON.parse(oAttribute.value) : oAttribute.value;
				}
			}
			if (oNode.childNodes.length && oNode.firstChild.nodeType === 3 &&
				JUL.trim(oNode.firstChild.nodeValue)) {
				oData[this.htmlProperty] = oNode.firstChild.nodeValue;
			}
			var aNames = [];
			var oRepeat = {};
			for (i = 0; i < oNode.childNodes.length; i++) {
				var oChild = oNode.childNodes[i];
				if (oChild.nodeType === 1) {
					if (aNames.indexOf(oChild.nodeName) > -1) {
						oRepeat[oChild.nodeName] = true;
					}
					else {
						aNames.push(oChild.nodeName);
					}
				}
			}
			for (i = 0; i < oNode.childNodes.length; i++) {
				oChild = oNode.childNodes[i];
				if (oChild.nodeType === 1) {
					nNS = oChild.nodeName.indexOf(':');
					var sTag = !bNoTag && nNS > -1 && this.defaultClass === oChild.nodeName.substr(0, nNS) ?
						oChild.nodeName.substr(nNS + 1) : oChild.nodeName;
					if (!oRepeat[oChild.nodeName] &&
						[].concat(this.childrenProperty, this.membersProperties || []).indexOf(sTag) > -1) {
						var aMembers = [];
						oData[sTag] = aMembers;
						for (var k = 0; k < oChild.childNodes.length; k++) {
							var oGrandChild = oChild.childNodes[k];
							if (oGrandChild.nodeType === 1) {
								aMembers.push({});
								dom2jul.call(this, aMembers[aMembers.length - 1], oGrandChild, bNoTag);
							}
						}
					}
					else {
						aMembers = oData[this.childrenProperty] || [];
						oData[this.childrenProperty] = aMembers;
						aMembers.push({});
						dom2jul.call(this, aMembers[aMembers.length - 1], oChild, bNoTag);
					}
				}
			}
		};
		dom2jul.call(this, oData, oXml.documentElement, !this.useTags);
		return bReturnString ? this.obj2str(oData) : oData;
	},
	/**
		May be set to a 'include' merging function used globally by the parser.
		See JUL.UI.include() parameters.
		@type	Function
		@private
	*/
	_includeMerger: null,
	/**
		Used for debugging purposes
		@type	String
		@private
	*/
	_instanceProperty: '_instance',
	/**
		Prefixes used when serializing certain objects into JSON.
		@see JUL.UI._usePrefixes property
		@type	Object
		@private
	*/
	_jsonPrefixes: {
		func: '=func:', regex: '=regex:', newop: '=newop:'
	},
	/**
		Used for debugging purposes
		@type	Boolean
		@private
	*/
	_keepInstance: false,
	/**
		New line delimiter for serialized strings
		@type	String
		@private
	*/
	_newlineString: '\n',
	/**
		Desired line length of an Array/Object member list in the generated code
		@type	Number
		@private
	*/
	_phraseLength: 120,
	/**
		Several RegExp patterns used across JUL.UI
		@type	Object
		@private
	*/
	_regExps: {
		variable: /^[a-z$_][\w$]*$/i, number: /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/, uint: /^(\d|[1-9]\d+)$/,
		 functionStart: /^function\s*\(/, newStart: /^new\s+[A-Z$_][\w$]*\s*\(/,
		 isoDateStart: /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/, regexp: /^\/(\s|\S)+\/[gim]{0,3}$/,
		 special: /^(true|false|null)$/, autoUseStrict: /(\{)\r?\n?"use strict";\r?\n?/,
		 keyword: /^(break|case|catch|continue|debugger|default|delete|do|else||finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with|class|enum|export|extends|import|super|implements|interface|let|package|private|protected|public|static|yield)$/
	},
	/**
		Space delimiter for serialized strings
		@type	String
		@private
	*/
	_spaceString: ' ',
	/**
		Tab delimiter for serialized strings
		@type	String
		@private
	*/
	_tabString: '\t',
	/**
		Set to true to generate double quoted JavaScript strings
		@type	Boolean
		@private
	*/
	_useDoubleQuotes: false,
	/**
		If true, the objects/functions will serialize into JSON using type dependent prefixes.
		@see JUL.UI._jsonPrefixes hash. This doesn't affect the generated JavaScript.
		@type	Boolean
		@private
	*/
	_usePrefixes: false,
	/**
		Utility wrapper of browser's XML parser
		@private
	*/
	_createXml: function(sXml) {
		if (window.DOMParser) {
			JUL.UI._xmlParser = JUL.UI._xmlParser || new DOMParser();
			try {
				return JUL.UI._xmlParser.parseFromString(sXml, 'application/xml');
			}
			catch(e) {
				return {error: e.message};
			}
		}
		else {
			JUL.UI._xmlParser = JUL.UI._xmlParser || new ActiveXObject('Msxml2.DOMDocument.3.0');
			 JUL.UI._xmlParser.async = false;
			 JUL.UI._xmlParser.loadXML(sXml);
			return  JUL.UI._xmlParser; 
		}
	},
	/**
		Callback used internally by the serializer
		@private
	*/
	_jsonReplacer: function(sKey, oValue) {
		if (typeof oValue === 'string' && JUL.UI._regExps.isoDateStart.test(oValue)) {
			oValue = new Date(Date.UTC(parseInt(oValue.substr(0, 4)), parseInt(oValue.substr(5, 2)) - 1, parseInt(oValue.substr(8, 2)),
				parseInt(oValue.substr(11, 2)), parseInt(oValue.substr(14, 2)), parseInt(oValue.substr(17, 2)), oValue.substr(19, 1) === '.' ? parseInt(oValue.substr(20, 3)) : 0));
		}
		switch (JUL.typeOf(oValue)) {
		case 'Function':
			return (this._usePrefixes ? this._jsonPrefixes.func + ' ' : '') +
				oValue.toString().replace(JUL.UI._regExps.autoUseStrict, '$1');
		case 'RegExp':
			return (this._usePrefixes ? this._jsonPrefixes.regex + ' ' : '') +
				oValue.toString();
		case 'Date':
			return (this._usePrefixes ? this._jsonPrefixes.newop + ' ' : '') +
				'new Date(/*' + oValue.toUTCString().replace('UTC', 'GMT') + '*/' + oValue.getTime() + ')';
		default:
			return oValue;
		}
	},
	/**
		Copies an object to a format suitable for JSON.stringify(). Used only for old JSON engines
		@private
	*/
	_jsonize: function(oData, _sKey) {
		var oValue = oData;
		if (typeof _sKey === 'undefined') { _sKey = ''; }
		else { oValue = oData[_sKey]; }
		if (oValue && typeof oValue === 'object' && typeof oValue.toJSON === 'function') {
			return this._jsonReplacer(_sKey, oValue.toJSON());
		}
		switch (JUL.typeOf(oValue)) {
		case 'Array':
			var aOut = [];
			for (var i = 0; i < oValue.length; i++) {
				try {
					aOut[i] = this._jsonize(oValue, i);
				}
				catch (e1) {
					aOut[i] = null;
				}
			}
			return aOut;
		case 'Object':
			var oOut = {};
			for (var sItem in oValue) {
				try {
					if (oValue.hasOwnProperty(sItem)) { oOut[sItem] = this._jsonize(oValue, sItem); }
				}
				catch (e2) {}
			}
			return oOut;
		default:
			return this._jsonReplacer(_sKey, oValue);
		}
	}
});

/* initiate a cyclic direct inheritance */
JUL.UI.Parser.prototype = JUL.UI;

})(typeof global !== 'undefined' ? global : window);

/* end JUL.UI.js */
