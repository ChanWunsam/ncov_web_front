module.exports = {
  publicPath: './',
  lintOnSave: false,

  devServer: {
    overlay: {
      warning: false,
      errors: false
    },
    hotOnly: true,
    disableHostCheck: true,
    proxy: {
      '/': {
        // target: 'http://39.99.156.174:8080',
        target: 'http://47.93.61.57:8000', // 测试服
        // ws: true,
        // port:8083
        changeOrigin: true
      }
    }
  },
  productionSourceMap: false,
  // productionGzip: true,
  // productionGzipExtensions: ['js', 'css']
}