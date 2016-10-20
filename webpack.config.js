const path = require('path');
const webpack = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';
const productionPlugins = [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ];

module.exports = {
  entry: {
    appBundle: "./src/entry.js",
    layoutBundle: "./src/layout.js",
  },
  output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].js"
  },
  plugins: isProduction? productionPlugins : [],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.json$/,
        loader: "json"
      },
      {
        test: /\.scss$/,
        loader: "style!css!sass"
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  watch: false,
  node: {
    fs: "empty",
    net: 'empty'
  }
}

