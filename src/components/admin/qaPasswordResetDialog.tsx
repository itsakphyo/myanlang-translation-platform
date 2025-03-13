"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography, Box } from '@mui/material';
import { QAMember } from '@/types/qaMember';
import { useQA } from '@/hooks/useQA';
import TextField from '@mui/material/TextField';
import { QAMemberUpdate } from '@/types/qaMember';
import Toast from '@/utils/showToast';

interface DeleteDialogProps {
    open: boolean;
    qa_member: QAMember;
    onClose: () => void;
}

export default function ResetPasswordQADialog({ open, onClose, qa_member }: DeleteDialogProps) {
    const [inputValue, setInputValue] = React.useState('');
    
    const { resetQAPassword } = useQA();

    const data: QAMemberUpdate = {
        qa_member_id: qa_member.qa_member_id,
        password: inputValue
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        resetQAPassword.mutate(data);
        Toast.show('Password for QA reset successfully');
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: { padding: 3, borderRadius: 2 },
                },
            }}
        >
            <form  onSubmit={handleSubmit}> 
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Confirm Passwrod Reset
                </DialogTitle>
                <DialogContent>
                    <Box mb={2}>
                        <Typography variant="body1" color="text.primary">
                            Reset password for QA Member {qa_member.full_name}?
                        </Typography>
                    </Box>
                    <Box mb={2}>
                        <Typography variant="body1" color="text.secondary">
                            New Password:
                        </Typography>
                    </Box>
                    <TextField
                        required
                        margin="dense"
                        id="new-password"
                        name="new-password"
                        fullWidth
                        variant="outlined"

                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Reset Password
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}