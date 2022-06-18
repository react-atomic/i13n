"use strict";

const webpack = require("reshow-app/webpack.client");

const entrys = {
  simple: "./build/es/src/clients/simple_web.mjs",
  //  utils: './build/es/src/client-utils.js',
};

module.exports = webpack(__dirname, entrys);
