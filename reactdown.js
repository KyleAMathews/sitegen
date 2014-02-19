"use strict";

var through     = require('through');
var marked      = require('meta-marked');
var reactTools  = require('react-tools');

var runtime = require.resolve('./runtime');

function compile(src) {
  var compiled = marked(src);
  var meta = compiled.meta || {};

  var wrapper = 'require("' + runtime + '").Wrapper';
  var component = meta.component ?
    'require("' + meta.component + '")' :
    '_runtime.Page'

  delete meta.component;

  var code = [
    '/** @jsx React.DOM */',
    'var React      = require("react");',
    'var _runtime   = require(' + JSON.stringify(runtime) + ');', 
    'var _Wrapper   = _runtime.Wrapper;',
    'var _Component = ' + component + ';',
    'var _markup    = <_Wrapper>' + compiled.html + '</_Wrapper>;',
    'exports.meta   = ' + JSON.stringify(meta) + ';',
    'exports.create = function create(props) {',
    '  props = _runtime.merge(exports.meta, props);',
    '  return _Component.apply(_Component, [props].concat(_markup));',
    '}'
  ].join('\n');

  code = reactTools.transform(code);

  return code;
}

module.exports = compile;
