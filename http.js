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
    get: (url, data, options) => {
      let axiosOpt = {
        ...options,
        ...{
          method: 'get',
          url: url,
          params: data
        }
      }
      return service(axiosOpt)
    },
    post: (url, data, options) => {
      let axiosOpt = {
        ...options,
        ...{
          method: 'post',
          url: url,
          data: data
        }
      }
      return service(axiosOpt)
    }
  }
  inject('http', $http)
}
