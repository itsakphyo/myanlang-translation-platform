export interface PaymentFormValues {
    freelancer_id: number;
    payment_method: '' | 'paypal' | 'payoneer' | 'wavepay' | 'kpay' | 'bank';
    amount: number;
    paypal_link?: string;
    payoneer_email?: string;
    wavepay_phone?: string;
    kpay_phone?: string;
    account_holder_name?: string;
    bank_name?: string;
    account_number?: string;
}