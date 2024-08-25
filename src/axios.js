import axios from 'axios';

const instance = axios.create({
    baseURL:'http://localhost:8080/api', //spring boot的API基礎URL
    timeout: 1000,
});

export default instance;