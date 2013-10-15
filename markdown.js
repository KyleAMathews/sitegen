"use strict";

var fs        = require('fs'),
    showdown  = require('showdown'),
    q         = require('kew');

function renderMarkdown(markdown) {
  var conv = new showdown.converter();
  return conv.makeHtml(markdown);
}

function parseMetadata(content) {
  var parts = content.split('---').filter(Boolean);
  if (parts.length > 1) {
    var metadata = {};
    parts[0].split('\n').filter(Boolean).forEach(function(stanza) {
      var parts = stanza.split(':');
      if (parts.length > 1) {
        metadata[parts[0].trim()] = parts.slice(1).join('').trim()
          .replace(/^"/, '')
          .replace(/"$/, '')
          .replace(/\\"/g, '"')
      }
    });
    return {metadata: metadata, content: parts.slice(1).join('').trim()}
  } else {
    return {metadata: {}, content: content}
  }
}

function readFile(filename, opts) {
  var promise = q.defer();
  fs.readFile(filename, opts, promise.makeNodeResolver());
  return promise;
}

module.exports = function(filename) {
  return readFile(filename, {encoding: 'utf-8'}).then(function(content) {
    var post = parseMetadata(content);
    post.content = renderMarkdown(post.content);
    return post;
  });
}
