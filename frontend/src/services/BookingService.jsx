import axios from '../utils/AxiosConfig.jsx';

const BookingService = {
    // Create a new booking
    createBooking: async (bookingData) => {
        try {
            const response = await axios.post(`/booking/createBooking`, bookingData);
            return response.data;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get all bookings
    getAllBookings: async () => {
        try {
            // Fetching data from the backend
            const response = await axios.get(`/booking/getAllBookings`);
            console.log("Raw Booking Data:", response.data);
            // Mapping the response data to the required structure
            const mappedBookings = response.data.map((booking) => ({
                booking: booking.bookingID,
                customerName: booking.user.firstName || "Unknown",
                event: null,
                tickets: booking.ticketQuantity,
                totalPrice: booking.totalPrice,
                date: new Date(booking.dateTimeBooked),
                status: booking.status,
            }));
            console.log("Mapped Booking Data:", mappedBookings);
            return mappedBookings;
        } catch (error) {
            // Log any errors that occur during the API request
            console.error("Error fetching all bookings:", error);
            throw error.response ? error.response.data : error.message;
        }
    },
    


    // Get booking by ID
    getBooking: async (id) => {
        try {
            const response = await axios.get(`/booking/getBooking/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching booking with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update booking by ID
    updateBooking: async (id, updatedData) => {
        try {
            const response = await axios.put(`/booking/updateBooking?id=${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error(`Error updating booking with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Delete booking by ID
    deleteBooking: async (id) => {
        try {
            await axios.delete(`/booking/deleteBooking/${id}`);
        } catch (error) {
            console.error(`Error deleting booking with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },
};

export default BookingService;
