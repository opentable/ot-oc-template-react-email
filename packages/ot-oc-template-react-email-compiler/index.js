"use strict";

const compile = require("./lib/compile");
const template = require("ot-oc-template-react-email");

module.exports = {
  compile,
  getCompiledTemplate: template.getCompiledTemplate,
  getInfo: template.getInfo,
  render: template.render
};
