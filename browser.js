var createPage = require('react-app/page'),
    api        = require('./api');



module.exports = {
  createPage: function(spec) {
    if (!spec.getData)
      spec.getData = function(props, callback) {
        api.getPageData(props.path, callback);
      }
    return createPage(spec);
  },
  api: api
};
