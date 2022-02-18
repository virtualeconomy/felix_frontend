module.exports = {
  // publicPath: '/',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/felix_frontend'
    : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  // For dev deployment
  // publicPath: "dev",
  lintOnSave: false,
  devServer: {
    // before: require('./mock/mock-server.js'),
    proxy: {
      // '/': {
      //   target: 'http://samblana.vos.systems:8000'
      // },
      '/find': {
        target: 'https://staging.vsystems.dev',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/find': ''
        }
      },
      '/': {
        target: 'https://staging.vsystems.dev/api',
        // target: 'http://163.172.101.111:8000'
      },
    }
  }
}
