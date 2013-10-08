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
var walkDirectory = fibrous(function(dirname, filter) {
  var stat = fs.sync.stat(dirname);

  if (stat.isFile()) {
    return [{filename: path.resolve(dirname), stat: stat}];

  } else if (stat.isDirectory()) {
    var futures = fs.sync.readdir(dirname)
      .filter(function(name) {
        return filter(path.join(dirname, name), name);
      })
      .map(function(name) {
        return walkDirectory(path.join(dirname, name), filter);
      });
    return utils.flatten(fibrous.wait(futures));
  }
});

module.exports = walkDirectory;
