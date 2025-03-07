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

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

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
        setErrorMessage("Login failed. Invalid response from server.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrorMessage("Invalid email or password");
        } else if (error.response?.status === 404) {
          setErrorMessage("User not found");
        } else {
          setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
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
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Password"
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
            {login.isPending ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            color="primary"
            sx={{ mt: 1 }}
            onClick={() => navigate('/forgot-password')}
            fullWidth
          >
            Forgot Password?
          </Button>
        </Box>
      </Box>
    </>
  );
}
