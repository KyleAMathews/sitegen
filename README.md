# sitegen

## Installation

You need several components to create your site with `sitegen`

    % npm install sitegen react-app react-tools

This will installs `sitegen` package itself, `react-tools` package which
provides React UI library and `react-app` which is a layer on top of React for
creating SPAs.


## Usage

First step is to create an application which will serve your website during
content creating and development. Create an `index.js` file with the following
content:

    var sitegen = require('sitegen');

    sitegen({
      routes: {
        '*/':     './ui/index.jsx',
        '*.html': './ui/page.jsx'
      },
      pages: './data',
      debug: true
    }).listen(3000);

Now as we specified, `./data` directory should contain our site's pages
(currently only markdown format is supported). Go create one, for example
`./data/index.md`. Now after running a server with `node ./index.js` you will be
able to query your page's content with `curl http://localhost:3000/index.json`
command.
