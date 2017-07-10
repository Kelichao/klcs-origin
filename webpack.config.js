var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var WebpackDevServer = require("webpack-dev-server");
var TARGET = process.env.npm_lifecycle_event;
var path = require("path");
console.log(TARGET)


module.exports = {
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
    entry: { bbb: "./src/js/kit.js" },
    output: {
        path: __dirname + "/assets",
        filename: "kit.min.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/src/enter.html"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    devServer: {
        contentBase: __dirname + "/assets/index.html",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    }
};


