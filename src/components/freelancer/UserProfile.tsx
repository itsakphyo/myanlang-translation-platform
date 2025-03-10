import React from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalanceWallet as WalletIcon,
  PendingActions as PendingActionsIcon,
} from '@mui/icons-material';
import { useCurrentUser } from '@/hooks/useAuth';

const UserProfile = () => {
  const { data: user } = useCurrentUser();

  // Show a loading state until the user data is available
  if (!user) {
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h6" color="textSecondary">
          Loading user information...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f5f5f5',     minHeight: '100vh', height: 'auto',}}>
      {/* Full-Width Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2196F3 30%, #21CBF3 90%)',
          height: 150,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: '#FFFFFF',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          {user.full_name}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            color: '#E0E0E0',
            fontStyle: 'italic',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
          }}
        >
          User ID: {user.freelancer_id}
        </Typography>
      </Box>

      {/* Profile Information */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <List sx={{ width: '100%', mx: 'auto' }}>
          {/* Email */}
          <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <EmailIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          <Divider component="li" />

          {/* Age */}
          <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Age" secondary={user.age} />
          </ListItem>
          <Divider component="li" />

          {/* Phone Number */}
          <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PhoneIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Phone Number"
              secondary={user.phone_number || 'Not provided'}
            />
          </ListItem>
          <Divider component="li" />

          {/* Total Earnings */}
          <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <MonetizationOnIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Total Earnings" secondary={`$${user.total_earnings}`} />
          </ListItem>
          <Divider component="li" />

          {/* Total Withdrawn */}
          <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <WalletIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Total Withdrawn" secondary={`$${user.total_withdrawn}`} />
          </ListItem>
          <Divider component="li" />

          {/* Current Balance */}
          <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <WalletIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Current Balance" secondary={`$${user.current_balance}`} />
          </ListItem>
          <Divider component="li" />

          {/* Pending Withdrawal */}
          <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PendingActionsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Pending Withdrawal"
              secondary={`$${user.pending_withdrawal}`}
            />
          </ListItem>
        </List>
      </Container>
    </Box>
  );
};

export default UserProfile;
