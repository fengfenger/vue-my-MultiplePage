var webpack = require("webpack");
var path = require('path');
var fs = require('fs');

var HtmlwebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractSASS = new ExtractTextPlugin('[name].css', {
    allChunks: true
});

// 判断开发环境还是正式环境
var isProduction = function() {
    return process.env.NODE_ENV === 'production';
}

// webpack扩展功能
var containerPath = path.resolve('./');
var compile = require('./bin/compile.js');
var getEntry = require('./bin/getEntry.js');
var alias = require('./bin/alias.js');

//  添加插件
var plugins = [];

//  切割css文件
plugins.push(extractSASS);

//  提取公共文件
plugins.push(new webpack.optimize.CommonsChunkPlugin('common', 'common.js'));

//  处理html
var pages = getEntry('./app/src/views/**/*.html');
for (var chunkname in pages) {
    var conf = {
        filename: chunkname + '.html',
        template: pages[chunkname],
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: false
        },
        chunks: ['common', chunkname],
        hash: true,
    }
    plugins.push(new HtmlwebpackPlugin(conf));
}


// 入口文件
var entrys = getEntry('./app/src/views/**/*.js');
entrys.common = ['vue', 'vue-router', 'fastclick', 'vue-async-data', 'vue-resource'];
module.exports = {
    entry: entrys,
    output: {
        path: path.resolve(containerPath, './app/www/'),
        publicPath: './',
        filename: '[name].js',
        chunkFilename: '[name].[hash].js'
    },
    devtool: 'eval-source-map',
    resolve: {
        alias:alias,
        extensions: ['', '.js', '.vue', '.scss', '.png', '.jpg'],
    },
    //babel重要的loader在这里
    module: {
        loaders: [
            // 解析.vue文件
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            // 转化ES6的语法
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            // 编译css并自动添加css前缀
            {
                test: /\.css$/,
                loader: extractSASS.extract('style-loader', 'css-loader?sourceMap')
            },
            //.scss 文件想要编译，scss就需要这些东西！来编译处理
            {
                test: /\.scss$/,
                loader: extractSASS.extract(['style-loader', 'css-loader?sourceMap', 'sass-loader'])
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[ext]'
            }, {
                test: /\.json$/,
                loader: 'json'
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
        ]
    },
    // 转化成es5的语法
    babel: {
        presets: ["es2015", "stage-0"],
        "plugins": ["transform-runtime", ["component", [{
            "libraryName": "mint-ui",
            "style": true
        }]]]
    },
    vue: {
        loaders: {
            css: extractSASS.extract("style-loader", "css-loader?sourceMap")
        }
    },
    plugins: plugins
}