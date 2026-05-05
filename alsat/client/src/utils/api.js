import axios from 'axios';

const api = axios.create({
    baseURL: 'https://alsatyeri.onrender.com/',
});

export default api;
