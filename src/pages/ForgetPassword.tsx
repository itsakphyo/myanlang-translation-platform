import React, { useState } from 'react';
import {
  AppBar,
  Box,
  TextField,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Container,
  Typography,
  ListItem,
  ListItemIcon,
  List,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { getPasswordRequirements } from '@/utils/passwordRequirements';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import VerificationCodeInput from '@/components/auth/VerificationCodeInput';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.png';

const steps = ['Email Verification', 'Enter Code', 'Reset Password'];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { sendResetCode, verifyCode, resetPassword } = useForgotPassword();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    new_password: '',
    confirm_password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [_, setPasswordRequirements] = useState(getPasswordRequirements(''));

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await sendResetCode.mutateAsync(formData.email);
      setActiveStep(1);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || 'Failed to send reset code'
        );
      }
    }
  };

  const handleCodeVerification = async (code: string) => {
    setErrorMessage('');
    try {
      await verifyCode.mutateAsync({
        email: formData.email,
        code: parseInt(code),
      });
      setActiveStep(2);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || 'Invalid code'
        );
      }
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.new_password !== formData.confirm_password) {
      setErrorMessage('Passwords do not match');
      return;
    }

    const passwordValidation = getPasswordRequirements(formData.new_password);
    setPasswordRequirements(passwordValidation);

    if (passwordValidation.some((req) => !req.valid)) {
      setErrorMessage('Password does not meet the requirements');
      return;
    }

    try {
      await resetPassword.mutateAsync({
        email: formData.email,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });
      navigate('/auth');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || 'Failed to reset password'
        );
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, new_password: newPassword });
    setPasswordRequirements(getPasswordRequirements(newPassword));
  };

  return (
    <>
      {/* Header Section */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }} elevation={1}>
        <Toolbar>
          <img
            src={logo}
            alt="MyanLang logo"
            style={{ height: '40px', marginLeft: '10px' }}
            onClick={() => navigate('/auth')}
          />
          <Typography variant="h6" component="div" sx={{ marginLeft: 2 }}>
            MyanLang Platform
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Forgot Password Content */}
      <Container maxWidth="sm">
        <Box sx={{ width: '100%', margin: '0 auto', mt: 8 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box component="form" onSubmit={handleEmailSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
                  Send Verification Code
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ my: 2 }}>
              <VerificationCodeInput onChange={handleCodeVerification} />
            </Box>
          )}

          {activeStep === 2 && (
            <Box component="form" onSubmit={handlePasswordReset}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                margin="normal"
                value={formData.new_password}
                onChange={handlePasswordChange}
                required
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                margin="normal"
                value={formData.confirm_password}
                onChange={(e) =>
                  setFormData({ ...formData, confirm_password: e.target.value })
                }
                required
              />

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="body1"
                  sx={{ fontSize: '1rem', mb: 1, mt: 2 }}
                >
                  Password must meet the following requirements:
                </Typography>

                <List dense sx={{ mt: 1, mb: 2 }}>
                  {getPasswordRequirements(formData.new_password).map(
                    (requirement, index) => (
                      <ListItem key={index} dense>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {requirement.checked ? (
                            requirement.valid ? (
                              <CheckCircleIcon
                                color="success"
                                fontSize="small"
                              />
                            ) : (
                              <CancelIcon color="error" fontSize="small" />
                            )
                          ) : null}
                        </ListItemIcon>
                        <ListItemText
                          primary={requirement.text}
                          sx={{
                            '& .MuiListItemText-primary': {
                              color: requirement.valid
                                ? 'success.main'
                                : 'text.secondary',
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      </ListItem>
                    )
                  )}
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
                    Reset Password
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}
