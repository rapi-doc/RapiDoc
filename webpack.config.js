const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { DuplicatesPlugin } = require("inspectpack/plugin");

const path = require('path');

module.exports = {
    entry: './src/index.js',
    node: {fs: 'empty'},
    externals: {
      esprima: 'esprima',
    },
    optimization: {
      runtimeChunk:'single',
      removeAvailableModules: true,
      splitChunks: {
        chunks: 'all'
      }
    },
    
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              { loader: 'babel-loader'}
            ]
          },
          {
            test: /\.scss$/,
            use: [
                { loader: "style-loader"}, // creates style nodes in HTML from CommonJS strings
                { loader: "css-loader" },  // translates CSS into CommonJS
                { loader: "sass-loader"}   // compiles Sass to CSS
            ]
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [{
                loader:"file-loader",
                options:{
                    name: '[name].[ext]'
                }
            }]
          }
        ]
    },
    resolve: {
        alias: {
          "@": path.resolve(__dirname, 'src')
        }
    },
    output: {
        filename: 'rapidoc-min.js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks:1
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({template: 'index.html'}),
        new BundleAnalyzerPlugin({analyzerMode:'static'}),
        new DuplicatesPlugin({emitErrors: false, verbose: true}),
        new CompressionPlugin(),
        new FileManagerPlugin({
            onEnd : {
              copy: [
                {source: 'dist/*.js', destination: 'docs' },
                {source: 'dist/*.woff2', destination: 'docs' }
              ]
            }
        })
    ]
}
