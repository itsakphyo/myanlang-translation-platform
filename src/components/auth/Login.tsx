"use client";

import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Alert,
  GlobalStyles
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { translations } from '@/contexts/translation';
import { useSystemLanguage } from '@/contexts/language-context';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const { systemLanguage } = useSystemLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim()) {
      setErrorMessage("Please provide an email address");
      return;
    }
  
    try {
      const response = await login.mutateAsync(formData);
      
      if (response.access_token && response.token_type) {
        localStorage.setItem('userName', response.full_name);
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('userType', response.user_type);
        localStorage.setItem('userId', response.userId);
        
        if (response.user_type === "admin") {
          navigate('/admin-dashboard');
        } else if (response.user_type === "freelancer") {
          navigate('/dashboard');
        } else if (response.user_type === "qa_member") {
          // Check the initial_password flag for qa_member
          if (response.initial_password) {
            navigate('/create-password', { 
              state: { userId: response.user_id } 
            }); 
          } else {
            navigate('/qa-dashboard');
          }
        }
      } else {
        setErrorMessage(translations[systemLanguage].login_failed_invalid_response_from_server);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrorMessage(translations[systemLanguage].invalid_email_or_password);
        } else if (error.response?.status === 404) {
          setErrorMessage(translations[systemLanguage].user_not_found);
        } else {
          setErrorMessage(error.response?.data?.message || translations[systemLanguage].login_failed_please_try_again);
        }
      } else {
        setErrorMessage(translations[systemLanguage].unexpected_error_occurred);
      }
    }
  };
  
  return (
    <>
      {/* GlobalStyles will override the autofill styling */}
      <GlobalStyles 
        styles={{
          'input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #fff inset',
            WebkitTextFillColor: '#000',
            transition: 'background-color 5000s ease-in-out 0s'
          }
        }}
      />

      <Box sx={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
        <Box component="form" onSubmit={handleSubmit}>
          {errorMessage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Alert severity="error">{errorMessage}</Alert>
            </Box>
          )}
          <TextField
            fullWidth
            label={translations[systemLanguage].email}
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label={translations[systemLanguage].password}
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={login.isPending} 
          >
            {login.isPending ? 'Logging in...' : translations[systemLanguage].login}
          </Button>
          <Button
            color="primary"
            sx={{ mt: 1 }}
            onClick={() => navigate('/forgot-password')}
            fullWidth
          >
            {translations[systemLanguage].forgot_password}
          </Button>
        </Box>
      </Box>
    </>
  );
}
