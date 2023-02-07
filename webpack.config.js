/*
import { webpack } from 'webpack';
import FileManagerPlugin from 'filemanager-webpack-plugin';
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import { DuplicatesPlugin } from 'inspectpack/plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import 'path';
// import ESLintPlugin from 'eslint-webpack-plugin';
*/

const webpack = require('webpack');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const { DuplicatesPlugin } = require('inspectpack/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const rapidocVersion = JSON.stringify(require('./package.json').version).replace(/"/g, '');

const rapidocBanner = `
/**
* @preserve
* RapiDoc ${rapidocVersion.replace()} - WebComponent to View OpenAPI docs
* License: MIT
* Repo   : https://github.com/rapi-doc/RapiDoc
* Author : Mrinmoy Majumdar
*/
`;

const commonPlugins = [
  new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
  new webpack.HotModuleReplacementPlugin(),
  new ESLintPlugin({ extensions: ['js'] }),
  new CleanWebpackPlugin(),
  new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  new HtmlWebpackPlugin({ template: 'index.html' }),
  new CompressionPlugin(),
  new FileManagerPlugin({
    events: {
      onEnd: {
        copy: [
          { source: 'dist/*.js', destination: 'docs' },
          { source: 'dist/*.woff2', destination: 'docs' },
        ],
      },
    },
  }),
];

if (process.env.NODE_ENV === 'production') {
  console.log('BUILDING FOR PRODUCTION ... '); // eslint-disable-line no-console
  commonPlugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
  commonPlugins.push(new DuplicatesPlugin({ emitErrors: false, verbose: true }));
  commonPlugins.push(new UnminifiedWebpackPlugin());
  commonPlugins.push(new webpack.BannerPlugin({
    raw: true,
    banner: rapidocBanner,
  }));
  // commonPlugins.push(new webpack.DefinePlugin({ VERSION }));
  commonPlugins.push(new FileManagerPlugin({
    events: {
      onEnd: {
        copy: [
          { source: 'dist/*.js', destination: 'docs' },
        ],
      },
    },
  }));
}

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'rapidoc-min.js',
    publicPath: '',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          banner: (licenseFile) => `RapiDoc ${rapidocVersion} | Author - Mrinmoy Majumdar | License information can be found in ${licenseFile} `,
        },
      }),
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'docs'),
    },
    port: 8080,
    hot: 'only',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' }, // creates style nodes in HTML from CommonJS strings
          { loader: 'css-loader' }, // translates CSS into CommonJS
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        }],
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      buffer: require.resolve('buffer'),
    },
    alias: {
      '~': path.resolve(__dirname, 'src'),
      'lit-html/lib/shady-render.js': path.resolve(__dirname, './node_modules/lit-html/lit-html.js'), // removes shady-render.js from the bundle
    },
  },
  plugins: commonPlugins,
};
