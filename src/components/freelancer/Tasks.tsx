import React, { useState, useEffect } from "react";
import { Container, Button, Box, Typography } from "@mui/material";
import { Language, ArrowDropDown, ArrowRightAlt } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LanguageSelectDialog from "@/components/freelancer/LanguageSelectDialog";
import TaskTranslationInterface from "@/components/freelancer/TaskTranslationInterface";
import logo from '@/assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useAuth';
import { useFreelancerLanguagePair } from "@/hooks/useLanguagePair";
import { LanguagePair } from "@/types/language";

const theme = createTheme({
  palette: {
    primary: { main: '#1e3a8a' },
    secondary: { main: '#db2777' },
  },
  typography: { fontFamily: 'Inter, sans-serif' },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
        },
      },
    },
  },
});

export default function TranslationTaskPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePair | null>(null);
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();

  // State to hold parameters for the language pair query.
  const [languagePairParams, setLanguagePairParams] = useState<{
    freelancerId: number;
    sourceLanguageId: number;
    targetLanguageId: number;
  } | null>(null);

  // Call the hook at the top level.
  const {
    data: languagePairData,
    isLoading: languagePairLoading,
    error: languagePairError,
    refetch: refetchLanguagePair,
  } = useFreelancerLanguagePair(
    languagePairParams?.freelancerId || 0,
    languagePairParams?.sourceLanguageId || 0,
    languagePairParams?.targetLanguageId || 0
  );

  // Log the query results whenever they change.
  useEffect(() => {
    if (languagePairParams) {
      console.log("Language Pair Data:", languagePairData);
      console.log("Loading:", languagePairLoading);
      console.log("Error:", languagePairError);
    }
  }, [languagePairData, languagePairLoading, languagePairError, languagePairParams]);

  // This function updates the query parameters and triggers a refetch.
  const handleFreelancerLanguagePairStatus = (
    freelancerId: number,
    sourceLanguageId: number,
    targetLanguageId: number
  ) => {
    setLanguagePairParams({ freelancerId, sourceLanguageId, targetLanguageId });
    refetchLanguagePair();
  };

  const getLanguagePairStatusMessage = () => {
    // Case 1: No language pair selected.
    if (!selectedLanguagePair) {
      return {
        title: 'Welcome to MyanLang Translation!',
        body: 'Please select a source and target language to begin your translation task. Let’s get started!',
      };
    }

    // Loading or invalid data
    if (languagePairLoading || !languagePairData || ('message' in languagePairData)) {
      return {
        title: '⏳ Loading...',
        body: '🔄 Fetching language pair details, please wait a moment...',
      };
    }

    // Case 2: Status is "complete" but accuracy is below 50.
    if (languagePairData.status === 'complete' && (languagePairData.accuracy_rate ?? 0) < 50) {
      return {
        title: '⚠️ Language Pair Not Available',
        body: `Your accuracy rate is ${languagePairData.accuracy_rate}%, which does not meet our minimum requirement of 50%.  
               You can choose another language pair, try again later, or submit an appeal request if you believe this rating is incorrect.`,
      };
    }

    // Case 3: Status is "under_review".
    if (languagePairData.status === 'under_review') {
      return {
        title: '🔍 Review In Progress',
        body: 'Our QA team is currently reviewing your assessment task for this language pair. Please wait until the review process is completed. Thank you for your patience!',
      };
    }

    // Case 4: Status is "not_found".
    if (languagePairData.status === 'not_found') {
      return {
        title: '📝 Assessment Required',
        body: 'The selected language pair was not found in our system. To proceed, please complete an assessment test Let’s get you started!',
      };
    }

    // If everything is fine, return null (no message needed)
    return null;
  };


  const message = getLanguagePairStatusMessage();

  const showAssessmentButton = languagePairData?.status === 'not_found';

  const showAppealButton = languagePairData?.status === 'complete' && (languagePairData.accuracy_rate ?? 0) < 50;


  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (selectedLanguagePair &&
        !languagePairLoading &&
        languagePairData &&
        !('message' in languagePairData) &&
        languagePairData.status === 'complete' &&
        (languagePairData.accuracy_rate ?? 0) > 50) {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [selectedLanguagePair]);

  const handleShowNext = () => {
    console.log("Loading the next translation task.");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          gap: 2,
          padding: 4,
          maxWidth: '100%',
          minWidth: '100%',
        }}
      >
        {/* Header with logo and language selection button */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          mb={4}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}
          >
            <img
              src={logo}
              alt="MyanLang logo"
              style={{ height: '50px', cursor: 'pointer' }}
              onClick={() => {
                if (!selectedLanguagePair ||
                  (selectedLanguagePair &&
                    languagePairData &&
                    (languagePairData.status !== 'complete' || (languagePairData.accuracy_rate ?? 0) <= 50))) {
                  navigate('/dashboard');
                } else {
                  alert("You have unsaved changes. Please submit your translation or close the task before leaving.");
                }
              }}
            />
          </Box>

          {/* Language Selection Button */}
          <Button
            onClick={() => {
              // Allow language change if:
              // 1. No language pair is selected OR
              // 2. Selected language pair doesn't meet requirements
              if (!selectedLanguagePair ||
                (selectedLanguagePair &&
                  languagePairData &&
                  (languagePairData.status !== 'complete' || (languagePairData.accuracy_rate ?? 0) <= 50))) {
                setDialogOpen(true);
              } else {
                alert("You have unsaved changes. Please submit your translation or close the task before changing languages.");
              }
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textTransform: 'none',
              gap: 2,
              px: 3,
              py: 1.5,
              color: 'white',
              background: 'linear-gradient(90deg, #4A90E2, #50A1F0)',
              boxShadow: '0px 1px 2px rgba(0,0,0,0.3)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0px 2px 5px rgba(0,0,0,0.3)',
                background: 'linear-gradient(90deg, #3F7EC5, #4291E5)',
              },
            }}
          >
            <Language sx={{ mr: 1 }} />
            {selectedLanguagePair ? (
              `${selectedLanguagePair.source.charAt(0).toUpperCase() + selectedLanguagePair.source.slice(1)}`
            ) : (
              'Select Source Language'
            )}
            <ArrowRightAlt sx={{ mx: 1 }} />
            {selectedLanguagePair ? (
              `${selectedLanguagePair.target.charAt(0).toUpperCase() + selectedLanguagePair.target.slice(1)}`
            ) : (
              'Target Language Here'
            )}
            <ArrowDropDown sx={{ ml: 1 }} />
          </Button>
        </Box>

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
            <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: 'pre-line' }} >
              {message.body}
            </Typography>
            {/* Show Assessment Button only when needed */}
            {showAssessmentButton && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => window.location.href = '/assessment'}
              >
                Take Assessment Test
              </Button>
            )}
            {/* Show Appeal Button only when needed */}
            {showAppealButton && (
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={() => window.location.href = '/appeal'}
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
            console.log('Selected Language Pair:', pair);
            console.log('User:', user);
            setDialogOpen(false);
            if (user) {
              // Update query parameters and trigger the query.
              handleFreelancerLanguagePairStatus(user?.freelancer_id, pair.source_id, pair.target_id);
            }
          }}
        />

        {/* Task Translation Interface */}
        {selectedLanguagePair &&
          !languagePairLoading &&
          languagePairData &&
          !('message' in languagePairData) &&
          languagePairData.status === 'complete' &&
          (languagePairData.accuracy_rate ?? 0) > 50 && (
            <TaskTranslationInterface
              onClose={() => setSelectedLanguagePair(null)}
              onShowNext={handleShowNext}
            />
          )}
      </Container>
    </ThemeProvider>
  );
}
