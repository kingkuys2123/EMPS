import axios from '../utils/AxiosConfig.jsx';

const VenueService = {

    createVenue: async (venue) => {
        try {
            const response = await axios.post(`/venue/createVenue`, venue, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting venue:', error);
            throw error;
        }
    },

    getAllVenue: async () => {
        try {
            const response = await axios.get(`/venue/getAllVenues`);
            return response.data;
        } catch (error) {
            console.error('Error fetching venues:', error);
            throw error;
        }
    },

    getVenue:async () => {
        try {
            const response = await axios.get(`/venue//getVenue/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching venue with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    deleteVenue:async (id) => {
        try {
            const response = await axios.get(`/venue/deleteVenue/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting venue with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    updateVenue: async (id, venue) => {
        if (!id) {
            throw new Error("Venue ID is required to update.");
        }
        try {
            const response = await axios.put(`/venue/updateVenue?id=${id}`, venue, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating venue with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },
}



export default VenueService;