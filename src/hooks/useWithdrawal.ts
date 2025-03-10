import axios from 'axios';

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