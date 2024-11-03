import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user';

const UserService = {
    // Create User
    createUser: async (userData, token) => {
        try {
            const response = await axios.post(`${API_URL}/createUser`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get all Users
    getAllUsers: async (token) => {
        try {
            const response = await axios.get(`${API_URL}/getAllUsers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get User by ID
    getUser: async (userId, token) => {
        try {
            const response = await axios.get(`${API_URL}/getUser/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update User
    updateUser: async (userId, token, newUserDetails) => {
        try {
            const response = await axios.put(`${API_URL}/updateUser?id=${userId}`, newUserDetails, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update Profile
    updateProfile: async (userId, token, newUserDetails) => {
        try {
            const response = await axios.put(`${API_URL}/updateProfile?id=${userId}`, newUserDetails, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Delete User
    deleteUser: async (userId, token) => {
        try {
            const response = await axios.delete(`${API_URL}/deleteUser/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Register
    registerUser: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Login
    loginUser: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
};

export default UserService;
