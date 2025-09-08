// In src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api' // Our backend API URL
});

export default api;