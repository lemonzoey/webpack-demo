const merge = require('webpack-merge')
const common = require('./webpack.common')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const production = merge(common,{
    devtool: 'source-map',
    //配置插件，完成loader无法完成的功能
    plugins: [
        //删除未引用代码(dead code)的压缩工具(minifier)
        new UglifyJSPlugin({
            //我们鼓励你在生产环境中启用 source map，因为它们对调试源码(debug)
            //和运行基准测试(benchmark tests)很有帮助。虽然有如此强大的功能，
            //然而还是应该针对生成环境用途，选择一个构建快速的推荐配置（具体细节请查看 devtool）。
            //对于本指南，我们将在生产环境中使用 source-map 选项，而不是我们在开发环境中用到的 inline-source-map：
            //避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。
            sourceMap:true
        })
    ],
})
module.exports = production 

