import { post } from './axiosConfig';

const createUser = (info, callback) => post('/users', info, callback);

const resendVerifyEmail = (id, callback) => post('/users/resendVerifyEmail', { id }, callback);

const verifyEmail = (id, callback) => post('/users/verifyEmail', { id }, callback);

const forgotPassword = (email, callback) => post('/users/forgotPassword', { email }, callback);

const resetPassword = (info, callback) => post('/users/resetPassword', info, callback);

export { createUser, resendVerifyEmail, verifyEmail, forgotPassword, resetPassword };