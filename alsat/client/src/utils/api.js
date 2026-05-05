import axios from 'axios';

const api = axios.create({
    baseURL: 'https://alsatyeri.onrender.com/api',
});

export default api;
