import { post } from './axiosConfig';

const createUser = (info, callback) => post('/users', info, callback);

const createUserGoogle = (token, callback) => post('/users/google', { token }, callback);

const resendVerifyEmail = (id, callback) => post('/users/resendVerifyEmail', { id }, callback);

const verifyEmail = (id, callback) => post('/users/verifyEmail', { id }, callback);

const forgotPassword = (email, callback) => post('/users/forgotPassword', { email }, callback);

const resetPassword = (info, callback) => post('/users/resetPassword', info, callback);

const editProfile = (info, callback, onProgress) => post('/users/editProfile', info, callback, (typeof onProgress === 'function' && {
    onUploadProgress: event => onProgress(Math.floor(event.loaded * 100 / event.total))
}));

const changePassword = (info, callback) => post('/users/changePassword', info, callback);

const changeEmail = (info, callback) => post('/users/changeEmail', info, callback);

const verifyNewEmail = (id, callback) => post('/users/verifyNewEmail', { id }, callback);

const changeEmailGoogle = (info, callback) => post('/users/changeEmail/google', info, callback);

export { createUser, createUserGoogle, resendVerifyEmail, verifyEmail, forgotPassword, resetPassword, editProfile, changePassword, changeEmail, verifyNewEmail, changeEmailGoogle };