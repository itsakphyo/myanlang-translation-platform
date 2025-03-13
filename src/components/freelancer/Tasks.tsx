"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Container,
  Button,
  Box,
  Typography,
  LinearProgress,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
  Fade,
  Grid,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Language,
  ArrowDropDown,
  ArrowRightAlt,
  Assessment,
  Gavel,
  Info,
  CheckCircle,
  ErrorOutline,
  HourglassEmpty,
  Refresh,
} from "@mui/icons-material"
import { ThemeProvider } from "@mui/material/styles"
import LanguageSelectDialog from "@/components/freelancer/LanguageSelectDialog"
import TaskTranslationInterface from "@/components/freelancer/TaskTranslationInterface"
import logo from "@/assets/images/logo.png"
import { useNavigate } from "react-router-dom"
import { useCurrentUser } from "@/hooks/useAuth"
import { useFreelancerLanguagePair } from "@/hooks/useLanguagePair"
import type { LanguagePair } from "@/types/language"
import { useAssessmentTasks } from "@/hooks/useAssTask"
import AssTaskTranslationInterface from "@/components/freelancer/AssTaskTranslationInterface"
import { useTask } from "@/hooks/useTask"
import type { OpenTask } from "@/types/task"
import theme from "@/theme"
import { useDialog } from "@/contexts/DialogContext"

export default function TranslationTaskPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePair | null>(null)
  const [takingAssessment, setTakingAssessment] = useState(false)
  const { data: user } = useCurrentUser()
  const navigate = useNavigate()
  const { openDialog } = useDialog()
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"))

  const handleRequestAppeal = (souce_language_id: number, target_language_id: number) => {
    openDialog("appeal-request", { souce_language_id, target_language_id })
  }

  // Query parameters for the open task query.
  const [queryParams, setQueryParams] = useState<{
    freelancerId: number
    sourceLanguageId: number
    targetLanguageId: number
  }>({
    freelancerId: user?.freelancer_id || 0,
    sourceLanguageId: selectedLanguagePair?.source_id || 0,
    targetLanguageId: selectedLanguagePair?.target_id || 0,
  })

  // useOpenTask from the custom useTask hook; auto fetching is disabled.
  const { useOpenTask } = useTask()
  const {
    data: task,
    isLoading: taskLoading,
    refetch,
  } = useOpenTask(queryParams.freelancerId, queryParams.sourceLanguageId, queryParams.targetLanguageId, {
    enabled: false,
  })

  // Use a ref to hold the last task's ID (avoids triggering extra renders)
  const lastTaskIdRef = useRef<number | null>(null)
  // State for the task to be displayed in the UI.
  const [currentTask, setCurrentTask] = useState<OpenTask | null>(null)

  // When the language pair changes, clear any stored task info.
  useEffect(() => {
    lastTaskIdRef.current = null
    setCurrentTask(null)
  }, [selectedLanguagePair])

  // When a new task is fetched, update currentTask only if the task's ID is different.
  useEffect(() => {
    if (task) {
      if (lastTaskIdRef.current === null || task.task_id !== lastTaskIdRef.current) {
        setCurrentTask(task)
        lastTaskIdRef.current = task.task_id
      } else {
        // The fetched task is the same as the last one; clear the UI.
        setCurrentTask(null)
      }
    }
  }, [task])

  // Update queryParams when the user triggers a new task.
  const handleGetOpenTask = useCallback(() => {
    if (selectedLanguagePair && user?.freelancer_id) {
      const newQueryParams = {
        freelancerId: user.freelancer_id,
        sourceLanguageId: selectedLanguagePair.source_id,
        targetLanguageId: selectedLanguagePair.target_id,
      }
      setQueryParams(newQueryParams)
    }
  }, [selectedLanguagePair, user])

  // When queryParams update to valid (non-zero) values, trigger refetch.
  useEffect(() => {
    if (queryParams.freelancerId !== 0 && queryParams.sourceLanguageId !== 0 && queryParams.targetLanguageId !== 0) {
      refetch()
    }
  }, [queryParams, refetch])

  // State for language pair and assessment queries.
  const [languagePairParams, setLanguagePairParams] = useState<{
    freelancerId: number
    sourceLanguageId: number
    targetLanguageId: number
  } | null>(null)
  const [languagePairQueryEnabled, setLanguagePairQueryEnabled] = useState(false)
  const [assessmentQueryEnabled, setAssessmentQueryEnabled] = useState(false)

  const { data: languagePairData, isLoading: languagePairLoading } = useFreelancerLanguagePair(
    languagePairParams ? languagePairParams.freelancerId : 0,
    languagePairParams ? languagePairParams.sourceLanguageId : 0,
    languagePairParams ? languagePairParams.targetLanguageId : 0,
    languagePairQueryEnabled,
  )

  const { data: tasks, isLoading: tasksLoading } = useAssessmentTasks(
    languagePairParams ? languagePairParams.sourceLanguageId : 0,
    languagePairParams ? languagePairParams.targetLanguageId : 0,
    assessmentQueryEnabled,
  )

  const handleGetAsstask = useCallback(() => { }, [tasks, tasksLoading])

  const handleFreelancerLanguagePairStatus = useCallback(
    async (freelancerId: number, sourceLanguageId: number, targetLanguageId: number) => {
      setLanguagePairParams({ freelancerId, sourceLanguageId, targetLanguageId })
      setLanguagePairQueryEnabled(true)
    },
    [],
  )

  const getLanguagePairStatusMessage = useCallback(() => {
    if (takingAssessment) return null

    if (!selectedLanguagePair) {
      return {
        title: "Welcome to MyanLang Translation!",
        body: "Please select a source and target language to begin your translation task. Let's get started!",
        icon: <Info fontSize="large" color="primary" />,
        severity: "info",
      }
    }

    if (languagePairLoading || !languagePairData || "message" in languagePairData) {
      return {
        title: "Loading...",
        body: "Fetching language pair details, please wait a moment...",
        icon: <HourglassEmpty fontSize="large" color="primary" />,
        severity: "info",
      }
    }

    if (languagePairData.status === "complete" && (languagePairData.accuracy_rate ?? 0) < 50) {
      return {
        title: "Language Pair Not Available",
        body: `Your accuracy rate is ${languagePairData.accuracy_rate}%, which does not meet our minimum requirement of 50%.  
               You can choose another language pair, try again later, or submit an appeal request if you believe this rating is incorrect.`,
        icon: <ErrorOutline fontSize="large" color="error" />,
        severity: "error",
      }
    }

    if (languagePairData.status === "under_review") {
      return {
        title: "Review In Progress",
        body: "Our QA team is currently reviewing your assessment task for this language pair. Please wait until the review process is completed. Thank you for your patience!",
        icon: <HourglassEmpty fontSize="large" color="warning" />,
        severity: "warning",
      }
    }

    if (languagePairData.status === "not_found") {
      return {
        title: "Assessment Required",
        body: "The selected language pair was not found in our system. To proceed, please complete an assessment test. Let's get you started!",
        icon: <Assessment fontSize="large" color="primary" />,
        severity: "info",
      }
    }

    return null
  }, [takingAssessment, selectedLanguagePair, languagePairLoading, languagePairData])

  const message = getLanguagePairStatusMessage()
  const showAssessmentButton = languagePairData?.status === "not_found"
  const showAppealButton = languagePairData?.status === "complete" && (languagePairData.accuracy_rate ?? 0) < 50

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (
        takingAssessment ||
        (selectedLanguagePair &&
          !languagePairLoading &&
          languagePairData &&
          !("message" in languagePairData) &&
          languagePairData.status === "complete" &&
          (languagePairData.accuracy_rate ?? 0) > 50 &&
          currentTask) ||
        currentTask
      ) {
        event.preventDefault()
        event.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload, { capture: true })
    return () => window.removeEventListener("beforeunload", handleBeforeUnload, { capture: true })
  }, [selectedLanguagePair, takingAssessment, languagePairData, languagePairLoading, task])

  const handleShowNext = useCallback(() => {
    setCurrentTask(null)
    handleGetOpenTask()
  }, [handleGetOpenTask])

  const getStatusChip = useCallback(() => {
    if (!selectedLanguagePair || !languagePairData || "message" in languagePairData) return null

    if (languagePairData.status === "complete" && (languagePairData.accuracy_rate ?? 0) >= 50) {
      return (
        <Chip
          icon={<CheckCircle />}
          label={`Qualified (${languagePairData.accuracy_rate}%)`}
          color="success"
          variant="outlined"
        />
      )
    } else if (languagePairData.status === "complete") {
      return (
        <Chip
          icon={<ErrorOutline />}
          label={`Not Qualified (${languagePairData.accuracy_rate}%)`}
          color="error"
          variant="outlined"
        />
      )
    } else if (languagePairData.status === "under_review") {
      return <Chip icon={<HourglassEmpty />} label="Under Review" color="warning" variant="outlined" />
    } else if (languagePairData.status === "not_found") {
      return <Chip icon={<Assessment />} label="Assessment Required" color="primary" variant="outlined" />
    }

    return null
  }, [selectedLanguagePair, languagePairData])

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth={false}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          p: { xs: 1, sm: 2, md: 3 },
          bgcolor: "#f8f9fa",
        }}
      >
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            borderRadius: 2,
            background: "linear-gradient(to right, #ffffff, #f5f9ff)",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
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
              <Tooltip title="Return to Dashboard">
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                  onClick={() => {
                    if (
                      !selectedLanguagePair ||
                      (selectedLanguagePair &&
                        languagePairData &&
                        !takingAssessment &&
                        (languagePairData.status !== "complete" || (languagePairData.accuracy_rate ?? 0) <= 50)) ||
                      !currentTask
                    ) {
                      navigate("/dashboard")
                    } else {
                      alert(
                        "You have unsaved changes. Please submit your translation or close the task before leaving.",
                      )
                    }
                  }}
                >
                  <img src={logo || "/placeholder.svg"} alt="MyanLang logo" style={{ height: "50px" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      ml: 1,
                      fontWeight: 600,
                      display: { xs: "none", sm: "block" },
                      color: "#2c3e50",
                    }}
                  >
                    MyanLang
                  </Typography>
                </Box>
              </Tooltip>

              {getStatusChip() && <Box sx={{ ml: 2 }}>{getStatusChip()}</Box>}
            </Box>

            <Button
              onClick={() => {
                if (
                  !selectedLanguagePair ||
                  (selectedLanguagePair &&
                    languagePairData &&
                    !takingAssessment &&
                    (languagePairData.status !== "complete" || (languagePairData.accuracy_rate ?? 0) <= 50)) ||
                  !currentTask
                ) {
                  setDialogOpen(true)
                } else {
                  alert(
                    "You have unsaved changes. Please submit your translation or close the task before changing languages.",
                  )
                }
              }}
              variant="contained"
              sx={{
                display: "flex",
                alignItems: "center",
                textTransform: "none",
                gap: 1,
                px: { xs: 2, sm: 3 },
                py: 1.5,
                color: "white",
                background: "linear-gradient(90deg, #4A90E2, #50A1F0)",
                boxShadow: "0px 2px 8px rgba(74, 144, 226, 0.3)",
                borderRadius: "10px",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0px 4px 12px rgba(74, 144, 226, 0.4)",
                  background: "linear-gradient(90deg, #3F7EC5, #4291E5)",
                },
              }}
            >
              <Language sx={{ mr: { xs: 0.5, sm: 1 } }} />
              {!isMobile ? (
                <>
                  {selectedLanguagePair
                    ? `${selectedLanguagePair.source.charAt(0).toUpperCase() + selectedLanguagePair.source.slice(1)}`
                    : "Choose Source Language "}
                  {selectedLanguagePair && <ArrowRightAlt sx={{ mx: 1 }} />}
                  {selectedLanguagePair
                    ? `${selectedLanguagePair.target.charAt(0).toUpperCase() + selectedLanguagePair.target.slice(1)}`
                    : "and Target Language"}
                </>
              ) : (
                <>
                  {selectedLanguagePair
                    ? `${selectedLanguagePair.source.charAt(0).toUpperCase() + selectedLanguagePair.source.slice(1)} → ${selectedLanguagePair.target.charAt(0).toUpperCase() + selectedLanguagePair.target.slice(1)}`
                    : "Select Languages"}
                </>
              )}
              <ArrowDropDown sx={{ ml: 0.5 }} />
            </Button>

            <Box sx={{ display: { xs: "block", sm: "none" }, width: "100%", mt: 1 }}>
              <Divider />
            </Box>
          </Box>
        </Paper>

        {/* Status Message */}
        {message && (
          <Fade in={!!message} timeout={500}>
            <Card
              sx={{
                mb: 4,
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
                border:
                  message.severity === "error"
                    ? "1px solid #ffcdd2"
                    : message.severity === "warning"
                      ? "1px solid #ffe0b2"
                      : "1px solid #e3f2fd",
              }}
            >
              <Box
                sx={{
                  height: 8,
                  width: "100%",
                  bgcolor:
                    message.severity === "error"
                      ? "error.main"
                      : message.severity === "warning"
                        ? "warning.main"
                        : "primary.main",
                }}
              />
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={2} md={1} sx={{ textAlign: "center" }}>
                    {message.icon}
                  </Grid>
                  <Grid item xs={12} sm={10} md={11}>
                    <Typography variant="h5" color="textPrimary" gutterBottom fontWeight={600}>
                      {message.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ whiteSpace: "pre-line" }}>
                      {message.body}
                    </Typography>

                    <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: { xs: "center", sm: "flex-start" } }}>
                      {showAssessmentButton && selectedLanguagePair && (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Assessment />}
                          onClick={() => {
                            setTakingAssessment(true)
                            setAssessmentQueryEnabled(true)
                            handleGetAsstask()
                          }}
                          sx={{
                            borderRadius: 2,
                            boxShadow: 2,
                            px: 3,
                          }}
                        >
                          Take Assessment Test
                        </Button>
                      )}
                      {showAppealButton && selectedLanguagePair && (
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<Gavel />}
                          onClick={() =>
                            handleRequestAppeal(selectedLanguagePair.source_id, selectedLanguagePair.target_id)
                          }
                          sx={{
                            borderRadius: 2,
                            boxShadow: 2,
                            px: 3,
                          }}
                        >
                          Submit Appeal Request
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Language Select Dialog */}
        <LanguageSelectDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(pair) => {
            setSelectedLanguagePair(pair)
            setDialogOpen(false)
            if (user) {
              handleFreelancerLanguagePairStatus(user.freelancer_id, pair.source_id, pair.target_id)
              setQueryParams({
                freelancerId: user.freelancer_id,
                sourceLanguageId: pair.source_id,
                targetLanguageId: pair.target_id,
              })
              handleGetOpenTask()
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
                <Box
                  sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Loading task...
                  </Typography>
                  <LinearProgress sx={{ width: "50%", mt: 2 }} />
                </Box>
              ) : currentTask ? (
                <TaskTranslationInterface
                  task={currentTask}
                  onClose={() => {
                    setSelectedLanguagePair(null)
                    setCurrentTask(null)
                  }}
                  onShowNext={handleShowNext}
                />
              ) : (
                <Box
                  sx={{
                    p: 6,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
                  <Typography variant="h5" color="textSecondary" gutterBottom>
                    No available tasks for this language pair
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: 500 }}>
                    There are currently no tasks available for your selected language pair. Please try again later or
                    select a different language pair.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    sx={{ mt: 2, borderRadius: 2, px: 3 }}
                    onClick={handleGetOpenTask}
                  >
                    Retry
                  </Button>
                </Box>
              )}
            </>
          )}

        {/* Assessment Task Interface */}
        {takingAssessment && tasks && (
          <>
            <AssTaskTranslationInterface
              tasks={tasks}
              freelancerId={user?.freelancer_id || 0}
              onClose={() => {
                setTakingAssessment(false)
                setSelectedLanguagePair(null)
              }}
            />
          </>
        )}

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: "auto",
            pt: 2,
            pb: 1,
            textAlign: "center",
            opacity: 0.7,
          }}
        >
          <Typography variant="caption" color="textSecondary">
            © {new Date().getFullYear()} MyanLang Translation Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

