import React, { useState, useEffect, useCallback, useRef } from "react";
import { Container, Button, Box, Typography, LinearProgress } from "@mui/material";
import { Language, ArrowDropDown, ArrowRightAlt } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
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
import theme from "@/theme";

export default function TranslationTaskPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePair | null>(null);
  const [takingAssessment, setTakingAssessment] = useState(false);
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();

  // Query parameters for the open task query.
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
    { enabled: false }
  );

  // Use a ref to hold the last task's ID (avoids triggering extra renders)
  const lastTaskIdRef = useRef<number | null>(null);
  // State for the task to be displayed in the UI.
  const [currentTask, setCurrentTask] = useState<OpenTask | null>(null);

  // When the language pair changes, clear any stored task info.
  useEffect(() => {
    lastTaskIdRef.current = null;
    setCurrentTask(null);
  }, [selectedLanguagePair]);

  // When a new task is fetched, update currentTask only if the task's ID is different.
  useEffect(() => {
    if (task) {
      if (lastTaskIdRef.current === null || task.task_id !== lastTaskIdRef.current) {
        setCurrentTask(task);
        lastTaskIdRef.current = task.task_id;
      } else {
        // The fetched task is the same as the last one; clear the UI.
        setCurrentTask(null);
      }
    }
  }, [task]);

  // Update queryParams when the user triggers a new task.
  const handleGetOpenTask = useCallback(() => {
    if (selectedLanguagePair && user?.freelancer_id) {
      const newQueryParams = {
        freelancerId: user.freelancer_id,
        sourceLanguageId: selectedLanguagePair.source_id,
        targetLanguageId: selectedLanguagePair.target_id,
      };
      console.log("Setting queryParams:", newQueryParams);
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
      console.log("Refetching tasks with queryParams:", queryParams);
      refetch();
    }
  }, [queryParams, refetch]);

  // State for language pair and assessment queries.
  const [languagePairParams, setLanguagePairParams] = useState<{
    freelancerId: number;
    sourceLanguageId: number;
    targetLanguageId: number;
  } | null>(null);
  const [languagePairQueryEnabled, setLanguagePairQueryEnabled] = useState(false);
  const [assessmentQueryEnabled, setAssessmentQueryEnabled] = useState(false);

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

  const { data: tasks, isLoading: tasksLoading } = useAssessmentTasks(
    languagePairParams ? languagePairParams.sourceLanguageId : 0,
    languagePairParams ? languagePairParams.targetLanguageId : 0,
    assessmentQueryEnabled
  );

  const handleGetAsstask = useCallback(() => {
    console.log("Tasks:", tasks);
    console.log("Loading:", tasksLoading);
  }, [tasks, tasksLoading]);

  useEffect(() => {
    if (languagePairParams) {
      console.log("Language Pair Data:", languagePairData);
      console.log("Loading:", languagePairLoading);
      console.log("Error:", languagePairError);
    }
  }, [languagePairData, languagePairLoading, languagePairError, languagePairParams]);

  const handleFreelancerLanguagePairStatus = useCallback(
    async (freelancerId: number, sourceLanguageId: number, targetLanguageId: number) => {
      setLanguagePairParams({ freelancerId, sourceLanguageId, targetLanguageId });
      setLanguagePairQueryEnabled(true);
    },
    []
  );

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
    languagePairData?.status === "complete" &&
    (languagePairData.accuracy_rate ?? 0) < 50;

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
          (languagePairData.accuracy_rate ?? 0) > 50) && currentTask ||
          currentTask
      ) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload, { capture: true });
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload, { capture: true });
  }, [selectedLanguagePair, takingAssessment, languagePairData, languagePairLoading, task]);

  // When the user clicks "Next", clear the displayed task immediately then update the query parameters.
  const handleShowNext = useCallback(() => {
    console.log("Loading the next translation task.");
    setCurrentTask(null);
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
          padding: 2,
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
                      (languagePairData.accuracy_rate ?? 0) <= 50)) ||
                  !currentTask
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
                    (languagePairData.accuracy_rate ?? 0) <= 50)) ||
                !currentTask
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
              ) : currentTask ? (
                <TaskTranslationInterface
                  task={currentTask}
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
