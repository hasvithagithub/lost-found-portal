import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogIn, UserPlus, Loader } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => Promise<boolean>;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (type === 'register') {
      if (!name.trim()) {
        setError('Name is required');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    try {
      setIsLoading(true);
      const success = await onSubmit({ name, email, password });
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError(type === 'login' 
          ? 'Invalid email or password' 
          : 'Registration failed. Email may already be in use.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-6">
          {type === 'login' ? (
            <LogIn className="h-12 w-12 text-primary-600 mx-auto" />
          ) : (
            <UserPlus className="h-12 w-12 text-primary-600 mx-auto" />
          )}
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {type === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {type === 'login' 
              ? 'Enter your credentials to access your account'
              : 'Fill out the form below to create your account'}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {type === 'register' && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          
          {type === 'register' && (
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-2.5 relative"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin mr-2 inline" />
                <span>{type === 'login' ? 'Signing in...' : 'Creating account...'}</span>
              </>
            ) : (
              <span>{type === 'login' ? 'Sign in' : 'Create account'}</span>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          {type === 'login' ? (
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a
                href="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}
              >
                Register here
              </a>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                Sign in
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;