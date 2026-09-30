import Card from '../common/Card';
import Button from '../common/Button';

interface BalanceCardProps {
    balance: number;
    onLoadBalance: () => void;
    isLoading?: boolean;
    racesRemaining?: number;
    onResetDailyCount?: () => void;
}

const BalanceCard = ({
    balance,
    onLoadBalance,
    isLoading = false,
    racesRemaining,
    onResetDailyCount,
}: BalanceCardProps) => {
    return (
        <Card>
            <h2 className="text-lg font-semibold mb-4">Balance</h2>
            <p className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</p>
            {racesRemaining !== undefined && (
                <p className="text-sm text-gray-600 mt-2">
                    Carreras restantes hoy: <span className="font-semibold">{racesRemaining}</span>
                </p>
            )}
            <Button
                onClick={onLoadBalance}
                isLoading={isLoading}
                className="mt-4 w-full"
                variant="success"
            >
                Load Balance
            </Button>
            {onResetDailyCount && (
                <button
                    onClick={onResetDailyCount}
                    className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700 underline"
                >
                    Reiniciar contador (pruebas)
                </button>
            )}
        </Card>
    );
};

export default BalanceCard;
