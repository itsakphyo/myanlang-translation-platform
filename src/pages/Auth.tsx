import { useState } from 'react';
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
    <>
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
    </>
  );
}
