import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AssJob, JobEdit } from '../../types/job';
import { useJob } from '@/hooks/useJob';
import { useState } from 'react';
import { red } from '@mui/material/colors';
import DeleteDialog from './DeleteJobDialog';
import EditAssJobDialog from './EditAssJobDialog';

interface AssTaskCardProps {
  job: AssJob;
}

export default function AssTaskCard({ job }: AssTaskCardProps) {
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const jobEdit: JobEdit = {
    job_id: job.job_id,
    job_title: job.job_title,
    source_language_id: job.source_language_id,
    target_language_id: job.target_language_id,
    max_time_per_task: job.max_time_per_task,
    task_price: job.task_price,
    instructions: job.instructions,
    ...(job.notes ? { notes: job.notes } : {}),
  };
  // const createdDate = new Date(job.created_at).toLocaleDateString();

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
    width: isMobile ? '100%' : 250,
    background: 'linear-gradient(135deg, #00ACC1 0%, #26C6DA 100%)',
    color: theme.palette.primary.contrastText,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  // Typography styles
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

  return (
    <Card sx={cardStyle}>
      {/* Header Section */}
      <CardContent sx={headerStyle}>
        <Typography variant="h6" sx={titleStyle}>
          {job.job_title}
        </Typography>
        <Typography variant="body2" sx={{ ...subtitleStyle, mb: 0.5 }}>
          JOB ID: {job.job_id}
        </Typography>
      </CardContent>

      <CardContent
        sx={{
          p: 2,
          flexGrow: 6,
          backgroundColor: theme.palette.grey[100],
          borderLeft: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
          borderTop: isMobile ? `1px solid ${theme.palette.divider}` : 'none',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-start' : 'space-between',
          gap: 2,
        }}
      >
        {/* Language Pair Group */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginLeft: isMobile ? 0 : 4 }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            {job.source_language_name}
          </Typography>
          {isMobile ? (
            <ArrowDownwardIcon color="action" sx={{ fontSize: '1rem' }} />
          ) : (
            <ArrowForwardIcon color="action" sx={{ fontSize: '1.2rem' }} />
          )}
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            {job.target_language_name}
          </Typography>
        </Box>

        {/* Total Tasks Group */}
        <Typography variant="body2">
          <Box component="span" sx={detailLabelStyle}>
            Total Tasks:
          </Box>
          <Box component="span" sx={detailValueStyle}>
            {job.total_tasks}
          </Box>
        </Typography>

        {/* Time/Task Group */}
        <Typography variant="body2" sx={{ marginRight: isMobile ? 0 : 4}}>
          <Box component="span" sx={detailLabelStyle}>
            Time/Task:
          </Box>
          <Box component="span" sx={detailValueStyle}>
            {job.max_time_per_task} min
          </Box>
        </Typography>
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
        <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteClose} job_id={job.job_id} job_title={job.job_title} />
        <EditAssJobDialog open={editJobDialogOpen} onClose={handleEditClose} job_id={job.job_id} editjob={jobEdit} />
      </Box>
    </Card>
  );
}