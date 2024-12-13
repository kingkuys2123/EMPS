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
  getPendingEvent: async () => {
    try {
      const response = await axios.get(`/event/getPendingEvents`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pending events:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
  getEventsByOrganizer: async (id) => {
    try {
      const response = await axios.get(`/event/getEventsByOrganizer?id=${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pending events:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

};

export default EventService;