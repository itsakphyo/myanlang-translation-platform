import { useState } from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

export default function Auth() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ width: '100%', mt: 4 }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <Box sx={{ mt: 4 }}>
          {tab === 0 ? <Login /> : <Register />} 
        </Box>
        <Box sx={{ mt: 30 }}>
        </Box>
      </Box>
    </Container>
  );
} 