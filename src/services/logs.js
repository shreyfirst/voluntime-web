import { post } from './axiosConfig';

const addLog = (info, callback, onProgress) => post('/logs', info, callback, (typeof onProgress === 'function' && {
    onUploadProgress: event => onProgress(Math.floor(event.loaded * 100 / event.total))
}));

const getLogsUser = (info, callback) => post('/logs/getUser', info, callback);

const getLogsOrg = (info, callback) => post('/logs/getOrg', info, callback);

const getLogsUserOrg = (info, callback) => post('/logs/getUserOrg', info, callback);

const editStatus = (info, callback) => post('/logs/editStatus', info, callback);

export { addLog, getLogsUser, getLogsOrg, getLogsUserOrg, editStatus };
