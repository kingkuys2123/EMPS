import axios from '../utils/AxiosConfig.jsx';

const VenueService = {

    createVenue: async (venueData) => {
        try {
            const response = await axios.post(`/venue/postVenue`, venue, {
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

    deleteVenue:async () => {
        try {
            const response = await axios.get(`/venue//deleteVenue/${id}`);
            return response.data;
        } catch (error) {
            onsole.error(`Error deleting venue with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    }

}
export default VenueService;