"use strict";

module.exports = function(url, cb) {
  var xhr = new global.XMLHttpRequest(),
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
