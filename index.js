"use strict";

var path        = require('path');
var fs          = require('fs');
var fibrous     = require('fibrous');
var utils       = require('lodash');
var webpackify  = require('webpackify');
var mkdirp      = require('mkdirp');

var walkDirectory = require('./walkDirectory').walkDirectoryUsing;
var getPages      = require('./getPages');
var reactdown     = require.resolve('./reactdown');

var sitegen = fibrous(function(basedir, opts) {
  opts = opts || {};
  basedir = path.resolve(basedir);

  var pages = getPages.sync(basedir, opts);

  var entry = {};

  pages.forEach(function(p) {
    var name = path.relative(basedir, p.filename);
    name = name.replace(/\..+$/, '');
    entry[name] = p.filename;
  });

  var options = {
    context: basedir,
    entry: entry,
    output: {
      filename: '[name].js',
      memory: true
    },
    plugins: [
      {
        plugin: 'webpack/lib/optimize/CommonsChunkPlugin',
        filenameTemplate: '__common.js'
      }
    ],
    module: {
      loaders: [
        {test: /\.md$/, loader: reactdown}
      ]
    }
  };

  var compiler = webpackify(basedir, options);

  var stats = compiler.sync.run();
  layoutFileSystem.sync(path.join(basedir, 'build'), stats.fs.data);
  return stats;
});

var layoutFileSystem = fibrous(function(basedir, directory) {
  for (var k in directory) {
    var filename = path.join(basedir, k);
    var data = directory[k];
    if (Buffer.isBuffer(data)) {
      mkdirp.sync(path.dirname(filename));
      fs.writeFile.sync(filename, directory[k]);
    } else {
      layoutFileSystem.sync(filename, data)
    }
  }
});

sitegen(process.argv[2], {}, function(err, stats) {
  if (err) throw err;
  //console.log(stats.toString({modules: false, colors: true}));
});
