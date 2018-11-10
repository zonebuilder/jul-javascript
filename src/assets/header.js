/*
	JUL - The JavaScript UI Language version 1.6.1
	Copyright (c) 2012 - 2018 The Zonebuilder <zone.builder@gmx.com>
	http://sourceforge.net/projects/jul-javascript/
	Licenses: GNU GPLv2 or later; GNU LGPLv3 or later (http://sourceforge.net/p/jul-javascript/wiki/License/)
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
