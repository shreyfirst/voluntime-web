const axiosPackage = require('axios');

const axios = axiosPackage.create({
    baseURL: 'https://api.mittaldev.com/voluntime/'
});

export default axios;