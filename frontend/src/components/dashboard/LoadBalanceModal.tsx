import { useState, FormEvent } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useSnailPay } from '../../hooks/useSnailPay';
import { ChargeRequest } from '@oswaldo/dtos';

interface LoadBalanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const LoadBalanceModal = ({ isOpen, onClose, onSuccess }: LoadBalanceModalProps) => {
    const { charge, isLoading, error } = useSnailPay();
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        fullName: '',
        amount: '',
    });
    const [errorIntended, setErrorIntended] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        cardNumber?: string;
        expiryDate?: string;
        cvv?: string;
        fullName?: string;
        amount?: string;
    }>({});

    const validate = (): boolean => {
        const errors: typeof validationErrors = {};

        if (!formData.cardNumber.trim()) {
            errors.cardNumber = 'Card number is required';
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
            errors.cardNumber = 'Card number must be 16 digits';
        }

        if (!formData.expiryDate.trim()) {
            errors.expiryDate = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            errors.expiryDate = 'Expiry date must be in MM/YY format';
        }

        if (!formData.cvv.trim()) {
            errors.cvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
            errors.cvv = 'CVV must be 3 or 4 digits';
        }

        if (!formData.fullName.trim()) {
            errors.fullName = 'Cardholder name is required';
        }

        if (!formData.amount.trim()) {
            errors.amount = 'Amount is required';
        } else if (parseFloat(formData.amount) <= 0) {
            errors.amount = 'Amount must be greater than 0';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            const chargeRequest: ChargeRequest = {
                cardNumber: formData.cardNumber,
                expiryDate: formData.expiryDate,
                cvv: formData.cvv,
                fullName: formData.fullName,
                amount: parseFloat(formData.amount),
                errorIntended,
            };

            const response = await charge(chargeRequest);

            if (response.status === 'approved') {
                onSuccess();
                onClose();
                setFormData({
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                    fullName: '',
                    amount: '',
                });
                setErrorIntended(false);
            }
        } catch (err) {
            console.error('Charge error:', err);
        }
    };

    const handleChange =
        (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [field]: e.target.value });
            if (validationErrors[field]) {
                setValidationErrors({ ...validationErrors, [field]: undefined });
            }
        };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Recargar Saldo">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <Input
                    label="Número de tarjeta"
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleChange('cardNumber')}
                    error={validationErrors.cardNumber}
                    placeholder="1234 1234 1234 1234"
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Fecha de expiración"
                        type="text"
                        value={formData.expiryDate}
                        onChange={handleChange('expiryDate')}
                        error={validationErrors.expiryDate}
                        placeholder="MM/YY"
                        required
                    />
                    <Input
                        label="CVV"
                        type="text"
                        value={formData.cvv}
                        onChange={handleChange('cvv')}
                        error={validationErrors.cvv}
                        placeholder="123"
                        required
                    />
                </div>

                <Input
                    label="Nombre del titular"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange('fullName')}
                    error={validationErrors.fullName}
                    placeholder="John Doe"
                    required
                />

                <Input
                    label="Monto a recargar"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange('amount')}
                    error={validationErrors.amount}
                    placeholder="100.00"
                    min="0"
                    step="0.01"
                    required
                />

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="errorIntended"
                        checked={errorIntended}
                        onChange={(e) => setErrorIntended(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="errorIntended" className="text-sm text-gray-700">
                        Simular error (para pruebas)
                    </label>
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full">
                    Recargar
                </Button>
            </form>
        </Modal>
    );
};

export default LoadBalanceModal;
