import axios from "axios";

const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

const _axios = axios.create();

const configure = () => {
  // axios.interceptors.request.use((config) => {
    
  // });
};

const getAxiosClient = () => _axios;

const HttpService = {
  HttpMethods,
  configure,
  getAxiosClient,
};

export default HttpService;
