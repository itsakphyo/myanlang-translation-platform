import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FlagIcon from '@mui/icons-material/Flag';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import JobDashboard from '@/components/admin/JobDashboard';
import Payment from '@/components/admin/Payment';
import Issue from '@/components/admin/Issue';
import QADashboard from '@/components/admin/QADashboard';
import logo from '@/assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

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
      segment: 'job-dashboard',
      title: 'Jobs Dashboard',
      icon: <DashboardIcon />,
    },
    {
      kind: 'page',
      segment: 'payments',
      title: 'Payments',
      icon: <AttachMoneyIcon />,
    },
    {
      kind: 'page',
      segment: 'qa-management',
      title: 'QA Management',
      icon: <GroupsIcon />,
    },
    {
      kind: 'page',
      segment: 'issues',
      title: 'User Reports',
      icon: <FlagIcon />,
      children: [
        {
          kind: 'page',
          segment: 'wrong-source-language',
          title: '- Wrong Source Language',
        },
        {
          kind: 'page',
          segment: 'payment-delay',
          title: '- Payment Delay',
        },
        {
          kind: 'page',
          segment: 'accuracy-appeal',
          title: '- Accuracy Appeal',
        },
        {
          kind: 'page',
          segment: 'other',
          title: '- Other',
        },
      ],
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
      case 'payments':
        return <Payment />;
      case 'qa-management':
        return <QADashboard />;
      case 'wrong-source-language':
      case 'payment-delay':
      case 'accuracy-appeal':
      case 'other':
        return <Issue />;
      default:
        return <JobDashboard />;
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
