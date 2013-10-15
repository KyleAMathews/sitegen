var SiteGen = require('../../index'),
    React   = require('react-tools/build/modules/React');

module.exports = SiteGen.createSite(
  SiteGen.createPage({
    render: function() {
      return (
        <html>
          <head>
            <title>{this.props.data.metadata.title}</title>
          </head>
          <body>
            <article
              dangerouslySetInnerHTML={{__html: this.props.data.content}} />
          </body>
        </html>
      );
    }
  })
);
