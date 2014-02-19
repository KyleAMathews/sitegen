"use strict";

var path    = require('path');
var fs      = require('fs');
var fibrous = require('fibrous');
var utils   = require('lodash');

/**
 * Walk filesystem recursively.
 *
 * @param {String} dirname
 * @param {Function} filter
 * @param {Callback} cb
 */
var walkDirectoryUsing = fibrous(function(fs, dirname, filter) {
  var stat = fs.sync.stat(dirname);
  if (filter && !filter(dirname, stat)) {
    return [];
  } else if (stat.isFile()) {
    return [{filename: path.resolve(dirname), stat: stat}];

  } else if (stat.isDirectory()) {
    var futures = fs.sync.readdir(dirname).map(function(name) {
      return walkDirectory.future(path.join(dirname, name), filter);
    });
    return utils.flatten(fibrous.wait(futures));
  }
});

var walkDirectory = walkDirectoryUsing.bind(null, fs);

module.exports = walkDirectory;
module.exports.walkDirectory = walkDirectory;
module.exports.walkDirectoryUsing = walkDirectoryUsing;
