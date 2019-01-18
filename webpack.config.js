const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    node: {fs: 'empty'},
    optimization: {
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
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({title: 'RAPIDoc', template: 'index.html'}),
        new BundleAnalyzerPlugin({analyzerMode:'static'}),
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
