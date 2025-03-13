"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  CircularProgress,
} from "@mui/material"
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from "@mui/icons-material"
import type { Report } from "@/types/reports"

interface ResolveDialogProps {
  open: boolean
  currentReport: Report | null
  loading: boolean
  onClose: () => void
  onResolve: (resolution: string, updatedTime?: number) => void
}

export default function ResolveDialog({ open, currentReport, loading, onClose, onResolve }: ResolveDialogProps) {
  const [resolution, setResolution] = useState<string>("")
  const [updatedTime, setUpdatedTime] = useState<number>(0)

  // Reset state when dialog opens with a new report
  useEffect(() => {
    if (open && currentReport) {
      setResolution("")
      // Initialize time if it's a time-related issue
      if (currentReport.issue_type === "not_enough_time" && currentReport.task) {
        setUpdatedTime(currentReport.task.max_time_per_task)
      } else {
        setUpdatedTime(0)
      }
    }
  }, [open, currentReport])

  // Handle dialog close without making a decision
  const handleCancel = () => {
    setResolution("")
    setUpdatedTime(0)
    onClose()
  }

  // Handle resolution submission
  const handleSubmit = () => {
    if (currentReport?.issue_type === "not_enough_time") {
      onResolve(resolution, updatedTime)
    } else {
      onResolve(resolution)
    }
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Resolve Report #{currentReport?.report_id}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Please select how you want to resolve this {currentReport?.issue_type?.replace("_", " ")} report.
        </DialogContentText>

        {/* Dynamic content based on issue type */}
        {currentReport?.issue_type === "not_enough_time" && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Update maximum time per task:
            </Typography>
            <TextField
              type="number"
              label="Time in minutes"
              value={updatedTime}
              onChange={(e) => setUpdatedTime(Number(e.target.value))}
              fullWidth
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant={resolution === "approve" ? "contained" : "outlined"}
                color="success"
                fullWidth
                startIcon={<CheckCircleIcon />}
                onClick={() => setResolution("approve")}
                sx={{ p: 2, height: "100%" }}
              >
                {currentReport?.issue_type === "wrong_source_language"
                  ? "Close Task"
                  : currentReport?.issue_type === "not_enough_time"
                    ? "Update Time"
                    : currentReport?.issue_type === "accuracy_appeal"
                      ? "Reset Freelancer Accuracy"
                      : currentReport?.issue_type === "payment_delay"
                        ? "Mark as Paid (pay manyually)"
                        : "Approve"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant={resolution === "reject" ? "contained" : "outlined"}
                color="error"
                fullWidth
                startIcon={<CancelIcon />}
                onClick={() => setResolution("reject")}
                sx={{ p: 2, height: "100%" }}
              >
                {currentReport?.issue_type === "wrong_source_language"
                  ? "Deny Request"
                  : currentReport?.issue_type === "not_enough_time"
                    ? "Deny Request"
                    : currentReport?.issue_type === "accuracy_appeal"
                      ? "Deny Appeal"
                      : currentReport?.issue_type === "payment_delay"
                        ? "Deny Request"
                        : "Reject"}
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!resolution || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Processing..." : "Submit Resolution"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

