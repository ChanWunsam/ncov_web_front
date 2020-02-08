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
        target: 'http://39.99.156.174:8080',
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