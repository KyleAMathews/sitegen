var React       = require('react-tools/build/modules/React'),
    createPage  = require('react-app/page'),
    getPageData = require('../request').getPageData;

module.exports = createPage({
  render: function() {
    return this.transferPropsTo(
      <html>
        <head>
          <title>reactivate</title>
        </head>
        <body>
          <h1>xPage</h1>
        </body>
      </html>
    );
  },

  getData: function(props, cb) {
    getPageData(props.path, cb);
  }
});
