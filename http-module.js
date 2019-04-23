const { resolve } = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const proxy = require('http-proxy-middleware')
const app = express()
const makeCache = require('nuxt-ssr-cache/lib/cache-builders')

export default function SimpleModule (moduleOptions) {
  var defaultModuleOptions = {
    apiProxy: true
  }

  // API PROXY HANDLER START
  const options = Object.assign({}, defaultModuleOptions, moduleOptions)
  if (options.apiProxy && this.options.env.siteApiHost) {
    const cache = makeCache(this.options.cache.store)
    console.log(cache)
    // app.use(express.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    let baseProxyOptions = {
      target: this.options.env.siteApiHost,
      pathRewrite: { '^/api/prx/api': '/api' },
      changeOrigin: true
    }
    let proxyOptions = Object.assign({}, baseProxyOptions, moduleOptions.proxyOptions)
    app.use('/prx/*', proxy(proxyOptions))
    app.get('/core/purgeCache', (req, res) => {
      cache.get('apiVersion').then(e => {
        console.log(e)
      })
      // cache.reset()
      console.log('cacheResetted')
      res.send('cacheResetted')
    })

    this.addServerMiddleware({ path: '/api', handler: app })
  }
  // API PROXY HANDLER STOP

  this.addPlugin(resolve(__dirname, './http.js'))
}

module.exports.meta = require('./package.json')
