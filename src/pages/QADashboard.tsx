import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  ThemeProvider,
  createTheme,
  Button,
  Box,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '@/assets/images/logo.png';
import { useTaskInfo } from "@/hooks/useTaskInfo";

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#00ACC1' },
    background: { default: '#f4f6f8' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function QADashboard() {
  const userName = localStorage.getItem('userName') || 'User';
  const navigate = useNavigate();
  const { data, isLoading, error } = useTaskInfo();

  // Extract task counts (default to 0 if data is not available yet)
  const avaliable_tasks = data?.task.total ?? 0;
  const assessment_tasks = data?.assessmenttask.total ?? 0;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/auth', { state: { logout: true } });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <Box
              component="img"
              src={logo}
              alt="MyanLang Logo"
              sx={{ height: 40, mr: 2 }}
            />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              MyanLang QA Dashboard
            </Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 'md',
            mt: 4,
            mb: 6,
          }}
        >
          <Typography variant="h4" sx={{ mb: 4 }}>
            Welcome, {userName}!
          </Typography>
          
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">Error: {error.message}</Typography>
          ) : (
            <>
              <Typography variant="body1" align="center" sx={{ maxWidth: 600, mb: 8 }}>
                As a valued member of the MyanLang QA team, your attention to detail is essential in ensuring the quality and accuracy of our text data collection.
              </Typography>

              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', mt: 4 }}>
                {/* Review Submission Tasks */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/qa-dashboard/review-task')}
                  sx={{
                    py: 2,
                    px: 4,
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 3,
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 5,
                      transform: 'scale(1.02)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'left', flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'common.white' }}>
                      Review Submission Tasks
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'grey.100', opacity: 0.95 }}>
                      Available for review
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'common.white',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 2
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {avaliable_tasks}
                    </Typography>
                  </Box>
                </Button>

                {/* Review Assessment Tasks */}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/qa-dashboard/review-task')}
                  sx={{
                    py: 2,
                    px: 4,
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 3,
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 5,
                      transform: 'scale(1.02)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'left', flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'common.white' }}>
                      Review Assessment Tasks
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'grey.100', opacity: 0.95 }}>
                      Pending assessments
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'common.white',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 2
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {assessment_tasks}
                    </Typography>
                  </Box>
                </Button>
              </Box>
            </>
          )}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2,
            textAlign: 'center',
            bgcolor: 'grey.200',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} MyanLang Platform. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
