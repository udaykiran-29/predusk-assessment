// In src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://predusk-assessment-s0na.onrender.com' // Our backend API URL
});

export default api;