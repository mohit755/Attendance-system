// requests.jsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

export const loginUser = async (credentials) => {
  console.log('Sending login credentials:', credentials);
  try {
    const response = await api.post('/api/auth/login', credentials);
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// requests.jsx
export const registerUser = async (credentials) => {
  console.log('Sending register credentials:', credentials);
  try {
    const response = await api.post('/api/auth/register', credentials);
    console.log('Register response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register error details:', error.response || error.message);
    throw error.response?.data || error;
  }
};