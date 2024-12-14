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
            const token = localStorage.getItem('authToken'); // Retrieve the token from local storage or any other secure place
            const response = await axios.get(`/organizer/getOrganizer/${organizerId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching organizer with ID:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update organizer
    updateOrganizer: async (organizerId, newOrganizerDetails) => {
        try {
            const response = await axios.put(`/organizer/updateOrganizer?id=${organizerId}`, newOrganizerDetails);
            return response.data;
        } catch (error) {
            console.error(`Error updating organizer with ID ${organizerId}:`, error);  // Fixed reference to organizerId
            throw error.response ? error.response.data : error.message;
        }
    },

    // Delete organizer
    deleteOrganizer: async (organizerId) => {
        try {
            const response = await axios.delete(`/organizer/deleteOrganizer/${organizerId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting organizer with ID ${organizerId}:`, error);
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

    approveOrganizer: async (organizerId, organizerData) => {
        try {
            const response = await axios.put(`/organizer/approveOrganizer?id=${organizerId}`, organizerData);
            return response.data;
        } catch (error) {
            console.error(`Error approving organizer with ID ${organizerId}:`, error);
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
    },

    getOrganizerWithUser: async (userID) => {
        try {
            const response = await axios.get(`/organizer/getOrganizerWithUser/${userID}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching organizer data:', error);
            throw error;
        }
    },

    applyForOrganizer: async (organizerData, userId) => {
        try {
            const response = await axios.post(`/organizer/applyForOrganizer?userId=${userId}`, organizerData);
            return response.data;
        } catch (error) {
            console.error("Error applying for organizer:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    getApprovedOrganizers: async () => {
        try {
            const response = await axios.get(`/organizer/approvedOrganizers`);
            return response.data;
        } catch (error) {
            console.error("Error fetching approved organizers:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

};

export default OrganizerService;
