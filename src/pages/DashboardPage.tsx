import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import ItemsList from '../components/ItemsList';
import { Package, FileSearch, Search, Plus, Loader } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { userItems, isLoading } = useItems();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const lostItems = userItems.filter(item => item.type === 'lost');
  const foundItems = userItems.filter(item => item.type === 'found');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="rounded-md bg-primary-100 p-3">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Reports</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {isLoading ? <Loader className="h-8 w-8 animate-spin" /> : userItems.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="rounded-md bg-accent-100 p-3">
                <FileSearch className="h-6 w-6 text-accent-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Lost Items</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {isLoading ? <Loader className="h-8 w-8 animate-spin" /> : lostItems.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="rounded-md bg-success-100 p-3">
                <Search className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Found Items</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {isLoading ? <Loader className="h-8 w-8 animate-spin" /> : foundItems.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
          <Link to="/report" className="btn btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Report New Item
          </Link>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Lost Items</h2>
          <Link to="/report?type=lost" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
            Report Lost Item
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : lostItems.length > 0 ? (
          <ItemsList items={lostItems} title="" canFilter={false} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500 mb-4">You haven't reported any lost items yet.</p>
            <Link to="/report?type=lost" className="btn btn-primary inline-flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Report Lost Item
            </Link>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Found Items</h2>
          <Link to="/report?type=found" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
            Report Found Item
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : foundItems.length > 0 ? (
          <ItemsList items={foundItems} title="" canFilter={false} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500 mb-4">You haven't reported any found items yet.</p>
            <Link to="/report?type=found" className="btn btn-primary inline-flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Report Found Item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;