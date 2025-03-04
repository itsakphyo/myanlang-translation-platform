import React, { useState, useEffect, useCallback } from "react";
import { Container, Button, Box, Typography, LinearProgress } from "@mui/material";
import { Language, ArrowDropDown, ArrowRightAlt } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LanguageSelectDialog from "@/components/freelancer/LanguageSelectDialog";
import TaskTranslationInterface from "@/components/freelancer/TaskTranslationInterface";
import logo from '@/assets/images/logo.png';
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useAuth";
import { useFreelancerLanguagePair } from "@/hooks/useLanguagePair";
import { LanguagePair } from "@/types/language";
import { useAssessmentTasks } from "@/hooks/useAssTask";
import AssTaskTranslationInterface from "@/components/freelancer/AssTaskTranslationInterface";
import { useTask } from "@/hooks/useTask";
import { OpenTask } from "@/types/task";

const theme = createTheme({
  palette: {
    primary: { main: "#1e3a8a" },
    secondary: { main: "#db2777" },
  },
  typography: { fontFamily: "Inter, sans-serif" },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          transition: "all 0.3s ease",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": { borderRadius: "12px" },
        },
      },
    },
  },
});

export default function TranslationTaskPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePair | null>(null);
  const [takingAssessment, setTakingAssessment] = useState(false);
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();

  // Query parameters for the open task query.
  // Note: Initial values are 0 (which we want to avoid in the API call).
  const [queryParams, setQueryParams] = useState<{
    freelancerId: number;
    sourceLanguageId: number;
    targetLanguageId: number;
  }>({
    freelancerId: user?.freelancer_id || 0,
    sourceLanguageId: selectedLanguagePair?.source_id || 0,
    targetLanguageId: selectedLanguagePair?.target_id || 0,
  });

  // useOpenTask from the custom useTask hook; auto fetching is disabled.
  const { useOpenTask } = useTask();
  const { data: task, isLoading: taskLoading, refetch } = useOpenTask(
    queryParams.freelancerId,
    queryParams.sourceLanguageId,
    queryParams.targetLanguageId,
    {
      enabled: false,
    }
  );

  // Update queryParams when the user triggers a new task.
  // Note: We no longer call refetch() here because the new state update happens asynchronously.
  const handleGetOpenTask = useCallback(() => {
    if (selectedLanguagePair && user?.freelancer_id) {
      const newQueryParams = {
        freelancerId: user.freelancer_id,
        sourceLanguageId: selectedLanguagePair.source_id,
        targetLanguageId: selectedLanguagePair.target_id,
      };
      console.log("Setting queryParams:", newQueryParams); // Debug log
      setQueryParams(newQueryParams);
    }
  }, [selectedLanguagePair, user]);

  // When queryParams update to valid (non-zero) values, trigger refetch.
  useEffect(() => {
    if (
      queryParams.freelancerId !== 0 &&
      queryParams.sourceLanguageId !== 0 &&
      queryParams.targetLanguageId !== 0
    ) {
      console.log("Refetching tasks with queryParams:", queryParams); // Debug log
      refetch();
    }
  }, [queryParams, refetch]);
  // State to hold language pair parameters.
  const [languagePairParams, setLanguagePairParams] = useState<{
    freelancerId: number;
    sourceLanguageId: number;
    targetLanguageId: number;
  } | null>(null);

  // Boolean state to control whether the language pair query should run.
  const [languagePairQueryEnabled, setLanguagePairQueryEnabled] = useState(false);

  // Boolean state to control whether the assessment tasks query should run.
  const [assessmentQueryEnabled, setAssessmentQueryEnabled] = useState(false);

  // Fetch language pair data only when explicitly enabled.
  const {
    data: languagePairData,
    isLoading: languagePairLoading,
    error: languagePairError,
    refetch: refetchLanguagePair
  } = useFreelancerLanguagePair(
    languagePairParams ? languagePairParams.freelancerId : 0,
    languagePairParams ? languagePairParams.sourceLanguageId : 0,
    languagePairParams ? languagePairParams.targetLanguageId : 0,
    languagePairQueryEnabled
  );

  // Fetch assessment tasks only when explicitly enabled.
  const { data: tasks, isLoading: tasksLoading } = useAssessmentTasks(
    languagePairParams ? languagePairParams.sourceLanguageId : 0,
    languagePairParams ? languagePairParams.targetLanguageId : 0,
    assessmentQueryEnabled
  );

  // Function to log assessment tasks (optional).
  const handleGetAsstask = useCallback(() => {
    console.log("Tasks:", tasks);
    console.log("Loading:", tasksLoading);
  }, [tasks, tasksLoading]);

  // Log language pair data when parameters exist.
  useEffect(() => {
    if (languagePairParams) {
      console.log("Language Pair Data:", languagePairData);
      console.log("Loading:", languagePairLoading);
      console.log("Error:", languagePairError);
    }
  }, [languagePairData, languagePairLoading, languagePairError, languagePairParams]);

  // Update language pair status and enable its query.
  const handleFreelancerLanguagePairStatus = useCallback(
    async (freelancerId: number, sourceLanguageId: number, targetLanguageId: number) => {
      setLanguagePairParams({ freelancerId, sourceLanguageId, targetLanguageId });
      setLanguagePairQueryEnabled(true);
    },
    []
  );

  // Get language pair status message based on current state and data.
  const getLanguagePairStatusMessage = useCallback(() => {
    if (takingAssessment) return null;

    if (!selectedLanguagePair) {
      return {
        title: "Welcome to MyanLang Translation!",
        body: "Please select a source and target language to begin your translation task. Let’s get started!",
      };
    }

    if (languagePairLoading || !languagePairData || "message" in languagePairData) {
      return {
        title: "⏳ Loading...",
        body: "🔄 Fetching language pair details, please wait a moment...",
      };
    }

    if (languagePairData.status === "complete" && (languagePairData.accuracy_rate ?? 0) < 50) {
      return {
        title: "⚠️ Language Pair Not Available",
        body: `Your accuracy rate is ${languagePairData.accuracy_rate}%, which does not meet our minimum requirement of 50%.  
               You can choose another language pair, try again later, or submit an appeal request if you believe this rating is incorrect.`,
      };
    }

    if (languagePairData.status === "under_review") {
      return {
        title: "🔍 Review In Progress",
        body: "Our QA team is currently reviewing your assessment task for this language pair. Please wait until the review process is completed. Thank you for your patience!",
      };
    }

    if (languagePairData.status === "not_found") {
      return {
        title: "📝 Assessment Required",
        body: "The selected language pair was not found in our system. To proceed, please complete an assessment test. Let’s get you started!",
      };
    }

    return null;
  }, [takingAssessment, selectedLanguagePair, languagePairLoading, languagePairData]);

  const message = getLanguagePairStatusMessage();
  const showAssessmentButton = languagePairData?.status === "not_found";
  const showAppealButton =
    languagePairData?.status === "complete" && (languagePairData.accuracy_rate ?? 0) < 50;

  // Prevent accidental navigation if there are unsaved changes.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (
        takingAssessment ||
        (selectedLanguagePair &&
          !languagePairLoading &&
          languagePairData &&
          !("message" in languagePairData) &&
          languagePairData.status === "complete" &&
          (languagePairData.accuracy_rate ?? 0) > 50)
      ) {
        event.preventDefault();
        event.returnValue = ""; // For Chrome
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload, { capture: true });
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload, { capture: true });
  }, [selectedLanguagePair, takingAssessment, languagePairData, languagePairLoading]);

  // Show the next task manually.
  const handleShowNext = useCallback(() => {
    console.log("Loading the next translation task.");
    handleGetOpenTask();
  }, [handleGetOpenTask]);

  useEffect(() => {
    console.log("Task Data:", task);
    console.log("Language Pair Data:", languagePairData);
  }, [task, languagePairData]);

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          gap: 2,
          padding: 4,
          maxWidth: "100%",
          minWidth: "100%",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          mb={4}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <img
              src={logo}
              alt="MyanLang logo"
              style={{ height: "50px", cursor: "pointer" }}
              onClick={() => {
                if (
                  !selectedLanguagePair ||
                  (selectedLanguagePair &&
                    languagePairData &&
                    !takingAssessment &&
                    (languagePairData.status !== "complete" ||
                      (languagePairData.accuracy_rate ?? 0) <= 50))
                ) {
                  navigate("/dashboard");
                } else {
                  alert(
                    "You have unsaved changes. Please submit your translation or close the task before leaving."
                  );
                }
              }}
            />
          </Box>
          <Button
            onClick={() => {
              if (
                !selectedLanguagePair ||
                (selectedLanguagePair &&
                  languagePairData &&
                  !takingAssessment &&
                  (languagePairData.status !== "complete" ||
                    (languagePairData.accuracy_rate ?? 0) <= 50))
              ) {
                setDialogOpen(true);
              } else {
                alert(
                  "You have unsaved changes. Please submit your translation or close the task before changing languages."
                );
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "none",
              gap: 2,
              px: 3,
              py: 1.5,
              color: "white",
              background: "linear-gradient(90deg, #4A90E2, #50A1F0)",
              boxShadow: "0px 1px 2px rgba(0,0,0,0.3)",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                background: "linear-gradient(90deg, #3F7EC5, #4291E5)",
              },
            }}
          >
            <Language sx={{ mr: 1 }} />
            {selectedLanguagePair
              ? `${selectedLanguagePair.source.charAt(0).toUpperCase() + selectedLanguagePair.source.slice(1)}`
              : "Choose Source Language "}
            {selectedLanguagePair && <ArrowRightAlt sx={{ mx: 1 }} />}
            {selectedLanguagePair
              ? `${selectedLanguagePair.target.charAt(0).toUpperCase() + selectedLanguagePair.target.slice(1)}`
              : "and Target Language"}
            <ArrowDropDown sx={{ ml: 1 }} />
          </Button>
        </Box>

        {/* Status Message */}
        {message && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            sx={{ mt: 4 }}
          >
            <Typography variant="h5" color="textPrimary" gutterBottom marginBottom={3}>
              {message.title}
            </Typography>
            <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: "pre-line" }}>
              {message.body}
            </Typography>
            {showAssessmentButton && selectedLanguagePair && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                  setTakingAssessment(true);
                  setAssessmentQueryEnabled(true);
                  handleGetAsstask();
                }}
              >
                Take Assessment Test
              </Button>
            )}
            {showAppealButton && selectedLanguagePair && (
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={() => (window.location.href = "/appeal")}
              >
                Submit Appeal Request
              </Button>
            )}
          </Box>
        )}

        {/* Language Select Dialog */}
        <LanguageSelectDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(pair) => {
            setSelectedLanguagePair(pair);
            setDialogOpen(false);
            if (user) {
              handleFreelancerLanguagePairStatus(user.freelancer_id, pair.source_id, pair.target_id);
              setQueryParams({
                freelancerId: user.freelancer_id,
                sourceLanguageId: pair.source_id,
                targetLanguageId: pair.target_id,
              });
              handleGetOpenTask();
            }
          }}
        />
        
        {/* Translation Task Interface */}
        {selectedLanguagePair &&
          !languagePairLoading &&
          languagePairData &&
          !("message" in languagePairData) &&
          languagePairData.status === "complete" &&
          (languagePairData.accuracy_rate ?? 0) > 50 && (
            <>
              {taskLoading ? (
                <LinearProgress />
              ) : task ? (
                <TaskTranslationInterface
                  task={task}
                  onClose={() => setSelectedLanguagePair(null)}
                  onShowNext={handleShowNext}
                />
              ) : (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="body1" color="error">
                    No available tasks for this language pair
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 2 }} onClick={handleGetOpenTask}>
                    Retry
                  </Button>
                </Box>
              )}
            </>
          )}


        {/* Assessment Task Interface */}
        {takingAssessment && tasks && (
          <AssTaskTranslationInterface
            tasks={tasks}
            freelancerId={user?.freelancer_id || 0}
            onClose={() => {
              setTakingAssessment(false);
              setSelectedLanguagePair(null);
            }}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}
