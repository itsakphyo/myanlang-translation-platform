import React, { useState, useEffect } from 'react';
import { Paper, Stack, Box, Typography, Button } from '@mui/material';
import {Task, CheckSubmitRequest } from '@/types/bulkSubmissionReview';

interface BulkSubmissionReviewProps {
  data: {
    userId: number;
    sourceLanguageId: number;
    targetLanguageId: number;
    sourceLanguage: string;
    targetLanguage: string;
    tasks: Task[];
  };
  onSubmitAllAndClose: (results: CheckSubmitRequest) => void;
  onSubmitAndNext: (results: CheckSubmitRequest) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

const BulkSubmissionReview: React.FC<BulkSubmissionReviewProps> = ({
  data,
  onSubmitAllAndClose,
  onSubmitAndNext,
  onClose,
  isSubmitting = false,
}) => {
  const [reviews, setReviews] = useState<Array<'approved' | 'rejected' | null>>(
    new Array(data.tasks.length).fill(null)
  );

  // Reset reviews whenever data.tasks changes
  useEffect(() => {
    setReviews(new Array(data.tasks.length).fill(null));
  }, [data.tasks]);

  const handleTaskDecision = (index: number, decision: 'approved' | 'rejected') => {
    const newReviews = [...reviews];
    newReviews[index] = decision;
    setReviews(newReviews);
  };

  const qa_id = localStorage.getItem('userId');

  const handleSubmitAllAndClose = () => {
    const payload: CheckSubmitRequest = {
      data: data.tasks.map((task, index) => ({
        taskid: task.taskId,
        originalText: task.originalText,
        submittedText: task.submittedText,
        status: reviews[index] as 'approved' | 'rejected',
      })),
      fl_id: data.userId,
      qa_id: qa_id ? parseInt(qa_id, 10) : null,
      source_lang_id: data.sourceLanguageId,
      target_lang_id: data.targetLanguageId,
    };
    onSubmitAllAndClose(payload);
  };

  const handleSubmitAndNext = () => {
    const payload: CheckSubmitRequest = {
      data: data.tasks.map((task, index) => ({
        taskid: task.taskId,
        originalText: task.originalText,
        submittedText: task.submittedText,
        status: reviews[index] as 'approved' | 'rejected',
      })),
      fl_id: data.userId,
      qa_id: qa_id ? parseInt(qa_id, 10) : null,
      source_lang_id: data.sourceLanguageId,
      target_lang_id: data.targetLanguageId,
    };
    onSubmitAndNext(payload);
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
      <Stack spacing={4}>
        <Typography variant="h5" gutterBottom>
          Batch Translation Review ({data.sourceLanguage} → {data.targetLanguage})
        </Typography>

        {data.tasks.map((task, index) => (
          <Paper key={index} sx={{ p: 3, mb: 2, border: '1px solid #e0e0e0' }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Original Text ({data.sourceLanguage})
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body1">{task.originalText}</Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Submitted Text ({data.targetLanguage})
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body1">{task.submittedText}</Typography>
                </Paper>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant={reviews[index] === 'rejected' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => handleTaskDecision(index, 'rejected')}
                >
                  Reject
                </Button>
                <Button
                  variant={reviews[index] === 'approved' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => handleTaskDecision(index, 'approved')}
                >
                  Approve
                </Button>
              </Box>
            </Stack>
          </Paper>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="text"
            sx={{ mr: 2 }}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            disabled={reviews.some(review => review === null) || isSubmitting}
            onClick={handleSubmitAndNext}
            sx={{ px: 4, py: 1.5, mr: 2 }}
          >
            Submit and Show Next
          </Button>
          <Button
            variant="contained"
            size="large"
            disabled={reviews.some(review => review === null) || isSubmitting}
            onClick={handleSubmitAllAndClose}
            sx={{ px: 4, py: 1.5 }}
          >
            Submit All Reviews
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default BulkSubmissionReview;