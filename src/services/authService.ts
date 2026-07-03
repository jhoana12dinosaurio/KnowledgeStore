import { postJson } from './api';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string;
};

type AuthResponse = {
  message?: string;
  token: string;
  user: AuthUser;
};

const persistSession = (data: AuthResponse) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('userName', data.user?.name || 'Usuario');
  localStorage.setItem('userRole', data.user?.role || 'student');
};

export const registerUser = async (name: string, email: string, password: string) => {
  const data = await postJson<AuthResponse>('/auth/register', { name, email, password });
  persistSession(data);
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const data = await postJson<AuthResponse>('/auth/login', { email, password });
  persistSession(data);
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
};
