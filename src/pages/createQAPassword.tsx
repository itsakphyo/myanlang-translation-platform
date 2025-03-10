
import { Container, Typography, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { TextField, Button, Alert, ListItem, ListItemIcon, List, ListItemText } from '@mui/material';
import { getPasswordRequirements } from '@/utils/passwordRequirements';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useQA } from '@/hooks/useQA';


export default function CreatePassword() {
    const location = useLocation();
    const user_id = location.state?.userId;
    const { createQApassword } = useQA();

    const [formData, setFormData] = useState({
        qa_member_id: user_id,
        new_password: '',
        confirm_password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [_, setPasswordRequirements] = useState(getPasswordRequirements(''));

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
            createQApassword.mutate(formData);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || 'Failed to reset password');
            }
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setFormData({ ...formData, new_password: newPassword });
        setPasswordRequirements(getPasswordRequirements(newPassword));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header Section */}
            <Container maxWidth="sm">
                <Box sx={{ width: "100%", margin: "0 auto", mt: 8 }}>
                    <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
                        Create Your Own Password
                    </Typography>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
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
                            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                            required
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body1" sx={{ fontSize: '1rem', mb: 1, mt: 2 }}>
                                Password must meet the following requirements:
                            </Typography>

                            <List dense sx={{ mt: 1, mb: 2 }}>
                                {getPasswordRequirements(formData.new_password).map((requirement, index) => (
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

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                >
                                    Create Password
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                </Box>
            </Container>
            <Box
                component="footer"
                sx={{
                    py: 2,
                    textAlign: 'center',
                    bgcolor: 'grey.200',
                    mt: 'auto',
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} MyanLang Platform. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}
