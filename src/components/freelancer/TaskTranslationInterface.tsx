import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Box,
  Typography,
  LinearProgress,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import Paid from '@mui/icons-material/Paid';
import AccessTime from '@mui/icons-material/AccessTime';
import Translate from '@mui/icons-material/Translate';

interface TaskTranslationInterfaceProps {
  onClose: () => void;
  onShowNext: () => void;
}

const TaskTranslationInterface: React.FC<TaskTranslationInterfaceProps> = ({ onClose, onShowNext }) => {
  // Dummy state for translation and remaining time (in seconds)
  const [translation, setTranslation] = useState('');
  const [remainingTime, setRemainingTime] = useState(900); // 15 minutes

  const handleShowNext = () => {
    // Reset translation and timer (simulate loading a new task)
    setTranslation('');
    setRemainingTime(900);
    onShowNext();
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Paid color="primary" />
          <Typography variant="h6" color="primary.main">
            Reward: 200 MMIK
          </Typography>
          <AccessTime color="primary" />
          <Typography variant="h6" color="primary.main">
            Time Left: {Math.floor(remainingTime / 60)}:{remainingTime % 60}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={(remainingTime / 900) * 100}
          sx={{ height: 2, borderRadius: 2 }}
        />

        <Box>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            <Translate sx={{ mr: 1 }} />
            Translation Task
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Translate the following text accurately while maintaining the original meaning.
            Pay attention to cultural nuances and idiomatic expressions.
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Original Text (English)
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body1">I love cars</Typography>
          </Paper>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Your Translation (Burmese)
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            placeholder="Enter your translation here..."
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" color="text.secondary">
                    {translation.length}/500
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          {/* Buttons that will close the interface */}
          <Button
            variant="outlined"
            color="error"
            size="large"
            sx={{ textTransform: 'none' }}
            onClick={onClose}
          >
            Reject &amp; Close
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ textTransform: 'none', px: 4 }}
            onClick={onClose}
          >
            Submit &amp; Close
          </Button>

          {/* Buttons that will show the next task */}
          <Button
            variant="outlined"
            color="error"
            size="large"
            sx={{ textTransform: 'none' }}
            onClick={handleShowNext}
          >
            Reject &amp; Show Next
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ textTransform: 'none', px: 4 }}
            onClick={handleShowNext}
          >
            Submit &amp; Show Next
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default TaskTranslationInterface;
