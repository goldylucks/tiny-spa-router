const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ENV = process.env.NODE_ENV || 'development'
const isProd = ENV === 'production'
const isExample = process.env.NODE_ENV === 'example'
const WebpackErrorNotificationPlugin = require('webpack-error-notification')

module.exports = {
  cache: !isProd,
  devtool: isProd ? 'cheap-source-map' : 'cheap-module-eval-source-map',
  entry: (function () {
    const entries = []
    if (!isProd) {
      entries.push(
        'webpack-dev-server/client?http://localhost:8080',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint

        'webpack/hot/only-dev-server',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates

        './example/app.js'
      )
    }
    if (isProd) {
      entries.push('./src/Router')
    }
    return entries
  })(),
  output: {
    path: path.resolve(__dirname, ifExampleElse('build-example', 'build')),
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [/src/, /example/],
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    unsafeCache: true,
    alias: { 'tiny-spa-router': path.resolve(__dirname, 'src', 'Router') } // relevant for dev example only
  },
  plugins: (function () {
    const plugins = [
      new WebpackErrorNotificationPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(ENV),
        },
      }),
    ]

    if (!isProd) {
      plugins.push(new HtmlWebpackPlugin({ template: 'example/index.ejs' }))
      plugins.push(new webpack.HotModuleReplacementPlugin())// enable HMR globally
      plugins.push(new webpack.NamedModulesPlugin()) // prints more readable module names in the browser console on HMR updates)
    }

    if (isProd) {
      plugins.push(new webpack.optimize.OccurrenceOrderPlugin(false))
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        screwIe8: true,
        compress: {
          warnings: false,
        },
        output: {
          comments: false,
        },
        sourceMap: true,
      }))
    }

    return plugins
  }()),
  devServer: {
    contentBase: path.resolve(__dirname, ifExampleElse('build-example', 'example')),
    hot: !isProd,
    publicPath: '/',
    historyApiFallback: true,
  },
}

function ifExampleElse (example, nonExample) {
  return isExample ? example : nonExample
}