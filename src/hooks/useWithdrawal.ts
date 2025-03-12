import axios from 'axios';
import { useState } from 'react';
import { PaymentRequestBody, BalanceResponse, WithdrawalRequest } from '@/types/withdrawal';

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

export const useWithdrawals = () => {
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

export const requestNewPayment = async (paymentData: PaymentRequestBody) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payment/request_new_payment`, paymentData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'An error occurred');
    }
};