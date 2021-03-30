import { post } from './axiosConfig';

const createEvent = (info, callback) => post('/events', info, callback);

const getEventsOrg = (info, callback) => post('/events/getOrg', info, callback);

export { createEvent, getEventsOrg };
