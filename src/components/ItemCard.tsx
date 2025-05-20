import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types';
import { format, parseISO } from 'date-fns';
import { MapPin, Calendar, Info, CheckCircle, User, Clock } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  isDetailed?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'status-pending';
    case 'verified':
      return 'status-verified';
    case 'resolved':
      return 'status-resolved';
    default:
      return 'status-pending';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'verified':
      return <Info className="h-4 w-4" />;
    case 'resolved':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const ItemCard: React.FC<ItemCardProps> = ({ item, isDetailed = false }) => {
  return (
    <div className={`card item-transition ${isDetailed ? '' : 'hover:scale-[1.01] transition-transform'}`}>
      <div className="relative">
        <div className={`absolute top-2 left-2 status-badge ${getStatusColor(item.status)} flex items-center`}>
          {getStatusIcon(item.status)}
          <span className="ml-1 capitalize">{item.status}</span>
        </div>
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/80 rounded-full text-xs font-medium uppercase">
          {item.type}
        </div>
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.itemName} 
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.itemName}</h3>
        
        <div className="flex items-start text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
          <span>{item.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
          <span>{format(parseISO(item.date), 'MMM dd, yyyy')}</span>
        </div>
        
        {isDetailed && (
          <>
            <div className="flex items-start text-sm text-gray-600 mb-2">
              <User className="h-4 w-4 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
              <span>{item.userName}</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{item.description}</p>
            
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Contact: </span>
              {item.contactInfo}
            </div>
          </>
        )}
        
        {!isDetailed && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>
        )}
        
        {!isDetailed && (
          <Link to={`/items/${item.id}`} className="btn btn-secondary text-sm w-full block text-center">
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default ItemCard;