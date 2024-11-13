import axios from '../utils/AxiosConfig.jsx';

const EventService = {
    // Create a new event
    createEvent: async (eventData) => {
        try {
            const response = await axios.post(`/event/createEvent`, eventData);
            return response.data;
        } catch (error) {
            console.error("Error creating event:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get all events
    getAllEvents: async () => {
        try {
            const response = await axios.get(`/event/getAllEvents`);
            return response.data;
        } catch (error) {
            console.error("Error fetching events:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get event by ID
    getEvent: async (id) => {
        try {
            const response = await axios.get(`/event/getEvent?id=${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching event with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update event by ID
    updateEvent: async (id, updatedData) => {
        try {
            const response = await axios.put(`/event/updateEvent/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error(`Error updating event with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Delete event by ID
    deleteEvent: async (id) => {
        try {
            await axios.delete(`/event/deleteEvent/${id}`);
        } catch (error) {
            console.error(`Error deleting event with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },
};

export default EventService;
