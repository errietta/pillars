"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	git = require("git-rev"),
	reload = require("browser-sync").reload,
	mainBowerFiles = require("main-bower-files"),
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("app:build:js:src", function(callback) {
	git.short(function(rev){
		var pipe = gulp.src(c.srcScripts + "/*.js")
			.pipe($.plumber({
				errorHandler: c.onError
			}))
			.pipe($.order([
				"app.js",
				"app-*.js"
			]))
			.pipe($.if(c.production, $.stripDebug()))
			.pipe($.if(c.production, $.complexity({breakOnErrors: false})))
			.pipe($.concat(c.concatSrcJsFile))
			.pipe($.if(c.production, $.uglify(c.uglifyConfig), $.jsPrettify()))
			.pipe(
				$.header(
					"/*!\r\n * " + c.copyrightBanner.join("\r\n * ") + "\r\n*/\r\n",
					{
						packageFile: c.packageFile,
						gitRev: rev,
						d: new Date()
					}
				)
			)
			.pipe(gulp.dest(c.distScripts))
			.pipe(reload({stream: true, once: true}))
			.pipe($.size({title: "app:build:js:src"}));
		callback(null, pipe);
	});
});

gulp.task("app:build:js:vendor", function(){
	return gulp.src(mainBowerFiles({filter: /\.(js)$/i}))
		.pipe($.plumber({
			errorHandler: c.onError
		}))
		.pipe($.concat(c.concatVendorJsFile))
		.pipe($.uglify(c.uglifyConfig))
		.pipe(gulp.dest(c.distScripts))
		.pipe(reload({stream: true, once: true}))
		.pipe($.size({title: "app:build:js:vendor"}));
});
