import React, { useState } from "react";
import { Container, Button } from "@mui/material";
import { Language, ArrowDropDown } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LanguageSelectDialog, { LanguagePair } from "@/components/freelancer/LanguageSelectDialog";
import TaskTranslationInterface from "@/components/freelancer/TaskTranslationInterface";
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';

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

  // Called when the "Show Next" buttons are clicked.
  const handleShowNext = () => {
    // Add your logic to load a new translation task here.
    console.log("Loading the next translation task.");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth={false}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          gap: 2,
          marginTop: 2,
        }}
      >
        <Button
          onClick={() => setDialogOpen(true)}
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            textTransform: 'none',
            gap: 2,
            px: 2,
            py: 1,
            color: 'black',
            boxShadow: '0px 1px 2px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0px 2px 5px rgba(0,0,0,0.3)',
            },
          }}
        >
          <Language sx={{ mr: 1 }} />
          {selectedLanguagePair ? (
            `${selectedLanguagePair.source.charAt(0).toUpperCase() + selectedLanguagePair.source.slice(1)}`
          ) : (
            'Source Language'
          )}
          <ArrowRightAlt sx={{ mx: 1 }} />
          {selectedLanguagePair ? (
            `${selectedLanguagePair.target.charAt(0).toUpperCase() + selectedLanguagePair.target.slice(1)}`
          ) : (
            'Target Language'
          )}
          <ArrowDropDown sx={{ ml: 1 }} />
        </Button>

        <LanguageSelectDialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          onConfirm={(pair) => {
            setSelectedLanguagePair(pair);
            setDialogOpen(false); // Optionally close the dialog after selection
          }}
        />

        {/* Render the translation interface only if a language pair is selected */}
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
