var oConfig = {
	copy: 'src/site/**',
	dest: 'build',
	concat: ['src/jul/JUL.js', 'src/jul/JUL.Ref.js', 'src/jul/JUL.UI.js'],
	concatHeader: 'src/assets/header.js',
	concatName: 'jul.js',
	concatDest: 'build/source',
	minHeader: 'src/assets/header-min.js',
	minName: 'jul.min.js',
	minDest: 'build/js',
	jsdoc: 'node "../../node_modules/jsdoc2/app/run.js" -d="../../build/docs" -D="noGlobal:true" -D="title:JUL 1.3.7 API Reference" -D="index:files" -D="copyright:true" -t="../jsdoc-templates/codeview" -p .',
	jsdocFrom: 'src/jul',
	copyNode: ['build/**', '!build/Readme', '!build/index.html', '!build/data/*', '!build/examples/*', '!build/js/*',
		 '!build/media/*', '!build/data', '!build/examples', '!build/js', '!build/media',
		 'README.md', 'LICENSE', 'package.json', 'src/node/*'],
	destNode: 'build_node'
};
var fRun = require('child_process').exec;
var oGulp = require('gulp');
var oPlugins = require('gulp-load-plugins')();

var oFlags = {
	scripts: false,
	jsdoc: false,
	site: false,
	built: false,
	built_node: false,
	done: function(sWhat) {
		this[sWhat] = true;
		if (this.scripts && this.jsdoc && this.site) {
			this.site = this.jsdoc = this.scripts = false;
			if (typeof this.built === 'function') {
				this.built();
				this.built = false;
			}
		}
	},
	done_node: function() {
		if (typeof this.built_node === 'function') {
			this.built_node();
			this.built_node = false;
		}
	}
};

oGulp.task('site', function(fDone) {
	oGulp.src(oConfig.copy)
	.pipe(oGulp.dest(oConfig.dest))
	.on('end', function() {
		fDone();
		oFlags.done('site');
	});
});

oGulp.task('scripts', function(fDone) {
	oGulp.src(oConfig.concat)
	.pipe(oPlugins.jshint())
	.pipe(oPlugins.stripComments())
	.pipe(oPlugins.addSrc.prepend(oConfig.concatHeader))
	.pipe(oPlugins.concat(oConfig.concatName, {newLine: ''}))
	.pipe(oGulp.dest(oConfig.concatDest))
	.pipe(oPlugins.uglify())
	.pipe(oPlugins.addSrc.prepend(oConfig.minHeader))
	.pipe(oPlugins.concat(oConfig.minName, {newLine: ''}))
	.pipe(oGulp.dest(oConfig.minDest))
	.on('end', function() {
		fDone();
		oFlags.done('scripts');
	});
});

oGulp.task('jsdoc', function(fDone) {
	fRun(oConfig.jsdoc, {cwd: oConfig.jsdocFrom}, function() {
		fDone();
		oFlags.done('jsdoc');
	});
});

oGulp.task('clean', function() {
	return oGulp.src(oConfig.dest + '/*', {read: false})
	.pipe(oPlugins.clean());
});

oGulp.task('build', function(fDone) {
	oFlags.built = fDone;
	oGulp.start(['site', 'jsdoc', 'scripts']);
});

oGulp.task('clean_node', function() {
	return oGulp.src(oConfig.destNode + '/*', {read: false})
	.pipe(oPlugins.clean());
});

oGulp.task('build_node', ['build'], function(fDone) {
	oGulp.src(oConfig.copyNode)
	.pipe(oGulp.dest(oConfig.destNode))
	.on('end', function() {
		fDone();
		oFlags.done_node();
	});
});

oGulp.task('default', ['clean', 'clean_node'], function(fDone) {
	oFlags.built_node = fDone;
	oGulp.start(['build_node']);
});
