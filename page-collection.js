var fs            = require('fs-promise'),
    q             = require('kew'),
    path          = require('path'),
    EventEmitter  = require('events').EventEmitter,
    monocle       = require('monocle')(),
    utils         = require('lodash'),
    markdown      = require('./markdown');

function PageCollection(root, opts) {
  opts = opts || {};

  this.root = path.resolve(root);
  this.opts = opts;
  this.processors = utils.assign({'.md': markdown}, opts.processors);

  this._get = utils.memoize(this._get);

  if (this.opts.watch)
    this._startWatching();
}

utils.assign(PageCollection.prototype, EventEmitter.prototype, {

  _startWatching: function() {
    monocle.watchDirectory({
      root: this.root,
      listener: function(stats) {
        this._get.cache = {};
        this.emit('change', this._filenameToId(stats.name));
      }.bind(this)
    });
  },

  _filenameToId: function(filename) {
    return '/' + path.relative(this.root, filename).replace(/\..+$/, '');
  },

  _read: function(filename, opts) {
    return fs.stat(filename).then(function(stats) {
      return stats.isDirectory()
        ? this._readDir(filename)
        : this._readFile(filename);
    }.bind(this));
  },

  _readFile: function(filename) {
    var ext = path.extname(filename);
    if (!this.processors[ext])
      throw new Error("don't know how to process: " + filename);
    return this.processors[ext](filename);
  },

  _readDir: function(filename) {
    var dataId = this._filenameToId(path.join(filename, 'index')),
        data = this.get(dataId, {fileOnly: true}),
        children = fs.readdir(filename);

    children = children.then(function(filenames) {
      return q.all(filenames
        .filter(function(fn) {
          return !fn.match(/^index\..+$/);
        })
        .map(function(fn) {
          var id = this._filenameToId(path.join(filename, fn));
          return this.get(id, {metadataOnly: true});
        }.bind(this)));
    }.bind(this));

    return q.all(data, children)
      .then(function(result) {
        var data = result[0],
            children = result[1];

        return utils.assign({}, data, {children: children});
      }.bind(this));
  },

  _get: function(id, opts) {
    var filename = path.join(this.root, id),
        dirname = path.dirname(filename),
        basename = path.basename(filename);

    return fs.readdir(dirname)
      .then(function(files) {
        for (var i = 0, len = files.length; i < len; i++) {
          var f = files[i];
          if (f.replace(/\.[^\.]+$/, '') === basename)
            return this._read(path.join(dirname, f), opts);
        }
      }.bind(this))
      .then(function(page) {
        if (page) {
          page.id = id;
          return page;
        } else {
          return null;
        }
      }.bind(this));
  },

  get: function(id, opts) {
    opts = opts || {};
    return this._get(id, opts).then(function(page) {
      if (page && opts.metadataOnly)
        return utils.pick(page, ['id', 'metadata'])
      else
        return page;
    }.bind(this));
  }
});

module.exports = function(root, opts) {
  return new PageCollection(root, opts);
}
