import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (message: string) => {
  const res = await api.post('/chat/', { message });
  return res.data.reply as string;
};