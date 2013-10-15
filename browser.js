"use strict";

var ReactApp   = require('react-app'),
    api        = require('./api');

module.exports = {
  createSite: function(spec) {
    if (spec.routes)
      return ReactApp.createApp(spec)
    else
      return ReactApp.createApp({
        routes: {'*/': spec, '*.html': spec}
      });
  },
  createPage: function(spec) {
    if (!spec.getData)
      spec.getData = function(callback) {
        api.getPageData(this.props.request.path, callback);
      }
    return ReactApp.createPage(spec);
  },
  api: api
};
