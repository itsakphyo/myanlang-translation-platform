"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  Grid,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  ThemeProvider,
  CssBaseline,
  type SelectChangeEvent,
} from "@mui/material"

// Icons
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Language as LanguageIcon,
  Payment as PaymentIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import type { ReactElement } from "react"
import type { Report, IssueTypeConfig, StatusColors, Stats } from "@/types/reports"
import theme from "@/theme"
import { fetchReports } from "@/hooks/reportIssue"
import ResolveDialog from "./resolve-dialog"
import { useResolveIssue, IssueResolveRequest } from "@/hooks/useResolveIssue"
import Toast from "@/utils/showToast"

// Map issue types to icons and colors
const issueTypeConfig: Record<string, IssueTypeConfig> = {
  accuracy_appeal: { icon: <LanguageIcon />, color: "info", label: "Accuracy Appeal" },
  not_enough_time: { icon: <AccessTimeIcon />, color: "warning", label: "Not Enough Time" },
  wrong_source_language: { icon: <LanguageIcon />, color: "error", label: "Wrong Source Language" },
  payment_delay: { icon: <PaymentIcon />, color: "secondary", label: "Payment Delay" },
}

// Map status to colors
const statusColors: StatusColors = {
  under_review: "warning",
  proceed: "success",
  rejected: "error",
}

// Format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Determine file type from URL
const getFileType = (url: string | null): "image" | "pdf" | "other" => {
  if (!url) return "other"
  if (url.match(/\.(png|jpg|jpeg|gif|svg)$/i)) return "image"
  if (url.match(/\.(pdf)$/i)) return "pdf"
  return "other"
}

export default function AdminDashboard(): ReactElement {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterIssueType, setFilterIssueType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [currentReport, setCurrentReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<string>("")
  const [reports, setReports] = useState<Report[]>([])

  const { resolveIssue } = useResolveIssue();

  const loadReports = async () => {
    try {
      setLoading(true)
      const data = await fetchReports()
      setReports(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  // Filter reports based on status, issue type, and search query
  const filteredReports = reports.filter((report) => {
    const matchesStatus = filterStatus === "all" || report.report_status === filterStatus
    const matchesIssueType = filterIssueType === "all" || report.issue_type === filterIssueType
    const matchesSearch =
      searchQuery === "" ||
      report.report_id.toString().includes(searchQuery) ||
      (report.description && report.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      report.issue_type.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesIssueType && matchesSearch
  })

  // Toggle row expansion
  const handleRowClick = (reportId: number): void => {
    setExpandedRow(expandedRow === reportId ? null : reportId)
  }

  // Open resolution dialog
  const handleResolveClick = (report: Report): void => {
    setCurrentReport(report)
    setDialogOpen(true)
  }

  // Close dialog without making a decision
  const handleDialogClose = (): void => {
    setDialogOpen(false)
    setCurrentReport(null)
  }

  const handleResolveSubmit = async (resolution: string, updatedTime?: number): Promise<void> => {
    if (!currentReport) return;
    setLoading(true);

    // Get user ID from localStorage
    const userIdStr = localStorage.getItem("userId");
    if (!userIdStr) {
      setLoading(false);
      return;
    }
    const userId = Number(userIdStr);

    // Build the payload based on the report issue type
    const payload: IssueResolveRequest = {
      report_id: currentReport.report_id,
      admin_id: userId,
      decision: resolution === "approve"
    };

    if (currentReport.issue_type === "wrong_source_language" && currentReport.taskId) {
      payload.task_id = currentReport.taskId;
      console.log(userId, resolution, currentReport.report_id, currentReport.taskId);
    } else if (currentReport.issue_type === "not_enough_time" && currentReport.task && currentReport.taskId) {
      payload.task_id = currentReport.taskId;
      if (updatedTime !== undefined) {
        payload.added_min = updatedTime;
      }
      console.log(userId, resolution, currentReport.report_id, currentReport.taskId, updatedTime);
    } else if (currentReport.issue_type === "accuracy_appeal" && currentReport.language_pair) {
      payload.language_pair_id = currentReport.language_pair.language_pair_id;
      console.log(userId, resolution, currentReport.report_id, currentReport.language_pair.language_pair_id);
    } else if (currentReport.issue_type === "payment_delay") {
      console.log(userId, resolution, currentReport.report_id);
    }

    try {
      await resolveIssue(payload);
      loadReports();
      setDialogOpen(false);
      setCurrentReport(null);
      Toast.show(`Report #${currentReport.report_id} has been ${resolution === "proceed" ? "proceed" : "rejected"}.`);
    } catch (error) {
      console.error("Error resolving issue:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open document dialog or new tab based on file type
  const handleImageClick = (url: string): void => {
    const fileType = getFileType(url)
    if (fileType === "image") {
      setCurrentImage(url)
      setImageDialogOpen(true)
    } else {
      window.open(url, "_blank") // Open other docs in a new tab
    }
  }

  // Handle status filter change
  const handleStatusFilterChange = (event: SelectChangeEvent): void => {
    setFilterStatus(event.target.value)
  }

  // Handle issue type filter change
  const handleIssueTypeFilterChange = (event: SelectChangeEvent): void => {
    setFilterIssueType(event.target.value)
  }

  // Handle search query change
  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value)
  }

  // Reset filters
  const handleResetFilters = (): void => {
    setFilterStatus("all")
    setFilterIssueType("all")
    setSearchQuery("")
  }

  // Calculate statistics
  const stats: Stats = {
    total: reports.length,
    underReview: reports.filter((r) => r.report_status === "under_review").length,
    proceed: reports.filter((r) => r.report_status === "proceed").length,
    rejected: reports.filter((r) => r.report_status === "rejected").length,
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Main content */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {/* Content */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Page header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Issue Reports
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and resolve reported issues from freelancers
              </Typography>
            </Box>

            {/* Stats cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
                      Total Reports
                    </Typography>
                    <Typography variant="h3" component="div">
                      {stats.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
                      Under Review
                    </Typography>
                    <Typography variant="h3" component="div" color="warning.main">
                      {stats.underReview}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
                      Proceed
                    </Typography>
                    <Typography variant="h3" component="div" color="success.main">
                      {stats.proceed}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
                      Rejected
                    </Typography>
                    <Typography variant="h3" component="div" color="error.main">
                      {stats.rejected}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search by ID, description, or issue type"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
                    }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={filterStatus}
                      label="Status"
                      onChange={handleStatusFilterChange}
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="under_review">Under Review</MenuItem>
                      <MenuItem value="proceed">Proceed</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="issue-type-filter-label">Issue Type</InputLabel>
                    <Select
                      labelId="issue-type-filter-label"
                      value={filterIssueType}
                      label="Issue Type"
                      onChange={handleIssueTypeFilterChange}
                    >
                      <MenuItem value="all">All Issues</MenuItem>
                      <MenuItem value="accuracy_appeal">Accuracy Appeal</MenuItem>
                      <MenuItem value="not_enough_time">Not Enough Time</MenuItem>
                      <MenuItem value="wrong_source_language">Wrong Source Language</MenuItem>
                      <MenuItem value="payment_delay">Payment Delay</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleResetFilters} fullWidth>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Reports table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>ID</TableCell>
                    <TableCell>Issue Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Reported At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box sx={{ py: 3 }}>
                          <Typography variant="body1" color="text.secondary">
                            No reports found matching your filters.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <React.Fragment key={report.report_id}>
                        <TableRow
                          hover
                          onClick={() => handleRowClick(report.report_id)}
                          sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
                        >
                          <TableCell>
                            <IconButton size="small">
                              {expandedRow === report.report_id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell>#{report.report_id}</TableCell>
                          <TableCell>
                            <Chip
                              label={issueTypeConfig[report.issue_type]?.label || report.issue_type}
                              color={"default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={report.report_status.replace("_", " ")}
                              color={statusColors[report.report_status] || "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(report.reported_at)}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation()
                                handleResolveClick(report)
                              }}
                              disabled={report.report_status !== "under_review"}
                            >
                              Resolve
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={expandedRow === report.report_id} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 2 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                  Report Details
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                    <Card variant="outlined" sx={{ height: "100%" }}>
                                      <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                          Basic Information
                                        </Typography>
                                        <Grid container spacing={2}>
                                          <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                              Freelancer ID
                                            </Typography>
                                            <Typography variant="body1">{report.freelancer_id}</Typography>
                                          </Grid>
                                          {report.taskId && (
                                            <Grid item xs={6}>
                                              <Typography variant="body2" color="text.secondary">
                                                Task ID
                                              </Typography>
                                              <Typography variant="body1">{report.taskId}</Typography>
                                            </Grid>
                                          )}
                                          {report.withdrawalId && (
                                            <Grid item xs={6}>
                                              <Typography variant="body2" color="text.secondary">
                                                Withdrawal ID
                                              </Typography>
                                              <Typography variant="body1">{report.withdrawalId}</Typography>
                                            </Grid>
                                          )}
                                          {report.language_pair && (
                                            <>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Accuracy
                                                </Typography>
                                                <Typography variant="body1">
                                                  {report.language_pair.accuracy_rate} %
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Source Language
                                                </Typography>
                                                <Typography variant="body1">
                                                  {report.language_pair.source_language_name}
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Target Language
                                                </Typography>
                                                <Typography variant="body1">
                                                  {report.language_pair.target_language_name}
                                                </Typography>
                                              </Grid>

                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Total Tasks
                                                </Typography>
                                                <Typography variant="body1">
                                                  {report.language_pair.complete_task}
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Total Rejected Tasks
                                                </Typography>
                                                <Typography variant="body1">
                                                  {report.language_pair.rejected_task}
                                                </Typography>
                                              </Grid>
                                            </>
                                          )}
                                          {report.task && (
                                            <>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Max Time Per Task
                                                </Typography>
                                                <Typography variant="body1">
                                                  {report.task.max_time_per_task} min
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Job ID
                                                </Typography>
                                                <Typography variant="body1">{report.task.job_id}</Typography>
                                              </Grid>
                                              <Grid item xs={12}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Source Language
                                                </Typography>
                                                <Typography variant="body1">
                                                  {report.task.source_language_name}
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={12}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Target Language
                                                </Typography>
                                                <Typography variant="body1">
                                                  {report.task.target_language_name}
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={12}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Source Text
                                                </Typography>
                                                <Typography variant="body1">{report.task.source_text}</Typography>
                                              </Grid>
                                              <Grid item xs={12}>
                                                <Typography variant="body2" color="text.secondary">
                                                  Instruction
                                                </Typography>
                                                <Typography variant="body1">{report.task.translated_text}</Typography>
                                              </Grid>
                                            </>
                                          )}
                                          {report.resolved_at && (
                                            <Grid item xs={12}>
                                              <Typography variant="body2" color="text.secondary">
                                                Resolved At
                                              </Typography>
                                              <Typography variant="body1">{formatDate(report.resolved_at)}</Typography>
                                            </Grid>
                                          )}
                                        </Grid>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Card variant="outlined" sx={{ height: "100%" }}>
                                      <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                          Description
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                          {report.description || "No description provided."}
                                        </Typography>

                                        {report.documentationUrl && (
                                          <>
                                            <Typography variant="subtitle1" gutterBottom>
                                              Documentation
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                              <Button
                                                variant="outlined"
                                                startIcon={
                                                  getFileType(report.documentationUrl as string) === "image" ? (
                                                    <ImageIcon />
                                                  ) : (
                                                    <PaymentIcon />
                                                  )
                                                }
                                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                  e.stopPropagation()
                                                  handleImageClick(report.documentationUrl as string)
                                                }}
                                                size="small"
                                              >
                                                View{" "}
                                                {getFileType(report.documentationUrl as string) === "image"
                                                  ? "Image"
                                                  : "Document"}
                                              </Button>
                                            </Box>
                                          </>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>

      {/* Use the separated ResolveDialog component */}
      <ResolveDialog
        open={dialogOpen}
        currentReport={currentReport}
        loading={loading}
        onClose={handleDialogClose}
        onResolve={handleResolveSubmit}
      />

      {/* Image preview dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Documentation Image
          <IconButton
            aria-label="close"
            onClick={() => setImageDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <img
              src={currentImage || "/placeholder.svg"}
              alt="Documentation"
              style={{ maxWidth: "100%", maxHeight: "70vh" }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}

