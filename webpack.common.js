// const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');


module.exports = {
  entry: {
    server: './src/index.ts'
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  target: 'node',
  resolve: {
    plugins: [
      new TsConfigPathsPlugin()
    ],
    extensions: ['.js', '.json', '.ts']
  },
  node: {
    __dirname: false,
    __filename: false
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        enforce: 'pre',
        loader: 'tslint-loader',
      },
      {
        test: /\.(ts)$/,
        use: 'ts-loader'
      }
    ]
  },
};
