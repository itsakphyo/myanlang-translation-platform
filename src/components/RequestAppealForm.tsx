import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import CloudinaryUpload from "./admin/CloudinaryUpload";
import { useDialog } from "@/contexts/DialogContext";
import { DescriptionOutlined } from "@mui/icons-material";
import { IssueReportRequest } from '@/types/IssueReportRequest';
import { reportIssue } from "@/hooks/reportIssue";

interface RequestAppealFormProps {
  souce_language_id: number;
  target_language_id: number;
}

const RequestAppealForm: React.FC<RequestAppealFormProps> = ({ souce_language_id, target_language_id }) => {
  const [appealMessage, setAppealMessage] = useState("");
  const [documentationUrl, setDocumentationUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeDialog } = useDialog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const current_user_id = localStorage.getItem("userId");
  const formRef = useRef<HTMLFormElement>(null);

  const documentUrlRef = useRef(documentationUrl);

  useEffect(() => {
    documentUrlRef.current = documentationUrl;
  }, [documentationUrl]);

  const handleReportIssue = async (data: IssueReportRequest) => {
    try {
      setIsSubmitting(true);
      const result = await reportIssue(data);
      console.log(result);
      closeDialog();
    } catch (err) {
      console.error("Failed to report issue:", err);
      alert('Failed to report issue.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (isUploading) {
      return;
    }

    const reportData: IssueReportRequest = {
      freelancer_id: Number(current_user_id),
      issue_type: "accuracy_appeal",
      source_language_id: souce_language_id,
      target_language_id: target_language_id,
      description: appealMessage,
      documentationUrl: documentUrlRef.current 
    };

    await handleReportIssue(reportData);
  };

  const handleUploadSuccess = (url: string) => {
    setIsUploading(false);
    setDocumentationUrl(url);
  };

  const wrapCloudinaryComponent = () => {
    return (
      <div onClick={(e) => {
        e.stopPropagation();
        setIsUploading(true); // Moved inside click handler
      }}>
        <CloudinaryUpload 
          onUploadSuccess={handleUploadSuccess} 
        />
      </div>
    );
  };

  return (
    <Box
      component="form"
      ref={formRef}
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <TextField
          label="Appeal Message"
          placeholder="Please describe your appeal reason in detail..."
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={appealMessage}
          onChange={(e) => setAppealMessage(e.target.value)}
          required
          variant="outlined"
          InputProps={{
            sx: { borderRadius: 1.5 }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />

        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DescriptionOutlined color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight="500">
              Additional Documentation
            </Typography>
          </Stack>

          <Card variant="outlined" sx={{ mt: 2, borderRadius: 1.5, borderStyle: 'dashed' }}>
            <CardContent sx={{ p: 2 }}>
              {isUploading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Upload in progress...
                  </Typography>
                </Box>
              )}
              
              {wrapCloudinaryComponent()}

              {documentationUrl && (
                <Box sx={{
                  mt: 2,
                  p: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                  <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                    Uploaded file: {documentationUrl}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </CardContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          flexDirection: isMobile ? "column" : "row",
          gap: 1,
          p: 2,
          pt: 0,
        }}
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            closeDialog();
          }}
          variant="outlined"
          color="inherit"
          type="button"
          sx={{
            borderRadius: 2,
            width: isMobile ? "100%" : "auto",
          }}
          disabled={isSubmitting || isUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={
            isSubmitting ||
            isUploading ||
            souce_language_id === 0 ||
            target_language_id === 0 ||
            appealMessage.trim() === ""
          }
          sx={{
            borderRadius: 2,
            boxShadow: 2,
            width: isMobile ? "100%" : "auto",
            transition: "all 0.2s",
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)"
            }
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Appeal"}
        </Button>
      </Box>
    </Box>
  );
};

export default RequestAppealForm;