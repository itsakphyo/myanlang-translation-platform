import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
} from "@mui/material";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface CreateLanguageDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateLanguageDialog({ open, onClose }: CreateLanguageDialogProps) {
    const [language, setLanguage] = useState("");
    const { createLanguage } = useLanguage();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createLanguage.mutate(language, {
            onSuccess: () => {
                console.log("Language Created");
                onClose(); // Optionally close the dialog after success.
            },
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle
                    sx={(theme) => ({
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        color: theme.palette.primary.contrastText,
                        py: 2,
                        px: 3,
                    })}
                >
                    Create New Language
                </DialogTitle>
                <DialogContent sx={{ py: 3, px: 3 }}>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="language"
                        name="language"
                        label="Language Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
