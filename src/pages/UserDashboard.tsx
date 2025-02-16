import { createTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import logo from '@/assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import TranslationTaskPage from '@/components/freelancer/Tasks';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import PaymentIcon from '@mui/icons-material/Payment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import UserProfile from '@/components/freelancer/UserProfile';

export default function DashboardLayoutBranding({ window }: { window?: () => Window }) {
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
      {/* <LogoutIcon /> */}
      <span style={{ marginLeft: 8 }}>Logout</span>
    </div>
  );

  const navigation: Navigation = [
    {
      kind: 'page',
      segment: 'task',
      title: 'Tasks',
      icon: <SubtitlesIcon />,
    },
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
      case 'task':
        return <TranslationTaskPage />;
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
          <img
            src={logo}
            alt="MyanLang logo"
            style={{ height: '40px', marginLeft: '10px' }}
          />
        ),
        title: '',
        homeUrl: '/admin-dashboard',
      }}
      theme={demoTheme}
      window={window ? window() : undefined}
      sx={{ zIndex: 1301 }}
    >
      <DashboardLayout
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
