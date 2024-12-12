import axios from '../utils/AxiosConfig.jsx';

const FeedbackService = {
  // Create a new feedback
  createFeedback: async (feedback) => {
    try {
      const response = await axios.post(`/feedback/createFeedback`, feedback);
      return response.data;
    } catch (error) {
      console.error("Error creating feedback:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  createFeedbackByUserAndEvent: async (user_id, event_id, feedback) => {
    try{
      const response = await axios.post(`/feedback/createFeedbackByUserAndEvent?user_id=${user_id}&event_id=${event_id}`, feedback);
      return response.data;
    } catch (error) {
      console.error("Error creating feedback by user and event:", error);
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

  // Get feedbacks by event ID
  getFeedbacksByEvent: async (id) => {
    try {
      const response = await axios.get(`/feedback/getFeedbacksByEvent?id=${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedbacks for event with ID ${id}:`, error);
      throw error.response ? error.response.data : error.message;
    }
  },

  getFeedbackByUserAndEvent: async (user_id, event_id) => {
    try {
      const response = await axios.get(`/feedback/getFeedbackByUserAndEvent?user_id=${user_id}&event_id=${event_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedback for user ID ${userId} and event ID ${eventId}:`, error);
      throw error.response ? error.response.data : error.message;
    }
  },

  updateFeedbackByUserAndEvent: async (user_id, event_id, feedback) => {
    try {
      const response = await axios.put(`/feedback/updateFeedbackByUserAndEvent?user_id=${user_id}&event_id=${event_id}`, feedback);
      return response.data;
    } catch (error) {
      console.error(`Error updating feedback for user ID ${user_id} and event ID ${event_id}:`, error);
      throw error.response ? error.response.data : error.message;
    }
  },

  findByUserIdAndEventId: async (user_id, event_id) => {
    try {
      const response = await axios.get(`/feedback/findByUserIdAndEventId?user_id=${user_id}&event_id=${event_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedback for user ID ${user_id} and event ID ${event_id}:`, error);
      throw error.response ? error.response.data : error.message;
    }
  }

};

export default FeedbackService;
