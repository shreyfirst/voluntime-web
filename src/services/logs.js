import { post } from './axiosConfig';

const addLog = (info, callback) => post('/logs', info, callback);

const getLogsUser = (info, callback) => post('/logs/getUser', info, callback);

const getLogsOrg = (info, callback) => post('/logs/getOrg', info, callback);

const getLogsUserOrg = (info, callback) => post('/logs/getUserOrg', info, callback);

export { addLog, getLogsUser, getLogsOrg, getLogsUserOrg };
