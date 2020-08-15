import axios from 'axios';

const api = axios.create({

    // se utiliar o expo, utilizar o IP da máquina
    baseURL: 'http://192.168.1.101:3333'
});

export default api;