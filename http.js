import axios from 'axios'

export default ({ app }, inject) => {
  const defaultOptions = {
    // request interceptor handler
    reqHandleFunc: config => {
      return config
    },
    reqErrorFunc: error => Promise.reject(error),
    // response interceptor handler
    resHandleFunc: response => response,
    resErrorFunc: error => Promise.reject(error),
    baseURL: process.env.siteApiHost
  }

  const initOptions = {
    ...defaultOptions
  }

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
      if (!process.server) {
        opt.baseURL = '/api/prx'
      }
      return service(opt)
    },
    workUrl: () => {
      if (!process.server) {
        return '/api/prx'
      } else {
        return process.env.siteApiHost
      }
    }
  }

  inject('http', $http)
}
