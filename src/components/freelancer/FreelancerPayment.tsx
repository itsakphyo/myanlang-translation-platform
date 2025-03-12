import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  CircularProgress,
  Button,
  Divider,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Refresh, AccountBalanceWallet, Payment, Schedule, CheckCircleOutline, ReportProblem } from '@mui/icons-material';
import { getWithdrawalsByFreelancer } from '@/hooks/useWithdrawal';
import { format } from 'date-fns';
import PaymentRequestDialog from './PaymentRequestDialog';
import { freelancerService } from '@/hooks/useWithdrawal';
import { useDialog } from '@/contexts/DialogContext';

interface Withdrawal {
  freelancer_id: number;
  withdrawal_id: number;
  admin_id: number | null;
  payment_method: string;
  amount: number;
  requested_at: string;
  processed_at: string | null;
  withdrawal_status: string;
  paypal_link: string | null;
  payoneer_email: string | null;
  wavepay_phone: string | null;
  kpay_phone: string | null;
  account_holder_name: string | null;
  bank_name: string | null;
  account_number: string | null;
  proof_of_payment: string | null;
}

const FreelancerPayment: React.FC = () => {
  const theme = useTheme();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
  const freelancerId = localStorage.getItem("userId");
  const { getCurrentBalance } = freelancerService;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const { openDialog } = useDialog();

  const handleReportIssue = (withdrawalId: number) => {
    openDialog('payment-issue', { withdrawalId });
  };

  const fetchWithdrawals = async () => {
    if (freelancerId) {
      try {
        // Fetch balance
        const balanceResponse = await getCurrentBalance(parseInt(freelancerId));
        setCurrentBalance(balanceResponse.current_balance);

        // Fetch withdrawals
        setLoading(true);
        const withdrawalData = await getWithdrawalsByFreelancer(parseInt(freelancerId));

        // Sort withdrawals by requested_at in descending order
        const sortedWithdrawals = withdrawalData.sort((a: Withdrawal, b: Withdrawal) => {
          return new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime();
        });

        setWithdrawals(sortedWithdrawals);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [freelancerId, getCurrentBalance, getWithdrawalsByFreelancer]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processed':
        return 'success';
      case 'under_processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderPaymentDetails = (withdrawal: Withdrawal) => {
    const fields = [
      { label: 'PayPal Link', value: withdrawal.paypal_link },
      { label: 'Payoneer Email', value: withdrawal.payoneer_email },
      { label: 'WavePay Phone', value: withdrawal.wavepay_phone },
      { label: 'KPay Phone', value: withdrawal.kpay_phone },
      { label: 'Account Holder Name', value: withdrawal.account_holder_name },
      { label: 'Bank Name', value: withdrawal.bank_name },
      { label: 'Account Number', value: withdrawal.account_number },
      { label: 'Proof of Payment', value: withdrawal.proof_of_payment },
    ];

    // Only render fields with a non-null value
    const availableFields = fields.filter(field => field.value);
    if (!availableFields.length) return null;

    return (
      <Box sx={{ mt: 2 }}>
        {availableFields.map((field, index) => (
          <Grid container spacing={1} key={index}>
            <Grid item>
              <Payment fontSize="small" color="action" />
            </Grid>
            <Grid item>
              {field.label === 'Proof of Payment' ? (
                <Link
                  href={field.value!}
                  target="_blank"
                  rel="noopener noreferrer"
                  fontSize="small"
                  underline="hover"
                >
                  See Proof of Payment
                </Link>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" >
                    {field.label}: <strong>{field.value}</strong>
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        ))}
      </Box>
    );
  };

  if (!freelancerId) {
    return (
      <Box textAlign="center" p={4}>
        <Typography color="error">Error: Freelancer ID not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <PaymentRequestDialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        currentBalance={currentBalance}
        freelancerId={parseInt(freelancerId)}
        fetchWithdrawals={fetchWithdrawals} // Pass fetchWithdrawals as a prop
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isSmallScreen ? "flex-start" : "center",
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBalanceWallet /> Withdrawal History
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            width: isSmallScreen ? "100%" : "auto",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchWithdrawals}
            disabled={loading}
            fullWidth={isSmallScreen}
            color='primary'
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowPaymentDialog(true)}
            fullWidth={isSmallScreen}
          >
            Request New Payment
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.grey[100], borderRadius: 1 }}>
        <Typography variant="h6">Current Balance: ${currentBalance.toFixed(2)}</Typography>
      </Box>

      {loading ? (
        <Box textAlign="center" p={4}>
          <CircularProgress />
        </Box>
      ) : withdrawals.length === 0 ? (
        <Box textAlign="center" p={4}>
          <Typography variant="body1" color="text.secondary">
            No withdrawal history found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {withdrawals.map((withdrawal) => (
            <Grid item xs={12} key={withdrawal.withdrawal_id}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
                    }}
                  >
                    <Box>
                      <Typography variant="h6" component="div">
                        ${withdrawal.amount.toFixed(2)}
                      </Typography>
                      <Chip
                        label={withdrawal.withdrawal_status}
                        color={getStatusColor(withdrawal.withdrawal_status)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box sx={{ mt: { xs: 2, sm: 0 } }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <Schedule fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Requested: {format(new Date(withdrawal.requested_at), 'MMM dd, yyyy HH:mm')}
                      </Typography>
                      {withdrawal.processed_at && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          <CheckCircleOutline fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          Processed: {format(new Date(withdrawal.processed_at), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
                    }}
                  >
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Payment fontSize="small" sx={{ mr: 1 }} />
                      Method: <strong style={{ marginLeft: '5px' }}>{withdrawal.payment_method}</strong>
                    </Typography>
                  </Box>
                  {renderPaymentDetails(withdrawal)}
                  {withdrawal.withdrawal_status.toLowerCase() === 'under_processing' && (
                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<ReportProblem />}
                        onClick={() => handleReportIssue(withdrawal.withdrawal_id)}
                      >
                        Report Payment Delay
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FreelancerPayment;
