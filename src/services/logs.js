import { post } from './axiosConfig';

const addLogs = (info, callback) => post('/logs', info, callback);

const getLogsUser = (info, callback) => post('/logs/getUser', info, callback);

const getLogsOrg = (info, callback) => post('/logs/getOrg', info, callback);

export { addLogs, getLogsUser, getLogsOrg };
