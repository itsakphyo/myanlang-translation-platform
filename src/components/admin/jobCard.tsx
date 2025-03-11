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

