// OrganizerService.js
import axios from '../utils/AxiosConfig.jsx';

const OrganizerService = {
    // Create organizer
    createOrganizer: async (organizerData) => {
        try {
            const response = await axios.post(`/organizer/createOrganizer`, organizerData);
            return response.data;
        } catch (error) {
            console.error("Error creating organizer:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    createOrganizerWithUserId: async (organizerData, userID) => {
        try {
            const response = await axios.post(`/organizer/createOrganizerWithUser?userId=${userID}`, organizerData);
            return response.data;
        } catch (error) {
            console.error("Error creating organizer with user ID:", error);
            throw error.response ? error.response.data : error.message;
        }
    },


    // Assign an existing user as an organizer
    assignOrganizer: async ({ username }) => {
        try {
            const response = await axios.post(`/organizer/assignOrganizer`, { username });
            return response.data;
        } catch (error) {
            console.error("Error assigning organizer:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get all organizers
    getAllOrganizers: async () => {
        try {
            const response = await axios.get(`/organizer/getAllOrganizers`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all organizers:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get organizer by ID
    getOrganizer: async (organizerId) => {
        try {
            const response = await axios.get(`/organizer/getOrganizer/${organizerId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching organizer with ID:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update organizer
    updateOrganizer: async (organizerId, neworganizerDetails) => {
        try {
            const response = await axios.put(`/organizer/updateOrganizer?id=${organizerId}`, neworganizerDetails);
            return response.data;
        } catch (error) {
            console.error(`Error updating organizer with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Delete organizer
    deleteOrganizer: async (organizerId) => {
        try {
            const response = await axios.delete(`/organizer/deleteOrganizer/${organizerId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting organizer with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Add Organizer
    addOrganizer: async (organizerData)=>{
        try {
            const response = await axios.post(`/organizer/addOrganizer`,organizerData);
            return response.data
        }catch (error) {
            console.error("Error creating organizer:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    getTopOrganizers: async () => {
        try {
            const response = await axios.get(`/organizer/getDummyData`);
            return response.data;
        } catch (error) {
            console.error("Error fetching top organizers:", error);
            throw error.response ? error.response.data : error.message;
        }
    }

};

export default OrganizerService;
