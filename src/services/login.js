import { post } from './axiosConfig';

const login = (info, callback) => post('/login', info, callback);

const loginToken = (token, method, callback) => post('/loginToken', { token, method }, callback);

export { login, loginToken };