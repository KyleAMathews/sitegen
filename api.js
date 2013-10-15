"use strict";

function xhr(url, cb) {
  var request = new XMLHttpRequest(),
      twoHundred = /^20\d$/;

  request.onreadystatechange = function() {
    if (4 == request.readyState && 0 !== request.status) {
      if (twoHundred.test(request.status)) {
        var response;
        try {
          response = JSON.parse(request.responseText);
        } catch (err) {
          err.request = request;
          return cb(err)
        }
        cb(null, response);
      } else {
        cb(request, null);
      }
    }
  };
  request.onerror = function(e) { return cb(e, null); };
  request.open('GET', url, true);
  request.send();
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
