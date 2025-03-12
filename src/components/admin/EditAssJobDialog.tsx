"use client";

import * as React from 'react';
import { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
} from '@mui/material';
import { JobEdit } from '@/types/job';
import { useJob } from '@/hooks/useJob';
import theme from '@/theme';

interface EditJobProps {
    open: boolean;
    onClose: () => void;
    job_id: number;
    editjob: JobEdit;
}


export default function EditAssJobDialog({ open, onClose, job_id, editjob }: EditJobProps) {
    const [jobTitle, setJobTitle] = useState(editjob.job_title);
    const [sourceLanguage, setSourceLanguage] = useState(editjob.source_language_id);
    const [targetLanguage, setTargetLanguage] = useState(editjob.target_language_id);
    const [maxTimePerTask, setMaxTimePerTask] = useState(editjob.max_time_per_task);
    const [taskPrice, setTaskPrice] = useState(editjob.task_price);
    const [instructions, setInstructions] = useState(editjob.instructions);
    const [notes, setNotes] = useState(editjob.notes || ""); 
    const [errorMessage, setErrorMessage] = useState("");

    const { updateJob } = useJob();

    useEffect(() => {
        setJobTitle(editjob.job_title);
        setSourceLanguage(editjob.source_language_id);
        setTargetLanguage(editjob.target_language_id);
        setMaxTimePerTask(editjob.max_time_per_task);
        setTaskPrice(editjob.task_price);
        setInstructions(editjob.instructions);
        setNotes(editjob.notes || "");
    }, [editjob]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');

        if (!maxTimePerTask) {
            setErrorMessage('Please specify the max time per task');
            return;
        }
        if (!sourceLanguage) {
            setErrorMessage('Source language is required');
            return;
        }
        if (!targetLanguage) {
            setErrorMessage('Target language is required');
            return;
        }
        if (jobTitle.trim() === '') {
            setErrorMessage('Job title is required');
            return;
        }
        if (instructions.trim() === '') {
            setErrorMessage('Instructions are required');
            return;
        }

        const jobData: JobEdit = {
            job_id: job_id,
            job_title: jobTitle,
            source_language_id: sourceLanguage,
            target_language_id: targetLanguage,
            max_time_per_task: maxTimePerTask,
            task_price: taskPrice,
            instructions,
            notes,
        };

        updateJob.mutate(
            { job_id: jobData.job_id, data: jobData },
            {
                onSuccess: (data) => {
                    onClose();
                },
                onError: (error: any) => {
                    console.error("Error updating job:", error);
                    setErrorMessage('Error updating job. Please try again.');
                },
            }
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                    },
                },
            }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        color: theme.palette.primary.contrastText,
                        py: 2,
                        px: 3,
                    }}
                >
                    Edit Job
                </DialogTitle>
                <DialogContent sx={{ py: 3, px: 3 }}>
                    {/* Job Title */}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="job_title"
                        name="job_title"
                        label="Job Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />

                    {/* Max Time Per Task */}
                    <TextField
                        required
                        margin="dense"
                        id="max_time_per_task"
                        name="max_time_per_task"
                        label="Max Time Per Task (mins)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={maxTimePerTask || ''}
                        onChange={(e) => setMaxTimePerTask(Number(e.target.value))}
                    />

                    {/* Instructions */}
                    <TextField
                        required
                        margin="dense"
                        id="instructions"
                        name="instructions"
                        label="Instructions"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        multiline
                        rows={3}
                    />
                    {/* Notes (Optional) */}
                    <TextField
                        margin="dense"
                        id="notes"
                        name="notes"
                        label="Notes"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        multiline
                        rows={2}
                    />
                    {/* Error Message */}
                    {errorMessage && (
                        <Typography variant="body2" color="error" mt={2}>
                            {errorMessage}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
