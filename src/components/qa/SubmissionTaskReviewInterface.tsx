import React from 'react';
import { Paper, Stack, Box, Typography, Button } from '@mui/material';

interface SubmissionTaskReviewInterfaceProps {
  originalText: string;
  sourceLanguage: string;
  submittedText: string;
  targetLanguage: string;
  onRejectAndClose: () => void;
  onRejectAndShowNext: () => void;
  onApproveAndClose: () => void;
  onApproveAndShowNext: () => void;
}

const SubmissionTaskReviewInterface: React.FC<SubmissionTaskReviewInterfaceProps> = ({
  originalText,
  sourceLanguage,
  submittedText,
  targetLanguage,
  onRejectAndClose,
  onRejectAndShowNext,
  onApproveAndClose,
  onApproveAndShowNext,
}) => {
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
            onClick={onRejectAndClose}
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
            onClick={onRejectAndShowNext}
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
            onClick={onApproveAndClose}
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
            onClick={onApproveAndShowNext}
          >
            Approve &amp; Show Next
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default SubmissionTaskReviewInterface;