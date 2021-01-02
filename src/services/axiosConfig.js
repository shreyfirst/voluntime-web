const axiosPackage = require('axios');

const axios = axiosPackage.create({
    baseURL: 'https://api.mittaldev.com/voluntime-dev/',
    headers: {},
    validateStatus: () => true
});

const post = (path, info, callback) =>
    axios.post(path, info)
        .then(response => callback(response.status < 200 || response.status >= 300, response.data))
        .catch(e => { console.error(e); callback(true, { message: 'An unexpected error occurred. Please try again.' }); });

export { post };