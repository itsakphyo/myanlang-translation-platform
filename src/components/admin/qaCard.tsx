import {
    Box,
    Card,
    CardContent,
    Typography,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { QAMember } from '../../types/qaMember';
import { useState } from 'react';
import RemoveQADialog from './qaRemoveDialog'
import ResetPasswordQADialog from './qaPasswordResetDialog'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface QACardProps {
    member: QAMember;
}

export default function JQACard({ member }: QACardProps) {
    const [removeQADialogOpen, setRemoveQADialogOpen] = useState(false);
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // const { data: jobProgress } = useJob().getJobProgress(job.job_id);
    // const { downloadTasks } = useJob();

    // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    // // const open = Boolean(anchorEl);

    // const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //   setAnchorEl(event.currentTarget);
    // };

    // const handleClose = () => {
    //   setAnchorEl(null);
    // };

    // const handleDownload = async () => {
    //   await downloadTasks(job.job_id);
    //   handleClose();
    // };

    // const handleDeleteOpen = () => {
    //   setDeleteDialogOpen(true);
    // };

    // const handleDeleteClose = () => {
    //   setDeleteDialogOpen(false);
    // };

    // const handleEditOpen = () => {
    //   setEditJobDialogOpen(true);
    // };

    // const handleEditClose = () => {
    //   setEditJobDialogOpen(false);
    // }

    // const completedPercentage = jobProgress
    //   ? (jobProgress.completed_tasks / jobProgress.total_tasks) * 100
    //   : 0;

    // const jobEdit: JobEdit = {
    //   job_id: job.job_id,
    //   job_title: job.job_title,
    //   source_language_id: job.source_language_id,
    //   target_language_id: job.target_language_id,
    //   max_time_per_task: job.max_time_per_task,
    //   task_price: job.task_price,
    //   instructions: job.instructions,
    //   ...(job.notes ? { notes: job.notes } : {}), // Add notes only if it's defined and not empty
    // };
    // const createdDate = new Date(job.created_at).toLocaleDateString();

    // const truncateText = (text: string, maxLength = 100) =>
    //   text.length > maxLength ? text.substring(0, maxLength) + '…' : text;

    // const formatJobProgress = (completedTasks: number, totalTasks: number, underReviewTasks: number) => {
    //   const completedText = completedTasks.toString();
    //   const totalText = totalTasks.toString();
    //   const underReviewText = underReviewTasks.toString();
    //   return `${completedText} done, ${totalText} total, ${underReviewText} reviewing`;
    // };

    // const jobProgressText = jobProgress ? formatJobProgress(jobProgress.completed_tasks, jobProgress.total_tasks, jobProgress.under_review_tasks) : '0/0 ⇡ 0';

    const handleRemoveQADialogOpen = () => {
        setRemoveQADialogOpen(true);
    }

    const handleRemoveQADialogClose = () => {
        setRemoveQADialogOpen(false);
    }

    const handleResetPasswordDialogOpen = () => {
        setResetPasswordDialogOpen(true);
    }

    const handleResetPasswordDialogClose = () => {
        setResetPasswordDialogOpen(false);
    }

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


    return (
        <Card sx={cardStyle}>
            <CardContent sx={headerStyle}>
                <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    mb: 0.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    WebkitBackgroundClip: 'text', 
                    backgroundClip: 'text',
                    color: 'transparent', 
                }}>
                    {member.full_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    ID: {member.qa_member_id}
                </Typography>
            </CardContent>

            <CardContent sx={sectionStyle}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        justifyContent: isMobile ? 'flex-start' : 'space-around',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        <strong>Total Reviewed Tasks:</strong> {member.total_tasks_reviewed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Total Rejected Tasks:</strong> {member.total_tasks_rejected}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Task Acceptance Percentage:</strong> {member.total_tasks_reviewed > 0 ? ((member.total_tasks_reviewed / (member.total_tasks_reviewed + member.total_tasks_rejected)) * 100).toFixed(2) : 0}%
                    </Typography>
                </Box>
            </CardContent>
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
                    <Button variant="outlined" onClick={handleResetPasswordDialogOpen}>Reset Password</Button>
                    <Button variant="contained" color='error' onClick={handleRemoveQADialogOpen}>Remove member</Button>
                </Stack>
                <RemoveQADialog open={removeQADialogOpen} onClose={handleRemoveQADialogClose} qa_member={member} />
                <ResetPasswordQADialog open={resetPasswordDialogOpen} onClose={handleResetPasswordDialogClose} qa_member={member} />
            </CardContent>
        </Card>
    );
}
