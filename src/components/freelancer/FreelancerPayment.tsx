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
  useTheme,
} from '@mui/material';
import { Refresh, AccountBalanceWallet, Payment, Schedule, CheckCircleOutline } from '@mui/icons-material';
import { getWithdrawalsByFreelancer } from '@/hooks/useWithdrawal';
import { format } from 'date-fns';
import PaymentRequestDialog from './PaymentRequestDialog';
import { freelancerService } from '@/hooks/useWithdrawal';

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
}

const FreelancerPayment: React.FC = () => {
  const theme = useTheme();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
  const freelancerId = localStorage.getItem("userId");
  const { getCurrentBalance } = freelancerService;

  const [currentBalance, setCurrentBalance] = useState<number>(0);

  const fetchWithdrawals = async () => {
    if (freelancerId) {
      try {
        // Fetch balance
        const balanceResponse = await getCurrentBalance(parseInt(freelancerId));
        setCurrentBalance(balanceResponse.current_balance);

        // Fetch withdrawals
        setLoading(true);
        const withdrawalData = await getWithdrawalsByFreelancer(parseInt(freelancerId));
        setWithdrawals(withdrawalData);
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
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderPaymentDetails = (withdrawal: Withdrawal) => {
    const methodDetails: { [key: string]: { label: string; value: string | null } } = {
      Paypal: { label: 'PayPal Link', value: withdrawal.paypal_link },
      Payoneer: { label: 'Payoneer Email', value: withdrawal.payoneer_email },
      Wavepay: { label: 'WavePay Phone', value: withdrawal.wavepay_phone },
      Kpay: { label: 'KPay Phone', value: withdrawal.kpay_phone },
      Bank: {
        label: 'Bank Account',
        value: `${withdrawal.bank_name} - ${withdrawal.account_number} (${withdrawal.account_holder_name})`,
      },
    };

    const details = methodDetails[withdrawal.payment_method];
    return details?.value ? (
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Payment fontSize="small" color="action" />
        </Grid>
        <Grid item>
          <Typography variant="body2" color="text.secondary">
            {details.label}: <strong>{details.value}</strong>
          </Typography>
        </Grid>
      </Grid>
    ) : null;
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalanceWallet /> Withdrawal History
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" startIcon={<Refresh />} onClick={fetchWithdrawals} disabled={loading}>
            Refresh
          </Button>
          <Button variant="contained" color="primary" onClick={() => setShowPaymentDialog(true)}>
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
                      <Typography variant="body2" color="text.secondary">
                        <Schedule fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Requested: {format(new Date(withdrawal.requested_at), 'MMM dd, yyyy HH:mm')}
                      </Typography>
                      {withdrawal.processed_at && (
                        <Typography variant="body2" color="text.secondary">
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
                      Method: <strong>{withdrawal.payment_method}</strong>
                    </Typography>
                    {renderPaymentDetails(withdrawal)}
                    {withdrawal.admin_id && (
                      <Typography variant="body2" color="text.secondary">
                        Processed by Admin ID: {withdrawal.admin_id}
                      </Typography>
                    )}
                  </Box>
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