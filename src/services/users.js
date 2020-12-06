import { axios, handleResponse } from './axiosConfig';

const createUser = (info, callback) => {
    axios.post('/users', info)
        .then(response => handleResponse(response, callback));
};

const resendVerifyEmail = (id, callback) => {
    axios.post('/users/resendVerifyEmail', { id })
        .then(response => handleResponse(response, callback));
};

const forgotPassword = (email, callback) => {
    axios.post('/users/forgotPassword', { email })
        .then(response => handleResponse(response, callback));
};

const resetPassword = (info, callback) => {
    axios.post('/users/resetPassword', info)
        .then(response => handleResponse(response, callback));
};

export { createUser, resendVerifyEmail, forgotPassword, resetPassword };