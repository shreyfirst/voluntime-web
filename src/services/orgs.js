import { post } from './axiosConfig';

const createOrg = (info, callback) => post('/orgs', info, callback);

const editOrg = (info, callback) => post('/orgs/edit', info, callback);

export { createOrg, editOrg };