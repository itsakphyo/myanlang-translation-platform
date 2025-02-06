import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { LoginFormData, RegisterFormData, VerificationData } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL;

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