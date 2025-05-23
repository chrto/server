const path = require('path');
const merge = require('webpack-merge').merge;
const common = require('./webpack.common.js');
const nodeExternals = require('webpack-node-externals');

module.exports = merge(common, {
  output: {
    filename: '[name].prod.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production',
  externals: [nodeExternals()]
});
