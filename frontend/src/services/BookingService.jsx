import axios from 'axios';

const API_URL = 'http://localhost:8080/api/booking';

const BookingService = {
    // Create a new booking
    createBooking: async (bookingData, token) => {
        try {
            const response = await axios.post(`${API_URL}/createBooking`, bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
        }
    },

    // Get all bookings
    getAllBookings: async (token) => {
        try {
            const response = await axios.get(`${API_URL}/getAllBookings`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            throw error;
        }
    },

    // Get booking by ID
    getBooking: async (id, token) => {
        try {
            const response = await axios.get(`${API_URL}/getBooking/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching booking with ID ${id}:`, error);
            throw error;
        }
    },

    // Update booking by ID
    updateBooking: async (id, updatedData, token) => {
        try {
            const response = await axios.put(`${API_URL}/updateBooking?id=${id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating booking with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete booking by ID
    deleteBooking: async (id, token) => {
        try {
            await axios.delete(`${API_URL}/deleteBooking/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error(`Error deleting booking with ID ${id}:`, error);
            throw error;
        }
    },
};

export default BookingService;
