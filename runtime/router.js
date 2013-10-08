"use strict";
/**
 * @jsx React.DOM
 */

var React   = require('react');
var Router  = require('react-router-component');

var Pages   = Router.Pages;
var Page    = Router.Page;

var SitegenRouter = React.createClass({

  route: function(page) {
    console.log(page);
    return page;
  },

  render: function() {
    var pages = this.props.pages.map(function(page) {
      return <Page path={page.url} handler={this.route.bind(null, page)} />
    });
    return (
      <html>
        <head>
          <script src="/assets/bundle.js" />
          <meta charset="utf-8" /> 
          <title></title>
        </head>
        <Pages>{pages}</Page>
      </html>
    );
  }
});

module.exports = SitegenRouter;
