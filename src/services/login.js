import { post } from './axiosConfig';

const login = (info, callback) => post('/login', info, callback);

const loginToken = (token, callback) => post('/loginToken', { token }, callback);

const loginGoogle = (token, callback) => post('/loginGoogle', { token }, callback);

export { login, loginToken, loginGoogle };