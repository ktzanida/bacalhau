const webpack = require('webpack')
const path = require('path')
const { merge } = require('webpack-merge')

const common = require('./webpack.common')

module.exports = merge(common({
  production: false,
}), {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
  ],
  snapshot: {
    managedPaths: [],
  },
  watchOptions: {
    ignored: /node_modules/
  },
  devServer: {
    contentBase: '../dist',
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: true,
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },
})