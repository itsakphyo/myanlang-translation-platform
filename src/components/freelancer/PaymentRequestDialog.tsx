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
import Toast from '@/utils/showToast';
import { translations } from '@/contexts/translation';
import { useSystemLanguage } from '@/contexts/language-context';

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

    const { systemLanguage } = useSystemLanguage();

    const validationSchema = (currentBalance: number) =>
        Yup.object().shape({
            payment_method: Yup.string().required('Payment method is required'),
            amount: Yup.number()
                .required(translations[systemLanguage].amount_is_required)
                .positive(translations[systemLanguage].amount_must_be_positive)
                .max(
                    currentBalance,
                    `${translations[systemLanguage].ammount_exceeds_available_balance}`
                ),
            paypal_link: Yup.string().when('payment_method', {
                is: (val: string) => val === 'paypal',
                then: (schema) => schema.required(translations[systemLanguage].paypal_email_is_required),
            }),
            payoneer_email: Yup.string().when('payment_method', {
                is: (val: string) => val === 'payoneer',
                then: (schema) => schema.required(translations[systemLanguage].payoneer_email_is_required),
            }),
            wavepay_phone: Yup.string().when('payment_method', {
                is: (val: string) => val === 'wavepay',
                then: (schema) => schema.required(translations[systemLanguage].wavepay_phone_is_required),
            }),
            kpay_phone: Yup.string().when('payment_method', {
                is: (val: string) => val === 'kpay',
                then: (schema) => schema.required(translations[systemLanguage].kpay_phone_is_required),
            }),
            account_holder_name: Yup.string().when('payment_method', {
                is: (method: string) =>
                    ['wavepay', 'kpay', 'bank'].includes(method),
                then: (schema) =>
                    schema.required(translations[systemLanguage].account_holder_name_is_required),
            }),
            bank_name: Yup.string().when('payment_method', {
                is: (val: string) => val === 'bank',
                then: (schema) => schema.required(translations[systemLanguage].bank_name_is_required),
            }),
            account_number: Yup.string().when('payment_method', {
                is: (val: string) => val === 'bank',
                then: (schema) =>
                    schema.required(translations[systemLanguage].account_number_is_required),
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
                Toast.show(translations[systemLanguage].withdraw_request_success_text);
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
                        label= {translations[systemLanguage].paypal_link}
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
                        label= {translations[systemLanguage].payoneer_email}
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
                                label= {translations[systemLanguage].account_holder_name}
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
                                label= {translations[systemLanguage].wavepay_phone}
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
                                label= {translations[systemLanguage].account_holder_name}
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
                                label= {translations[systemLanguage].kpay_phone}
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
                                label= {translations[systemLanguage].account_holder_name}
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
                                label= {translations[systemLanguage].bank_name}
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
                                label= {translations[systemLanguage].account_number}
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
                {translations[systemLanguage].request_new_payment_btn}
            </DialogTitle>
            <Divider />
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Typography variant="subtitle1" gutterBottom>
                        {translations[systemLanguage].current_balance} {currentBalance.toFixed(2)} {translations[systemLanguage].currency}
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        label= {translations[systemLanguage].method}
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
                        label= {translations[systemLanguage].ammount}
                        name="amount"
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"> {translations[systemLanguage].currency} </InputAdornment>,
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
                        {translations[systemLanguage].cancel_btn}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={submitting}
                        startIcon={submitting && <CircularProgress size={20} />}
                    >
                        {submitting ? 'Processing...' : translations[systemLanguage].reauest_withdraw_btn}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PaymentRequestDialog;
