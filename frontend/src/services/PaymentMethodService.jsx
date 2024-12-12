import axios from '../utils/AxiosConfig.jsx';

const PaymentMethodService = {
    createPaymentMethod: async (paymentMethod) => {
        try {
            const response = await axios.post('/payment_method/createPaymentMethod', paymentMethod);
            return response.data;
        } catch (error) {
            console.error("Error creating payment method:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    getAllPaymentMethods: async () => {
        try {
            const response = await axios.post('/payment_method/getAllPaymentMethods');
            return response.data;
        } catch (error) {
            console.error("Error fetching all payment methods:", error);
            throw error.response ? error.response.data : error.message;
        }
    },

    getPaymentMethod: async (id) => {
        try {
            const response = await axios.post(`/payment_method/getPaymentMethod/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching payment method with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    updatePaymentMethod: async (id, updatedPaymentMethod) => {
        try {
            const response = await axios.put('/payment_method/updatePaymentMethod', updatedPaymentMethod, {
                params: { id }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating payment method with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    deletePaymentMethod: async (id) => {
        try {
            const response = await axios.delete(`/payment_method/deletePaymentMethod/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting payment method with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    userAddPaymentMethod: async (userId, paymentMethod) => {
        try {
            const response = await axios.post(`/payment_method/userAddPaymentMethod/${userId}`, paymentMethod);
            return response.data;
        } catch (error) {
            console.error(`Error adding payment method for user with ID ${userId}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },

    getUserPaymentMethod: async (id) => {
        try {
            const response = await axios.get(`/payment_method/getUserPaymentMethod/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn(`Payment method with ID ${id} not found.`);
                return null; // or handle it as needed
            } else {
                console.error(`Error fetching user payment method with ID ${id}:`, error);
                throw error.response ? error.response.data : error.message;
            }
        }
    },

    updateUserPaymentMethod: async (id, updatedPaymentMethod) => {
        try {
            const response = await axios.put(`/payment_method/updateUserPaymentMethod/${id}`, updatedPaymentMethod);
            return response.data;
        } catch (error) {
            console.error(`Error updating user payment method with ID ${id}:`, error);
            throw error.response ? error.response.data : error.message;
        }
    },
};

export default PaymentMethodService;