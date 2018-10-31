/*
	JUL Calculator v1.0
	Copyright (c) 2018 The Zonebuilder <zone.builder@gmx.com>
	Licenses: GNU GPLv2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-javascript/wiki/License/)
 */
/* jshint browser: true, curly: true, eqeqeq: true, expr: true, funcscope: true, immed: true, latedef: true, 
	onevar: true, newcap: true, noarg: true, node: true, strict: true, trailing: true, undef: true, unused: vars, wsh: true */
/* globals JUL */
(function() {
'use strict';
/* Calc busibess logic */
var oProject = JUL.ns('Calc');
JUL.apply(oProject, {
	version: '1.0',
	config: {
		keys: '#!$@789%456/123*0.-+=',
		labelMap: {
			'#': 'CE',
			'@': '&lt;-',
			'$': '+/-',
			'!': '1/x'
		},
		special: '+=0',
		keyMap: {
			enter: '=',
			backspace: '@',
			'delete': '#',
			sign: '$',
			invert: '!',
			add: '+',
			subtract: '-',
			multiply: '*',
			divide: '/',
			decimal: '.'
		},
		alias: {
			back: 'backspace',
			del: 'delete',
			'\\': 'sign',
			'|': 'invert'
		}
	},
	state: {
		text: '0',
		value: 0,
		op: '',
		over: true
	},
	map: function(name) {
		var c = this.config.alias[name] || name;
		c = this.config.keyMap[c] || c;
		return c;
	},
	get: function(prop) {
		return this.state[prop];
	},
	set: function(prop, val) {
		this.state[prop] = val;
	},
	onClick: function(event) {
		if (event.target.nodeName.toLowerCase() === 'button') {
			var sKey = this.map(event.target.value);
			if (this.config.keys.indexOf(sKey) > -1) {
				this.dispatch(sKey);
			}
		}
	},
	onKey: function(event) {
	 var key = event.key.toLowerCase();
	 key = this.map(key);
	 if (this.config.keys.indexOf(key) > -1) {
	 	event.preventDefault();
		 this.dispatch(key);
	 }
	},
	dispatch: function(key) {
		var clear = '.0123456789';
		var inputs = clear + this.map('sign') + this.map('back');
		var ops = '/*+-%=' + this.map('invert') + this.map('del');
		var c = key;
		switch (key) {
		case this.map('back'): c = 'b'; break;
		case this.map('del'): c = 'c'; break;
		case this.map('sign'): c = 's'; break;
		case this.map('invert'): c = 'v'; break;
		}
		if (this.get('over') && clear.indexOf(key) > -1) {
			this.set('over', false);
			this.set('text', '0');
		}
		if (!this.get('over') && inputs.indexOf(key) > -1) {
			this.input(c);
		}
		if (ops.indexOf(key) > -1 || (c === 's' && this.get('over'))) {
			if (!this.get('over') && c !== 'c') {
				this.calc();
			}
			this.set('op', c);
			var single = '%svc';
			if (single.indexOf(c) > -1) {
				this.calc();
			}
		}
		this.display();
	},
	input: function(key) {
		var c = key === '.' || (key >= '0' && key <= '9') ? 'd' : key;
		var text = this.get('text');
		if (text === '0') {
			if (key === '0' || c === 's' || c === 'b') {
				return;
			}
			if (key !== '.') {
				text = '';
			}
		}
		if (key === '.' && text.indexOf('.' ) > -1) {
			return;
		}
		switch (c) {
		case 'd': text += key; break;
		case 's': text = text.substr(0, 1) === '-' ? text.substr(1) : '-' + text; break;
		case 'b': text = text.slice(0, -1) || '0'; break;
		}
		if (text === '-' || text === '-0') {
			text = '0';
		}
		this.set('text', text);
	},
		calc: function() {
		var text = this.get('text');
		var value = this.get('value');
		var v = parseFloat(text);
		switch (this.get('op')) {
		case '/': value /= v; break;
		case '*': value *= v; break;
		case '+': value += v; break;
		case '-': value -= v; break;
	
		case '%': value = v * 100.0; break;
		case 's': value = -value; break;
		case 'v': value = 1.0 / value; break;
		case 'c': value = 0; break;
		default: value = v;
		}
		if (value) {
			value = parseFloat(value.toPrecision(15));
			if (!isFinite(value)) {
				value = parseFloat('z');
			}
		}
		this.set('text', parseFloat(value.toPrecision(14)).toString());
		this.set('value', value);
		this.set('op', '');
		this.set('over', true);
	}
});

})();
	