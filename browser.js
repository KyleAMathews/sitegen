var createPage = require('react-app/page'),
    api        = require('./api');



module.exports = {
  createPage: function(spec) {
    if (!spec.getData)
      spec.getData = function(callback) {
        api.getPageData(this.props.request.path, callback);
      }
    return createPage(spec);
  },
  api: api
};
