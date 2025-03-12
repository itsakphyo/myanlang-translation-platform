export interface Withdrawal {
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

export interface WithdrawalRequest {
  freelancer_id: number;
  withdrawal_id: number;
  amount: number;
  requested_at: string;
  processed_at: string | null;
  payoneer_email: string | null;
  kpay_phone: string | null;
  bank_name: string | null;
  admin_id: number | null;
  payment_method: string;
  withdrawal_status: string;
  paypal_link: string | null;
  wavepay_phone: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  proof_of_payment: string | null
}

export interface BalanceResponse {
  current_balance: number;
}

export interface PaymentRequestBody {
  freelancer_id: number;
  payment_method: string;
  amount: number;
  paypal_link?: string;
  payoneer_email?: string;
  wavepay_phone?: string;
  account_holder_name?: string;
  kpay_phone?: string;
  bank_name?: string;
  account_number?: string;
}