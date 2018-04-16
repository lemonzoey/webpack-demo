### 一.项目启动
npm run dev
这个启动是利用webpack-dev-server来启动的，这个插件内置了个小型的express服务器，所以也能启动项目。
用webpack-dev-server启动项目有个问题，就是打包生成的dist文件在内存中，本地项目上没法看到dist文件夹的内容

npm run server
这个是自己写了个express服务器来启动项目


### 二.webpack配置的详细解释
  1.error: webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
 这里有个坑，webpack 4.0.0-beta.0删除了 CommonsChunkPlugin，以支持两个新的选项（optimization.splitChunks 和 optimization.runtimeChunk）。

从webpack 4.0.0-beta.0 开始分割 Chunk 将不在使用 CommonsChunkPlugin 插件，而是使用 optimization 配置项，具体的实现原理可以参考 CommonsChunkPlugin。

对于那些需要细粒度控制缓存策略的人，可以通过 optimization.splitChunks和 optimization.runtimeChunk。 现在可以使用 module.rules[].resolve来配置解析。它与全局配置合并。
 ```js
 删掉 new webpack.optimize.CommonsChunkPlugin({
            name: 'common' // 指定公共 bundle 的名称。
        }),
 改用  new webpack.optimize.RuntimeChunkPlugin({
            name: "common" // 指定公共 bundle 的名称
        }),
```
 

 optimization的配置介绍如下：
```js
//这里有两种使用方式：
const config= {
     //方式一：
     optimization:{...}
     //方式二：
     plugins: [
         new webpack.optimize.SplitChunksPlugin({...})
     ]
}

optimization参数介绍：

optimization: {
     runtimeChunk: {
        name: "manifest"        //指定公共 bundle 的名称
    },
    splitChunks: {
      chunks: "initial",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
      minSize: 0,                // 最小尺寸，默认0
      minChunks: 1,              // 最小 chunk ，默认1
      maxAsyncRequests: 1,       // 最大异步请求数， 默认1
      maxInitialRequests: 1,    // 最大初始化请求书，默认1
      name: () => {},              // 名称，此选项可接收 function
      cacheGroups: {                 // 这里开始设置缓存的 chunks
        priority: "0",                // 缓存组优先级 false | object |
        vendor: {                   // key 为entry中定义的 入口名称
          chunks: "initial",        // 必须三选一： "initial" | "all" | "async"(默认就是异步)
          test: /react|lodash/,     // 正则规则验证，如果符合就提取 chunk
          name: "vendor",           // 要缓存的 分隔出来的 chunk 名称
          minSize: 0,
          minChunks: 1,
          enforce: true,
          maxAsyncRequests: 1,       // 最大异步请求数， 默认1
          maxInitialRequests: 1,    // 最大初始化请求书，默认1
          reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值）
        }
      }
    }
  },
```

  2.filename: '[name].[chunkhash].js',
  dev环境时候报错：Cannot use [chunkhash] or [contenthash] for chunk in '[name].[chunkhash].js' (use [hash] instead)
  这里[chunkhash]=>改成[hash]
  bundle 的名称是它内容（通过 hash）的映射。如果我们不做修改，然后再次运行构建，我们以为文件名会保持不变。然而，如果我们真的运行，可能会发现情况并非如此：（译注：这里的意思是，如果不做修改，文件名可能会变，也可能不会。）

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
        //此选项决定了非入口(non-entry) chunk 文件的名称
        chunkFilename:'[name].bundle.js',
        
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
         //离线任务未完成，报错：TypeError: WorkboxPlugin is not a constructor，原因待查
        // new WorkboxPlugin({
        //  // 这些选项帮助 ServiceWorkers 快速启用
        //  // 不允许遗留任何“旧的” ServiceWorkers
        //    clientsClaim: true,
        //    skipWaiting: true
        // }),
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
        new UglifyJSPlugin(),
         //允许你创建一个在编译时可以配置的全局常量。这可能会对开发模式和
        //发布模式的构建允许不同的行为非常有用
        //比如,你可能会用一个全局的常量来决定 log 在开发模式触发而不是发布模式。
        //这仅仅是 DefinePlugin 提供的便利的一个场景。
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        //这里会导致报错，因为方法已经被弃用，官网真坑，不给维护，换成另一种方式配置
        //  new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common' // 指定公共 bundle 的名称。
        // }),
         //HashedModuleIdsPlugin，推荐用于生产环境构建：使用这个可以实现缓存，那些没有改变的文件就不会
        //随着每次构建而改变了，节约资源
        new webpack.HashedModuleIdsPlugin(),
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
