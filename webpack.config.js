var webpack = require("webpack");
var path = require('path');
var fs = require('fs');

var HtmlwebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


// webpack扩展功能
var containerPath = path.resolve('./');
var compile = require('./bin/compile.js');
var getEntry = require('./bin/getEntry.js');
var alias = require('./bin/alias.js');


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
    resolve: {
        alias: alias,
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
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
            },
            //.scss 文件想要编译，scss就需要这些东西！来编译处理
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader','css-loader?sourceMap!sass-loader')
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
            css: ExtractTextPlugin.extract("vue-style-loader", "css-loader?sourceMap"),
            scss: ExtractTextPlugin.extract("vue-style-loader", "css-loader?sourceMap", "sass-loader"),
        }
    },
    plugins: [
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin('common', 'common.js')
    ]
};

// 判断环境
var prod = process.env.NODE_ENV === 'production';
console.log(prod);
module.exports.plugins = (module.exports.plugins || []);
if (prod) {
    module.exports.devtool = 'source-map';
    module.exports.plugins = module.exports.plugins.concat([
        // 借鉴vue官方的生成环境配置
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.BannerPlugin('vue')
    ]);
} else {
    module.exports.devtool = 'eval-source-map';
}


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
    module.exports.plugins.push(new HtmlwebpackPlugin(conf));
}
