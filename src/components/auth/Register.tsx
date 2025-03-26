"use client";

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
  Checkbox, FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getPasswordRequirements } from '@/utils/passwordRequirements';
import { translations } from '@/contexts/translation';
import { useSystemLanguage } from '@/contexts/language-context';
import { Link as MuiLink } from "@mui/material";

export default function Register() {
  const navigate = useNavigate();
  const { sendVerificationCode, verifyCode, register, login } = useAuth();
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
  const currentYear = new Date().getFullYear();

  const { systemLanguage } = useSystemLanguage();

  const steps = [translations[systemLanguage].email_varification, translations[systemLanguage].enter_code, translations[systemLanguage].complete_registration];



  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await sendVerificationCode.mutateAsync(formData.email);
      setActiveStep(1);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setErrorMessage(translations[systemLanguage].user_already_exists);
        } else if (error.response?.status === 422) {
          setErrorMessage(translations[systemLanguage].please_enter_valid_email);
        } else {
          setErrorMessage(translations[systemLanguage].fail_to_send_verification_code);
        }
      } else {
        setErrorMessage(translations[systemLanguage].unexpected_error_occurred);
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
        setErrorMessage(translations[systemLanguage].invalid_verification_code);
      } else {
        setErrorMessage(translations[systemLanguage].verification_failed);
      }
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return translations[systemLanguage].password_characters;
    if (!/[A-Z]/.test(password)) return translations[systemLanguage].password_uppercase;
    if (!/[a-z]/.test(password)) return translations[systemLanguage].password_lowercase;
    if (!/[0-9]/.test(password)) return translations[systemLanguage].password_number;
    if (!/[!@#$%^&*]/.test(password)) return translations[systemLanguage].password_special;
    return '';
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    const age = parseInt(formData.age);
    const passwordError = validatePassword(formData.password);

    if (age < 18 || passwordError) {
      setErrors({
        age: age < 18 ? translations[systemLanguage].you_must_be_at_least_18_years_old : '',
        password: passwordError,
      });
      return;
    }
    if (!isChecked) {
      setErrorMessage(translations[systemLanguage].you_must_agree_to_terms);
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
            label={translations[systemLanguage].email}
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          {/* CAPTCHA component here */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={sendVerificationCode.isPending}
          >
            {translations[systemLanguage].sent_verification_code}
          </Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <Typography align="center" sx={{ mb: 2 }}>
            {translations[systemLanguage].enter_varification_code_sent_to_your_mail}
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
            label={translations[systemLanguage].full_name}
            margin="normal"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          <FormControl fullWidth margin="normal" error={!!errors.age}>
            <InputLabel>{translations[systemLanguage].y_o_b}</InputLabel>
            <Select
              value={formData.age.toString()}
              onChange={(e) => {
                const selectedYear = parseInt(e.target.value as string);
                const calculatedAge = currentYear - selectedYear;

                setFormData({ ...formData, age: selectedYear.toString() });

                setErrors(prev => ({
                  ...prev,
                  age: calculatedAge < 18 ? translations[systemLanguage].you_must_be_at_least_18_years_old : ''
                }));
              }}
              label={translations[systemLanguage].year_of_birth}
              required
            >
              {Array.from({ length: 100 }, (_, i) => currentYear - i).map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            {errors.age && <FormHelperText>{errors.age}</FormHelperText>}
          </FormControl>
          <TextField
            fullWidth
            label={translations[systemLanguage].password}
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
              {translations[systemLanguage].password_requirements}
            </Typography>
            <List dense sx={{ mt: 1, mb: 2 }}>
              {getPasswordRequirements(formData.password, systemLanguage).map((requirement, index) => (
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
            <FormControlLabel
              control={<Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />}
              label={
                <Typography variant="body2">
                  {translations[systemLanguage].agree_terms}
                </Typography>
              }
            />
            {/* <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Terms and Conditions
            </a>
            <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                Privacy Policy
            </a> */}
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              <MuiLink
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "primary.main", textDecoration: "underline", mb: 1 }}
              >
                Terms and Conditions
              </MuiLink>
              <MuiLink
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "primary.main", textDecoration: "underline" }}
              >
                Privacy Policy
              </MuiLink>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={register.isPending}
              >
                {translations[systemLanguage].register}
              </Button>
            </Box>
            <Box sx={{ height: 100 }} />

          </Box>
        </Box>
      )}
    </Box>
  );
}
