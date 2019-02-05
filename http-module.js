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
  if (options.apiProxy) {
    // app.use(express.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use('/prx/*', proxy({
      target: this.options.env.siteApiHost,
      pathRewrite: { '^/api/prx/api': '/api' },
      changeOrigin: true
    }))

    this.addServerMiddleware({ path: '/api', handler: app })
  }
  // API PROXY HANDLER STOP

  this.addPlugin(resolve(__dirname, './http.js'))
}

module.exports.meta = require('./package.json')
