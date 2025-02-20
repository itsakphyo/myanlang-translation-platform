import React, { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  useTheme
} from '@mui/material';
import AccessTime from '@mui/icons-material/AccessTime';
import Translate from '@mui/icons-material/Translate';
import { AssTask } from '@/types/task';
import {useCreateAssessmentAttempts } from '@/hooks/useCreateAssessmentAttempts';
import { AssessmentAttempt } from "@/types/task";


interface AssTaskTranslationInterfaceProps {
  tasks: AssTask[];
  freelancerId: number;
  onClose: () => void;
}

const AssTaskTranslationInterface: React.FC<AssTaskTranslationInterfaceProps> = ({ tasks, freelancerId, onClose }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  // Clone tasks to track translation updates locally
  const [updatedTasks, setUpdatedTasks] = useState<AssTask[]>(tasks.map(task => ({ ...task })));
  const [translation, setTranslation] = useState('');
  const { createAssessmentAttempts } = useCreateAssessmentAttempts();
  const theme = useTheme();

  // Load the current task from our updatedTasks state
  const currentTask = updatedTasks[currentTaskIndex] ?? null;
  const maxTime = currentTask?.max_time_per_task || 0;

  // When the task changes, load its saved translation (or reset to empty)
  useEffect(() => {
    setTranslation(currentTask?.translated_text || '');
  }, [currentTask]);

  const isLastTask = currentTaskIndex === updatedTasks.length - 1;

  // Helper: update current task's translation in the updatedTasks array
  const updateCurrentTaskTranslation = () => {
    setUpdatedTasks(prevTasks => {
      const newTasks = [...prevTasks];
      newTasks[currentTaskIndex] = {
        ...newTasks[currentTaskIndex],
        translated_text: translation
      };
      return newTasks;
    });
  };

  const handlePrevious = () => {
    updateCurrentTaskTranslation();
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const handleNextTask = () => {
    updateCurrentTaskTranslation();
    if (currentTaskIndex < updatedTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const handleSubmitTasks = () => {
    // Update the current task before submit
    const newTasks = [...updatedTasks];
    newTasks[currentTaskIndex] = { 
      ...newTasks[currentTaskIndex], 
      translated_text: translation 
    };
  
    // Create an array of AssessmentAttempt objects
    const assessmentAttempts: AssessmentAttempt[] = newTasks.map((task) => ({
      freelancer_id: freelancerId,
      task_id: task.task_id,
      submission_text: task.translated_text,
    }));
  
    console.log('Assessment Attempts:', assessmentAttempts);
  
    // Ensure createAssessmentAttempts.mutate expects the correct type
    createAssessmentAttempts.mutate(assessmentAttempts);
  
    onClose();
  };
  
  

  return (
    <Paper sx={{
      p: 4,
      borderRadius: 4,
      boxShadow: 3,
      position: 'relative',
      overflow: 'visible'
    }}>
      {/* Time Indicator Chip */}
      <Chip
        icon={<AccessTime style={{ color: 'white' }} />}
        label={`Time allowed for each task: ${maxTime} minute${maxTime !== 1 ? 's' : ''}`}
        sx={{
          position: 'absolute',
          right: -8,
          top: -8,
          bgcolor: theme.palette.mode === 'dark'
            ? theme.palette.primary.dark
            : theme.palette.primary.light,
          color: theme.palette.primary.contrastText,
          fontWeight: 500,
          fontSize: '1rem',
          '& .MuiChip-icon': {
            color: theme.palette.mode === 'dark'
              ? theme.palette.primary.light
              : theme.palette.primary.dark
          }
        }}
      />

      <Stack spacing={3}>
        {currentTask && (
          <>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                <Translate sx={{
                  mr: 1,
                  color: 'primary.main',
                  verticalAlign: 'text-bottom'
                }} />
                Translation Task
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please provide a high-quality translation while preserving:
              </Typography>
              <Box component="ul" sx={{
                pl: 2.5,
                color: 'text.secondary',
                '& li': { typography: 'body2', my: 0.5 }
              }}>
                <li>Original meaning and context</li>
                <li>Cultural references and idioms</li>
                <li>Formal/informal tone</li>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Original Text ({currentTask.source_language_name})
              </Typography>
              <Paper variant="outlined" sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default'
              }}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                  }
                }}
              />
            </Box>
          </>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
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
              px: { xs: 2, sm: 4 },
              order: { xs: 0, sm: 0 }
            }}
          >
            ← Previous Task
          </Button>

          {/* Page Indicator */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: 4,
              bgcolor: 'action.hover',
              order: { xs: 2, sm: 1 }
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                fontSize: { xs: '0.75rem', md: '1rem' },
                gap: 0.5
              }}
            >
              Task {currentTaskIndex + 1} of {updatedTasks.length}
            </Typography>
          </Box>

          {isLastTask ? (
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleSubmitTasks}
              sx={{
                textTransform: 'none',
                fontSize: { xs: '0.75rem', md: '1rem' },
                px: { xs: 2, sm: 4 },
                order: { xs: 1, sm: 2 }
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
                px: { xs: 2, sm: 4 },
                order: { xs: 1, sm: 2 }
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
