import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;


type UpdateWithdrawalRequestBody = {
  withdrawal_id: number;
  admin_id: number;
  proof_of_payment: string;
};

export const useUpdateWithdrawal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateWithdrawal = async (data: UpdateWithdrawalRequestBody) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/payment/update_withdrawal/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateWithdrawal, isLoading, error };
};
