var webpack = require('webpack');
var path = require('path');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

var BUILD_DIR = path.resolve(__dirname, 'public/js');
var APP_DIR = path.resolve(__dirname, 'frontend');

console.log('Loading webpack.config.js')

var config = {
  
  entry: {
   modulea : ["lodash"],
   moduleb : ["react-dom"],
   app : APP_DIR + '/index.jsx'
  },
  
  // devtool: 'eval-source-map',

  output: {
    path: BUILD_DIR,
    filename: '[name].[chunkhash].js',
    publicPath : 'js/', 
    chunkFilename : '[name].[chunkhash].js'
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
      },
      {
        test: /\.css$/,
        use : [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names : ["modulea", "moduleb"],
      minChunks: Infinity
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
    }),
    // new BundleAnalyzerPlugin(),
    new WebpackCleanupPlugin(),
    new HtmlWebpackPlugin({
      template : path.resolve(__dirname, 'templates', 'index.ejs'),
      filename : path.resolve(__dirname, 'public', 'index.html'),
      inject : 'head'
    })
  ]

};

module.exports = config;