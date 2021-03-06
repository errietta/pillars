'use strict';

var express = require('express'),
	app = express(),
	appConfig = require(__dirname + '/config.js');

app.use(express.static(appConfig.webserver.staticDir));
app.listen(appConfig.webserver.port);