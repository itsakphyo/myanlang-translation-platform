import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Box,
  Typography,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Fade,
} from "@mui/material";
import { Language, ArrowDropDown, Task, Assignment, ChevronRight } from "@mui/icons-material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import LanguageSelectDialog from "@/components/freelancer/LanguageSelectDialog";
import SubmissionTaskReviewInterface from "@/components/qa/SubmissionTaskReviewInterface";
import BulkSubmissionReview from "@/components/qa/BulkSubmissionReview";
import { useAssessmentTasksForReview } from "@/hooks/useAssTaskForReview";
import { LanguagePair } from "@/types/language";
import logo from "@/assets/images/logo.png";
import { useAssReviewedSubmit } from "@/hooks/useAssTask"
import { useQueryClient } from '@tanstack/react-query';
import LanguageSelector from "./helperComponents/LanguageSelector";
import TaskReviewContent from "./helperComponents/TaskReviewContent";
import TaskTypeToggle from "./helperComponents/TaskTypeToggle";

// Modern theme configuration
const theme = createTheme({
  palette: {
    primary: { main: "#2563eb" },
    secondary: { main: "#4f46e5" },
    background: { default: "#f8fafc" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h5: { fontWeight: 700, letterSpacing: "-0.025em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
          padding: "12px 24px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});


export default function TaskReviewPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assTaskOpen, setAssTaskOpen] = useState(false);
  const [isSubmissionTaskOpen, setIsSubmissionTaskOpen] = useState(true);
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePair | null>(null);
  const [taskType, setTaskType] = useState<"assessment" | "submission">("assessment");
  const navigate = useNavigate();

  const handleTaskTypeChange = (_: React.MouseEvent<HTMLElement>, newType: string) => {
    if (newType) setTaskType(newType as "assessment" | "submission");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} sx={{ minHeight: "100vh", p: 4 }}>
        {/* Header Section */}
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 8 }}>
          <Box onClick={() => navigate("/qa-dashboard")} sx={{ cursor: "pointer" }}>
            <img src={logo} alt="MyanLang logo" style={{ height: "48px" }} />
          </Box>

          <ToggleButtonGroup
            value={taskType}
            exclusive
            onChange={handleTaskTypeChange}
            sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", gap: 1 }}
          >
            <TaskTypeToggle
              value="assessment"
              icon={<Task sx={{ color: "primary.main" }} />}
              label="Review Assessments"
            />
            <TaskTypeToggle
              value="submission"
              icon={<Assignment sx={{ color: "primary.main" }} />}
              label="Review Submissions"
            />
          </ToggleButtonGroup>

          <LanguageSelector
            selectedLanguagePair={selectedLanguagePair}
            onOpen={() => setDialogOpen(true)}
          />
        </Box>

        {/* Main Content Area */}
        <Box sx={{
          maxWidth: 1200,
          mx: "auto",
          bgcolor: "white",
          borderRadius: 4,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          p: 4,
        }}>
          <TaskReviewContent
            selectedLanguagePair={selectedLanguagePair}
            taskType={taskType}
            assTaskOpen={assTaskOpen}
            setAssTaskOpen={setAssTaskOpen}
            isSubmissionTaskOpen={isSubmissionTaskOpen}
            setIsSubmissionTaskOpen={setIsSubmissionTaskOpen}
            setSelectedLanguagePair={setSelectedLanguagePair}
          />
        </Box>

        <LanguageSelectDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(pair: LanguagePair) => {
            setSelectedLanguagePair(pair);
            setIsSubmissionTaskOpen(true);
            setAssTaskOpen(true);
            setDialogOpen(false);
          }}
        />
      </Container>
    </ThemeProvider>
  );
}