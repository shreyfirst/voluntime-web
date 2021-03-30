import { post } from './axiosConfig';

const createEvent = (info, callback) => post('/events', info, callback);

const getEventsOrg = (info, callback) => post('/events/getOrg', info, callback);

const editEvent = (info, callback) => post('/events/edit', info, callback);

export { createEvent, getEventsOrg, editEvent };
