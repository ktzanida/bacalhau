import axios from 'axios'

export const getHTTPTokenHeaders = token => ({
  Authorization: token ? `Bearer ${token}` : '',
})

export const setHTTPToken = token => {
  axios.defaults.headers.common = getHTTPTokenHeaders(token)
}

export const unsetHTTPToken = () => {
  axios.defaults.headers.common = getHTTPTokenHeaders()
}

// pluck an error message from the response body if present
export const getErrorMessage = (error) => {
  const res = error.response
  let message = ''
  if(res && res.data) {
    message = res.data.error || res.data.message || res.data.log
  }
  message = message || error.toString()
  return message.replace(/^Error\: Error\:/, 'Error:')
}

export const getUrl = (path) => path

const factory = method => async (url, data, extra = {}) => axios({
  method,
  url,
  data,
  ...extra
}).then(res => res.data)

export const handlers = {
  get: factory('get'),
  post: factory('post'),
  put: factory('put'),
  delete: factory('delete'),
}