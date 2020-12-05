import { axios, handleResponse } from './axiosConfig';

const login = (info, callback) => {
    axios.post('/login', info)
        .then(response => handleResponse(response, callback));
};

const loginToken = (info, callback) => {
    axios.post('/loginToken', info)
        .then(response => handleResponse(response, callback));
};

export { login, loginToken };