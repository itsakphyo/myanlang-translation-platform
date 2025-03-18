"use client";

import * as React from 'react';
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
import { useJob } from '@/hooks/useJob';
import { JobFormData } from '@/types/job';
import theme from '@/theme';
import LanguageSelectDialog from '../freelancer/LanguageSelectDialog';
import { LanguagePair } from '@/types/language';
import Toast from '@/utils/showToast';
import { set } from 'date-fns';

interface CreateJobProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateJob({ open, onClose }: CreateJobProps) {
  const [csvFile, setCsvFile] = React.useState<File | null>(null);
  const [jobTitle, setJobTitle] = React.useState<string>('');
  const [maxTimePerTask, setMaxTimePerTask] = React.useState<number | undefined>(undefined);
  const [taskPrice, setTaskPrice] = React.useState<number | undefined>(undefined);
  const [instructions, setInstructions] = React.useState<string>('');
  const [notes, setNotes] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [csvFileName, setCsvFileName] = React.useState<string | null>(null);
  const [languageDialogOpen, setLanguageDialogOpen] = React.useState(false);
  const [selectedLanguagePair, setSelectedLanguagePair] = React.useState<LanguagePair | null>(null);

  const { createJob } = useJob();

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCsvFile(event.target.files[0]);
      setCsvFileName(event.target.files[0].name);
    }
  };

  // Handle file removal
  const handleCancelFile = () => {
    setCsvFile(null);
    setCsvFileName(null);
  };

  // Handle language pair selection
  const handleLanguagePairConfirm = (pair: LanguagePair) => {
    setSelectedLanguagePair(pair);
    setLanguageDialogOpen(false);
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    // Validate required fields
    if (!csvFile) {
      setErrorMessage('CSV file is required');
      return;
    }
    if (!maxTimePerTask) {
      setErrorMessage('Please specify the max time per task');
      return;
    }
    if (!taskPrice) {
      setErrorMessage('Task price should be greater than 0');
      return;
    }
    if (!selectedLanguagePair) {
      setErrorMessage('Language pair is required');
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

    // Prepare job data
    const jobData: JobFormData = {
      title: jobTitle,
      source_language_id: selectedLanguagePair.source_id,
      target_language_id: selectedLanguagePair.target_id,
      max_time_per_task: maxTimePerTask,
      task_price: taskPrice,
      instructions,
      notes,
      csv: csvFile,
    };

    // Submit job data
    createJob.mutate(jobData, {
      onSuccess: () => {
        Toast.show('Job created successfully');
        setJobTitle('');
        setMaxTimePerTask(undefined);
        setTaskPrice(undefined);
        setInstructions('');
        setNotes('');
        setCsvFile(null);
        setCsvFileName(null);
        setSelectedLanguagePair(null);
        onClose();
      },
      onError: (error: any) => {
        console.error('Error creating job:', error);
        setErrorMessage('Error creating job. Please try again.');
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit}>
        {/* Dialog Title */}
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: theme.palette.primary.contrastText,
            py: 2,
            px: 3,
          }}
        >
          Create Job
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

          {/* Language Pair Selection */}
          <Box mt={1} mb={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setLanguageDialogOpen(true)}
            >
              {selectedLanguagePair
                ? `${selectedLanguagePair.source} → ${selectedLanguagePair.target}`
                : 'Select Language Pair'}
            </Button>

            {/* Language Select Dialog */}
            <LanguageSelectDialog
              open={languageDialogOpen}
              onClose={() => setLanguageDialogOpen(false)}
              onConfirm={handleLanguagePairConfirm}
            />
          </Box>

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

          {/* Task Price */}
          <TextField
            required
            margin="dense"
            id="task_price"
            name="task_price"
            label="Task Price"
            type="number"
            fullWidth
            variant="outlined"
            value={taskPrice || ''}
            onChange={(e) => setTaskPrice(Number(e.target.value))}
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

          {/* CSV File Upload */}
          <Box mt={2} display="flex" flexDirection="column">
            <Button variant="outlined" component="label">
              Upload CSV
              <input type="file" accept=".csv" hidden onChange={handleFileChange} />
            </Button>
            {csvFileName && (
              <Box display="flex" alignItems="center" mt={1}>
                <Typography variant="body2">{csvFileName}</Typography>
                <Button
                  onClick={handleCancelFile}
                  sx={{ ml: 2, minWidth: 'auto', p: 0, lineHeight: 1 }}
                >
                  &times;
                </Button>
              </Box>
            )}
          </Box>

          {/* Error Message */}
          {errorMessage && (
            <Typography variant="body2" color="error" mt={2}>
              {errorMessage}
            </Typography>
          )}
        </DialogContent>

        {/* Dialog Actions */}
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