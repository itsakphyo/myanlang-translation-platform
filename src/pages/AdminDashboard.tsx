import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FlagIcon from '@mui/icons-material/Flag';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import JobDashboard from '@/components/admin/JobManage';
import Payment from '@/components/admin/Payment';
import Issue from '@/components/admin/Issue';
import QADashboard from '@/components/admin/QAManage';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import logo from '@/assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import TaskManage from '@/components/admin/AssTaskManage';
import theme from '@/theme';

export default function AdminDashboard({ window }: { window?: () => Window }) {
  const router = useDemoRouter('/dashboard');
  const currentSegment = router.pathname.split('/').pop() || 'job-dashboard';
  const navigate = useNavigate();

  const logoutAction = (
    <div
      onClick={() => {
        localStorage.clear();
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
      segment: 'assessment-tasks',
      title: 'Assessment Tasks',
      icon: <TaskAltIcon />,
    },
    {
      kind: 'page',
      segment: 'issues',
      title: 'User Reports',
      icon: <FlagIcon />,
    },
    {
      kind: 'page',
      icon: <LogoutIcon />,
      action: logoutAction,
    },
  ];

  const renderContent = () => {
    switch (currentSegment) {
      case 'payments':
        return <Payment />;
      case 'qa-management':
        return <QADashboard />;
      case 'assessment-tasks':
        return <TaskManage />;
      case 'issues':
        return <Issue />;
      default:
        return <JobDashboard />;
    }
  };

  return (
    <div id="app-root">
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
      theme={theme}
      window={window ? window() : undefined}
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
    </div>
  );
}
