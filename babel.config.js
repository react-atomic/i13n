module.exports = function(api) {
  api.cache(true); 
  return {
    env: {
      build: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: ['last 2 versions', 'ie >= 8'],
            },
          ]
        ],
        plugins: [
          [
            'reshow-transform-runtime',
            {
              regenerator: false,
            },
          ],
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-transform-object-assign',
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-proposal-class-properties',
        ],
      },
      es: {
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: ['last 2 versions', 'ie >= 8'],
            },
          ],
        ],
        plugins: [
          [
            'reshow-transform-runtime',
            {
              regenerator: false,
              useESModules: true,
              version: "7.5.0",
            },
          ],
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-transform-object-assign',
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-proposal-class-properties',
        ],
      },
    },
  };
};
