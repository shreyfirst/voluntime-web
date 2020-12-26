import { post } from './axiosConfig';

const login = (info, callback) => post('/login', info, callback);

const loginToken = (token, callback) => post('/login/token', { token }, callback);

const loginGoogle = (token, callback) => post('/login/google', { token }, callback);

export { login, loginToken, loginGoogle };