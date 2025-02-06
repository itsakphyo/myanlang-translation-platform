import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography, Box } from '@mui/material';
import { red } from '@mui/material/colors';
import { useJob } from '@/hooks/useJob';

interface DeleteDialogProps {
    open: boolean;
    job_id: number;
    job_title: string;
    onClose: () => void;
}

export default function DeleteDialog({ open, onClose, job_id, job_title }: DeleteDialogProps) {
    const [inputValue, setInputValue] = React.useState('');
    const { deleteJob } = useJob();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputValue !== `DELETE ${job_title}`) return; // why i cannot pass ${job_title} here?
        deleteJob.mutate(job_id);
        onClose();
        setInputValue('');
    };

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
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ fontWeight: 'bold', color: red[700] }}>
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Box mb={2}>
                        <Typography variant="body1" color="text.primary">
                            Are you sure you want to <strong>permanently delete</strong> this job?
                            This action <strong>cannot be undone</strong> and will remove all associated tasks.
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        To confirm, please follow these steps:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(0, 0, 0, 0.6)' }}>
                        <li>Make sure you have downloaded the job.</li>
                        <li>
                            Please type <strong style={{ color: red[600] }}>DELETE {job_title}</strong> in the field below.
                        </li>
                    </ul>
                    <TextField
                        required
                        margin="dense"
                        id="delete-confirm"
                        name="delete"
                        fullWidth
                        variant="outlined"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        inputProps={{
                            autoComplete: 'off',
                            spellCheck: 'false',
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        disabled={inputValue !== `DELETE ${job_title}`}
                    >
                        Delete Permanently
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}