import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Alert,
  Checkbox
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { useAuth } from '@/hooks/useAuth';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getPasswordRequirements } from '@/utils/passwordRequirements';


const steps = ['Email Verification', 'Enter Code', 'Complete Registration'];

export default function Register() {
  const navigate = useNavigate();
  const { sendVerificationCode, verifyCode, register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    full_name: '',
    age: '',
    phone_number: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    age: '',
    password: ''
  });
  const [isChecked, setIsChecked] = useState(false);


  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await sendVerificationCode.mutateAsync(formData.email);
      setActiveStep(1);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setErrorMessage('User already exists. Please use a different email.');
        } else if (error.response?.status === 422) {
          setErrorMessage('Please enter a valid email address');
        } else {
          setErrorMessage('Failed to send verification code. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
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
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setErrorMessage('Invalid verification code. Please try again.');
      } else {
        setErrorMessage('Verification failed. Please try again.');
      }
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain a number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain a special character';
    return '';
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    const age = parseInt(formData.age);
    const passwordError = validatePassword(formData.password);

    if (age < 18 || passwordError) {
      setErrors({
        age: age < 18 ? 'You must be at least 18 years old' : '',
        password: passwordError,
      });
      return;
    }
    if (!isChecked) {
      setErrorMessage('You must agree to the terms and conditions');
      return;
    }

    try {
      await register.mutateAsync({
        full_name: formData.full_name,
        email: formData.email,
        age: age,
        phone_number: formData.phone_number,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const VerificationCodeInput = ({ onChange }: { onChange: (value: string) => void }) => {
    const [digits, setDigits] = useState<string[]>(Array(5).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [submittedCode, setSubmittedCode] = useState('');

    const handleInput = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const digit = e.target.value.slice(-1).replace(/[^0-9]/g, '');
      const newDigits = [...digits];
      newDigits[index] = digit;
      setDigits(newDigits);

      if (digit && index < 4) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
    };

    const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 0);
      }
    };

    useEffect(() => {
      const currentCode = digits.join('')
      if (digits.every(digit => digit !== '')) {
        if (currentCode !== submittedCode) {
          setSubmittedCode(currentCode);
          onChange(currentCode);
        }
      } else if (submittedCode !== '') {
        setSubmittedCode('')
      }
    }, [digits, onChange, submittedCode]);

    return (
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 2 }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <TextField
            key={index}
            inputRef={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            value={digits[index] || ''}
            onChange={handleInput(index)}
            onKeyDown={handleKeyDown(index)}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: '1.5rem',
                padding: '8px',
                width: '40px',
                height: '40px',
              },
            }}
          />
        ))}
      </Stack>
    );
  };


  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {errorMessage && (
        <Box sx={{ display: "flex", justifyContent: 'center', marginBottom: "10px" }}>
          <Alert severity="error" >{errorMessage}</Alert>
        </Box>
      )}
      {activeStep === 0 && (
        <Box component="form" onSubmit={handleEmailSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          {/* Add your CAPTCHA component here */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={sendVerificationCode.isPending}
          >
            Send Verification Code
          </Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <Typography align="center" sx={{ mb: 2 }}>
            Enter the verification code sent to your email
          </Typography>
          <VerificationCodeInput
            onChange={(value) => handleCodeVerification(value)}
          />
        </Box>
      )}

      {activeStep === 2 && (
        <Box component="form" onSubmit={handleRegistration}>
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Age"
            type="number"
            margin="normal"
            value={formData.age}
            onChange={(e) => {
              const age = parseInt(e.target.value);
              setFormData({ ...formData, age: e.target.value });
              setErrors(prev => ({
                ...prev,
                age: age < 18 ? 'You must be at least 18 years old' : ''
              }));
            }}
            slotProps= {{ htmlInput: { min: 18 }}}
            required
            error={!!errors.age}
            helperText={errors.age}
          />
          <MuiTelInput
            fullWidth
            label="Phone Number (optional)"
            value={formData.phone_number}
            onChange={(value) => setFormData({ ...formData, phone_number: value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => {
              const newPassword = e.target.value;
              setFormData({ ...formData, password: newPassword });
              setErrors(prev => ({
                ...prev,
                password: validatePassword(newPassword)
              }));
            }}
            required
            error={!!errors.password}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body1" sx={{ fontSize: '1rem', mb: 1, mt: 2 }}>
              Password must meet the following requirements:
            </Typography>
            <List dense sx={{ mt: 1, mb: 2 }}>
              {getPasswordRequirements(formData.password).map((requirement, index) => (
                <ListItem key={index} dense>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {requirement.checked ? (
                      requirement.valid ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : (
                        <CancelIcon color="error" fontSize="small" />
                      )
                    ) : null}
                  </ListItemIcon>
                  <ListItemText
                    primary={requirement.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: requirement.valid ? 'success.main' : 'text.secondary',
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <FormControlLabel control={<Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />} label="I agree to the terms and conditions" />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={register.isPending}
              >
                Complete Registration
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
