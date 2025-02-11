type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchApi(endpoint: string, options: RequestOptions) {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  if (response.statusText === 'No Content') {
    return { success: true };
  }

  return response.json();
}

export const api = {
  signin: (data: { name: string; password: string }) =>
    fetchApi('/api/auth/signin', { method: 'POST', body: data }),
    
  signup: (data: { name: string; password: string; role?: 'user' | 'admin' }) =>
    fetchApi('/api/auth/signup', { method: 'POST', body: data }),
    
  submitFeedback: (data: { text: string }) =>
    fetchApi('/api/feedback', { method: 'POST', body: data }),
    
  getUserFeedback: () =>
    fetchApi('/api/feedback/user', { method: 'GET' }),
    
  getAllFeedback: () =>
    fetchApi('/api/feedback/all', { method: 'GET' }),
    
  updateFeedback: (id: string, data: { text: string }) =>
    fetchApi(`/api/feedback/${id}`, { method: 'PUT', body: data }),
    
  deleteFeedback: (id: string) =>
    fetchApi(`/api/feedback/${id}`, { method: 'DELETE' }),
  
  getUsernameById: (userId: string) =>
    fetchApi(`/api/auth/username/${userId}`, { method: 'GET' }),
  adminDeleteFeedback: (id: string) =>
    fetchApi(`/api/feedback/admin/${id}`, { method: 'DELETE' }),
}; 