"use strict";

var api = require('./api');

api({path: './posts', debug: true}).listen(3000);
