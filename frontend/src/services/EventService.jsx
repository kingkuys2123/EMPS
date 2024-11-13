import axios from '../utils/AxiosConfig.jsx';

const EventService = {
  createEvent: async (events) => {
    return await axios.post(`/event/createEvent`, events);
  },
  getAllEvent: async () => {
    return await axios.get(`/event/getAllEvents`);
  },
  getEvent: async (id) => {
    return await axios.get(`/event/getEvent?id=${id}`);
  },
  updateEvent: async (id, events) => {
    return await axios.put(`/event/updateEvent/${id}`, events);
  },
  deleteEvent: async (id) => {
    return await axios.delete(`/event/deleteEvent/${id}`);
  },
};

export default EventService;