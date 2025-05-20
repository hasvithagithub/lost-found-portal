import React, { useState } from 'react';
import { useItems } from '../context/ItemsContext';
import ItemsList from '../components/ItemsList';
import { Search, Loader } from 'lucide-react';

const ItemsPage: React.FC = () => {
  const { items, isLoading } = useItems();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
        <p className="text-gray-600 mt-1">
          View all lost and found items on campus
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-12 w-12 animate-spin text-primary-500" />
        </div>
      ) : (
        <ItemsList items={items} title="" />
      )}
    </div>
  );
};

export default ItemsPage;