/*
	JUL Calculator v1.0
	Copyright (c) 2018 The Zonebuilder <zone.builder@gmx.com>
	Licenses: GNU GPLv2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-javascript/wiki/License/)
 */
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, 
	onevar: true, newcap: true, noarg: true, node: true, strict: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals JUL, Vue */
(function() {
'use strict';

/* Calc UI related */
var oProject = JUL.ns('Calc');
JUL.apply(oProject, {
	ui: {
	c: 'div',
	'class': 'board-vue',
	attrs: {id: 'calc'},
	children: [
		{c: 'div', attrs: {id: 'screen'}, children: [
			{c: 'input', attrs: {id: 'display', 'type': 'text', readonly: true, value: '$display'}}
		]},
		{c: 'div', attrs: {id: 'keys'}, children: []}
	]},
	addButtons: function() {
		var aButtons = this.ui.children[1].children;
		for (var i = 0; i < this.config.keys.length; i++) {
			var sKey = this.config.keys.substr(i, 1);
			aButtons[i] = {
				c: 'button',
				'class': 'key' + (this.config.special.indexOf(sKey) > -1 ?
					' k' + sKey.charCodeAt(0) : ''),
					attrs: {value: sKey},
					html: this.config.labelMap[sKey] || sKey
			};
		}
	},
	props: {
		display: '0'
	},
	render: function(createElement) {
		var oParser = new JUL.UI.Parser({
			classProperty: 'c',
			nsRoot: this.props,
			referencePrefix: '$',
			customFactory: JUL.UI.createVDom,
			_createElement: createElement
		});
		return oParser.create(this.ui,null, null, true);
	},
	init: function() {
		['ui', 'render'].map(function(sItem) {
			var oEl = window.document.getElementById(sItem + '-code');
			oEl.wrap = 'off';
			oEl.value = JUL.UI.obj2str(this[sItem]).replace(/\t/g, '    ')
				.replace(/(:\s{)\s+(\w)/g, '$1$2').replace(/(\x27)\s+(})/g, '$1$2') + '\n';
		}, this);
		this.addButtons();
		new Vue({
			el: '#app',
			data: this.props,
			render: JUL.makeCaller(this, 'render')
		});
	},
	display: function() {
		var sText = this.get('text');
		var c = sText.substr(0, 1) === '-' ? sText.substr(1, 1) : sText.substr(0, 1);
		this.props.display = c >= '0' && c <= '9' ? sText.toUpperCase() : 'Error';
	}
});

})();
