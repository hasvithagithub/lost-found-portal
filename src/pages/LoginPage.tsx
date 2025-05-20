import React from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = async (data: { email: string; password: string }) => {
    return await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 page-transition">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm type="login" onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;