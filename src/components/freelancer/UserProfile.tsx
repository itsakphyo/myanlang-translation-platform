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

const user = {
  freelancer_id: 1,
  full_name: 'Aung Khant Phyo',
  email: 'itsakphyo@gmail.com',
  age: 18,
  phone_number: '+123456789',
  total_earnings: 1000,
  total_withdrawn: 500,
  current_balance: 500,
  pending_withdrawal: 200,
};

const UserProfile = () => {
  return (
    <Box sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
      {/* Full-Width Header */}
      <Box
        sx={{
          background:'linear-gradient(135deg, #2196F3 30%, #21CBF3 90%)',
          height: 200,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Avatar sx={{ bgcolor: 'white', width: 100, height: 100 }}>
          <PersonIcon sx={{ fontSize: 60, color: '#2196F3' }} />
        </Avatar>
      </Box>

      {/* Profile Information */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 1 }}>
          {user.full_name}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ mb: 2, color: 'text.secondary', fontStyle: 'italic' }}
        >
          Freelancer ID: {user.freelancer_id}
        </Typography>

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
