import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDialog } from '../contexts/DialogContext';
import  TaskReportDialog  from './IssueReportForm';
import RequestAppealForm from './RequestAppealForm';
import PaymentDelayReportForm from './PaymentDelayReportForm';

export const GlobalDialog = () => {
  const { isOpen, dialogType, dialogData, closeDialog } = useDialog();

  const renderContent = () => {
    switch (dialogType) {
      case 'issue-report':
        return <TaskReportDialog taskId={Number(dialogData.taskId)} />;
      case 'payment-issue':
        return <PaymentDelayReportForm withdrawalId={Number(dialogData.withdrawalId)} />;
      case 'appeal-request':
        return <RequestAppealForm souce_language_id={Number(dialogData.souce_language_id)} target_language_id={Number(dialogData.target_language_id)} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog} fullWidth maxWidth="sm">
      <DialogTitle>
        {(dialogType ?? '').replace('-', ' ').toUpperCase()}
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{renderContent()}</DialogContent>
    </Dialog>
  );
};