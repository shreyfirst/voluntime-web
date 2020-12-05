const axiosPackage = require('axios');

const axios = axiosPackage.create({
    baseURL: 'https://api.mittaldev.com/voluntime-dev/',
    headers: {},
    validateStatus: () => true
});

const handleResponse = (response, callback) => {
    callback(response.status < 200 || response.status >= 300, response.data);
};

export { axios, handleResponse };