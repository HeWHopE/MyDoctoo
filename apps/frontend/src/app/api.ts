import createClient from 'openapi-fetch';
import type { paths } from '../api';

const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:3005',
  // credentials: import.meta.env.PROD ? 'same-origin' : 'include',
  credentials: 'include',
});

export default api;
