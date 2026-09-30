import { useState, FormEvent } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

interface LoginFormProps {
    onSubmit: (data: { email: string; password: string }) => void;
    isLoading?: boolean;
}

const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({ email, password });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="your@email.com"
                required
            />
            <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••"
                required
            />
            <Button type="submit" isLoading={isLoading} className="w-full">
                Login
            </Button>
        </form>
    );
};

export default LoginForm;
