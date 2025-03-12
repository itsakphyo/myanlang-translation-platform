"use client";

import type React from "react"
import { useState } from "react"
import {
  Box,
  Button,
  MenuItem,
  FormControl,
  Select,
  type SelectChangeEvent,
  Stack,
  Divider,
  InputLabel,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { useDialog } from "@/contexts/DialogContext"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import TranslateIcon from "@mui/icons-material/Translate"
import { IssueReportRequest } from '@/types/IssueReportRequest';
import { reportIssue } from "@/hooks/reportIssue";

const handleReportIssue = async (data: IssueReportRequest) => {
  try {
    const result = await reportIssue(data);
    console.log(result);
  } catch (err) {
    alert('Failed to report issue.');
  }
};

interface IssueReportFormProps {
  taskId: number
}

const IssueReportForm: React.FC<IssueReportFormProps> = ({ taskId }) => {
  const [issueType, setIssueType] = useState("")
  const { closeDialog } = useDialog()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const current_user_id = localStorage.getItem("userId")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const reportData: IssueReportRequest = {
      freelancer_id: Number(current_user_id),
      issue_type: issueType,
      task_id: taskId
    }

    handleReportIssue(reportData)
    console.log("Issue Report Data:", reportData)
    closeDialog()
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Alert severity="info" sx={{ mb: 2 }}>
          You are reporting an issue for Task #{taskId}
        </Alert>

        <FormControl fullWidth variant="outlined">
          <InputLabel id="issue-type-label">Issue Type</InputLabel>
          <Select
            labelId="issue-type-label"
            id="issue-type"
            value={issueType}
            onChange={(event: SelectChangeEvent) => setIssueType(event.target.value)}
            label="Issue Type"
            sx={{
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                gap: 1,
              },
            }}
          >
            <MenuItem value="" disabled>
              <em>Select an issue type</em>
            </MenuItem>
            <MenuItem value="not_enough_time" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon fontSize="small" color="action" />
              Not enough time for translation
            </MenuItem>
            <MenuItem value="wrong_source_language" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TranslateIcon fontSize="small" color="action" />
              Wrong source language
            </MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        <Stack direction={isMobile ? "column" : "row"} spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            onClick={closeDialog}
            variant="outlined"
            color="inherit"
            fullWidth={isMobile}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!issueType}
            fullWidth={isMobile}
            sx={{
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            Submit Report
          </Button>
        </Stack>
      </Box>
    </>
  )
}

export default IssueReportForm

