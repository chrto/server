const merge = require('webpack-merge').merge;
const dev = require('./webpack.dev');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = merge(dev, {
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new NodemonPlugin()
  ],
});
