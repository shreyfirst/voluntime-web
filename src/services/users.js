import { axios, handleResponse } from './axiosConfig';

const createUser = (info, callback) => {
    axios.post('/users', info)
        .then(response => handleResponse(response, callback));
};

const resendVerifyEmail = (id, callback) => {
    axios.post('/users/resendVerifyEmail', { id })
        .then(response => handleResponse(response, callback));
};

export { createUser, resendVerifyEmail };