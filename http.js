import axios from 'axios'

export default (context, inject) => {
  let { app } = context
  const defaultOptions = {
    // request interceptor handler
    reqHandleFunc: config => {
      if (app.$http.token)
        config.headers = {
          'Authorization': 'Bearer ' + app.$http.token
        }
      return config
    },
    reqErrorFunc: error => Promise.reject(error),
    // response interceptor handler
    resHandleFunc: response => response,
    resErrorFunc: error => Promise.reject(error),
    baseURL: process.env.siteApiHost
  }
  let useProxy = true
    <% console.log({ options })
  if (!options.apiProxy) { %>
    useProxy = false
      <% } else { %>
  <% } %>

  const initOptions = {
    ...defaultOptions
  }
  initOptions.baseURL = useProxy ? '/api/prx' : process.env.siteApiHost

  const service = axios.create(initOptions)
  service.interceptors.request.use(
    config => initOptions.reqHandleFunc(config),
    error => initOptions.reqErrorFunc(error)
  )
  service.interceptors.response.use(
    response => initOptions.resHandleFunc(response),
    error => initOptions.resErrorFunc(error)
  )

  let $http = {
    token: null,
    get: function (url, data, options) {
      let axiosOpt = {
        ...options,
        ...{
          method: 'get',
          url: url,
          params: data
        }
      }
      return this.action(axiosOpt)
    },
    post: function (url, data, options) {
      let axiosOpt = {
        ...options,
        ...{
          method: 'post',
          url: url,
          data: data
        }
      }
      return this.action(axiosOpt)
    },
    action: function (opt) {
      if (!process.server && useProxy) {
        opt.baseURL = '/api/prx'
      }
      return service(opt)
    },
    workUrl: () => {
      if (!process.server && useProxy) {
        return '/api/prx'
      } else {
        return process.env.siteApiHost
      }
    }
  }

  inject('http', $http)
}
