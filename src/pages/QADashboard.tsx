import { Box, Typography, Container } from '@mui/material';

export default function Dashboard() {
  const userName = localStorage.getItem('userName') || 'Stuff';

  return (
    <Container>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4">
          Hello, {userName}! 👋
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Welcome to your dashboard.
        </Typography>
      </Box>
    </Container>
  );
} 