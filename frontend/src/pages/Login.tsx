import { useState } from 'react';
import Card from '../components/common/Card';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, isLoading, error } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? 'Login' : 'Register'}
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {isLogin ? (
                    <LoginForm onSubmit={login} isLoading={isLoading} />
                ) : (
                    <RegisterForm onSubmit={register} isLoading={isLoading} />
                )}

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                        {isLogin
                            ? "Don't have an account? Register"
                            : 'Already have an account? Login'}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Login;
