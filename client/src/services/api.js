import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const summarizeContent = async (payload) => {
  const response = await apiClient.post('/summarize', payload);
  return response.data;
};

export const getHistory = async () => {
  const response = await apiClient.get('/history');
  return response.data;
};

export const deleteHistory = async (id) => {
  const response = await apiClient.delete(`/history/${id}`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await apiClient.get('/analytics');
  return response.data;
};
