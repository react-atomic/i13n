module.exports = function (api) {
  api.cache(true);
  return {
    env: {
      cjs: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: ["last 2 versions", "ie >= 8"],
            },
          ],
        ],
        plugins: [
          [
            "reshow-transform-runtime",
            {
              regenerator: false,
              version: '7.9.0',
            },
          ],
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-transform-object-assign",
          "@babel/plugin-proposal-object-rest-spread",
          "@babel/plugin-proposal-class-properties",
        ],
      },
      es: {
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
              targets: ["last 2 versions", "ie >= 8"],
            },
          ],
        ],
        plugins: [
          [
            "reshow-transform-runtime",
            {
              regenerator: false,
              useESModules: true,
              version: "7.9.0",
            },
          ],
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-transform-object-assign",
          "@babel/plugin-proposal-object-rest-spread",
          "@babel/plugin-proposal-class-properties",
        ],
      },
    },
  };
};
