import React from 'react';
import { createTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { useNavigate } from 'react-router-dom';
import TranslationTaskPage from '@/components/freelancer/Tasks';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import PaymentIcon from '@mui/icons-material/Payment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import UserProfile from '@/components/freelancer/UserProfile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import { Box, Button  } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

export default function UserDashboard({ window }: { window?: () => Window }) {
  const theme = useTheme();
  const router = useDemoRouter('/dashboard');
  const currentSegment = router.pathname.split('/').pop() || 'job-dashboard';
  const navigate = useNavigate();

  const logoutAction = (
    <div
      onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        navigate('/auth', { state: { logout: true } });
      }}
      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}
    >
      <span style={{ marginLeft: 8 }}>Logout</span>
    </div>
  );

  function CustomToolbarActions() {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<TravelExploreIcon sx={{ fontSize: '1.5rem' }} />}
          onClick={() => navigate('/explore-task')}
          sx={{
            borderRadius: '24px',
            textTransform: 'none',
            padding: '10px 20px',
            background: 'linear-gradient(45deg,rgb(23, 170, 36) 30%,rgb(54, 196, 99) 90%)',
            color: 'white',
            boxShadow: '0 3px 5px 2px rgba(93, 247, 144, 0.3)',
            transition: 'transform 0.2s ease-in-out, background 0.2s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(45deg,rgb(33, 243, 128) 30%,rgb(116, 231, 141) 90%)',
              transform: 'scale(1.05)',
            },
          }}
        >
          Explore Tasks &amp; Participate
        </Button>
      </Box>

    );
  }

  const navigation: Navigation = [
    {
      kind: 'page',
      segment: 'request-payment',
      title: 'Request Payment',
      icon: <PaymentIcon />,
    },
    {
      kind: 'page',
      segment: 'report-issues',
      title: 'Report Issues',
      icon: <ReportProblemIcon />,
    },
    {
      kind: 'page',
      icon: <LogoutIcon />,
      action: logoutAction,
    },
  ];

  const demoTheme = createTheme({
    zIndex: {
      drawer: 1301,
    },
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  const renderContent = () => {
    switch (currentSegment) {
      case 'request-payment':
        return <div>Withdrawal Payment</div>;
      case 'report-issues':
        return <div>Report Issues</div>;
      case 'other':
        return <div>Task</div>;
      default:
        return <UserProfile />;
    }
  };

  return (
    <AppProvider
      navigation={navigation}
      router={router}
      branding={{
        logo: (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <AccountCircleIcon
              style={{ fontSize: 40, color: theme.palette.primary.main, marginLeft: '10px' }}
            />
          </Box>
        ),
        title: '',
        homeUrl: '/admin-dashboard',
      }}
      theme={demoTheme}
      window={window ? window() : undefined}
      sx={{ zIndex: 1301 }}
    >
      <DashboardLayout
        slots={{ toolbarActions: CustomToolbarActions }}
        sx={{
          '& .MuiDrawer-paper': {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          },
          '& .MuiList-root': {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          },
          '& .MuiList-root > .MuiListItem-root:last-child': {
            marginTop: 'auto',
          },
        }}
      >
        {renderContent()}
      </DashboardLayout>
    </AppProvider>
  );
}
