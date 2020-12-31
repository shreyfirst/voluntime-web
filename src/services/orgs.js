import { post } from './axiosConfig';

const createOrg = (info, callback) => post('/orgs', info, callback);

const editOrg = (info, callback) => post('/orgs/edit', info, callback);

const leaveOrg = (info, callback) => post('/orgs/leave', info, callback);

const getMembers = (info, callback) => post('/orgs/getMembers', info, callback);

const createInviteLink = (info, callback) => post('/orgs/inviteLink', info, callback);

const joinOrg = (info, callback) => post('/orgs/join', info, callback);

const joinOrgInfo = (invite, callback) => post('/orgs/join/info', { invite }, callback);

export { createOrg, editOrg, leaveOrg, getMembers, createInviteLink, joinOrg, joinOrgInfo };