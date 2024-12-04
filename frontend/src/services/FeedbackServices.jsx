import axios from '../utils/AxiosConfig.jsx';

const FeedbackService = {
  // Create a new feedback
  createFeedback: async (feedback) => {
    try {
      const response = await axios.post(`/feedback/postFeedback`, feedback);
      return response.data;
    } catch (error) {
      console.error("Error creating feedback:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get all feedbacks
  getAllFeedback: async () => {
    try {
      const response = await axios.get(`/feedback/getAllFeedbacks`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all feedback:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get feedback by ID
  getFeedback: async () => {
    try {
      const response = await axios.get(`/feedback/getFeedback`);
      return response.data;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Put feedback by ID
  updateFeedback: async (id, feedback) => {
    try {
      const response = await axios.put(`/feedback/putFeedback?id=${id}`, feedback);
      return response.data;
    } catch (error) {
      console.error(`Error updating feedback with ID ${id}:`, error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Delete feedback by ID
  deleteFeedback: async (id) => {
    try {
      await axios.delete(`/feedback/deleteFeedback/${id}`);
    } catch (error) {
      console.error(`Error deleting feedback with ID ${id}:`, error);
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default FeedbackService;
