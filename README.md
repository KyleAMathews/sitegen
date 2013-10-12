# sitegen

Static site generator which uses React for UI and markdown for pages.

## Installation

Install with npm:

    % npm install sitegen react-tools

This will install the `sitegen` package itself and a `react-tools` package which
provides React UI library which you will use to define your pages and other UI
compoments.

## Usage

First step is to create an application which will serve your website during
content creating and development. Create an `index.js` file with the following
content:

    var sitegen = require('sitegen');

    sitegen({
      routes: {
        '*/':     './ui/page.jsx',
        '*.html': './ui/page.jsx'
      },
      pages: './data',
      debug: true
    }).listen(3000);

Now as we specified, `./data` directory should contain our site's pages
(currently only markdown format is supported). Go create one, for example
`./data/index.md`.

Now you should create `./ui/page.jsx` which define page UI:

    var React       = require('react-tools/build/modules/React'),
        SiteGen     = require('sitegen'),

    module.exports = SiteGen.createPage({
      render: function() {
        return (
          <html>
            <head>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
              <title>{this.props.metadata.title}</title>
              <link rel="data" href={this.props.id + '.json'} />
            </head>
            <body>
              <header>
                <h1>{this.props.metadata.title}</h1>
              </header>
              <article dangerouslySetInnerHTML={{__html: this.props.content}}>
              </article>
            </body>
          </html>
        );
      }
    });

Now after running a server with `node ./index.js` you will be able to query your
page's content with `curl http://localhost:3000/index.json` command and page
itself with `curl http://localhost:3000/` command.

But that's not really a static site yet, you should use `wget` to mirror
`http://localhost:3000` into a directory.

