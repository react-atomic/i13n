// @ts-check

import { webpackClientBuild } from 'reshow-app';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const entrys = {
  node: "./build/es/src/clients/simple_node.mjs",
  browser: "./build/es/src/browser/clients/simple_browser.mjs",
};

export default webpackClientBuild(__dirname, entrys);
