"use strict";

var path          = require('path');
var fibrous       = require('fibrous');
var walkDirectory = require('./walkDirectory');

/**
 * Default isPage test.
 */
var isPageRe = /\.(?:md|html|js)$/;

/**
 * Check if a filename is a page
 *
 * @param {RegExp|Function} isPage
 * @param {String} filename
 */
function isPage(isPage, filename) {
  if (!isPage) {
    return isPageRe.exec(filename);
  } else if (typeof isPage === 'function') {
    return isPage(filename);
  } else if (isPage instanceof RegExp) {
    return isPage.exec(filename);
  } else {
    throw new TypeError("invalid options.isPage: " + options.isPage);
  }
}

/**
 * Construct URL from a filename relatively base directory.
 *
 * @param {String} basedir
 * @param {String} filename
 */
function urlFromFilename(basedir, filename) {
  var dirname = path.dirname(path.relative(basedir, filename));
  var extname = path.extname(filename);
  var basename = path.basename(filename, extname);
  return  basename === 'index' ?
    path.join('/', dirname) :
    path.join('/', dirname, basename);
}

/**
 * Return a list of pages for a directory.
 *
 * @param {String} basedir
 * @param {Object} options
 * @param {Callback} cb
 */
var getPages = fibrous(function(basedir, options) {
  options = options || {};
  var nodes = walkDirectory.sync(basedir, function(name, stat) {
    var basename = path.basename(name);
    return stat.isDirectory() ?
      basename !== 'node_modules' && basename !== '.git' && basename !== 'build' :
      isPage(options.isPage, name);
  });
  return nodes.map(function(node) {
    return {
      filename: node.filename,
      url: urlFromFilename(basedir, node.filename)
    }
  });
});

module.exports = getPages;
