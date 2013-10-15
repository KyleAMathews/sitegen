"use strict";

var path            = require('path'),
    callsite        = require('callsite'),
    express         = require('express'),
    ui              = require('react-app'),
    pageCollection  = require('./page-collection');

function uriToId(uri) {
  return uri.replace(/\.json$/, '').replace(/\/index$/, '/');
}

module.exports = function(site, opts) {
  opts = opts || {};
  opts.pages = opts.pages || path.dirname(site);
  opts.root || path.dirname(callsite()[1].getFileName());

  var app = express(),
      pages = pageCollection(opts.pages, {watch: opts.debug});

  app.get('*.json', function(req, res, next) {
    var id = uriToId(req.params[0]);
    res.setHeader('Content-Type', 'application/json');
    return pages.get(id).then(
      function(page) { page ? res.send(page) : next(); },
      next);
  });
  app.use(ui(site, opts));
  return app;
}
