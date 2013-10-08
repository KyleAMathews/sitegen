"use strict";

var fs            = require('fs-promise'),
    EventEmitter  = require('events').EventEmitter,
    path          = require('path'),
    utils         = require('lodash'),
    markdown      = require('./markdown'),
    q             = require('kew');

function PageCollection(opts) {
  this.opts = opts;

  this.get = utils.memoize(this.get);

  if (this.opts.watch)
    this._startWatching();
}

PageCollection.prototype = {

  _startWatching: function() {

  },

  _changed: function(f) {
    f = '/' + path.relative(this.opts.path, f).replace(/\.md$/, '');
    while (f !== '/') {
      delete this.get.cache[CACHE_KEY + f];
      this.emit('update', f);
      f = path.dirname(f);
    }
    delete this.get.cache[CACHE_KEY + '/'];
    this.emit('update', '/');
  },

  _getDir: function(d) {
    return this._resolveDir(d)
      .then(function(fs) {
        var promises = fs
          .map(function(f) {
            var id = '/' + path.relative(this.opts.path, f);
            if (id.match(/\.md$/))
              return this.get(id.replace(/\.md$/, ''))
                .then(function(page) {
                  return utils.pick(page, ['id', 'metadata']);
                });
            else
              return {ref: id};
          }.bind(this));
        return q.all(promises)
          .then(function(items) { return {pages: items.filter(Boolean)}; });
      }.bind(this));
  },

  _getFile: function(f) {
    return markdown(f)
  },

  _resolveDir: function(d) {
    return fs.readdir(d).then(function(fs) {
      fs.reverse();
      var promises = fs
        .map(function(f) {
          f = path.join(d, f).replace(/\.md$/, '');
          return this._resolve(f);
        }.bind(this));
      return q.all(promises)
        .then(function(fs) { return fs.filter(Boolean); });
    }.bind(this));
  },

  _resolve: function(f, _file) {
    _file = _file || f.match(/\.md$/);
    return fs.stat(f)
      .then(
        function(stat) {
          if (stat.isDirectory()) return f
          else if (_file) return f
          else return null;
        }.bind(this),
        function(err) {
          if (!_file && err.errno === 34) return this._resolve(f + '.md', true);
          else if (err.errno === 34) return null;
          else throw err;
        }.bind(this)
      );
  },

  get: function(id) {
    var f = path.join(this.opts.path, id);
    return this._resolve(f)
      .then(function(f) {
        if (f && f.match(/\.md$/)) return this._getFile(f)
        else if (f) return this._getDir(f)
        else return null;
      }.bind(this))
      .then(function(page) {
        if (page) page.id = id;
        return page;
      });
  }
};
utils.assign(PageCollection.prototype, EventEmitter.prototype);

var _FUNC = utils.memoize(function() {});
_FUNC('');
var CACHE_KEY = Object.keys(_FUNC.cache)[0];

module.exports = PageCollection;
