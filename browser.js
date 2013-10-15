"use strict";

var ReactApp   = require('react-app'),
    api        = require('./api');

module.exports = {
  createSite: ReactApp.createApp,
  createPage: function(spec) {
    if (!spec.getData)
      spec.getData = function(callback) {
        api.getPageData(this.props.request.path, callback);
      }
    return ReactApp.createPage(spec);
  },
  api: api
};
