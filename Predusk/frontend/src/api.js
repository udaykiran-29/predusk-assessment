// In src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dashboard.render.com/web/srv-d2vg083e5dus73flpfs0/deploys/dep-d2vg3t3uibrs738isea0' // Our backend API URL
});

export default api;