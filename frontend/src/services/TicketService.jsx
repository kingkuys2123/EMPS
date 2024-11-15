import axios from "../utils/AxiosConfig";

const TicketService = {
    // Get All Tickets
    getAllTickets: async () => {
        try {
            const response = await axios.get(`/ticket/getAllTickets`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all tickets:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Get Ticket by ID
    getTicketById: async (id) => {
        try {
            const response = await axios.get(`/ticket/getById/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ticket with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
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
};

export default TicketService;
