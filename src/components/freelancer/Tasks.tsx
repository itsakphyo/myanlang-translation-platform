import React, { useState, useEffect } from "react";
import { Container, Button, Box, Typography } from "@mui/material";
import { Language, ArrowDropDown } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LanguageSelectDialog from "@/components/freelancer/LanguageSelectDialog";
import { LanguagePair } from "@/types/language";
import TaskTranslationInterface from "@/components/freelancer/TaskTranslationInterface";
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import logo from '@/assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a',
    },
    secondary: {
      main: '#db2777',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
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
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        },
      },
    },
  },
});

export default function TranslationTaskPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePair | null>(null);
  const navigate = useNavigate();

  // Warn the user if they try to reload or close the page with unsaved changes.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (selectedLanguagePair) {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
                if (!selectedLanguagePair) {
                  navigate('/dashboard');
                } else {
                  alert("You have unsaved changes. Please submit your translation or or close the task before leaving.");
                }
              }}
            />
          </Box>

          {/* Language Selection Button */}
          <Button
            onClick={() => {
              if (!selectedLanguagePair) {
                setDialogOpen(true);
              } else {
                alert("You have unsaved changes. Please submit your translation or or close the taskn before changing languages.");
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

        {/* Welcome Message */}
        {!selectedLanguagePair && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            sx={{ mt: 4 }}
          >
            <Typography variant="h5" color="textSecondary" gutterBottom>
              Welcome to MyanLang Translation
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Please select a source and target language to begin your translation task.
            </Typography>
          </Box>
        )}

        {/* Language Select Dialog */}
        <LanguageSelectDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(pair) => {
            setSelectedLanguagePair(pair);
            setDialogOpen(false);
          }}
        />

        {/* Task Translation Interface */}
        {selectedLanguagePair && (
          <TaskTranslationInterface
            onClose={() => setSelectedLanguagePair(null)}
            onShowNext={handleShowNext}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}
