import axios from 'axios';
import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getWithdrawalsByFreelancer = async (freelancerId: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/payment/get_withdrawals_by_freelancer/${freelancerId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching withdrawals:', error);
        throw error;
    }
};

export interface BalanceResponse {
    current_balance: number;
}

export const freelancerService = {
    getCurrentBalance: async (freelancerId: number): Promise<BalanceResponse> => {
        try {
            const response = await axios.get<BalanceResponse>(
                `${API_BASE_URL}/payment/get_current_balance/${freelancerId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw error;
        }
    }
};

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
  
  export const useWithdrawals = () => {
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    // Function to fetch withdrawals
    const fetchWithdrawals = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(`${API_BASE_URL}/payment/get_all_withdrawals/`);
        setWithdrawalRequests(response.data);
      } catch (err) {
        setError('Error fetching withdrawal requests.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    return { withdrawalRequests, fetchWithdrawals, loading, error };
  };

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

export const requestNewPayment = async (paymentData: PaymentRequestBody) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payment/request_new_payment`, paymentData);
        return response.data;
    } catch (error: any) {
        // If the backend returns a specific error, we can extract it here.
        throw new Error(error.response?.data?.detail || 'An error occurred');
    }
};