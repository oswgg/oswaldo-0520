import { useState } from 'react';
import { useApi } from './useApi';
import { sessionStorage } from '../data/localStorage';
import { ChargeRequest, ChargeResponse } from '@oswaldo/dtos';

export const useSnailPay = () => {
    const api = useApi();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const charge = async (cardData: ChargeRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post<ChargeResponse>('/snailpay/charge', cardData);

            if (response.status === 'approved') {
                // Actualizar balance en LocalStorage
                const currentBalance = sessionStorage.getBalance();
                const newBalance = currentBalance + response.transaction_amount;
                sessionStorage.setBalance(newBalance);

                // Agregar transacción al historial
                sessionStorage.addTransaction({
                    id: response.id,
                    amount: response.transaction_amount,
                    status: response.status,
                    statusDetail: response.status_detail,
                    dateCreated: response.date_created,
                    cardNumber: response.cardNumber,
                });

                return response;
            } else {
                setError(response.status_detail || 'Payment failed');
                return response;
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Payment failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        charge,
        isLoading,
        error,
    };
};
