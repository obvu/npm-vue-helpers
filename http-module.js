const { resolve } = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const proxy = require('http-proxy-middleware')
const app = express()

export default function SimpleModule (moduleOptions) {
  var defaultModuleOptions = {
    apiProxy: true
  }

  // API PROXY HANDLER START
  const options = Object.assign({}, defaultModuleOptions, moduleOptions)
  console.log(options)
  if (options.apiProxy && this.options.env.siteApiHost) {
    // app.use(express.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    let baseProxyOptions = {
      target: this.options.env.siteApiHost,
      pathRewrite: { '^/api/prx/api': '/api' },
      changeOrigin: true
    }
    let proxyOptions = Object.assign({}, baseProxyOptions, moduleOptions.proxyOptions)
    app.use('/prx/*', proxy(proxyOptions))

    this.addServerMiddleware({ path: '/api', handler: app })
  }
  // API PROXY HANDLER STOP

  this.addPlugin({
    src: resolve(__dirname, './http.js'),
    options
  })
}

module.exports.meta = require('./package.json')
