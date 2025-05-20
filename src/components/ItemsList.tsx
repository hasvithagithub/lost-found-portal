import React, { useState, useEffect } from 'react';
import { Item, ItemType } from '../types';
import ItemCard from './ItemCard';
import { Search, Trash2, Filter } from 'lucide-react';

interface ItemsListProps {
  items: Item[];
  title?: string;
  canFilter?: boolean;
}

const ItemsList: React.FC<ItemsListProps> = ({ items, title = "Items", canFilter = true }) => {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    let result = items;
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(item => 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(item => item.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    setFilteredItems(result);
  }, [items, searchTerm, typeFilter, statusFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      
      {canFilter && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ItemType | 'all')}
                className="input-field max-w-[150px]"
              >
                <option value="all">All Types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field max-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="resolved">Resolved</option>
              </select>
              
              <button 
                onClick={clearFilters}
                className="btn btn-secondary flex items-center"
                title="Clear filters"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-gray-400 mb-2">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-1">No items found</h3>
          <p className="text-gray-500">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
              ? 'Try adjusting your filters to see more results' 
              : 'There are no items to display at this time'}
          </p>
          {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="btn btn-secondary mt-4"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsList;