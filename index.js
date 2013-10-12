"use strict";

var path            = require('path'),
    callsite        = require('callsite'),
    express         = require('express'),
    ui              = require('react-app'),
    pageCollection  = require('./page-collection');

function promise(func) {
  return function(req, res, next) {
    return func(req, res, next)
      .then(
        function(response) { response ? res.send(response) : next(); },
        next);
  }
}

function uriToId(uri) {
  return uri.replace(/\.json$/, '').replace(/\/index$/, '/');
}

module.exports = function(opts) {
  var root = opts.root || path.dirname(callsite()[1].getFileName()),
      app = express(),
      pages = pageCollection(opts.pages, {watch: opts.debug});

  app.get('*.json', promise(function(req) {
    var id = uriToId(req.params[0]);
    return pages.get(id);
  }));

  app.use(ui(opts.routes, {
    transform: opts.transform,
    pageOptions: opts.options,
    debug: opts.debug,
    root: root
  }));

  return app;
}
