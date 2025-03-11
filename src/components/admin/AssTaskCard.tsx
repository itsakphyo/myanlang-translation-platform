"use client";

import type React from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  useMediaQuery,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Chip,
  Divider,
  Stack,
  alpha,
  Link,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TimerIcon from "@mui/icons-material/Timer";
import type { AssJob, JobEdit } from "../../types/job";
import { useJob } from "@/hooks/useJob";
import { useState } from "react";
import { red } from "@mui/material/colors";
import DeleteDialog from "./DeleteJobDialog";
import EditAssJobDialog from "./EditAssJobDialog";
import theme from "@/theme";

interface AssTaskCardProps {
  job: AssJob;
}

export default function AssTaskCard({ job }: AssTaskCardProps) {
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
    handleClose();
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditOpen = () => {
    setEditJobDialogOpen(true);
    handleClose();
  };

  const handleEditClose = () => {
    setEditJobDialogOpen(false);
  };

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

  return (
    <Card
      elevation={2}
      sx={{
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "100%",
        }}
      >
        {/* Left Section - Job Title and ID */}
        <Box
          sx={{
            flex: 1.5,
            width: isMobile ? "100%" : "280px",
            flexShrink: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: "white",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              lineHeight: 1.2,
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {job.job_title}
          </Typography>

          <Chip
            label={`JOB #${job.job_id}`}
            size="small"
            sx={{
              bgcolor: alpha("#ffffff", 0.2),
              color: "white",
              fontWeight: 600,
              width: "fit-content",
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        </Box>

        {/* Middle Section - Language Pair and Details */}
        <Box
          sx={{
            flex: 5,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            p: isMobile ? 2 : 0,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
          }}
        >
          {/* Language Pair */}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              p: isMobile ? 1 : 3,
              width: "100%",
              justifyContent: "center",
              gap: 2,

            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              divider={<SwapHorizIcon sx={{ color: theme.palette.primary.main, mx: 1 }} />}
            >
              <Chip
                label={job.source_language_name}
                variant="filled"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                  px: 1,
                }}
              />
              <Chip
                label={job.target_language_name}
                variant="filled"
                sx={{
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.dark,
                  fontWeight: 600,
                  px: 1,
                }}
              />
            </Stack>
          </Box>

          {isMobile && <Divider sx={{ width: "100%", my: 1 }} />}

          {!isMobile && <Divider orientation="vertical" flexItem />}

          {/* </Box> */}
          <Box
            sx={{
              flex: 2,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: isMobile ? 2 : 4,
              p: isMobile ? 1 : 3,
              width: "100%",
              ml: isMobile ? 0 : 2,
            }}
          >
            {/* Total Tasks */}
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
              <AssignmentIcon sx={{ color: theme.palette.text.secondary, mr: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                Total Tasks :
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2, ml: 1 }}>
                {job.total_tasks}
              </Typography>
            </Box>

            {/* Time per Task */}
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
              <TimerIcon sx={{ color: theme.palette.text.secondary, mr: 1.5 }} />
              <Typography variant="body2" color="text.secondary">
                Time per Task :
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2, ml: 1 }}>
                {job.max_time_per_task} min
              </Typography>
            </Box>
          </Box>

        </Box>

        {/* Right Section - Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            bgcolor: theme.palette.background.paper,
            borderLeft: isMobile ? "none" : `1px solid ${theme.palette.divider}`,
            borderTop: isMobile ? `1px solid ${theme.palette.divider}` : "none",
          }}
        >
          <IconButton
            onClick={handleMenuClick}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>

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
                borderRadius: 2,
                minWidth: 180,
                mt: 0.5,
              },
            }}
          >
            <MenuItem onClick={handleDownload} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <DownloadIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Download Tasks" />
            </MenuItem>
            <MenuItem onClick={handleEditOpen} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <EditNoteIcon fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText primary="Edit Job" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDeleteOpen} sx={{ py: 1.5, color: red[700] }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: red[700] }} />
              </ListItemIcon>
              <ListItemText primary="Delete Job" />
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Dialogs - keeping the same logic */}
      <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteClose} job_id={job.job_id} job_title={job.job_title} />
      <EditAssJobDialog open={editJobDialogOpen} onClose={handleEditClose} job_id={job.job_id} editjob={jobEdit} />
    </Card>
  );
}

