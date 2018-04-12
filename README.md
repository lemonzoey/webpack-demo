### 一.项目启动
npm run dev
这个启动是利用webpack-dev-server来启动的，这个插件内置了个小型的express服务器，所以也能启动项目。
用webpack-dev-server启动项目有个问题，就是打包生成的dist文件在内存中，本地项目上没法看到dist文件夹的内容

npm run server
这个是自己写了个express服务器来启动项目


### 二.webpack配置的详细解释
```js
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin  = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const config = {
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
    //追踪错误来源，若不配置，错误会在bundle.js中，不好找错误
    devtool:'inline-source-map',
    //配置插件，完成loader无法完成的功能
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
        // webpack 内置的 HMR 插件
        new webpack.HotModuleReplacementPlugin(),
        //查看要修补(patch)的依赖
        new webpack.NamedModulesPlugin(),
        //删除未引用代码(dead code)的压缩工具(minifier)
        new UglifyJSPlugin()
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
    
}
module.exports = config 


```

### 三.webpack-dev-server和webpack-dev-middleware的区别
1.webpack-dev-server
webpack-dev-server实际上相当于启用了一个express的Http服务器+调用webpack-dev-middleware。它的作用主要是用来伺服资源文件。这个Http服务器和client使用了websocket通讯协议，原始文件作出改动后，webpack-dev-server会用webpack实时的编译，再用webpack-dev-middleware将webpack编译后文件会输出到内存中。适合纯前端项目，很难编写后端服务，进行整合。

2.webpack-dev-middleware
 webpack-dev-middleware输出的文件存在于内存中。你定义了 webpack.config，webpack 就能据此梳理出entry和output模块的关系脉络，而 webpack-dev-middleware 就在此基础上形成一个文件映射系统，每当应用程序请求一个文件，它匹配到了就把内存中缓存的对应结果以文件的格式返回给你，反之则进入到下一个中间件。

因为是内存型文件系统，所以重建速度非常快，很适合于开发阶段用作静态资源服务器；因为 webpack 可以把任何一种资源都当作是模块来处理，因此能向客户端反馈各种格式的资源，所以可以替代HTTP 服务器。事实上，大多数 webpack 用户用过的 webpack-dev-server 就是一个 express＋webpack-dev-middleware 的实现。二者的区别仅在于 webpack-dev-server 是封装好的，除了 webpack.config 和命令行参数之外，很难去做定制型开发。而 webpack-dev-middleware 是中间件，可以编写自己的后端服务然后把它整合进来，相对而言比较灵活自由。

3.webpack-hot-middleware：
是一个结合webpack-dev-middleware使用的middleware，它可以实现浏览器的无刷新更新（hot reload），这也是webpack文档里常说的HMR（Hot Module Replacement）。HMR和热加载的区别是：热加载是刷新整个页面。

# webpack-demo
