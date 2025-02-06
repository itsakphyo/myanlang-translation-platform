import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { VerificationData, PasswordResetData } from '@/types/auth';


const API_URL = import.meta.env.VITE_API_URL;

export const useForgotPassword = () => {
  const sendResetCode = useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post(`${API_URL}/password_reset/auth/send-code`, { email });
      return response.data;
    }
  });

  const verifyCode = useMutation({
    mutationFn: async (data: VerificationData) => {
      const response = await axios.post(`${API_URL}/password_reset/auth/verify-code`, data);
      return response.data;
    },
  });

  const resetPassword = useMutation({
    mutationFn: async (data: PasswordResetData) => {
      const response = await axios.post(`${API_URL}/password_reset/auth/reset-password`, data);
      return response.data;
    },
  });

  return {
    sendResetCode,
    verifyCode,
    resetPassword
  };
}; 