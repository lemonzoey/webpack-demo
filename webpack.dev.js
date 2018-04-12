const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin  = require('clean-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const dev =merge(common,{
    
    //追踪错误来源，若不配置，错误会在bundle.js中，不好找错误
    devtool:'inline-source-map',
    //配置插件，完成loader无法完成的功能
    plugins: [
        // webpack 内置的 HMR 插件
        new webpack.HotModuleReplacementPlugin(),
        //查看要修补(patch)的依赖
        new webpack.NamedModulesPlugin(),
    ],
    //webpack-dev-server 为你提供了一个简单的 web 服务器，并且能够实时重新加载,devServer启动的就是webpack-dev-server
    //以下配置告知 webpack-dev-server，在 localhost:8080 下建立服务，将 dist 目录下的文件，作为可访问文件。
    devServer:{
        //告诉开发服务器(dev server)，在哪里查找文件：
        contentBase:'./dist',
        port:'3333',
        //启动热重载
        hot:true 
    }
    
})
module.exports = dev 

