'use strict';

const webpack = require('reshow-app/webpack.client');

const entrys = {
  tag: './build/es/src/client.js'
}

module.exports = webpack(__dirname, entrys);
