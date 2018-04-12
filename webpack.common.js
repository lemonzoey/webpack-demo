const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin  = require('clean-webpack-plugin')
const common = {
    //入口文件配置
    entry:{
        app:'./src/index.js',
        // print:'./src/print.js'
    },
    //配置出口文件
    output:{
        //出口文件的名称
        filename:'[name].bundle.js',
        //出口文件的路径
        path:path.resolve(__dirname,'dist'),
        //publicPath 也会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问
        publicPath:'/'
        
    },
    mode:'none',
    module:{
        //匹配除开js之外其他的文件，让相应的loader将文件解析成js文件
        rules:[
          {
              test:/\.css$/,
              use:['style-loader','css-loader']
          },
          {
              test:/\.xml$/,
              use:'xml-loader'
          }
        ]
    },
    plugins: [
        /*
          自动生成html,及文件的引用
          html-webpack-plugin用来打包入口html文件
          entry配置的入口是js文件, webpack以js文件为入口, 遇到import, 用配置的loader加载引入文件
          但作为浏览器打开的入口html, 是引用入口js的文件, 它在整个编译过程的外面,
          所以, 我们需要html-webpack-plugin来打包作为入口的html文件
        */
        new HtmlWebpackPlugin({
        title: '柠檬🍋'
        }),
        //每次打包前会将dist文件夹中的文件清除，防止加载不必要的文件
        new CleanWebpackPlugin(['dist']),
    
    ],
}
module.exports = common 

