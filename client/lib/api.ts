import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (message: string): Promise<string> => {
  try {
    const res = await api.post('/chat/', { message });

    if (res.status !== 200) {
      console.error('Non-200 response from server:', res.data);
      throw new Error(res.data?.error || 'Failed to get a valid response from backend.');
    }

    return res.data.reply as string;
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw new Error(error?.response?.data?.detail || 'Failed to send message.');
  }
};
