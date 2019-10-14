const path = require('path')
const fs = require('fs')
const resolve = dir => {
  return path.join(__dirname, dir)
}
const env = process.env.NODE_ENV || 'development'
fs.writeFileSync(path.join(__dirname, './config/env.js'), `export default '${env}'
`)
/**
 *打包的时候配置 对应nginx的location
 */
const BASE_URL = '/apimgmt/'
module.exports = {
  baseUrl: BASE_URL,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 关闭eslint
  lintOnSave: false,
  // 关闭eslint
  lintOnSave: false,
  devServer: {
    host: 'localhost',
    port: 8088,
    proxy: {
      '/api': {
        // target: 'http://127.0.0.1:9090/',
        target: 'http://39.106.213.187:9090/',
        changeOrigin: true
      }
    }
  }
}
