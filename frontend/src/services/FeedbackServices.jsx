import axios from 'axios';

const API_URL = 'http://localhost:8080/api/feedback';
const FeedbackService = {
  createFeedback: async (feedback) => {
    return await axios.post(`${API_URL}/postFeedback`, feedback);
  },
  getAllFeedback: async () => {
    return await axios.get(`${API_URL}/getAllFeedback`);
  },
  getFeeback: async () => {
    return await axios.get(`${API_URL}/getFeedback`);
  },
  updateFeedback: async (id, feedback) => {
    return await axios.put(`${API_URL}/putFeedback?id=${id}`, feedback);
  },
  deleteFeedback: async (id) => {
    return await axios.delete(`${API_URL}/deleteFeedback/${id}`);
  },
};

export default FeedbackService; 
