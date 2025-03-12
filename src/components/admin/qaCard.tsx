"use client";

import {
  Box,
  Card,
  Typography,
  useMediaQuery,
  Button,
  Stack,
  Avatar,
  Chip,
  Paper,
  Grid,
  LinearProgress,
  useTheme,
  Container,
} from "@mui/material";
import type { QAMember } from "../../types/qaMember";
import { useState } from "react";
import RemoveQADialog from "./qaRemoveDialog";
import ResetPasswordQADialog from "./qaPasswordResetDialog";
import { Person, Assessment, Cancel, BarChart } from "@mui/icons-material";

interface QACardProps {
  member: QAMember;
}

export default function QACard({ member }: QACardProps) {
  const [removeQADialogOpen, setRemoveQADialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Calculate acceptance rate
  const acceptanceRate =
    member.total_tasks_reviewed > 0
      ? (member.total_tasks_reviewed /
          (member.total_tasks_reviewed + member.total_tasks_rejected)) *
        100
      : 0;

  // Dialog handlers - keeping the same logic
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
    <Container maxWidth={false} disableGutters sx={{ p: { xs: 1, md: 2 } }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Header Section with Background */}
        <Box
          sx={{
            flex: 0.7,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            p: { xs: 1, md: 2 },
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Horizontal container for Avatar and Name/ID group */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Fixed width container for Name and ID */}
            <Box
              sx={{
                ml: 2,
                width: { xs: "auto", md: 150 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  textAlign: "center",
                  mb: 1,
                }}
              >
                {member.full_name}
              </Typography>
              <Chip
                icon={<Person fontSize="small" />}
                label={`ID: ${member.qa_member_id}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 500,
                  mt: 0.5,
                  "& .MuiChip-icon": { color: "white" },
                  fontSize: "0.75rem",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            flex: 2,
            p: { xs: 1, md: 2 },
            borderLeft: isMobile ? "none" : `1px solid ${theme.palette.divider}`,
            borderRight: isMobile ? "none" : `1px solid ${theme.palette.divider}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              fontWeight: 600,
              color: theme.palette.text.primary,
              borderBottom: `1px solid ${theme.palette.primary.main}`,
              pb: 0.5,
              fontSize: "0.75rem",
              textAlign: "center",
            }}
          >
            Performance Metrics
          </Typography>

          <Grid container spacing={1} justifyContent="center">
            {/* Reviewed Tasks */}
            <Grid item xs={12} sm={4}>
              <Card
                elevation={2}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  minHeight: "12vh",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.light,
                      mr: 1,
                      width: 24,
                      height: 24,
                    }}
                  >
                    <Assessment fontSize="small" />
                  </Avatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                  >
                    Reviewed
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    textAlign: "center",
                    my: 0.5,
                    color: theme.palette.primary.main,
                    fontSize: "1rem",
                  }}
                >
                  {member.total_tasks_reviewed}
                </Typography>
              </Card>
            </Grid>

            {/* Rejected Tasks */}
            <Grid item xs={12} sm={4}>
              <Card
                elevation={2}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  minHeight: "12vh",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.error.light,
                      mr: 1,
                      width: 24,
                      height: 24,
                    }}
                  >
                    <Cancel fontSize="small" />
                  </Avatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                  >
                    Rejected
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    textAlign: "center",
                    my: 0.5,
                    color: theme.palette.error.main,
                    fontSize: "1rem",
                  }}
                >
                  {member.total_tasks_rejected}
                </Typography>
              </Card>
            </Grid>

            {/* Acceptance Rate */}
            <Grid item xs={12} sm={4}>
              <Card
                elevation={2}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  minHeight: "12vh",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.success.light,
                      mr: 1,
                      width: 24,
                      height: 24,
                    }}
                  >
                    <BarChart fontSize="small" />
                  </Avatar>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                  >
                    Acceptance
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    textAlign: "center",
                    my: 0.5,
                    color:
                      acceptanceRate > 70
                        ? theme.palette.success.main
                        : acceptanceRate > 40
                        ? theme.palette.warning.main
                        : theme.palette.error.main,
                    fontSize: "1rem",
                  }}
                >
                  {acceptanceRate.toFixed(2)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={acceptanceRate}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: theme.palette.grey[200],
                    "& .MuiLinearProgress-bar": {
                      bgcolor:
                        acceptanceRate > 70
                          ? theme.palette.success.main
                          : acceptanceRate > 40
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                    },
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Actions Footer */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 1, md: 2 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.grey[50],
          }}
        >
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={1}
            sx={{
              width: "100%",
              maxWidth: 300,
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={handleResetPasswordDialogOpen}
              fullWidth
              sx={{
                borderRadius: 1,
                py: 0.5,
                fontWeight: 600,
                borderWidth: 2,
                fontSize: "0.75rem",
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              Reset Password
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleRemoveQADialogOpen}
              fullWidth
              sx={{
                borderRadius: 1,
                py: 0.5,
                fontWeight: 600,
                fontSize: "0.75rem",
                boxShadow: "0 2px 8px rgba(211, 47, 47, 0.4)",
                "&:hover": {
                  boxShadow: "0 3px 10px rgba(211, 47, 47, 0.6)",
                },
              }}
            >
              Remove Member
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Dialogs */}
      <RemoveQADialog
        open={removeQADialogOpen}
        onClose={handleRemoveQADialogClose}
        qa_member={member}
      />
      <ResetPasswordQADialog
        open={resetPasswordDialogOpen}
        onClose={handleResetPasswordDialogClose}
        qa_member={member}
      />
    </Container>
  );
}
