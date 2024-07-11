import { API_URL } from '@/api/axios.api';
import { io } from 'socket.io-client';

const socket = io(API_URL, {
  withCredentials: true,
});

export default socket;
