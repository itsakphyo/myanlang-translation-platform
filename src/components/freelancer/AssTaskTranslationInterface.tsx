import React, { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  Box,
  Typography,
  LinearProgress,
  TextField,
  Button,
} from '@mui/material';
import AccessTime from '@mui/icons-material/AccessTime';
import Translate from '@mui/icons-material/Translate';
import { AssTask } from '@/types/task'; // Adjust the path as needed

// Define the prop interface
interface AssTaskTranslationInterfaceProps {
  tasks: AssTask[];
  onClose: () => void;
}

const AssTaskTranslationInterface: React.FC<AssTaskTranslationInterfaceProps> = ({ tasks, onClose }) => {
  // Track the current task index
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  // Hold the current translation text
  const [translation, setTranslation] = useState('');
  // Initialize remainingTime using the first task's max_time_per_task (in minutes converted to seconds)
  const [remainingTime, setRemainingTime] = useState(tasks.length > 0 ? tasks[0].max_time_per_task * 60 : 0);

  // Get the current task object safely
  const currentTask = tasks[currentTaskIndex] ?? null;
  
  // When the current task changes, reset the translation and timer
  useEffect(() => {
    if (currentTask) {
      setTranslation('');
      setRemainingTime(currentTask.max_time_per_task * 60); // Convert minutes to seconds
    }
  }, [currentTask]);

  // Countdown timer logic
  useEffect(() => {
    if (remainingTime <= 0) return;
    
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  // Check if the current task is the last in the list
  const isLastTask = currentTaskIndex === tasks.length - 1;

  // Handle previous task button click
  const handlePrevious = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  // Handle next task button click
  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <AccessTime color="primary" />
          <Typography variant="h6" color="primary.main">
            Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={(remainingTime / (currentTask?.max_time_per_task * 60 || 1)) * 100}
          sx={{ height: 2, borderRadius: 2 }}
        />

        {currentTask && (
          <>
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
                Original Text ({currentTask.source_language_name})
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="body1">
                  {currentTask.source_text}
                </Typography>
              </Paper>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Your Translation ({currentTask.target_language_name})
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={4}
                variant="outlined"
                placeholder="Enter your translation here..."
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
              />
            </Box>
          </>
        )}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'space-between',
            mt: 2
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handlePrevious}
            disabled={currentTaskIndex === 0}
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.75rem', md: '1rem' },
              px: { xs: 2, sm: 4 }
            }}
          >
            ← Previous Task
          </Button>

          {isLastTask ? (
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={onClose}
              sx={{
                textTransform: 'none',
                fontSize: { xs: '0.75rem', md: '1rem' },
                px: { xs: 2, sm: 4 }
              }}
            >
              Submit Tasks
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleNextTask}
              sx={{
                textTransform: 'none',
                fontSize: { xs: '0.75rem', md: '1rem' },
                px: { xs: 2, sm: 4 }
              }}
            >
              Next Task →
            </Button>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default AssTaskTranslationInterface;
