import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LoginFormData, RegisterFormData, VerificationData } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL;

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      const response = await axios.get(`${API_URL}/register/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!localStorage.getItem('token'),
    retry: false,
  });
};

export const useAuth = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  const sendVerificationCode = useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post(`${API_URL}/register/auth/send-code`, { email });
      return response.data;
    },
  });

  const verifyCode = useMutation({
    mutationFn: async (data: VerificationData) => {
      const response = await axios.post(`${API_URL}/register/auth/verify-code`, data);
      return response.data;
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await axios.post(`${API_URL}/register/auth/register`, data);
      return response.data;
    },
  });

  const login = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await axios.post(`${API_URL}/register/auth/login`, data);
      return response.data; 
    },
  });

  return {
    sendVerificationCode,
    verifyCode,
    register,
    login,
    isAuthenticated
  };
}; 