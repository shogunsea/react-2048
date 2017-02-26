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
    '2048': "./src/entry.js",
    example: "./src/layout_example.js",
  },
  output: {
      path: path.join(__dirname, "dist"),
      filename: "[name]/[name].js"
  },
  plugins: isProduction? productionPlugins : [],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: { // will this ever work ?
              presets: ['es2015', 'react']
            }
          }
        ],
        include: [
          path.resolve(__dirname, "src")
        ],
        exclude: /node_modules/,
      }
    ]
  },
  watch: false,
  node: {
    fs: "empty",
    net: 'empty'
  }
}

