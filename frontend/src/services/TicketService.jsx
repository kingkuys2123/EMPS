import axios from "../utils/AxiosConfig";

const TicketService = {

    // Get All Tickets
    getAllTickets: async () => {
        try {
            const response = await axios.get(`/ticket/getAllTickets`);
            console.log("Raw ticket Data:", response.data);

            // Filter and map the raw data
            const mappedTickets = response.data
                .filter((ticket) => ticket.isDeleted === 0) // Filter out deleted tickets
                .map((ticket) => ({
                    ticketId: ticket.ticketId, // Maps ticketId from raw data
                    name: ticket.name || "Unknown", // Maps name or defaults to "Unknown"
                    description: ticket.description || "No Description", // Maps description
                    type: ticket.type || "General", // Maps type
                    quantity: ticket.quantity || 0, // Maps quantity
                    price: ticket.price || 0, // Maps price
                    isAvailable: ticket.isAvailable, // Maps availability
                }));

            console.log("Mapped ticket Data:", mappedTickets);
            return mappedTickets;
        } catch (error) {
            console.error("Error fetching all tickets:", error);
            throw error.response ? error.response.data : error.message;
        }
    },
    

    // Get Ticket by ID
    getTicketById: async (id) => {
        try {
            const response = await axios.get(`/ticket/getAllTicketsFromOrganizer/${id}`);
            console.log(`Fetched ticket with ID ${id}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ticket with ID ${id}:`, error);
            throw error.response?.data || error.message;
        }
    },
    

    // Create Ticket
    createTicket: async (ticketData) => {
        try {
            const response = await axios.post(`/ticket/createTicket`, ticketData);
            return response.data;
        } catch (error) {
            console.error("Error creating ticket:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Update Ticket
    updateTicket: async (id, updatedTicketData) => {
        try {
            const response = await axios.put(`/ticket/updateTicket?id=${id}`, updatedTicketData);
            return response.data;
        } catch (error) {
            console.error(`Error updating ticket with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Delete Ticket
    deleteTicket: async (id) => {
        try {
            const response = await axios.delete(`/ticket/deleteTicket/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting ticket with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get Tickets by Event ID
    getTicketsByEventId: async (eventId) => {
        try {
            const response = await axios.get(`/ticket/getTicketsByEventId/${eventId}`);
            console.log(`Fetched tickets for event ID ${eventId}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching tickets for event ID ${eventId}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get Remaining Tickets by Event ID
    getRemainingTicketQuantity: async (ticketId) => {
        try {
            const response = await axios.get(`/ticket/getRemainingTicketQuantity/${ticketId}`);
            console.log(`Fetched remaining ticket quantity for ticket ID ${ticketId}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching remaining ticket quantity for ticket ID ${ticketId}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    }

};

export default TicketService;
