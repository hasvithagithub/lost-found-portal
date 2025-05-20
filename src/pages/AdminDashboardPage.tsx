import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import { Item, ItemStatus } from '../types';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Search, 
  ChevronRight,
  Users,
  Package,
  Layers
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { items, updateItemStatus, isLoading } = useItems();
  const navigate = useNavigate();
  
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'lost' | 'found' | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleUpdateStatus = async (itemId: string, newStatus: ItemStatus) => {
    if (!user) return;
    
    setUpdating(itemId);
    try {
      await updateItemStatus(itemId, newStatus, user.id);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  // Apply filters
  const filteredItems = items.filter(item => {
    // Apply status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    
    // Apply type filter
    if (typeFilter !== 'all' && item.type !== typeFilter) {
      return false;
    }
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower) ||
        item.userName.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Count items by status
  const pendingCount = items.filter(item => item.status === 'pending').length;
  const verifiedCount = items.filter(item => item.status === 'verified').length;
  const resolvedCount = items.filter(item => item.status === 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage and review lost and found items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="rounded-md bg-warning-100 p-3">
                <Clock className="h-6 w-6 text-warning-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Pending</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="rounded-md bg-primary-100 p-3">
                <AlertTriangle className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Verified</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{verifiedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="rounded-md bg-success-100 p-3">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Resolved</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{resolvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Item Reports</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full sm:w-auto"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ItemStatus | 'all')}
                  className="input-field w-full sm:w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="resolved">Resolved</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as 'lost' | 'found' | 'all')}
                  className="input-field w-full sm:w-auto"
                >
                  <option value="all">All Types</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading items...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {item.imageUrl ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={item.imageUrl}
                              alt={item.itemName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.type === 'lost' 
                          ? 'bg-error-100 text-error-800' 
                          : 'bg-success-100 text-success-800'
                      }`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{item.userName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(item.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-badge flex items-center ${
                        item.status === 'pending' ? 'status-pending' : 
                        item.status === 'verified' ? 'status-verified' : 
                        'status-resolved'
                      }`}>
                        {item.status === 'pending' ? <Clock className="h-3 w-3 mr-1" /> : 
                        item.status === 'verified' ? <AlertTriangle className="h-3 w-3 mr-1" /> : 
                        <CheckCircle className="h-3 w-3 mr-1" />}
                        <span className="capitalize">{item.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {item.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'verified')}
                            disabled={updating === item.id}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Verify
                          </button>
                        )}
                        {item.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'resolved')}
                            disabled={updating === item.id}
                            className="text-success-600 hover:text-success-900"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/items/${item.id}`)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;