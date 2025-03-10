"use client"

import { useState, useEffect } from "react"
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Chip,
    Grid,
    InputAdornment,
    IconButton,
    Link,
} from "@mui/material"
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    FilterList,
    Search,
    Refresh,
    CheckCircle,
    Cancel,
    AccessTime,
    Visibility,
} from "@mui/icons-material"
import { useWithdrawals } from "@/hooks/useWithdrawal"
import CloudinaryUpload from "./CloudinaryUpload"
import { useUpdateWithdrawal } from "@/hooks/useUpdateWithdrawal"

// Define the type for withdrawal data
interface WithdrawalRequest {
    freelancer_id: number
    withdrawal_id: number
    amount: number
    requested_at: string
    processed_at: string | null
    payoneer_email: string | null
    kpay_phone: string | null
    bank_name: string | null
    admin_id: number | null
    payment_method: string
    withdrawal_status: string
    paypal_link: string | null
    wavepay_phone: string | null
    account_holder_name: string | null
    account_number: string | null
    proof_of_payment: string | null
}

export default function Payment() {
    // Sample data - in a real app, this would come from an API
    const { withdrawalRequests, fetchWithdrawals, loading, error } = useWithdrawals();
    const { updateWithdrawal, isLoading: updateLoading, error: UpdateError } = useUpdateWithdrawal();

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    // State for sorting
    const [sortField, setSortField] = useState<keyof WithdrawalRequest>("withdrawal_id")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

    // State for filtering
    const [filterMethod, setFilterMethod] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState<string>("")

    // State for detail view
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null)

    // State for processing
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [proofOfPayment, setProofOfPayment] = useState<string>("")

    // Handle sort
    const handleSort = (field: keyof WithdrawalRequest) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const handleUploadSuccess = (url: string) => {
        setProofOfPayment(url)
    }

    // Filter and sort the data
    const filteredAndSortedData = withdrawalRequests
        .filter((request) => {
            // Filter by payment method
            if (filterMethod !== "all" && request.payment_method.toLowerCase() !== filterMethod.toLowerCase()) {
                return false
            }

            // Filter by status
            if (filterStatus !== "all" && request.withdrawal_status !== filterStatus) {
                return false
            }

            // Search by ID, amount, or account holder name
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase()
                return (
                    request.withdrawal_id.toString().includes(searchTerm) ||
                    request.amount.toString().includes(searchTerm) ||
                    (request.account_holder_name && request.account_holder_name.toLowerCase().includes(searchLower))
                )
            }

            return true
        })
        .sort((a, b) => {
            const aValue = a[sortField]
            const bValue = b[sortField]

            if (aValue === null) return sortDirection === "asc" ? -1 : 1
            if (bValue === null) return sortDirection === "asc" ? 1 : -1

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }

            // For numbers and dates
            return sortDirection === "asc" ? (aValue < bValue ? -1 : 1) : bValue < aValue ? -1 : 1
        })

    // Handle view details
    const handleViewDetails = (request: WithdrawalRequest) => {
        setSelectedRequest(request)
    }

    const [dialogErrorMessage, setDialogErrorMessage] = useState<string | null>(null)

    const handleProcessPayment = async (status: "completed" | "rejected") => {
        if (status === "rejected") {
            setSelectedRequest(null);
            fetchWithdrawals();
            return;
        }

        if (!selectedRequest) return;
    
        if (!proofOfPayment && status === "completed") {
          setDialogErrorMessage("Please upload proof of payment");
          return;
        }
    
        setIsProcessing(true);
    
        try {
          const adminId = Number(localStorage.getItem("userId"));
    
          await updateWithdrawal({
            withdrawal_id: selectedRequest.withdrawal_id,
            admin_id: adminId,
            proof_of_payment: proofOfPayment,
          });
    
          setSelectedRequest(null);
          setProofOfPayment("");
        } catch (error) {
          console.error("Error processing payment:", error);
        } finally {
          setDialogErrorMessage(null);
          setIsProcessing(false);
          fetchWithdrawals();
        }
      };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString()
    }

    // Get status chip
    const getStatusChip = (status: string) => {
        switch (status) {
            case "processed":
                return <Chip label="Complete" color="success" />
            case "under_processing":
                return <Chip label="Processing" color="warning" />
            default:
                return <Chip label={status} />
        }
    }

    // Handle dialog close
    const handleCloseDialog = () => {
        setSelectedRequest(null)
    }

    return (
        <Box>
            <Card sx={{ height: 'auto', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                    title={
                        <Typography variant="h5" component="h1" fontWeight="bold">
                            Payment Withdrawal Requests
                        </Typography>
                    }
                    subheader="Manage and process freelancer payment withdrawal requests"
                />
                <CardContent>
                    {/* Filters */}
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 3 }}>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel id="payment-method-label">Payment Method</InputLabel>
                            <Select
                                labelId="payment-method-label"
                                value={filterMethod}
                                onChange={(e) => setFilterMethod(e.target.value)}
                                label="Payment Method"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <FilterList fontSize="small" />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="all">All Methods</MenuItem>
                                <MenuItem value="paypal">PayPal</MenuItem>
                                <MenuItem value="kpay">KPay</MenuItem>
                                <MenuItem value="wavepay">WavePay</MenuItem>
                                <MenuItem value="bank">Bank Transfer</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                label="Status"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccessTime fontSize="small" />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="all">All Statuses</MenuItem>
                                <MenuItem value="under_processing">Processing</MenuItem>
                                <MenuItem value="processed">Completed</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            size="small"
                            placeholder="Search by ID, amount or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ flexGrow: 1 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <IconButton
                            onClick={() => {
                                setFilterMethod("all")
                                setFilterStatus("all")
                                setSearchTerm("")
                                fetchWithdrawals()
                            }}
                            sx={{ height: 40, width: 40 }}
                        >
                            <Refresh fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Table */}
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="medium">
                            <TableHead>
                                <TableRow>
                                    <TableCell onClick={() => handleSort("withdrawal_id")} sx={{ cursor: "pointer" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            ID
                                            {sortField === "withdrawal_id" &&
                                                (sortDirection === "asc" ? (
                                                    <KeyboardArrowUp fontSize="small" />
                                                ) : (
                                                    <KeyboardArrowDown fontSize="small" />
                                                ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort("freelancer_id")} sx={{ cursor: "pointer" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            Freelancer ID
                                            {sortField === "freelancer_id" &&
                                                (sortDirection === "asc" ? (
                                                    <KeyboardArrowUp fontSize="small" />
                                                ) : (
                                                    <KeyboardArrowDown fontSize="small" />
                                                ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort("amount")} sx={{ cursor: "pointer" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            Amount
                                            {sortField === "amount" &&
                                                (sortDirection === "asc" ? (
                                                    <KeyboardArrowUp fontSize="small" />
                                                ) : (
                                                    <KeyboardArrowDown fontSize="small" />
                                                ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort("payment_method")} sx={{ cursor: "pointer" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            Method
                                            {sortField === "payment_method" &&
                                                (sortDirection === "asc" ? (
                                                    <KeyboardArrowUp fontSize="small" />
                                                ) : (
                                                    <KeyboardArrowDown fontSize="small" />
                                                ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort("requested_at")} sx={{ cursor: "pointer" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            Requested
                                            {sortField === "requested_at" &&
                                                (sortDirection === "asc" ? (
                                                    <KeyboardArrowUp fontSize="small" />
                                                ) : (
                                                    <KeyboardArrowDown fontSize="small" />
                                                ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell onClick={() => handleSort("withdrawal_status")} sx={{ cursor: "pointer" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            Status
                                            {sortField === "withdrawal_status" &&
                                                (sortDirection === "asc" ? (
                                                    <KeyboardArrowUp fontSize="small" />
                                                ) : (
                                                    <KeyboardArrowDown fontSize="small" />
                                                ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAndSortedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                            <Typography color="text.secondary">No withdrawal requests found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAndSortedData.map((request) => (
                                        <TableRow key={request.withdrawal_id}>
                                            <TableCell sx={{ fontWeight: "medium" }}>{request.withdrawal_id}</TableCell>
                                            <TableCell>{request.freelancer_id}</TableCell>
                                            <TableCell>${request.amount.toFixed(2)}</TableCell>
                                            <TableCell>{request.payment_method}</TableCell>
                                            <TableCell>{formatDate(request.requested_at)}</TableCell>
                                            <TableCell>{getStatusChip(request.withdrawal_status)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    startIcon={<Visibility />}
                                                    onClick={() => handleViewDetails(request)}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Showing {filteredAndSortedData.length} of {withdrawalRequests.length} requests
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={!!selectedRequest} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                {selectedRequest && (
                    <>
                        <DialogTitle>Withdrawal Request #{selectedRequest.withdrawal_id}</DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{ mb: 2 }}>Review and process this payment withdrawal request</DialogContentText>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" fontWeight="medium">
                                        Freelancer ID:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">{selectedRequest.freelancer_id}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" fontWeight="medium">
                                        Amount:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">${selectedRequest.amount.toFixed(2)}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" fontWeight="medium">
                                        Payment Method:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">{selectedRequest.payment_method}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" fontWeight="medium">
                                        Requested At:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">{formatDate(selectedRequest.requested_at)}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" fontWeight="medium">
                                        Status:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    {getStatusChip(selectedRequest.withdrawal_status)}
                                </Grid>

                                {selectedRequest.account_holder_name && (
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" fontWeight="medium">
                                                Account Holder:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">{selectedRequest.account_holder_name}</Typography>
                                        </Grid>
                                    </>
                                )}

                                {selectedRequest.kpay_phone && (
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" fontWeight="medium">
                                                KPay Phone:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">{selectedRequest.kpay_phone}</Typography>
                                        </Grid>
                                    </>
                                )}

                                {selectedRequest.wavepay_phone && (
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" fontWeight="medium">
                                                WavePay Phone:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">{selectedRequest.wavepay_phone}</Typography>
                                        </Grid>
                                    </>
                                )}

                                {selectedRequest.paypal_link && (
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" fontWeight="medium">
                                                PayPal Link:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">{selectedRequest.paypal_link}</Typography>
                                        </Grid>
                                    </>
                                )}

                                {selectedRequest.bank_name && (
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" fontWeight="medium">
                                                Bank Name:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">{selectedRequest.bank_name}</Typography>
                                        </Grid>
                                    </>
                                )}

                                {selectedRequest.account_number && (
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" fontWeight="medium">
                                                Account Number:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">{selectedRequest.account_number}</Typography>
                                        </Grid>
                                    </>
                                )}

                                {selectedRequest.processed_at && (
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" fontWeight="medium">
                                                Processed At:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">{formatDate(selectedRequest.processed_at)}</Typography>
                                        </Grid>
                                    </>
                                )}

                                {selectedRequest.admin_id && (
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" fontWeight="medium">
                                                Processed By:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Admin #{selectedRequest.admin_id}</Typography>
                                        </Grid>
                                    </>
                                )}

                                {selectedRequest.withdrawal_status === "under_processing" && (
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" fontWeight="medium">
                                                Upload Proof of Payment:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <CloudinaryUpload onUploadSuccess={handleUploadSuccess} />
                                        </Grid>
                                    </>
                                )}

                                {selectedRequest.proof_of_payment && (
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" fontWeight="medium">
                                                Proof of Payment:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Link
                                                href={selectedRequest.proof_of_payment}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                See Proof of Payment
                                            </Link>
                                        </Grid>
                                    </>
                                )}

                                {dialogErrorMessage && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="error">
                                            {dialogErrorMessage}
                                        </Typography>
                                    </Grid>
                                )}

                            </Grid>

                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            {selectedRequest.withdrawal_status === "under_processing" && (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleProcessPayment("rejected")}
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleProcessPayment("completed")}
                                        disabled={isProcessing || !proofOfPayment}
                                        startIcon={<CheckCircle />}
                                    >
                                        Approve
                                    </Button>
                                </>
                            )}
                            {selectedRequest.withdrawal_status !== "under_processing" && (
                                <Button onClick={handleCloseDialog}>Close</Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    )
}

