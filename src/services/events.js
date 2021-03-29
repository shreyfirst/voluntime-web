import { post } from './axiosConfig';

const createEvent = (info, callback) => post('/events', info, callback);

export { createEvent };
