// @ts-check

import { webpackClientBuild } from 'reshow-app';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const entrys = {
  browser: "./build/es/src/browser/clients/simple_browser.mjs",
};

export default webpackClientBuild(__dirname, entrys);
