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
    getAllBookings: async (organizerID) => {
        try {
            // Fetching data from the backend
            const response = await axios.get(`/booking/getAllBookings`);
            console.log("Raw Booking Data:", response.data);
    
            // Mapping the response data to the required structure
            const mappedBookings = response.data
                .filter((booking) => booking.ticket.event.organizer.organizerId === organizerID)
                .map((booking) => ({
                    bookingID: booking.bookingID,
                    customerName: `${booking.user.firstName} ${booking.user.lastName}` || "Unknown",
                    ticketName: booking.ticket.name,
                    ticketsQuantity: booking.ticketQuantity,
                    totalPrice: booking.ticket.price * booking.ticketQuantity,
                    dateBooked: booking.dateTimeBooked,
                    status: booking.status,
                    eventName: booking.ticket.event.name,
                    eventID: booking.ticket.event.eventId,
                }));
    
            console.log("Mapped Booking Data:", mappedBookings);
            return mappedBookings;
        } catch (error) {
            // Log any errors that occur during the API request
            console.error("Error fetching all bookings:", error);
            throw error.response ? error.response.data : error.message;
        }
    },
    
    //get bookings if status is Confirmed
    getPaidBookings: async (organizerID) => {
        try {
            const response = await axios.get(`/booking/getAllBookings`);
            console.log("Raw Booking Data:", response.data);

            const confirmedBookings = response.data
                .filter((booking) => booking.status.toLowerCase() === "paid" && booking.ticket.event.organizer.organizerId === organizerID)
                .map((booking) => ({
                    bookingID: booking.bookingID,
                    customerName: `${booking.user.firstName} ${booking.user.lastName}` || "Unknown",
                    ticketName: booking.ticket.name,
                    ticketsQuantity: booking.ticketQuantity,
                    totalPrice: booking.ticket.price * booking.ticketQuantity,
                    dateBooked: booking.dateTimeBooked,
                    status: booking.status,
                    eventName: booking.ticket.event.name,
                    eventID: booking.ticket.event.name,
                }));
    
            console.log("Mapped Confirmed Booking Data:", confirmedBookings);
            return confirmedBookings;
        } catch (error) {
            // Log any errors that occur during the API request
            console.error("Error fetching confirmed bookings:", error);
            throw error.response ? error.response.data : error.message;
        }
    },
    
    //get bookings if status is Pending
    getPendingBookings: async (organizerID) => {
        try {
            const response = await axios.get(`/booking/getAllBookings`);
            console.log("Raw Booking Data:", response.data);
            
            const pendingBookings = response.data
                .filter((booking) => booking.status.toLowerCase() === "pending" && booking.ticket.event.organizer.organizerId === organizerID)
                .map((booking) => ({
                    bookingID: booking.bookingID,
                    customerName: `${booking.user.firstName} ${booking.user.lastName}` || "Unknown",
                    ticketName: booking.ticket.name,
                    ticketsQuantity: booking.ticketQuantity,
                    totalPrice: booking.ticket.price * booking.ticketQuantity,
                    dateBooked: booking.dateTimeBooked,
                    status: booking.status,
                    eventID: booking.ticket.event.eventID,
                    eventName: booking.ticket.event.name,
                }));
    
            console.log("Mapped Confirmed Booking Data:", pendingBookings);
            return pendingBookings;
        } catch (error) {
            // Log any errors that occur during the API request
            console.error("Error fetching pending bookings:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get all bookings by EventId
    getAllBookingsByEventId: async (eventId) => {
        try {
            const response = await axios.get(`/booking/getAllBookings`);
            console.log("Raw Booking Data:", response.data);

            const mappedBookings = response.data
                .filter((booking) => booking.ticket.event.eventId === eventId)
                .map((booking) => ({
                    bookingID: booking.bookingID,
                    customerName: `${booking.user.firstName} ${booking.user.lastName}` || "Unknown",
                    ticketName: booking.ticket.name,
                    ticketsQuantity: booking.ticketQuantity,
                    totalPrice: booking.ticket.price * booking.ticketQuantity,
                    dateBooked: booking.dateTimeBooked,
                    status: booking.status,
                    eventName: booking.ticket.event.name,
                    eventID: booking.ticket.event.eventId,
                }));

            console.log("Mapped Booking Data:", mappedBookings);
            return mappedBookings;
        } catch (error) {
            console.error("Error fetching all bookings by EventId:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get paid bookings by EventId
    getPaidBookingsByEventId: async (eventId) => {
        try {
            const response = await axios.get(`/booking/getAllBookings`);
            console.log("Raw Booking Data:", response.data);

            const confirmedBookings = response.data
                .filter((booking) => booking.status.toLowerCase() === "paid" && booking.ticket.event.eventId === eventId)
                .map((booking) => ({
                    bookingID: booking.bookingID,
                    customerName: `${booking.user.firstName} ${booking.user.lastName}` || "Unknown",
                    ticketName: booking.ticket.name,
                    ticketsQuantity: booking.ticketQuantity,
                    totalPrice: booking.ticket.price * booking.ticketQuantity,
                    dateBooked: booking.dateTimeBooked,
                    status: booking.status,
                    eventName: booking.ticket.event.name,
                    eventID: booking.ticket.event.eventId,
                }));

            console.log("Mapped Confirmed Booking Data:", confirmedBookings);
            return confirmedBookings;
        } catch (error) {
            console.error("Error fetching paid bookings by EventId:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get pending bookings by EventId
    getPendingBookingsByEventId: async (eventId) => {
        try {
            const response = await axios.get(`/booking/getAllBookings`);
            console.log("Raw Booking Data:", response.data);

            const pendingBookings = response.data
                .filter((booking) => booking.status.toLowerCase() === "pending" && booking.ticket.event.eventId === eventId)
                .map((booking) => ({
                    bookingID: booking.bookingID,
                    customerName: `${booking.user.firstName} ${booking.user.lastName}` || "Unknown",
                    ticketName: booking.ticket.name,
                    ticketsQuantity: booking.ticketQuantity,
                    totalPrice: booking.ticket.price * booking.ticketQuantity,
                    dateBooked: booking.dateTimeBooked,
                    status: booking.status,
                    eventID: booking.ticket.event.eventId,
                    eventName: booking.ticket.event.name,
                }));

            console.log("Mapped Pending Booking Data:", pendingBookings);
            return pendingBookings;
        } catch (error) {
            console.error("Error fetching pending bookings by EventId:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get booking by ID
    getBookingById: async (id) => {
        try {
            const response = await axios.get(`/booking/getBooking/${id}`);
            console.log("Bookingid: ", response.data);
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
    updateTicketQuantity: async (id) => {
        try {
            const response = await axios.put(`/booking/updateTicketQuantity/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error updating booking quantity for ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    updateBookingStatus: async (id) => {
        try {
            const response = await axios.put(`/booking/updateStatus/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error updating booking status for ID ${id}:`, error);
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

    // Get Transaction History
    getTransactionHistory: async (userId) => {
        try {
            const response = await axios.get(`/booking/getTransactionHistory/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching transaction history for user with ID ${userId}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Create Booking with userId and ticketId
    createBookingByUserAndTicket: async (userId, ticketId, bookingData) => {
        try {
            const response = await axios.post(`/booking/createBookingByUserAndTicket?user_id=${userId}&ticket_id=${ticketId}`, bookingData);
            return response.data;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get All User Bookings
    getAllUserBookings: async (userId) => {
        try {
            const response = await axios.get(`/booking/getAllUserBookings/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching all bookings for user with ID ${userId}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Pay booking by ID
    payBooking: async (id) => {
        try {
            const response = await axios.put(`/booking/payBooking/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error paying for booking with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    getTotalPaidPriceSumByEvent: async (eventId) => {
        try {
            const response = await axios.get(`/booking/getTotalPaidPriceSumByEvent/${eventId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching total paid price sum by event:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get total paid ticket quantity sum by event ID
    getTotalPaidTicketQuantitySumByEvent: async (eventId) => {
        try {
            const response = await axios.get(`/booking/getTotalPaidTicketQuantitySumByEvent/${eventId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching total paid ticket quantity sum by event:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

};

export default BookingService;
