const webpack = require('webpack')
const path = require('path')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')

const common = require('./webpack.common')

module.exports = merge(common({
  production: true,
}), {
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    fallback: {
      buffer: require.resolve("buffer")
    }
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].[chunkhash:8].bundle.js',
    chunkFilename: '[name].[chunkhash:8].bundle.js',
    publicPath: '/',
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: false,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: false,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: false,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: false,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: false,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: false,
    },
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  ],
})