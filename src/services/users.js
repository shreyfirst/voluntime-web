import axios from './axiosConfig';

const createUser = (info, callback) => {
    axios.post('/users', info)
    .then(response => {
        callback(false, response.data);
    })
    .catch(error => {
        callback(true, error.data);
    });
};

export { createUser };