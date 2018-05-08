const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (baseConfig, env, defaultConfig) => {

  // We extend the default config by
  const copyWebpackPlugin = new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../node_modules/stencil-components-spike/dist/stencil-components-spike'),
      to: path.posix.join('static', 'stencil-components-spike'),
      ignore: ['.*']
    },
    {
      from: path.resolve(__dirname, '../src/assets'),
      to: path.posix.join('static', 'assets'),
      ignore: ['.*']
    }
  ]);

  if (defaultConfig.plugins) {
    defaultConfig.plugins.push(copyWebpackPlugin);
  } else {
    defaultConfig.plugins = [
      copyWebpackPlugin
    ];
  }

  return defaultConfig;
};
