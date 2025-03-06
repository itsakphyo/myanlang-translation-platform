import React, { useState } from "react";
import {
  Container,
  Box,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Task, Assignment } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import LanguageSelectDialog from "@/components/freelancer/LanguageSelectDialog";
import LanguageSelector from "./helperComponents/LanguageSelector";
import TaskReviewContent from "./helperComponents/TaskReviewContent";
import TaskTypeToggle from "./helperComponents/TaskTypeToggle";
import logo from "@/assets/images/logo.png";
import { LanguagePair } from "@/types/language";

const baseTheme = createTheme();

// Modern theme configuration
const theme = createTheme({
  palette: {
    primary: { main: "#2563eb" },
    secondary: { main: "#4f46e5" },
    background: { default: "#f8fafc" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h5: {
      fontWeight: 700,
      [baseTheme.breakpoints.up("md")]: {
        fontSize: "1.2rem",
      },
      [baseTheme.breakpoints.up("lg")]: {
        fontSize: "1.5rem",
      },
    },
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleTaskTypeChange = (_: React.MouseEvent<HTMLElement>, newType: string) => {
    if (newType) setTaskType(newType as "assessment" | "submission");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} sx={{ minHeight: "100vh", p: { xs: 2, md: 4 } }}>
        {/* Responsive Header Section */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          gap={2}
          sx={{ mb: { xs: 4, md: 8 }, position: "relative" }}
        >
          {/* Logo */}
          <Box onClick={() => navigate("/qa-dashboard")} sx={{ cursor: "pointer" }}>
            <img
              src={logo}
              alt="MyanLang logo"
              style={{ height: isMobile ? "40px" : "48px" }}
            />
          </Box>

          {/* Task Type Toggle */}
          <ToggleButtonGroup
            value={taskType}
            exclusive
            onChange={handleTaskTypeChange}
            sx={{
              mx: "auto",
              width: { xs: "100%", md: "auto" },
              order: { xs: 2, md: 0 },
              transform: { md: "translateX(-50%)" },
              position: { md: "absolute" },
              left: { md: "50%" },
              "& .MuiToggleButton-root": {
                flex: 1,
                minWidth: 0,
                px: { xs: 1, md: 2 },
                py: { xs: 0.5, md: 1 },
                fontSize: { xs: "0.75rem", md: "1rem" },
              },
            }}
          >
            <Box sx={{ width: { xs: "50%", md: "auto" } }}>
              <TaskTypeToggle
                value="assessment"
                icon={<Task sx={{ color: "primary.main", fontSize: { xs: "1rem", md: "1.5rem" } }} />}
                label="Review Assessments"
              />
            </Box>
            <Box sx={{ width: { xs: "50%", md: "auto" } }}>
              <TaskTypeToggle
                value="submission"
                icon={<Assignment sx={{ color: "primary.main", fontSize: { xs: "1rem", md: "1.5rem" } }} />}
                label="Review Submissions"
              />
            </Box>
          </ToggleButtonGroup>

          {/* Language Selector */}
          <Box sx={{ order: { xs: 1, md: 0 }, ml: { xs: "auto", md: 0 } }}>
            <LanguageSelector
              selectedLanguagePair={selectedLanguagePair}
              onOpen={() => setDialogOpen(true)}
            />
          </Box>
        </Box>

        {/* Responsive Main Content Area */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            bgcolor: "white",
            borderRadius: { xs: 2, md: 4 },
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            p: { xs: 2, md: 4 },
          }}
        >
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

        {/* Language Select Dialog */}
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