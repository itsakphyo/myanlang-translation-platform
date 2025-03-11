// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   useMediaQuery,
//   Tooltip,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Menu,
// } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import DownloadIcon from '@mui/icons-material/Download';
// import EditNoteIcon from '@mui/icons-material/EditNote';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import { Job, JobEdit } from '../../types/job';
// import { useJob } from '@/hooks/useJob';
// import { useState } from 'react';
// import { red } from '@mui/material/colors';
// import DeleteDialog from './DeleteJobDialog';
// import EditJobDialog from './EditJobDialog';
// import theme from '@/theme';

// interface JobCardProps {
//   job: Job;
// }

// export default function JobCard({ job }: JobCardProps) {
//   const [editJobDialogOpen, setEditJobDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const { data: jobProgress } = useJob().getJobProgress(job.job_id);
//   const { downloadTasks } = useJob();

//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDownload = async () => {
//     await downloadTasks(job.job_id);
//     handleClose();
//   };

//   const handleDeleteOpen = () => {
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteClose = () => {
//     setDeleteDialogOpen(false);
//   };

//   const handleEditOpen = () => {
//     setEditJobDialogOpen(true);
//   };

//   const handleEditClose = () => {
//     setEditJobDialogOpen(false);
//   }

//   const completedPercentage = jobProgress
//     ? (jobProgress.completed_tasks / jobProgress.total_tasks) * 100
//     : 0;

//   const jobEdit: JobEdit = {
//     job_id: job.job_id,
//     job_title: job.job_title,
//     source_language_id: job.source_language_id,
//     target_language_id: job.target_language_id,
//     max_time_per_task: job.max_time_per_task,
//     task_price: job.task_price,
//     instructions: job.instructions,
//     ...(job.notes ? { notes: job.notes } : {}),
//   };
//   const createdDate = new Date(job.created_at).toLocaleDateString();

//   const truncateText = (text: string, maxLength = 100) =>
//     text.length > maxLength ? text.substring(0, maxLength) + '…' : text;

//   const formatJobProgress = (completedTasks: number, totalTasks: number, underReviewTasks: number) => {
//     const completedText = completedTasks.toString();
//     const totalText = totalTasks.toString();
//     const underReviewText = underReviewTasks.toString();
//     return `${completedText} completed, ${underReviewText} under review, ${totalText} total`;
//   };

//   const jobProgressText = jobProgress ? formatJobProgress(jobProgress.completed_tasks, jobProgress.total_tasks, jobProgress.under_review_tasks) : '0/0 ⇡ 0';

//   // Style constants
//   const cardStyle = {
//     display: 'flex',
//     flexDirection: isMobile ? 'column' : 'row',
//     width: '100%',
//     borderRadius: 2,
//     boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
//     overflow: 'hidden',
//     backgroundColor: theme.palette.background.paper,
//   };

//   const headerStyle = {
//     p: 2,
//     width: isMobile ? '100%' : 250,
//     background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
//     color: theme.palette.primary.contrastText,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//   };

//   const sectionStyle = {
//     p: 2,
//     width: isMobile ? '100%' : '500px', // fixed width
//     backgroundColor: theme.palette.grey[100],
//     borderLeft: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
//     borderTop: isMobile ? `1px solid ${theme.palette.divider}` : 'none',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//   };

//   const footerStyle = {
//     p: 2,
//     flexGrow: 1.8,
//     backgroundColor: theme.palette.grey[50],
//     borderLeft: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
//     borderTop: isMobile ? `1px solid ${theme.palette.divider}` : 'none',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//   };

//   // Typography styles
//   const titleStyle = {
//     fontSize: '1.4rem',
//     fontWeight: 700,
//     letterSpacing: 0.2,
//     mb: 1,
//     fontFamily: theme.typography.fontFamily,
//     lineHeight: 1.2,
//   };

//   const subtitleStyle = {
//     fontSize: '0.85rem',
//     fontWeight: 500,
//     letterSpacing: 0.1,
//     fontFamily: 'monospace',
//     opacity: 0.9,
//   };

//   const detailLabelStyle = {
//     fontWeight: 600,
//     fontSize: '0.9rem',
//     color: theme.palette.text.primary,
//     display: 'inline',
//     mr: 0.5,
//   };

//   const detailValueStyle = {
//     fontWeight: 400,
//     fontSize: '0.9rem',
//     color: theme.palette.text.secondary,
//     display: 'inline',
//   };

//   const statusStyle = {
//     fontSize: '0.8rem',
//     fontWeight: 700,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//     px: 1,
//     py: 0.5,
//     borderRadius: 1,
//     bgcolor: theme.palette.action.selected,
//     color: theme.palette.text.primary,
//     mt: 1,
//   };

//   return (
//     <Card sx={cardStyle}>
//       {/* Header Section */}
//       <CardContent sx={headerStyle}>
//         <Typography variant="h6" sx={titleStyle}>
//           {job.job_title}
//         </Typography>
//         <Typography variant="body2" sx={{ ...subtitleStyle, mb: 0.5 }}>
//           JOB ID: {job.job_id}
//         </Typography>
//         <Typography variant="caption" sx={{ fontSize: '0.75rem', opacity: 0.9 }}>
//           Created: {createdDate}
//         </Typography>
//       </CardContent>

//       {/* Languages Section */}
//       <CardContent sx={sectionStyle}>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: isMobile ? 'column' : 'row',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: 1,
//             mb: isMobile ? 1 : 2,
//           }}
//         >
//           <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
//             {job.source_language_name}
//           </Typography>
//           {!isMobile && <ArrowForwardIcon color="action" sx={{ mx: 1, fontSize: '1.2rem' }} />}
//           <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
//             {job.target_language_name}
//           </Typography>
//         </Box>

//         {/* Job Details */}
//         <Box
//           sx={{
//             display: 'flex',
//             flexWrap: 'wrap',
//             gap: 2,
//             justifyContent: isMobile ? 'flex-start' : 'space-around',
//           }}
//         >
//           <Typography variant="body2">
//             <Box component="span" sx={detailLabelStyle}>Total Tasks:</Box>
//             <Box component="span" sx={detailValueStyle}>{job.total_tasks}</Box>
//           </Typography>
//           <Typography variant="body2">
//             <Box component="span" sx={detailLabelStyle}>Time/Task:</Box>
//             <Box component="span" sx={detailValueStyle}>{job.max_time_per_task} min</Box>
//           </Typography>
//           <Typography variant="body2">
//             <Box component="span" sx={detailLabelStyle}>Price/Task:</Box>
//             <Box component="span" sx={detailValueStyle}>{job.task_price.toFixed(2)}MMK</Box>
//           </Typography>
//         </Box>
//       </CardContent>

//       {/* Instructions & Status Section */}
//       <CardContent sx={footerStyle}>
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
//           <Tooltip title={job.instructions} arrow>
//             <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.4 }}>
//               <Box component="span" sx={detailLabelStyle}>Instructions:</Box>
//               <Box component="span" sx={{ ...detailValueStyle, fontStyle: 'italic' }}>
//                 {truncateText(job.instructions, 80)}
//               </Box>
//             </Typography>
//           </Tooltip>
//           {job.notes && (
//             <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.4 }}>
//               <Box component="span" sx={detailLabelStyle}>Notes:</Box>
//               <Box component="span" sx={{ ...detailValueStyle, fontStyle: 'italic' }}>
//                 {truncateText(job.notes, 80)}
//               </Box>
//             </Typography>
//           )}
//           <Box sx={statusStyle}>
//             {job.job_status}
//           </Box>
//         </Box>

//         {/* Progress Bar */}
//         <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//           <Box sx={{ flexGrow: 1, mr: 1, height: 8, bgcolor: theme.palette.grey[300], borderRadius: 5, overflow: 'hidden' }}>
//             <Box sx={{
//               width: '100%',
//               height: '100%',
//               display: 'flex',
//             }}>
//               <Box sx={{
//                 width: `${completedPercentage}%`,
//                 bgcolor: theme.palette.primary.main,
//                 height: '100%',
//               }} />
//               <Box sx={{
//                 width: `${jobProgress ? (jobProgress.under_review_tasks / jobProgress.total_tasks) * 100 : 0}%`,
//                 bgcolor: '#ffa600',
//                 height: '100%',
//               }} />
//             </Box>
//           </Box>
//           <Tooltip title={jobProgressText} arrow>
//             <Typography variant="body2" color="text.secondary">
//               {jobProgress
//                 ? `${jobProgress.completed_tasks}/${jobProgress.total_tasks} || ⇡ ${jobProgress.under_review_tasks}`
//                 : '0/0 || ⇡ 0'
//               }
//             </Typography>
//           </Tooltip>
//         </Box>
//       </CardContent>

//       {/* Actions Section */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           p: 1,
//           pl: isMobile ? 2 : 0,
//           borderLeft: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
//         }}
//       >
//         <IconButton sx={{ marginLeft: 'auto' }} onClick={handleMenuClick}>
//           <MoreVertIcon />
//         </IconButton>

//         <Menu
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//           anchorOrigin={{
//             vertical: 'bottom',
//             horizontal: 'right',
//           }}
//           transformOrigin={{
//             vertical: 'top',
//             horizontal: 'right',
//           }}
//         >
//           <MenuItem onClick={handleDownload}>
//             <ListItemIcon>
//               <DownloadIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText primary="Download" />
//           </MenuItem>
//           <MenuItem onClick={handleEditOpen}>
//             <ListItemIcon>
//               <EditNoteIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText primary="Edit" />
//           </MenuItem>
//           <MenuItem onClick={handleDeleteOpen} sx={{ color: red[500] }}>
//             <ListItemIcon>
//               <DeleteIcon fontSize="small" sx={{ color: red[400] }} />
//             </ListItemIcon>
//             <ListItemText primary="Delete" />
//           </MenuItem>
//         </Menu>
//         <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteClose} job_id={job.job_id} job_title={job.job_title}/>
//         <EditJobDialog open={editJobDialogOpen} onClose={handleEditClose} job_id={job.job_id} editjob={jobEdit} />
//       </Box>
//     </Card>
//   );
// }

"use client"

import type React from "react"

import {
  Box,
  Card,
  Typography,
  IconButton,
  useMediaQuery,
  Tooltip,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Chip,
  Grid,
  Paper,
  Divider,
  Avatar,
  LinearProgress,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import DownloadIcon from "@mui/icons-material/Download"
import EditNoteIcon from "@mui/icons-material/EditNote"
import DeleteIcon from "@mui/icons-material/Delete"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import WorkIcon from "@mui/icons-material/Work"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import TranslateIcon from "@mui/icons-material/Translate"
import TimerIcon from "@mui/icons-material/Timer"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import DescriptionIcon from "@mui/icons-material/Description"
import NoteIcon from "@mui/icons-material/Note"
import type { Job, JobEdit } from "../../types/job"
import { useJob } from "../../hooks/useJob"
import { useState } from "react"
import { red } from "@mui/material/colors"
import DeleteDialog from "./DeleteJobDialog"
import EditJobDialog from "./EditJobDialog"
import theme from "@/theme"

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { data: jobProgress } = useJob().getJobProgress(job.job_id)
  const { downloadTasks } = useJob()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDownload = async () => {
    await downloadTasks(job.job_id)
    handleClose()
  }

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false)
  }

  const handleEditOpen = () => {
    setEditJobDialogOpen(true)
  }

  const handleEditClose = () => {
    setEditJobDialogOpen(false)
  }

  const completedPercentage = jobProgress ? (jobProgress.completed_tasks / jobProgress.total_tasks) * 100 : 0

  const underReviewPercentage = jobProgress ? (jobProgress.under_review_tasks / jobProgress.total_tasks) * 100 : 0

  const jobEdit: JobEdit = {
    job_id: job.job_id,
    job_title: job.job_title,
    source_language_id: job.source_language_id,
    target_language_id: job.target_language_id,
    max_time_per_task: job.max_time_per_task,
    task_price: job.task_price,
    instructions: job.instructions,
    ...(job.notes ? { notes: job.notes } : {}),
  }

  const createdDate = new Date(job.created_at).toLocaleDateString()

  const truncateText = (text: string, maxLength = 100) =>
    text.length > maxLength ? text.substring(0, maxLength) + "…" : text

  const formatJobProgress = (completedTasks: number, totalTasks: number, underReviewTasks: number) => {
    const completedText = completedTasks.toString()
    const totalText = totalTasks.toString()
    const underReviewText = underReviewTasks.toString()
    return `${completedText} completed, ${underReviewText} under review, ${totalText} total`
  }

  const jobProgressText = jobProgress
    ? formatJobProgress(jobProgress.completed_tasks, jobProgress.total_tasks, jobProgress.under_review_tasks)
    : "0/0 ⇡ 0"

  // Get status color based on job status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return theme.palette.success.main
      case "pending":
        return theme.palette.warning.main
      case "completed":
        return theme.palette.info.main
      case "cancelled":
        return theme.palette.error.main
      default:
        return theme.palette.primary.main
    }
  }

  return (
    <Card
      elevation={2}
      sx={{
        width: "100%",
        borderRadius: 1.5,
        overflow: "hidden",
        position: "relative",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
        },
        height: "auto",
      }}
    >
      <Grid container sx={{ minHeight: 0 }}>
        {/* Header Section
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              p: { xs: 1.25, md: 1.5 },
              height: "100%",
              background: `linear-gradient(145deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              borderTopLeftRadius: { xs: 6, md: 6 },
              borderTopRightRadius: { xs: 6, md: 0 },
              borderBottomLeftRadius: { xs: 0, md: 6 },
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 1, width: 32, height: 32 }}>
                <WorkIcon sx={{ fontSize: "1.1rem" }} />
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ wordBreak: "break-word", fontSize: "1rem", lineHeight: 1.2 }}
                >
                  {job.job_title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.25 }}>
                  <CalendarTodayIcon sx={{ fontSize: "0.8rem", mr: 0.5 }} />
                  <Typography variant="caption" sx={{ fontSize: "0.8rem" }}>
                    {createdDate}
                  </Typography>
                  <Chip
                    label={job.job_status}
                    color="primary"
                    size="small"
                    sx={{
                      ml: 1,
                      fontWeight: "bold",
                      backgroundColor: getStatusColor(job.job_status || ""),
                      color: "#fff",
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                      height: "18px",
                      "& .MuiChip-label": {
                        px: 0.75,
                        py: 0,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid> */}

        {/* Header Section */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              p: { xs: 1.25, md: 1.5 },
              height: "100%",
              background: `linear-gradient(145deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              borderTopLeftRadius: { xs: 6, md: 6 },
              borderTopRightRadius: { xs: 6, md: 0 },
              borderBottomLeftRadius: { xs: 0, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Job Status Chip - Top Right */}
            <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
              <Chip
                label={job.job_status}
                size="small"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: getStatusColor(job.job_status || ""),
                  color: "#fff",
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  height: "18px",
                  "& .MuiChip-label": {
                    px: 0.75,
                    py: 0,
                  },
                }}
              />
            </Box>

            {/* Job Title with Icon */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.75 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 1, width: 28, height: 28 }}>
                <WorkIcon sx={{ fontSize: "1rem" }} />
              </Avatar>
              <Typography
                variant="caption"
                sx={{
                  display: "inline-block",
                  bgcolor: "rgba(255,255,255,0.15)",
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.75,
                  fontSize: "0.7rem",
                  mb: 0.75,
                }}
              >
                ID: {job.job_id}
              </Typography>
            </Box>

            {/* Job ID */}

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                wordBreak: "break-word",
                fontSize: "0.95rem",
                lineHeight: 1.2,
                maxWidth: "calc(100% - 40px)",
              }}
            >
              Job Title : {job.job_title}
            </Typography>

            {/* Creation Date */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarTodayIcon sx={{ fontSize: "0.75rem", mr: 0.5 }} />
              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                Created: {createdDate}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Content Section */}
        <Grid item xs={12} md={9}>
          <Box sx={{ p: { xs: 1.25, md: 1.5 }, height: "100%" }}>
            <Grid container spacing={1}>
              {/* Language and Progress Section - Combined */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    backgroundColor: theme.palette.grey[50],
                    border: `1px solid ${theme.palette.grey[200]}`,
                  }}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={5}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TranslateIcon color="primary" sx={{ mr: 0.5, fontSize: "1rem" }} />
                        <Typography variant="body2" fontWeight="medium" sx={{ fontSize: "0.85rem" }}>
                          {job.source_language_name}
                          <ArrowForwardIcon sx={{ mx: 0.5, color: theme.palette.text.secondary, fontSize: "0.9rem" }} />
                          {job.target_language_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={7}>
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.25 }}>
                          <Typography variant="body2" fontWeight="medium" sx={{ fontSize: "0.85rem" }}>
                            Progress
                          </Typography>
                          <Tooltip title={jobProgressText} arrow>
                            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.85rem" }}>
                              {jobProgress
                                ? `${jobProgress.completed_tasks}/${jobProgress.total_tasks} ⇡ ${jobProgress.under_review_tasks}`
                                : "0/0 ⇡ 0"}
                            </Typography>
                          </Tooltip>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={completedPercentage + underReviewPercentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: theme.palette.grey[200],
                            "& .MuiLinearProgress-bar": {
                              background: `linear-gradient(90deg, ${theme.palette.success.main} ${completedPercentage}%, ${theme.palette.warning.main} ${completedPercentage}%)`,
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Details Grid */}
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1,
                        height: "100%",
                        borderRadius: 1.5,
                        backgroundColor: theme.palette.grey[50],
                        border: `1px solid ${theme.palette.grey[200]}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                        Total Tasks
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ fontSize: "1.1rem" }}>
                        {job.total_tasks}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1,
                        height: "100%",
                        borderRadius: 1.5,
                        backgroundColor: theme.palette.grey[50],
                        border: `1px solid ${theme.palette.grey[200]}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TimerIcon sx={{ mr: 0.25, color: theme.palette.text.secondary, fontSize: "0.85rem" }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                          Time/Task
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ fontSize: "1.1rem" }}>
                        {job.max_time_per_task} min
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1,
                        height: "100%",
                        borderRadius: 1.5,
                        backgroundColor: theme.palette.grey[50],
                        border: `1px solid ${theme.palette.grey[200]}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AttachMoneyIcon sx={{ mr: 0.25, color: theme.palette.text.secondary, fontSize: "0.85rem" }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                          Price/Task
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ fontSize: "1.1rem" }}>
                        {job.task_price.toFixed(2)} MMK
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              {/* Instructions & Notes - Combined in one row with action button */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    backgroundColor: theme.palette.grey[50],
                    border: `1px solid ${theme.palette.grey[200]}`,
                  }}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={job.notes ? 5 : 10}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DescriptionIcon sx={{ mr: 0.5, color: theme.palette.primary.main, fontSize: "1rem" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                          Instructions :
                        </Typography>
                        <Tooltip title={job.instructions} arrow>
                          <Typography variant="body2" sx={{ fontSize: "0.85rem", fontStyle: "italic" }}>
                            {truncateText(job.instructions, 40)}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Grid>

                    {job.notes && (
                      <Grid item xs={5}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <NoteIcon sx={{ mr: 0.5, color: theme.palette.primary.main, fontSize: "1rem" }} />
                          <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                            Note :
                          </Typography>
                          <Tooltip title={job.notes} arrow>
                            <Typography variant="body2" sx={{ fontSize: "0.85rem", fontStyle: "italic" }}>
                              {truncateText(job.notes, 40)}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </Grid>
                    )}

                    <Grid item xs={job.notes ? 2 : 2} sx={{ textAlign: "right" }}>
                      <Tooltip title="More options">
                        <IconButton
                          onClick={handleMenuClick}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.grey[100],
                            "&:hover": {
                              backgroundColor: theme.palette.grey[200],
                            },
                            width: 28,
                            height: 28,
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 1.5,
            minWidth: 160,
          },
        }}
      >
        <MenuItem onClick={handleDownload} sx={{ py: 1 }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Download" />
        </MenuItem>
        <MenuItem onClick={handleEditOpen} sx={{ py: 1 }}>
          <ListItemIcon>
            <EditNoteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteOpen} sx={{ py: 1, color: red[500] }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: red[500] }} />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteClose} job_id={job.job_id} job_title={job.job_title} />
      <EditJobDialog open={editJobDialogOpen} onClose={handleEditClose} job_id={job.job_id} editjob={jobEdit} />
    </Card>
  )
}

