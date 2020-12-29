import { post } from './axiosConfig';

const createOrg = (info, callback) => post('/orgs', info, callback);

const editOrg = (info, callback) => post('/orgs/edit', info, callback);

const leaveOrg = (info, callback) => post('/orgs/leave', info, callback);

export { createOrg, editOrg, leaveOrg };