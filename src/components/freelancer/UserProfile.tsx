import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
    <Container 
      maxWidth={false} 
      sx={{ py: 4, px: 1, backgroundColor: '#f5f5f5' }} 
    >
      <Grid container spacing={1}>
        {/* Detailed Information */}
        <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ mt: 1, mb: 1, fontWeight: 700, color: 'primary.main' }} 
          >
            {user.full_name}
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ mb: 1, color: 'text.secondary', fontStyle: 'italic' }} 
          >
            Freelancer ID: {user.freelancer_id}
          </Typography>
          <List sx={{ width: '90%', mx: 'auto' }}>
            {/* Email */}
            <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0', borderRadius: 2 } }}>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}> 
                <EmailIcon color="primary" sx={{ fontSize: 24 }} /> 
              </ListItemIcon>
              <ListItemText
                primary="Email"
                primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                secondary={user.email}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
            <Divider variant="inset" component="li" sx={{ mx: 0 }} />

            {/* Age */}
            <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0', borderRadius: 2 } }}> 
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <PersonIcon color="primary" sx={{ fontSize: 24 }} /> 
              </ListItemIcon>
              <ListItemText
                primary="Age"
                primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                secondary={user.age}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
            <Divider variant="inset" component="li" sx={{ mx: 0 }} />

            {/* Phone Number */}
            <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0', borderRadius: 2 } }}>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <PhoneIcon color="primary" sx={{ fontSize: 24 }} /> 
              </ListItemIcon>
              <ListItemText
                primary="Phone Number"
                primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                secondary={user.phone_number || 'Not provided'}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
            <Divider variant="inset" component="li" sx={{ mx: 0 }} />

            {/* Total Earnings */}
            <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0', borderRadius: 2 } }}> 
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <MonetizationOnIcon color="primary" sx={{ fontSize: 24 }} />
              </ListItemIcon>
              <ListItemText
                primary="Total Earnings"
                primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                secondary={`$${user.total_earnings}`}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
            <Divider variant="inset" component="li" sx={{ mx: 0 }} />

            {/* Total Withdrawn */}
            <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0', borderRadius: 2 } }}>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <WalletIcon color="primary" sx={{ fontSize: 24 }} />
              </ListItemIcon>
              <ListItemText
                primary="Total Withdrawn"
                primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                secondary={`$${user.total_withdrawn}`}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
            <Divider variant="inset" component="li" sx={{ mx: 0 }} />

            {/* Current Balance */}
            <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0', borderRadius: 2 } }}> 
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <WalletIcon color="primary" sx={{ fontSize: 24 }} /> 
              </ListItemIcon>
              <ListItemText
                primary="Current Balance"
                primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                secondary={`$${user.current_balance}`}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
            <Divider variant="inset" component="li" sx={{ mx: 0 }} />

            {/* Pending Withdrawal */}
            <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0', borderRadius: 2 } }}> 
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <PendingActionsIcon color="primary" sx={{ fontSize: 24 }} /> 
              </ListItemIcon>
              <ListItemText
                primary="Pending Withdrawal"
                primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                secondary={`$${user.pending_withdrawal}`}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;