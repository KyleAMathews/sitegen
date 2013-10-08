var React       = require('react-tools/build/modules/React'),
    createPage  = require('react-app/page'),
    request     = require('../request');


function pathToData(path) {
  return path.match(/\.html$/) ?
    path.replace(/\.html$/, '.json') :
    path[path.length - 1] === '/' ?
      path + 'index.json' :
      path + '.json'
}

module.exports = createPage({
  render: function() {
    console.log(this.props);
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
    request(pathToData(props.path), cb);
  }
});
