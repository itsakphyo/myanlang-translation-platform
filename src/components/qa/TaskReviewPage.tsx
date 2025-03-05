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

const TaskTypeToggle = ({ value, icon, label, ...props }: { value: string; icon: React.ReactNode; label: string }) => (
  <ToggleButton
    value={value}
    sx={{
      px: 4,
      py: 2,
      borderRadius: "12px!important",
      "&.Mui-selected": { bgcolor: alpha(theme.palette.primary.main, 0.1) },
    }}
    {...props}
  >
    <Stack direction="row" alignItems="center" spacing={2}>
      {icon}
      <Typography variant="h6" fontWeight={600}>
        {label}
      </Typography>
      <ChevronRight sx={{ color: theme.palette.primary.main }} />
    </Stack>
  </ToggleButton>
);

const TaskReviewContent = ({ selectedLanguagePair, taskType, assTaskOpen, setAssTaskOpen, setSelectedLanguagePair }: { selectedLanguagePair: LanguagePair | null, taskType: "assessment" | "submission", assTaskOpen: boolean, setAssTaskOpen: (open: boolean) => void, setSelectedLanguagePair: (pair: LanguagePair | null) => void }) => {
  const queryClient = useQueryClient();
  const { mutate: sentData } = useAssReviewedSubmit();
  
  const { data, error, isLoading } = useAssessmentTasksForReview(
    selectedLanguagePair?.source_id ?? 0,
    selectedLanguagePair?.target_id ?? 0
  );

  useEffect(() => {
    if (error) console.error("Error fetching assessment tasks:", error);
  }, [error]);

  useEffect(() => {
    if (data?.length > 0) {
      setAssTaskOpen(true);
    }
  }, [data, setAssTaskOpen]);

  if (!selectedLanguagePair) {
    return (
      <Box textAlign="center" py={10} sx={{ opacity: 0.7 }}>
        <Language sx={{ fontSize: 64, mb: 2, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">
          Select a language pair to begin reviewing
        </Typography>
      </Box>
    );
  }

  if (taskType === "assessment") {
    return <SubmissionTaskReviewInterface {...dummyData} />;
  }

  const handleSubmit = (data: any) => {
    console.log("The data I send is ", JSON.stringify(data));
    sentData(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['assessmentTasks', selectedLanguagePair?.source_id, selectedLanguagePair?.target_id] });
        setAssTaskOpen(false);
        setSelectedLanguagePair(null);
        queryClient.setQueryData(['assessmentTasks', selectedLanguagePair?.source_id, selectedLanguagePair?.target_id], []);
      },
    });
  };

  return (
    <>
      {isLoading && <Typography variant="body1">Loading bulk review data...</Typography>}
      {error && <Typography color="error">No Assessment Tasks To Review For This Language Pair</Typography>}
      {data?.length > 0 && assTaskOpen && data[0]?.tasks && (
        <BulkSubmissionReview
          data={data[0]}
          onSubmit={handleSubmit}
          onClose={() => {
            setAssTaskOpen(false);
            setSelectedLanguagePair(null);
          }}
        />
      )}
    </>
  );
};

export default function TaskReviewPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assTaskOpen, setAssTaskOpen] = useState(false);
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
        <ContentBox>
          <TaskReviewContent
            selectedLanguagePair={selectedLanguagePair}
            taskType={taskType}
            assTaskOpen={assTaskOpen}
            setAssTaskOpen={setAssTaskOpen}
            setSelectedLanguagePair={setSelectedLanguagePair}
          />
        </ContentBox>

        <LanguageSelectDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(pair: LanguagePair) => {
            setSelectedLanguagePair(pair);
            setDialogOpen(false);
          }}
        />
      </Container>
    </ThemeProvider>
  );
}

// Helper components
const LanguageSelector = ({ selectedLanguagePair, onOpen }: { selectedLanguagePair: LanguagePair | null, onOpen: () => void }) => (
  <Button
    variant="outlined"
    onClick={onOpen}
    sx={{
      border: "2px solid",
      borderColor: "primary.main",
      "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1}>
      <Language sx={{ color: "primary.main" }} />
      {selectedLanguagePair ? (
        <Fade in={!!selectedLanguagePair}>
          <Typography fontWeight={600}>
            {selectedLanguagePair.source} → {selectedLanguagePair.target}
          </Typography>
        </Fade>
      ) : (
        <Typography fontWeight={600}>Select Language</Typography>
      )}
      <ArrowDropDown sx={{ color: "primary.main" }} />
    </Stack>
  </Button>
);

import { ReactNode } from "react";

const ContentBox = ({ children }: { children: ReactNode }) => (
  <Box sx={{
    maxWidth: 1200,
    mx: "auto",
    bgcolor: "white",
    borderRadius: 4,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    p: 4,
  }}>
    {children}
  </Box>
);

// Dummy data and handlers
const dummyData = {
  originalText: "This is the original text to be translated.",
  sourceLanguage: "English",
  submittedText: "Este es el texto traducido.",
  targetLanguage: "Spanish",
  onRejectAndClose: () => console.log("Rejected and closed"),
  onRejectAndShowNext: () => console.log("Rejected and next"),
  onApproveAndClose: () => console.log("Approved and closed"),
  onApproveAndShowNext: () => console.log("Approved and next"),
};