import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:9000'
});

http.interceptors.request.use(
  (config) => {
    return config;
  }
);

http.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;