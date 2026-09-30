import Button from '../common/Button';

interface LogoutButtonProps {
    onLogout: () => void;
    isLoading?: boolean;
}

const LogoutButton = ({ onLogout, isLoading = false }: LogoutButtonProps) => {
    return (
        <Button variant="danger" onClick={onLogout} isLoading={isLoading}>
            Logout
        </Button>
    );
};

export default LogoutButton;
