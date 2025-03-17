"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Alert,
  Chip,
  alpha
} from "@mui/material";
import { useDialog } from "@/contexts/DialogContext";
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { IssueReportRequest } from '@/types/IssueReportRequest';
import { reportIssue } from "@/hooks/reportIssue";
import Toast from "@/utils/showToast";
import { translations } from "@/contexts/translation";
import { useSystemLanguage } from "@/contexts/language-context";

const handleReportIssue = async (data: IssueReportRequest) => {
  try {
    const result = await reportIssue(data);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};


interface PaymentDelayReportFormProps {
  withdrawalId: number;
}

const PaymentDelayReportForm: React.FC<PaymentDelayReportFormProps> = ({ withdrawalId }) => {
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeDialog } = useDialog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { systemLanguage } = useSystemLanguage();

  const current_user_id = localStorage.getItem("userId")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const reportData: IssueReportRequest = {
      freelancer_id: Number(current_user_id),
      issue_type: "payment_delay",
      withdrawalId: withdrawalId,
      description: additionalDetails
    };

    handleReportIssue(reportData);
    Toast.show(translations[systemLanguage].issue_reported_successfully);

    setIsSubmitting(false);
    closeDialog();

  };

  return (
    <Fade in={true} timeout={400}>
      {/* Content */}
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip
              icon={<AccessTimeIcon />}
              label={`${translations[systemLanguage].withdrawal} ID: ${withdrawalId}`}
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: 1,
                '& .MuiChip-label': { fontWeight: 500 }
              }}
            />
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            {translations[systemLanguage].alert_text_for_payment_delay}
          </Alert>

          <TextField
            label= {translations[systemLanguage].additional_details}
            multiline
            rows={isMobile ? 3 : 4}
            fullWidth
            variant="outlined"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                transition: theme.transitions.create(['box-shadow']),
                '&:hover': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`
                },
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }
            }}
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <Button
            onClick={closeDialog}
            variant="outlined"
            color="inherit"
            fullWidth={isMobile}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {translations[systemLanguage].cancel_btn}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            fullWidth={isMobile}
            endIcon={<SendIcon />}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 2
            }}
          >
            {isSubmitting ? "Submitting..." :  translations[systemLanguage].submit_report_btn} 
          </Button>
        </Stack>
      </Box>
    </Fade>
  );
};

export default PaymentDelayReportForm;