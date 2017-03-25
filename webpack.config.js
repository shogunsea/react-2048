const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const plugins = [
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new ExtractTextPlugin('2048/style.css'), // how to namespace to a different dist path?
  new OptimizeCssAssetsPlugin()
];

module.exports = {
  entry: {
    '2048': "./src/entry.js",
  },
  output: {
      path: path.join(__dirname, "dist"),
      filename: "[name]/[name].js"
  },
  plugins: plugins,
  module: {
    rules: [
      // It seems like this repo doesn't have any native css files at the moment. This can be commented out.
      // {
      //   test: /\.css$/,
      //   use: [
      //     "style-loader",
      //     "css-loader"
      //   ]
      // },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', "postcss-loader", 'sass-loader']
        })
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react']
            }
          }
        ],
        include: [
          path.resolve(__dirname, "src")
        ],
      }
    ]
  },
  watch: false,
  node: {
    fs: "empty",
    net: 'empty'
  }
}
