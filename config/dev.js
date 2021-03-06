'use strict';
var path = require('path');

var getCommon = require('./common');


module.exports = function(config) {
  var cwd = process.cwd();

  var themeConfig = config.themeConfig && config.themeConfig.development;
  themeConfig = themeConfig && themeConfig() || {};

  var siteConfig = config.webpack && config.webpack.development;
  siteConfig = siteConfig || {};

  return getCommon(config).then(function(common) {
    return {
      cache: true,
      node: {
        __filename: true,
        fs: 'empty',
      },
      output: {
        path: path.join(cwd, './.antwar/build/'),
        publicPath: '/',
        filename: '[name]-bundle.js',
        chunkFilename: '[chunkhash].js',
      },
      plugins: common.plugins,
      module: {
        loaders: [
          {
            test: /\.woff$/,
            loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff',
          },
          {
            test: /\.ttf$|\.eot$/,
            loader: 'file-loader?prefix=font/',
          },
          {
            test: /\.json$/,
            loader: 'json-loader',
          },
          {
            test: /\.svg$/,
            loader: 'raw-loader',
          },
          {
            test: /\.jsx?$/,
            loaders: [
              'react-hot',
              'babel'
            ],
            include: new RegExp(common.corePath + '|' + cwd),
            exclude: new RegExp(common.resolve.root + '|' + common.themeDependenciesPath +
              '|' + path.join(cwd, 'node_modules')),
          },
          {
            test: /\.css$/,
            loaders: [
              'style-loader',
              'css-loader',
            ],
          },
          {
            test: /\.md$/,
            loader: 'json!yaml-frontmatter-loader',
          }
        ].concat(themeConfig.module && themeConfig.module.loaders? themeConfig.module.loaders: []).
        concat(siteConfig.module && siteConfig.module.loaders? siteConfig.module.loaders: []),
      },
      resolve: common.resolve,
      resolveLoader: common.resolveLoader,
    };
  });
};
