import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://hackathon-calendar.duckdns.org',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const ApiService = {
  get: <T>(url: string) => api.get<T>(url),
  post: <T>(url: string, data: unknown) => api.post<T>(url, data),
  put: <T>(url: string, data: unknown) => api.put<T>(url, data),
  delete: <T>(url: string) => api.delete<T>(url),
};

export type ApiResponse<T = any> =
  | { success: true; data: T }
  | { success: false; error: { message: string; status?: number; data?: any } };