import axios from '../utils/AxiosConfig.jsx';

const UserService = {
    // Create User
    createUser: async (userData) => {
        try {
            const response = await axios.post(`/user/createUser`, userData);
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get all Users
    getAllUsers: async () => {
        try {
            const response = await axios.get(`/user/getAllUsers`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get User by ID
    getUser: async (userId) => {
        try {
            const response = await axios.get(`/user/getUser/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user with ID:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update User
    updateUser: async (userId, newUserDetails) => {
        try {
            const response = await axios.put(`/user/updateUser?id=${userId}`, newUserDetails);
            return response.data;
        } catch (error) {
            console.error(`Error updating user with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Delete User
    deleteUser: async (userId) => {
        try {
            const response = await axios.delete(`/user/deleteUser/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting feedback with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Register
    registerUser: async (userData) => {
        try {
            const response = await axios.post(`/user/register`, userData);
            return response.data;
        } catch (error) {
            console.error(`Error in registering user:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Login
    loginUser: async (username, password) => {
        try {
            const response = await axios.post(`/user/login`, { username, password });
            return response.data;
        } catch (error) {
            console.error(`Error in logging in user:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update Profile
    updateProfile: async (userId, newUserDetails) => {
        try {
            const response = await axios.put(`/user/updateProfile?id=${userId}`, newUserDetails);
            return response.data;
        } catch (error) {
            console.error(`Error updating user profile:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Change Email
    changeEmail: async(userId, newEmail) => {
        try {
            const response = await axios.put(`/user/changeEmail?id=${userId}`, newEmail);
            return response.data;
        } catch (error) {
            console.error(`Error changing email:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Change Password
    changePassword: async(id, oldPassword, newPassword) => {
        try {
            const response = await axios.put(`/user/changePassword?id=${id}`, {oldPassword, newPassword});
            return response.data;
        } catch (error) {
            console.error(`Error changing password:`, error);
            throw error.response ? error.response.data : error.message;
        }
    }
};

export default UserService;
