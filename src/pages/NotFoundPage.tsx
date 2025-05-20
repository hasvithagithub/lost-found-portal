import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 page-transition">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-error-100 p-4">
          <AlertTriangle className="h-10 w-10 text-error-600" />
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900">404 - Page Not Found</h1>
        <p className="mt-3 text-lg text-gray-500">
          Oops! The page you are looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn btn-primary inline-flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;