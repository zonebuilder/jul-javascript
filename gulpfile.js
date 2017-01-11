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
	jsdoc: 'node "../../node_modules/jsdoc2/app/run.js" -d="../../build/docs" -D="noGlobal:true" -D="title:JUL 1.3.8 API Reference" -D="index:files" -D="copyright:true" -t="../jsdoc-templates/codeview" -p .',
	jsdocFrom: 'src/jul',
	copyNode: ['build/**', '!build/Readme', '!build/index.html', '!build/data/*', '!build/examples/*', '!build/js/*',
		 '!build/media/*', '!build/data', '!build/examples', '!build/js', '!build/media',
		 'README.md', 'LICENSE', 'src/node/**'],
	destNode: 'build_node'
};
var fRun = require('child_process').exec;
var oGulp = require('gulp');
var oPlugins = require('gulp-load-plugins')();
require('pump');

oGulp.task('site', function() {
	return oGulp.src(oConfig.copy)
	.pipe(oGulp.dest(oConfig.dest));
});

oGulp.task('scripts', function() {
	return oGulp.src(oConfig.concat)
	.pipe(oPlugins.jshint())
	.pipe(oPlugins.stripComments())
	.pipe(oPlugins.addSrc.prepend(oConfig.concatHeader))
	.pipe(oPlugins.concat(oConfig.concatName, {newLine: ''}))
	.pipe(oGulp.dest(oConfig.concatDest))
	.pipe(oPlugins.uglify())
	.pipe(oPlugins.addSrc.prepend(oConfig.minHeader))
	.pipe(oPlugins.concat(oConfig.minName, {newLine: ''}))
	.pipe(oGulp.dest(oConfig.minDest));
});

oGulp.task('jsdoc', function(fDone) {
	fRun(oConfig.jsdoc, {cwd: oConfig.jsdocFrom}, fDone);
});

oGulp.task('clean', function() {
	return oGulp.src(oConfig.dest + '/*', {read: false})
	.pipe(oPlugins.clean());
});

oGulp.task('build', ['site', 'jsdoc', 'scripts']);

oGulp.task('clean_node', function() {
	return oGulp.src(oConfig.destNode + '/*', {read: false})
	.pipe(oPlugins.clean());
});

oGulp.task('build_node', ['build'], function() {
	return oGulp.src(oConfig.copyNode)
	.pipe(oGulp.dest(oConfig.destNode));
});

oGulp.task('default', ['clean', 'clean_node'], function() {
	oGulp.start('build_node');
});
