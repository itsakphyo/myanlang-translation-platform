import {
    Box,
    Card,
    CardContent,
    Typography,
    useMediaQuery,
    Button,
    Stack,
  } from '@mui/material';
  import { QAMember } from '../../types/qaMember';
  import { useState } from 'react';
  import RemoveQADialog from './qaRemoveDialog';
  import ResetPasswordQADialog from './qaPasswordResetDialog';
  import theme from '@/theme';
  
  interface QACardProps {
    member: QAMember;
  }
  
  export default function QACard({ member }: QACardProps) {
    const [removeQADialogOpen, setRemoveQADialogOpen] = useState(false);
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
    // Typography style constants similar to JobCard
    const titleStyle = {
      fontSize: '1.4rem',
      fontWeight: 700,
      letterSpacing: 0.2,
      mb: 1,
      fontFamily: theme.typography.fontFamily,
      lineHeight: 1.2,
    };
  
    const subtitleStyle = {
      fontSize: '0.85rem',
      fontWeight: 500,
      letterSpacing: 0.1,
      fontFamily: 'monospace',
    color: theme.palette.text.secondary,
      opacity: 0.9,
    };
  
    const detailLabelStyle = {
      fontWeight: 600,
      fontSize: '0.9rem',
      color: theme.palette.text.primary,
      display: 'inline',
      mr: 0.5,
    };
  
    const detailValueStyle = {
      fontWeight: 400,
      fontSize: '0.9rem',
      color: theme.palette.text.secondary,
      display: 'inline',
    };
  
    // Style constants
    const cardStyle = {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      width: '100%',
      borderRadius: 2,
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    };
  
    const headerStyle = {
      p: 2,
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.primary.contrastText,
      minWidth: isMobile ? '100%' : 250,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    };
  
    const sectionStyle = {
      p: 2,
      flexGrow: 1,
      minWidth: isMobile ? '100%' : '200px',
      backgroundColor: theme.palette.grey[50],
      borderLeft: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
      borderTop: isMobile ? `1px solid ${theme.palette.divider}` : 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    };
  
    const footerStyle = {
      p: 2,
      flexGrow: 0.5,
      backgroundColor: theme.palette.grey[50],
      borderLeft: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
      borderTop: isMobile ? `1px solid ${theme.palette.divider}` : 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    };
  
    const handleRemoveQADialogOpen = () => {
      setRemoveQADialogOpen(true);
    };
  
    const handleRemoveQADialogClose = () => {
      setRemoveQADialogOpen(false);
    };
  
    const handleResetPasswordDialogOpen = () => {
      setResetPasswordDialogOpen(true);
    };
  
    const handleResetPasswordDialogClose = () => {
      setResetPasswordDialogOpen(false);
    };
  
    return (
      <Card sx={cardStyle}>
        {/* Header Section */}
        <CardContent sx={headerStyle}>
          <Typography
            variant="h6"
            sx={{
              ...titleStyle,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {member.full_name}
          </Typography>
          <Typography variant="body2" sx={subtitleStyle}>
            ID: {member.qa_member_id}
          </Typography>
        </CardContent>
  
        {/* Details Section */}
        <CardContent sx={sectionStyle}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: isMobile ? 'flex-start' : 'space-around',
            }}
          >
            <Typography variant="body2">
              <Box component="span" sx={detailLabelStyle}>
                Total Reviewed Tasks:
              </Box>
              <Box component="span" sx={detailValueStyle}>
                {member.total_tasks_reviewed}
              </Box>
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={detailLabelStyle}>
                Total Rejected Tasks:
              </Box>
              <Box component="span" sx={detailValueStyle}>
                {member.total_tasks_rejected}
              </Box>
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={detailLabelStyle}>
                Task Acceptance Percentage:
              </Box>
              <Box component="span" sx={detailValueStyle}>
                {member.total_tasks_reviewed > 0
                  ? (
                      (member.total_tasks_reviewed /
                        (member.total_tasks_reviewed + member.total_tasks_rejected)) *
                      100
                    ).toFixed(2)
                  : 0}
                %
              </Box>
            </Typography>
          </Box>
        </CardContent>
  
        {/* Actions Section */}
        <CardContent sx={footerStyle}>
          <Stack
            spacing={2}
            direction="row"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Button variant="outlined" onClick={handleResetPasswordDialogOpen}>
              Reset Password
            </Button>
            <Button variant="contained" color="error" onClick={handleRemoveQADialogOpen}>
              Remove Member
            </Button>
          </Stack>
          <RemoveQADialog open={removeQADialogOpen} onClose={handleRemoveQADialogClose} qa_member={member} />
          <ResetPasswordQADialog open={resetPasswordDialogOpen} onClose={handleResetPasswordDialogClose} qa_member={member} />
        </CardContent>
      </Card>
    );
  }
  