import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return true;
  } catch (error) {
    console.error('Error logging in:', error);
    return false;
  }
};