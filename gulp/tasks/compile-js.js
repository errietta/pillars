"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	git = require("git-rev"),
	reload = require("browser-sync").reload,
	mainBowerFiles = require("main-bower-files"),
	merge = require("event-stream").merge,
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("app:build:js:src", function(callback) {
	git.short(function(rev){
		var pipe = gulp.src(c.scriptsSrcGlob)
			.pipe($.plumber({
				errorHandler: c.onError
			}))
			.pipe($.order([
				"app.js",
				"app-*.js"
			]))
			.pipe($.if(c.production, $.stripDebug()))
			.pipe($.if(!c.production, $.complexity({breakOnErrors: false})))
			.pipe($.if(c.debug, $.filelog("app:build:js:src")))
			.pipe($.if(!c.production, $.sourcemaps.init()))
			.pipe($.concat(c.concatSrcJsFile))
			.pipe($.size({title: "app:build:js:src"}))
			//Any plugins between sourcemaps.init and sourcemaps.write need to have sourcemaps support
			//unless they don't modify the output. There's a list of compatible plugins on the gulp-sourcemaps page
			.pipe($.if(c.production, $.uglify(c.uglifyConfig)))
			//An issue is open about header's sourcemaps support but it isn't yet available
			//until then headers for this file are only enabled for production
			.pipe($.if(c.production,
				$.header(
					"/*!\r\n * " + c.copyrightBanner.join("\r\n * ") + "\r\n*/\r\n",
					{
						packageFile: c.packageFile,
						gitRev: rev,
						d: new Date()
					}
				)
			))
			.pipe($.if(!c.production, $.sourcemaps.write()))
			.pipe(gulp.dest(c.scriptsDist));

		pipe.on("end", callback);
		pipe.pipe(reload({stream: true, once: true}));
	});
});

gulp.task("app:build:js:vendor", function(){
	var polyfillStream = gulp.src(c.scriptsSrcGlob)
		.pipe($.autopolyfiller(c.jsPolyfillsFile, {
			browsers: c.prefixBrowsers
		}));
	var vendorStream = gulp.src(mainBowerFiles({filter: c.scriptsRegex}))
		.pipe($.concat(c.concatVendorJsFile));
	return merge(polyfillStream, vendorStream)
		.pipe($.plumber({
			errorHandler: c.onError
		}))
		.pipe($.order([
			c.jsPolyfillsFile,
			c.concatVendorJsFile
		]))
		.pipe($.if(c.debug, $.jsPrettify(), $.uglify(c.vendorUglifyConfig)))
		.pipe($.concat(c.concatVendorJsFile))
		.pipe(gulp.dest(c.scriptsDist))
		.pipe(reload({stream: true, once: true}))
		.pipe($.if(c.debug, $.filelog("app:build:js:vendor")))
		.pipe($.size({title: "app:build:js:vendor"}));
});
