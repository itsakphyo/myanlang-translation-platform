"use client";

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  Box,
  Typography,
  LinearProgress,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import Paid from '@mui/icons-material/Paid';
import AccessTime from '@mui/icons-material/AccessTime';
import ReportIcon from '@mui/icons-material/Report';
import { OpenTask } from "@/types/task";
import { useTask } from '@/hooks/useTask';
import { useDialog } from '@/contexts/DialogContext';
import Toast from '@/utils/showToast';
import { translations } from '@/contexts/translation';
import { useSystemLanguage } from '@/contexts/language-context';

interface TaskTranslationInterfaceProps {
  task: OpenTask | null;
  onClose: () => void;
  onShowNext: () => void;
}

const TaskTranslationInterface: React.FC<TaskTranslationInterfaceProps> = ({
  task,
  onClose,
  onShowNext,
}) => {
  const [translation, setTranslation] = useState(task?.translated_text || '');
  const totalTime = task?.max_time_per_task ? task.max_time_per_task * 60 : 900;
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const { openDialog } = useDialog();

  const { systemLanguage } = useSystemLanguage();

  const handleReportIssue = (taskId: number) => {
    openDialog('issue-report', { taskId });
  };

  useEffect(() => {
    if (task) {
      setTranslation(task.translated_text || '');
      // Update remaining time, converting minutes to seconds
      setRemainingTime(task.max_time_per_task ? task.max_time_per_task * 60 : 900);
    }
  }, [task]);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const userId = JSON.parse(localStorage.getItem('userId') || '{}');

  const { submitTask } = useTask();

  const handleSubmit = () => {
    if (task) {
      submitTask(task.task_id, userId, translation);
      Toast.show(`${translations[systemLanguage].tran_submit_sucess_message}`);
    } else {
      console.error('Task data is not available.');
    }
  };

  if (!task) {
    return (
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h6" color="error">
          No task data available.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
      <Stack spacing={3}>
        {/* Top Section with Reward, Timer, and Report Issue Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Paid color="primary" />
          <Typography variant="h6" color="primary.main">
           {translations[systemLanguage].reward} {task.price} {translations[systemLanguage].currency}
          </Typography>
          <AccessTime color="primary" />
          <Typography variant="h6" color="primary.main">
            {translations[systemLanguage].time_left} {minutes}:{seconds.toString().padStart(2, "0")}
          </Typography>

          {/* Report Issue Button as a Small Icon */}
          <Tooltip title="Report Issue">
            <IconButton
              onClick={() => handleReportIssue(task?.task_id)}
              sx={{ ml: 'auto', color: 'error.main' }}
            >
              <ReportIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={(remainingTime / totalTime) * 100}
          sx={{ height: 2, borderRadius: 2 }}
        />

        {/* Translation Task Section */}
        <Box>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {translations[systemLanguage].instructions}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {task.instruction}
          </Typography>
        </Box>

        {/* Original Text Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
           {translations[systemLanguage].original_text} ({task.source_language_name})
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body1">{task.source_text}</Typography>
          </Paper>
        </Box>

        {/* Translation Input Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {translations[systemLanguage].your_translation} ({task.target_language_name})
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
          />
        </Box>

        {/* Action Buttons Section */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'flex-end',
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            color="error"
            size="large"
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.75rem', md: '1rem' },
              px: { xs: 2, sm: 4 },
            }}
            onClick={() => {
              onClose();
            }}
          >
            {translations[systemLanguage].reject_and_close_btn}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.75rem', md: '1rem' },
              px: { xs: 2, sm: 4 },
            }}
            onClick={() => {
              handleSubmit();
              onClose();
            }}
          >
            {translations[systemLanguage].submit_and_close_btn}
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.75rem', md: '1rem' },
              px: { xs: 2, sm: 4 },
            }}
            onClick={() => {
              handleSubmit();
              onShowNext();
            }}
          >
            {translations[systemLanguage].submit_and_show_next_btn}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default TaskTranslationInterface;