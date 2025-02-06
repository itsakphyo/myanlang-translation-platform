import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Job, JobEdit } from '../../types/job';
import { useJob } from '@/hooks/useJob';
import { useState } from 'react';
import { red } from '@mui/material/colors';
import DeleteDialog from './DeleteJobDialog';
import EditJobDialog from './EditJobDialog';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: jobProgress } = useJob().getJobProgress(job.job_id);
  const { downloadTasks } = useJob();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async () => {
    await downloadTasks(job.job_id);
    handleClose();
  };

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditOpen = () => {
    setEditJobDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditJobDialogOpen(false);
  }

  const completedPercentage = jobProgress
    ? (jobProgress.completed_tasks / jobProgress.total_tasks) * 100
    : 0;

  const jobEdit: JobEdit = {
    job_id: job.job_id,
    job_title: job.job_title,
    source_language_id: job.source_language_id,
    target_language_id: job.target_language_id,
    max_time_per_task: job.max_time_per_task,
    task_price: job.task_price,
    instructions: job.instructions,
    ...(job.notes ? { notes: job.notes } : {}), // Add notes only if it's defined and not empty
  };
  const createdDate = new Date(job.created_at).toLocaleDateString();

  const truncateText = (text: string, maxLength = 100) =>
    text.length > maxLength ? text.substring(0, maxLength) + '…' : text;

  const formatJobProgress = (completedTasks: number, totalTasks: number, underReviewTasks: number) => {
    const completedText = completedTasks.toString();
    const totalText = totalTasks.toString();
    const underReviewText = underReviewTasks.toString();
    return `${completedText} done, ${totalText} total, ${underReviewText} reviewing`;
  };

  const jobProgressText = jobProgress ? formatJobProgress(jobProgress.completed_tasks, jobProgress.total_tasks, jobProgress.under_review_tasks) : '0/0 ⇡ 0';

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
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
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
    backgroundColor: theme.palette.grey[100],
    borderLeft: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
    borderTop: isMobile ? `1px solid ${theme.palette.divider}` : 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const footerStyle = {
    p: 2,
    flexGrow: 1.8,
    backgroundColor: theme.palette.grey[50],
    borderLeft: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
    borderTop: isMobile ? `1px solid ${theme.palette.divider}` : 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  return (
    <Card sx={cardStyle}>
      {/* Header Section */}
      <CardContent sx={headerStyle}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {job.job_title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          ID: {job.job_id}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.85 }}>
          Created: {createdDate}
        </Typography>
      </CardContent>

      {/* Languages Section */}
      <CardContent sx={sectionStyle}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: isMobile ? 1 : 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Source: {job.source_language_name}
          </Typography>
          {!isMobile && <ArrowForwardIcon color="action" sx={{ mx: 1 }} />}
          <Typography variant="body2" color="text.secondary">
            Target: {job.target_language_name}
          </Typography>
        </Box>

        {/* Job Details */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: isMobile ? 'flex-start' : 'space-around',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Total Tasks:</strong> {job.total_tasks}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Max Time:</strong> {job.max_time_per_task} min
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Price:</strong> ${job.task_price.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>

      {/* Instructions & Status Section */}
      <CardContent sx={footerStyle}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          <Tooltip title={job.instructions} arrow>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Instructions:</strong> {truncateText(job.instructions, 80)}
            </Typography>
          </Tooltip>
          {job.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Notes:</strong> {truncateText(job.notes, 80)}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            <strong>Status:</strong> {job.job_status}
          </Typography>
        </Box>

        {/* Progress bar remains unchanged */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Box sx={{ flexGrow: 1, mr: 1, height: 8, bgcolor: theme.palette.grey[300], borderRadius: 5, overflow: 'hidden' }}>
            <Box sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
            }}>
              {/* Completed segment */}
              <Box sx={{
                width: `${completedPercentage}%`,
                bgcolor: theme.palette.primary.main,
                height: '100%',
              }} />
              {/* Under Review segment */}
              <Box sx={{
                width: `${jobProgress ? (jobProgress.under_review_tasks / jobProgress.total_tasks) * 100 : 0}%`,
                bgcolor: '#D4C5A9', // Light beige/tan color
                height: '100%',
              }} />
              {/* Open segment is the remaining space (grey background) */}
            </Box>
          </Box>
          <Tooltip title={jobProgressText} arrow>
            <Typography variant="body2" color="text.secondary">
              {jobProgress
                ? `${jobProgress.completed_tasks}/${jobProgress.total_tasks} ⇡ ${jobProgress.under_review_tasks}`
                : '0/0 ⇡ 0'
              }
            </Typography>
          </Tooltip>
        </Box>
      </CardContent>

      {/* Actions Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          pl: isMobile ? 2 : 0,
          borderLeft: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton sx={{ marginLeft: 'auto' }} onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>

        {/* The Menu appears when MoreVertIcon is clicked */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleDownload}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Download" />
          </MenuItem>
          <MenuItem onClick={handleEditOpen}>
            <ListItemIcon>
              <EditNoteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
          <MenuItem onClick={handleDeleteOpen} sx={{ color: red[500] }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: red[400] }} />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
        <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteClose} job_id={job.job_id} job_title={job.job_title}/>
        <EditJobDialog open={editJobDialogOpen} onClose={handleEditClose} job_id={job.job_id} editjob={jobEdit} />
      </Box>
    </Card>
  );
}
