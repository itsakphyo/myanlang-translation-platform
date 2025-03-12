"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Grid,
    Typography,
    Divider,
    InputAdornment,
    CircularProgress,
    useTheme,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { requestNewPayment } from '@/hooks/useWithdrawal';
import { PaymentFormValues } from '@/types/paymentFromValues';

interface PaymentDialogProps {
    open: boolean;
    onClose: () => void;
    currentBalance: number;
    freelancerId: number;
    fetchWithdrawals: () => void;
}

const PaymentRequestDialog = ({
    open,
    onClose,
    currentBalance,
    freelancerId,
    fetchWithdrawals,
}: PaymentDialogProps) => {
    const theme = useTheme();
    const [submitting, setSubmitting] = useState(false);

    const validationSchema = (currentBalance: number) =>
        Yup.object().shape({
            payment_method: Yup.string().required('Payment method is required'),
            amount: Yup.number()
                .required('Amount is required')
                .positive('Amount must be positive')
                .max(
                    currentBalance,
                    `Amount exceeds available balance (${currentBalance} MMK)`
                ),
            paypal_link: Yup.string().when('payment_method', {
                is: (val: string) => val === 'paypal',
                then: (schema) => schema.required('PayPal email is required'),
            }),
            payoneer_email: Yup.string().when('payment_method', {
                is: (val: string) => val === 'payoneer',
                then: (schema) => schema.required('Payoneer email is required'),
            }),
            wavepay_phone: Yup.string().when('payment_method', {
                is: (val: string) => val === 'wavepay',
                then: (schema) => schema.required('WavePay phone number is required'),
            }),
            kpay_phone: Yup.string().when('payment_method', {
                is: (val: string) => val === 'kpay',
                then: (schema) => schema.required('KPay phone number is required'),
            }),
            account_holder_name: Yup.string().when('payment_method', {
                is: (method: string) =>
                    ['wavepay', 'kpay', 'bank'].includes(method),
                then: (schema) =>
                    schema.required('Account holder name is required'),
            }),
            bank_name: Yup.string().when('payment_method', {
                is: (val: string) => val === 'bank',
                then: (schema) => schema.required('Bank name is required'),
            }),
            account_number: Yup.string().when('payment_method', {
                is: (val: string) => val === 'bank',
                then: (schema) =>
                    schema.required('Account number is required'),
            }),
        });

    const formik = useFormik<PaymentFormValues>({
        initialValues: {
            freelancer_id: freelancerId,
            payment_method: '',
            amount: 0,
        },
        validationSchema: validationSchema(currentBalance),
        onSubmit: async (values: PaymentFormValues) => {
            setSubmitting(true);
            try {
                const payload = {
                    ...values,
                    freelancer_id: Number(values.freelancer_id),
                };
                await requestNewPayment(payload);
                onClose();
                fetchWithdrawals();
            } catch (error: unknown) {
                console.error('Submission error:', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const renderMethodFields = () => {
        switch (formik.values.payment_method) {
            case 'paypal':
                return (
                    <TextField
                        fullWidth
                        label="PayPal Email"
                        name="paypal_link"
                        value={formik.values.paypal_link || ''}
                        onChange={formik.handleChange}
                        error={formik.touched.paypal_link && Boolean(formik.errors.paypal_link)}
                        helperText={formik.touched.paypal_link && formik.errors.paypal_link}
                        margin="normal"
                    />
                );
            case 'payoneer':
                return (
                    <TextField
                        fullWidth
                        label="Payoneer Email"
                        name="payoneer_email"
                        value={formik.values.payoneer_email || ''}
                        onChange={formik.handleChange}
                        error={formik.touched.payoneer_email && Boolean(formik.errors.payoneer_email)}
                        helperText={formik.touched.payoneer_email && formik.errors.payoneer_email}
                        margin="normal"
                    />
                );
            case 'wavepay':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Account Holder Name"
                                name="account_holder_name"
                                value={formik.values.account_holder_name || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.account_holder_name && Boolean(formik.errors.account_holder_name)}
                                helperText={formik.touched.account_holder_name && formik.errors.account_holder_name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="wavepay_phone"
                                value={formik.values.wavepay_phone || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.wavepay_phone && Boolean(formik.errors.wavepay_phone)}
                                helperText={formik.touched.wavepay_phone && formik.errors.wavepay_phone}
                            />
                        </Grid>
                    </Grid>
                );
            case 'kpay':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Account Holder Name"
                                name="account_holder_name"
                                value={formik.values.account_holder_name || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.account_holder_name && Boolean(formik.errors.account_holder_name)}
                                helperText={formik.touched.account_holder_name && formik.errors.account_holder_name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="kpay_phone"
                                value={formik.values.kpay_phone || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.kpay_phone && Boolean(formik.errors.kpay_phone)}
                                helperText={formik.touched.kpay_phone && formik.errors.kpay_phone}
                            />
                        </Grid>
                    </Grid>
                );
            case 'bank':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Account Holder Name"
                                name="account_holder_name"
                                value={formik.values.account_holder_name || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.account_holder_name && Boolean(formik.errors.account_holder_name)}
                                helperText={formik.touched.account_holder_name && formik.errors.account_holder_name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Bank Name"
                                name="bank_name"
                                value={formik.values.bank_name || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.bank_name && Boolean(formik.errors.bank_name)}
                                helperText={formik.touched.bank_name && formik.errors.bank_name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Account Number"
                                name="account_number"
                                value={formik.values.account_number || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.account_number && Boolean(formik.errors.account_number)}
                                helperText={formik.touched.account_number && formik.errors.account_number}
                            />
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
                Request Payment Withdrawal
            </DialogTitle>
            <Divider />
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Available Balance: {currentBalance.toFixed(2)} MMK
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        label="Payment Method"
                        name="payment_method"
                        value={formik.values.payment_method}
                        onChange={formik.handleChange}
                        error={formik.touched.payment_method && Boolean(formik.errors.payment_method)}
                        helperText={formik.touched.payment_method && formik.errors.payment_method}
                        margin="normal"
                    >
                        <MenuItem value="">Select Method</MenuItem>
                        <MenuItem value="paypal">PayPal</MenuItem>
                        <MenuItem value="payoneer">Payoneer</MenuItem>
                        <MenuItem value="wavepay">WavePay</MenuItem>
                        <MenuItem value="kpay">KPay</MenuItem>
                        <MenuItem value="bank">Bank Transfer</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        label="Amount"
                        name="amount"
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">MMK</InputAdornment>,
                            inputProps: { min: 0, max: currentBalance, step: 0.01 },
                        }}
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        error={formik.touched.amount && Boolean(formik.errors.amount)}
                        helperText={formik.touched.amount && formik.errors.amount}
                        margin="normal"
                    />

                    {formik.values.payment_method && renderMethodFields()}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={submitting}
                        startIcon={submitting && <CircularProgress size={20} />}
                    >
                        {submitting ? 'Processing...' : 'Request Withdrawal'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PaymentRequestDialog;
