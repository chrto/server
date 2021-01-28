const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const nodeExternals = require('webpack-node-externals');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].dev.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()],
  watch: true,
  plugins: [
    new WebpackNotifierPlugin(),
    new webpack.BannerPlugin({
      banner: 'hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]',
      entryOnly: false
    })
  ],
});
