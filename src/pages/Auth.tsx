"use client";

import React, { useState } from 'react';
import { AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import logo from '@/assets/images/logo.png';

export default function Auth() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header Section */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }} elevation={1}>
        <Toolbar>
          <img
            src={logo}
            alt="MyanLang logo"
            style={{ height: '40px', marginLeft: '10px' }}
          />
          <Typography variant="h6" component="div" sx={{ marginLeft: 2 }}>
            MyanLang Platform
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Login/Register Content */}
      <Container maxWidth="sm">
        <Box sx={{ width: '100%', mt: 4 }}>
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          <Box sx={{ mt: 4 }}>
            {tab === 0 ? <Login /> : <Register />}
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
