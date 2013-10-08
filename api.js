"use strict";

function xhr(url, cb) {
  var xhr = new XMLHttpRequest(),
      twoHundred = /^20\d$/;

  xhr.onreadystatechange = function() {
    if (4 == xhr.readyState && 0 !== xhr.status) {
      if (twoHundred.test(xhr.status)) {
        var response;
        try {
          response = JSON.parse(xhr.responseText);
        } catch (err) {
          err.xhr = xhr;
          return cb(err)
        }
        cb(null, response);
      } else {
        cb(xhr, null);
      }
    }
  };
  xhr.onerror = function(e) { return cb(e, null); };
  xhr.open('GET', url, true);
  xhr.send();
}

function getPageData(path, cb) {
  var id = path.match(/\.html$/) ?
    path.replace(/\.html$/, '.json') :
    path[path.length - 1] === '/' ?
      path + 'index.json' :
      path + '.json';
  return xhr(id, cb);
}

module.exports = {
  xhr: xhr,
  getPageData: getPageData
};
