import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Stack,
  Fade,
} from "@mui/material";
import { Language, ArrowDropDown } from "@mui/icons-material";
import { createTheme, alpha } from "@mui/material/styles";
import { LanguagePair } from "@/types/language";

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
  
  export default LanguageSelector;