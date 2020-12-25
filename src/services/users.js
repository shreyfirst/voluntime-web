import { post } from './axiosConfig';

const createUser = (info, callback) => post('/users', info, callback);

const createUserGoogle = (token, callback) => post('/users/google', { token }, callback);

const resendVerifyEmail = (id, callback) => post('/users/resendVerifyEmail', { id }, callback);

const verifyEmail = (id, callback) => post('/users/verifyEmail', { id }, callback);

const forgotPassword = (email, callback) => post('/users/forgotPassword', { email }, callback);

const resetPassword = (info, callback) => post('/users/resetPassword', info, callback);

const editProfile = (info, callback) => post('/users/editProfile', info, callback);

const changePassword = (info, callback) => post('/users/changePassword', info, callback);

export { createUser, createUserGoogle, resendVerifyEmail, verifyEmail, forgotPassword, resetPassword, editProfile, changePassword };