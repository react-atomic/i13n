'use strict';

const webpack = require('reshow-app/webpack.client');

const entrys = {
  tag: './build/es/src/client.js',
  utils: './build/es/src/client-utils.js',
}

module.exports = webpack(__dirname, entrys);
