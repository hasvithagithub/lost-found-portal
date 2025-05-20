import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import { ItemType } from '../types';
import { MapPin, Calendar, CheckCircle, Loader, Upload, AlertCircle } from 'lucide-react';

const ReportItemPage: React.FC = () => {
  const { user } = useAuth();
  const { addItem } = useItems();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = (queryParams.get('type') as ItemType) || 'lost';

  const [itemType, setItemType] = useState<ItemType>(initialType);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [itemDate, setItemDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemLocation, setItemLocation] = useState('');
  const [contactInfo, setContactInfo] = useState(user?.email || '');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!itemName.trim()) {
      setError('Item name is required');
      return;
    }
    
    if (!itemLocation.trim()) {
      setError('Location is required');
      return;
    }
    
    if (!contactInfo.trim()) {
      setError('Contact information is required');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to report an item');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would upload the image to a server here
      // For now, we'll just use the preview URL if available
      
      const newItem = {
        userId: user.id,
        userName: user.name,
        itemName,
        type: itemType,
        description,
        date: new Date(itemDate).toISOString(),
        location: itemLocation,
        imageUrl, // In a real app, this would be the URL returned from the server
        contactInfo,
        status: 'pending' as const,
      };
      
      const addedItem = await addItem(newItem);
      setSuccess(true);
      
      // Reset form
      setItemName('');
      setDescription('');
      setItemDate(new Date().toISOString().split('T')[0]);
      setItemLocation('');
      setImageUrl(null);
      setImageFile(null);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/items/${addedItem.id}`);
      }, 2000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location } });
    }
  }, [user, navigate, location]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Report an Item</h1>
        <p className="text-gray-600 mt-1">
          Fill out the form below to report a lost or found item
        </p>
      </div>

      {success ? (
        <div className="bg-success-50 border border-success-200 text-success-700 p-6 rounded-lg mb-8 flex items-start">
          <CheckCircle className="h-6 w-6 text-success-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Item Reported Successfully!</h3>
            <p className="mb-2">Your item has been reported and is now pending admin verification.</p>
            <p>You'll be redirected to view your report in a moment...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 p-4 rounded-lg mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-error-500 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Item Type</label>
            <div className="flex">
              <button
                type="button"
                onClick={() => setItemType('lost')}
                className={`flex-1 py-3 px-4 rounded-l-md border ${
                  itemType === 'lost'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                Lost Item
              </button>
              <button
                type="button"
                onClick={() => setItemType('found')}
                className={`flex-1 py-3 px-4 rounded-r-md border-t border-b border-r ${
                  itemType === 'found'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                Found Item
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="itemName" className="block text-gray-700 font-medium mb-2">
              Item Name *
            </label>
            <input
              type="text"
              id="itemName"
              className="input-field"
              placeholder="e.g. Blue Backpack, iPhone 14 Pro"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="input-field"
              placeholder="Provide details about the item (color, brand, distinguishing features, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="itemDate" className="block text-gray-700 font-medium mb-2">
                Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="itemDate"
                  className="input-field pl-10"
                  value={itemDate}
                  onChange={(e) => setItemDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="itemLocation" className="block text-gray-700 font-medium mb-2">
                Location *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="itemLocation"
                  className="input-field pl-10"
                  placeholder="e.g. Library 2nd Floor, Student Union"
                  value={itemLocation}
                  onChange={(e) => setItemLocation(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
              Image (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imageUrl ? (
                  <div className="mb-4">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="max-h-48 mx-auto rounded-md"
                    />
                  </div>
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="imageUpload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
                  >
                    <span>{imageUrl ? 'Replace image' : 'Upload an image'}</span>
                    <input 
                      id="imageUpload" 
                      type="file" 
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="contactInfo" className="block text-gray-700 font-medium mb-2">
              Contact Information *
            </label>
            <input
              type="text"
              id="contactInfo"
              className="input-field"
              placeholder="Your email, phone number, or other contact information"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              This will be shown to users who may have found/lost this item
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary py-2.5 px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportItemPage;