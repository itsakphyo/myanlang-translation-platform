// import React from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Avatar,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
// } from '@mui/material';
// import {
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Person as PersonIcon,
//   MonetizationOn as MonetizationOnIcon,
//   AccountBalanceWallet as WalletIcon,
//   PendingActions as PendingActionsIcon,
// } from '@mui/icons-material';
// import { useCurrentUser } from '@/hooks/useAuth';

// const UserProfile = () => {
//   const { data: user } = useCurrentUser();

//   // Show a loading state until the user data is available
//   if (!user) {
//     return (
//       <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <Typography variant="h6" color="textSecondary">
//           Loading user information...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ width: '100%', backgroundColor: '#f5f5f5',     minHeight: '100vh', height: 'auto',}}>
//       {/* Full-Width Header */}
//       <Box
//         sx={{
//           background: 'linear-gradient(135deg, #2196F3 30%, #21CBF3 90%)',
//           height: 150,
//           width: '100%',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           flexDirection: 'column',
//         }}
//       >
//         <Typography
//           variant="h4"
//           align="center"
//           sx={{
//             fontWeight: 700,
//             mb: 1,
//             color: '#FFFFFF',
//             textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
//           }}
//         >
//           {user.full_name}
//         </Typography>
//         <Typography
//           variant="subtitle1"
//           align="center"
//           sx={{
//             color: '#E0E0E0',
//             fontStyle: 'italic',
//             textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
//           }}
//         >
//           User ID: {user.freelancer_id}
//         </Typography>
//       </Box>

//       {/* Profile Information */}
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <List sx={{ width: '100%', mx: 'auto' }}>
//           {/* Email */}
//           <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <EmailIcon color="primary" />
//             </ListItemIcon>
//             <ListItemText primary="Email" secondary={user.email} />
//           </ListItem>
//           <Divider component="li" />

//           {/* Age */}
//           <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <PersonIcon color="primary" />
//             </ListItemIcon>
//             <ListItemText primary="Age" secondary={user.age} />
//           </ListItem>
//           <Divider component="li" />

//           {/* Phone Number */}
//           <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <PhoneIcon color="primary" />
//             </ListItemIcon>
//             <ListItemText
//               primary="Phone Number"
//               secondary={user.phone_number || 'Not provided'}
//             />
//           </ListItem>
//           <Divider component="li" />

//           {/* Total Earnings */}
//           <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <MonetizationOnIcon color="primary" />
//             </ListItemIcon>
//             <ListItemText primary="Total Earnings" secondary={`$${user.total_earnings}`} />
//           </ListItem>
//           <Divider component="li" />

//           {/* Total Withdrawn */}
//           <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <WalletIcon color="primary" />
//             </ListItemIcon>
//             <ListItemText primary="Total Withdrawn" secondary={`$${user.total_withdrawn}`} />
//           </ListItem>
//           <Divider component="li" />

//           {/* Current Balance */}
//           <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <WalletIcon color="primary" />
//             </ListItemIcon>
//             <ListItemText primary="Current Balance" secondary={`$${user.current_balance}`} />
//           </ListItem>
//           <Divider component="li" />

//           {/* Pending Withdrawal */}
//           <ListItem sx={{ py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }}>
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <PendingActionsIcon color="primary" />
//             </ListItemIcon>
//             <ListItemText
//               primary="Pending Withdrawal"
//               secondary={`$${user.pending_withdrawal}`}
//             />
//           </ListItem>
//         </List>
//       </Container>
//     </Box>
//   );
// };

// export default UserProfile;
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalanceWallet as WalletIcon,
  PendingActions as PendingActionsIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { useCurrentUser } from '@/hooks/useAuth';

const UserProfile = () => {
  const { data: user } = useCurrentUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Show a loading state until the user data is available
  if (!user) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.palette.background.default
      }}>
        <Typography variant="h6" color="textSecondary">
          Loading user information...
        </Typography>
      </Box>
    );
  }

  // Generate avatar from user's name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Info items for personal details
  const personalInfo = [
    { icon: <EmailIcon />, label: "Email", value: user.email },
    { icon: <PersonIcon />, label: "Age", value: user.age },
    { icon: <PhoneIcon />, label: "Phone", value: user.phone_number || 'Not provided' },
    { icon: <BadgeIcon />, label: "User ID", value: user.freelancer_id },
  ];

  // Financial stats cards
  const financialStats = [
    { 
      icon: <MonetizationOnIcon fontSize="large" />, 
      label: "Total Earnings", 
      value: `$${user.total_earnings}`,
      color: "#4caf50"
    },
    { 
      icon: <WalletIcon fontSize="large" />, 
      label: "Total Withdrawn", 
      value: `$${user.total_withdrawn}`,
      color: "#4caf50"
    },
    { 
      icon: <WalletIcon fontSize="large" />, 
      label: "Current Balance", 
      value: `$${user.current_balance}`,
      color: "#2196f3"
    },
    { 
      icon: <PendingActionsIcon fontSize="large" />, 
      label: "Pending Withdrawal", 
      value: `$${user.pending_withdrawal}`,
      color: "#ff9800"
    },
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh',
      height: 'auto',
      backgroundColor: theme.palette.background.default,
      pb: 4
    }}>
      {/* Header with curved bottom */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
          borderRadius: '0 0 30px 30px',
          padding: { xs: 3, md: 5 },
          mb: { xs: 3, md: 5 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Avatar
                sx={{
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  bgcolor: theme.palette.primary.dark,
                  border: '4px solid white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontSize: { xs: 36, md: 42 },
                }}
              >
                {getInitials(user.full_name)}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={10} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: '#FFFFFF',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
                  mb: 1,
                }}
              >
                {user.full_name}
              </Typography>
              <Chip 
                label={`Freelancer`} 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  fontWeight: 500,
                  '& .MuiChip-label': { px: 2 }
                }} 
              />
            </Grid>
          </Grid>
        </Container>
      </Paper>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Personal Information Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}>
                  Personal Information
                </Typography>
                
                <Stack spacing={3}>
                  {personalInfo.map((item, index) => (
                    <Box key={index}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={2}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.contrastText,
                            borderRadius: '50%',
                            width: 40,
                            height: 40
                          }}>
                            {item.icon}
                          </Box>
                        </Grid>
                        <Grid item xs={10}>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {item.value}
                          </Typography>
                        </Grid>
                      </Grid>
                      {index < personalInfo.length - 1 && (
                        <Divider sx={{ mt: 3 }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Financial Information */}
          <Grid item xs={12} md={8}>
            <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}>
                  Financial Overview
                </Typography>
                
                <Grid container spacing={3}>
                  {financialStats.map((stat, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          height: '100%',
                          borderLeft: `4px solid ${stat.color}`,
                          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ color: stat.color, mr: 1 }}>
                            {stat.icon}
                          </Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            {stat.label}
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Additional card for future content */}
            {/* <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                  Account Activity
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Your account is in good standing. Last login was on {new Date().toLocaleDateString()}.
                </Typography>
                <Box sx={{ 
                  p: 3, 
                  backgroundColor: theme.palette.background.default, 
                  borderRadius: 2,
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" color="textSecondary">
                    Account created on {new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card> */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserProfile;