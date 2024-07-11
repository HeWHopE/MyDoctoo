import axios from 'axios';

export const API_URL = import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:3005';

export const instance = axios.create({ baseURL: API_URL, withCredentials: true });
