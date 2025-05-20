import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import { ArrowLeft, Loader, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getItemById, updateItemStatus, isLoading } = useItems();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(id ? getItemById(id) : undefined);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      const foundItem = getItemById(id);
      setItem(foundItem);
      
      if (!foundItem && !isLoading) {
        // Item not found, redirect to items page
        navigate('/items');
      }
    }
  }, [id, getItemById, navigate, isLoading]);

  const handleStatusUpdate = async (status: 'verified' | 'resolved') => {
    if (!id || !user || user.role !== 'admin' || !item) return;
    
    setUpdating(true);
    try {
      const success = await updateItemStatus(id, status, user.id);
      if (success) {
        // Update local item
        setItem({...item, status, adminId: user.id});
        setSuccessMessage(`Item status updated to ${status}`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center h-64">
        <Loader className="h-12 w-12 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <AlertTriangle className="h-16 w-16 text-warning-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/items" className="btn btn-primary">
            Browse All Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-primary-600 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-success-100 border border-success-200 text-success-800 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.itemName} 
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-6">
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900">{item.itemName}</h1>
                <span className={`status-badge ${
                  item.status === 'pending' ? 'status-pending' : 
                  item.status === 'verified' ? 'status-verified' : 
                  'status-resolved'
                } flex items-center capitalize`}>
                  {item.status === 'pending' ? <Clock className="h-3 w-3 mr-1" /> : 
                  item.status === 'verified' ? <AlertTriangle className="h-3 w-3 mr-1" /> : 
                  <CheckCircle className="h-3 w-3 mr-1" />}
                  {item.status}
                </span>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-semibold uppercase mr-2">
                  {item.type}
                </span>
                <span>Reported on {format(parseISO(item.createdAt), 'MMMM dd, yyyy')}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Date</h3>
                <p className="text-gray-900">{format(parseISO(item.date), 'MMMM dd, yyyy')}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Location</h3>
                <p className="text-gray-900">{item.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Contact</h3>
                <p className="text-gray-900">{item.contactInfo}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Reported By</h3>
                <p className="text-gray-900">{item.userName}</p>
              </div>
            </div>

            {user && user.role === 'admin' && item.status !== 'resolved' && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">Admin Actions</h3>
                <div className="flex space-x-4">
                  {item.status === 'pending' && (
                    <button 
                      onClick={() => handleStatusUpdate('verified')}
                      disabled={updating}
                      className="btn btn-primary flex-1"
                    >
                      {updating ? <Loader className="h-4 w-4 animate-spin mr-1" /> : null}
                      Verify Item
                    </button>
                  )}
                  <button 
                    onClick={() => handleStatusUpdate('resolved')}
                    disabled={updating}
                    className="btn btn-success flex-1"
                  >
                    {updating ? <Loader className="h-4 w-4 animate-spin mr-1" /> : null}
                    Mark as Resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Items (in a real app, you would show actually similar items) */}
      {/* <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ItemDetailPage;