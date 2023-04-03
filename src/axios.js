import axios from 'axios';
import { backendUrl } from './env';

const instance = axios.create({
  baseURL: backendUrl,
});

//При каждом запросе ищем токен авторизации в localStorage
instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
});

export default instance;
