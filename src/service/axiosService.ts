import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL  || 'http://localhost:3000/api';
if (!baseURL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;