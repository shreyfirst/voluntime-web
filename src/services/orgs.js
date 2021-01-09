import { post } from './axiosConfig';

const createOrg = (info, callback) => post('/orgs', info, callback);

const editOrg = (info, callback) => post('/orgs/edit', info, callback);

const deleteOrg = (info, callback) => post('/orgs/delete', info, callback);

const leaveOrg = (info, callback) => post('/orgs/leave', info, callback);

const getMembers = (info, callback) => post('/orgs/getMembers', info, callback);

const createInviteLink = (info, callback) => post('/orgs/inviteLink', info, callback);

const joinOrg = (info, callback) => post('/orgs/join', info, callback);

const joinOrgInfo = (invite, callback) => post('/orgs/join/info', { invite }, callback);

const changeRole = (info, callback) => post('/orgs/changeRole', info, callback);

const removeMember = (info, callback) => post('/orgs/removeMember', info, callback);

export { createOrg, editOrg, deleteOrg, leaveOrg, getMembers, createInviteLink, joinOrg, joinOrgInfo, changeRole, removeMember };