import React from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    return await register(data.name, data.email, data.password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 page-transition">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm type="register" onSubmit={handleRegister} />
      </div>
    </div>
  );
};

export default RegisterPage;