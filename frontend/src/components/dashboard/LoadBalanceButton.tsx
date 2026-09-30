import Button from '../common/Button';

interface LoadBalanceButtonProps {
    onClick: () => void;
    isLoading?: boolean;
}

const LoadBalanceButton = ({ onClick, isLoading = false }: LoadBalanceButtonProps) => {
    return (
        <Button onClick={onClick} isLoading={isLoading} variant="success" className="w-full">
            Load Balance
        </Button>
    );
};

export default LoadBalanceButton;
