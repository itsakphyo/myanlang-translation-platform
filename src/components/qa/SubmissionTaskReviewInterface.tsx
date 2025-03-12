import React from 'react';
import { Paper, Stack, Box, Typography, Button } from '@mui/material';
import { submitRequiest } from '@/types/submitRequiest';

interface SubmissionTaskReviewInterfaceProps {
  taskId: number;
  originalText: string;
  sourceLanguage: string;
  submittedText: string;
  targetLanguage: string;
  onRejectAndClose: (results: submitRequiest) => void;
  onRejectAndShowNext: (results: submitRequiest) => void;
  onApproveAndClose: (results: submitRequiest) => void;
  onApproveAndShowNext: (results: submitRequiest) => void;
}

const SubmissionTaskReviewInterface: React.FC<SubmissionTaskReviewInterfaceProps> = ({
  taskId,
  originalText,
  sourceLanguage,
  submittedText,
  targetLanguage,
  onRejectAndClose,
  onRejectAndShowNext,
  onApproveAndClose,
  onApproveAndShowNext,
}) => {
  const qaId = Number(localStorage.getItem("userId")) || 0;

  const handleRejectAndClose = () => {
    const request: submitRequiest = {
      task_id: taskId,
      qa_id: qaId,
      decision: false,
    };
    onRejectAndClose(request);
  };

  const handleRejectAndShowNext = () => {
    const request: submitRequiest = {
      task_id: taskId,
      qa_id: qaId,
      decision: false,
    };
    onRejectAndShowNext(request);
  };

  const handleApproveAndClose = () => {
    const request: submitRequiest = {
      task_id: taskId,
      qa_id: qaId,
      decision: true,
    };
    onApproveAndClose(request);
  };

  const handleApproveAndShowNext = () => {
    const request: submitRequiest = {
      task_id: taskId,
      qa_id: qaId,
      decision: true,
    };
    onApproveAndShowNext(request);
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
      <Stack spacing={3}>
        {/* Original Text Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Original Text ({sourceLanguage})
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body1">{originalText}</Typography>
          </Paper>
        </Box>

        {/* Submitted Text Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Submitted Text ({targetLanguage})
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body1">{submittedText}</Typography>
          </Paper>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'flex-end',
            mt: 2
          }}
        >
          <Button
            variant="outlined"
            color="error"
            size="large"
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.75rem', md: '1rem' },
              px: { xs: 2, sm: 4 }
            }}
            onClick={handleRejectAndClose}
          >
            Reject &amp; Close
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="large"
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.75rem', md: '1rem' },
              px: { xs: 2, sm: 4 }
            }}
            onClick={handleRejectAndShowNext}
          >
            Reject &amp; Show Next
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.75rem', md: '1rem' },
              px: { xs: 2, sm: 4 }
            }}
            onClick={handleApproveAndClose}
          >
            Approve &amp; Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.75rem', md: '1rem' },
              px: { xs: 2, sm: 4 }
            }}
            onClick={handleApproveAndShowNext}
          >
            Approve &amp; Show Next
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default SubmissionTaskReviewInterface;