const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = ({
  production = true,
}) => ({
  entry: './src/index.js',
  resolve: {
    modules: [path.resolve(__dirname, '..', 'src'), 'node_modules'],
    fallback: {
      buffer: require.resolve("buffer")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '..', 'src'),
        ],
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            babelrc: false,
            sourceType: 'unambiguous',
            sourceMaps: true,
            retainLines: true,
            presets: [
              [
                "@babel/preset-env",
                {
                  "useBuiltIns": "usage", // alternative mode: "entry"
                  "corejs": 3, // default would be 2
                  "targets": "> 0.25%, not dead"
                }
              ],
              "@babel/preset-react",
            ],
            plugins: [
              ["@babel/plugin-proposal-class-properties"],
              '@babel/plugin-transform-arrow-functions',
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ 
      template: './src/index.html', 
      filename: './index.html',
      hash: true,
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'src/assets',
        to: '',
      }]
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
})