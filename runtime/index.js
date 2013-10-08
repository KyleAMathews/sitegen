"use strict";

var React = require('react');
var merge = require('react/lib/merge');

function Wrapper() {
  return Array.prototype.slice.call(arguments, 1);
}

var Page = React.createClass({
  displayName: 'Page',
  render: function() {
    return React.DOM.div(null, this.props.children);
  }
});

module.exports = {
  Wrapper: Wrapper,
  Page: Page,
  merge: merge
};
