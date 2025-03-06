import React, { useState, useEffect } from "react";
import {
    Typography,
    Stack,
    ToggleButton,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { createTheme, alpha } from "@mui/material/styles";

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
            px: { xs: 2, md: 4 },
            py: { xs: 1, md: 2 },
            borderRadius: "12px!important",
            "&.Mui-selected": { bgcolor: alpha(theme.palette.primary.main, 0.1) },
        }}
        {...props}
    >
        <Stack direction="row" alignItems="center" spacing={2}>
            {icon}
            <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                {label}
            </Typography>
            <ChevronRight sx={{ color: theme.palette.primary.main, fontSize: { xs: "1rem", md: "1.5rem" } }} />
        </Stack>
    </ToggleButton>
);

export default TaskTypeToggle;