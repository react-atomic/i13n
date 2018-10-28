module.exports = function(api) {
  api.cache(true); 
  return {
    env: {
      build: {
        presets: [
          [
            '@babel/env',
            {
              targets: ['last 2 versions', 'ie >= 8'],
            },
          ]
        ],
        plugins: [
          [
            '@babel/plugin-transform-runtime',
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
            '@babel/env',
            {
              modules: false,
              targets: ['last 2 versions', 'ie >= 8'],
            },
          ],
        ],
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            {
              regenerator: false,
              useESModules: true,
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
