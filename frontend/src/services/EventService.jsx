import axios from '../utils/AxiosConfig.jsx';

const EventService = {
  createEvent: async (events) => {
    return await axios.post(`/event/createEvent`, events);
  },
  createEventWithOrganizer: async (organizerId, event) => {
    return await axios.post(`/event/createEventWithOrganizer/${organizerId}`, event);
  },
  getAllEvent: async () => {
    return await axios.get(`/event/getAllEvents`);
  },
  getEvent: async (id) => {
    return await axios.get(`/event/getEvent/${id}`);
  },
  updateEvent: async (id, events) => {
    return await axios.put(`/event/updateEvent/${id}`, events);
  },
  deleteEvent: async (id) => {
    return await axios.delete(`/event/deleteEvent/${id}`);
  },
  getFeaturedEvents: async () => {
    return await axios.get(`/event/getFeaturedEvents`);
  },
  getRandomUpcomingEvents: async () => {
    return await axios.get(`/event/getRandomUpcomingEvents`);
  },
  getEventsByOrganizer: async (id) => {
    return await axios.get(`/event/getEventsByOrganizer/${id}`);
  },
  getAllByConfirmationStatusConfirmed: async () => {
    return await axios.get(`/event/getAllByConfirmationStatusConfirmed`);
  },
  uploadCoverPhoto: async (userId, file) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', file);
    return await axios.post(`/event/uploadCoverPhoto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getCoverPhoto: async (filename) => {
    return await axios.get(`/event/getCoverPhoto/${filename}`, {
      responseType: 'blob'
    });
  },
  deleteCoverPhoto: async (id) => {
    return await axios.delete(`/event/deleteCoverPhoto/${id}`);
  },
  getAllByConfirmationStatusPending: async () => {
    return await axios.get(`/event/getAllByConfirmationStatusPending`);
  },

};

export default EventService;