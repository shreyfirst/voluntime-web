import { post } from './axiosConfig';

const createOrg = (info, callback) => post('/orgs', info, callback);

export { createOrg };