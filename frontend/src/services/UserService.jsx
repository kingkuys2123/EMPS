import axios from '../utils/AxiosConfig.jsx';

const UserService = {
    // Create User
    createUser: async (userData) => {
        try {
            const response = await axios.post(`/user/createUser`, userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get all Users
    getAllUsers: async () => {
        try {
            const response = await axios.get(`/user/getAllUsers`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get User by ID
    getUser: async (userId) => {
        try {
            const response = await axios.get(`/user/getUser/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update User
    updateUser: async (userId, newUserDetails) => {
        try {
            const response = await axios.put(`/user/updateUser?id=${userId}`, newUserDetails);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update Profile
    updateProfile: async (userId, newUserDetails) => {
        try {
            const response = await axios.put(`/user/updateProfile?id=${userId}`, newUserDetails);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Delete User
    deleteUser: async (userId) => {
        try {
            const response = await axios.delete(`/user/deleteUser/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Register
    registerUser: async (userData) => {
        try {
            const response = await axios.post(`/user/register`, userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Login
    loginUser: async (username, password) => {
        try {
            const response = await axios.post(`/user/login`, { username, password });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
};

export default UserService;
