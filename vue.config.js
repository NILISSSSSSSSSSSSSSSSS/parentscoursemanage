const webpack = require('webpack')
var path = require('path')
function resolve (dir) {
  console.log(__dirname)
  return path.join(__dirname, dir)
}
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  //assetsPublicPath: "./",
  chainWebpack: config => {
    config.resolve.symlinks(true)
    //路径配置别名
    config.resolve.alias.set('@', resolve('src'))
    // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
    config.plugin('define').tap(args => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL)
      return args
    })
    // if (process.env.NODE_ENV === 'production') {
    //   config.optimization.minimizer[0].options.extractComments = true
    //   config.optimization.minimizer[0].options.uglifyOptions.output.comments = false
    // }
  },

  devServer: {
    open: false, //配置自动启动浏览器
    port:8220,
    // proxy: {
    //   '/htApi': {
    //       target:'http://192.168.100.235:8006/api/',//测试环境(绘童)
    //       // target:'http://192.168.100.252:8000/api/',//陈伦巨
    //       // target:'http://192.168.100.29:8000/api/',//彭博
    //       ws: true,
    //       changOrigin: true,//允许跨域
    //       pathRewrite: {
    //         '^/htApi': ''
    //       }
    //   },
    //   '/casdev': {
    //     target: 'http://casdev.pymom.com/api/',//开发环境(公共登录相关操作)
    //     ws: true,
    //     changOrigin: true,//允许跨域
    //     pathRewrite: {
    //       '^/casdev': ''
    //     }
    // },
    // }
  },
  configureWebpack: {
     plugins: [
     new webpack.ProvidePlugin({
      $:"jquery",
      jQuery:"jquery",
      "windows.jQuery":"jquery"
      })
    ]
  },
  lintOnSave: false
}