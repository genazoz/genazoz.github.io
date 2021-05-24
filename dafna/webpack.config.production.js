const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const baseConfig = require('./webpack.config.base.js');
const config = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
});

config.module.rules.push({
  test: /\.(sass|scss)$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
    },
    'postcss-loader',
    {
      loader: 'sass-loader'
    }
  ]
});

module.exports = config;
