const axiosPackage = require('axios');


const DEV = true;


const axios = axiosPackage.create({
    baseURL: `https://api.mittaldev.com/voluntime${DEV ? '-dev' : ''}/`,
    headers: {},
    validateStatus: () => true
});

const post = (path, info, callback, config) =>
    axios.post(path, info, config)
        .then(response => callback(response.status < 200 || response.status >= 300, response.data))
        .catch(e => { console.error(e); callback(true, { message: 'An unexpected error occurred. Please try again.' }); });

export { post };