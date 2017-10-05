var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/js');
var APP_DIR = path.resolve(__dirname, 'frontend');

var config = {
  
  entry: APP_DIR + '/index.jsx',
  
  devtool: 'eval-source-map',

  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  },

  
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    })
  ]

};

module.exports = config;