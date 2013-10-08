"use strict";

var path        = require('path');
var fs          = require('fs');
var fibrous     = require('fibrous');
var utils       = require('lodash');
var webpack     = require('webpack');
var webpackify  = require('webpackify');

var reactdown   = require('./reactdown');
var getPages    = require('./getPages');

var sitegen = fibrous(function(basedir, opts) {
  opts = opts || {};
  basedir = path.resolve(basedir);

  var builddir = path.join(basedir, 'build');
  var pages = getPages.sync(basedir, opts);

  var entry = {};

  pages.forEach(function(p) {
    entry[path.basename(p.filename, path.extname(p.filename))] = p.filename;
  });

  var compilerOptions = {
    context: basedir,
    entry: entry,
    plugins: [
      new webpack.optimize.CommonsChunkPlugin("_bundle.js")
    ],
    module: {
      loaders: [
        {test: /\.md$/, loader: '../reactdown.js'}
      ]
    }
  };

  var compiler = webpackify(basedir, compilerOptions);

  return compiler.sync.run();
});

sitegen(process.argv[2], {}, function(err, stats) {
  if (err) throw err;
  console.log(stats.hasErrors());
});
