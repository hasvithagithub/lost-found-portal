import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, ItemType, ItemStatus } from '../types';
import { mockItems } from '../data/mockData';
import { format, parseISO } from 'date-fns';

interface ItemsContextType {
  items: Item[];
  userItems: Item[];
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<Item>;
  updateItemStatus: (id: string, status: ItemStatus, adminId: string) => Promise<boolean>;
  getItemById: (id: string) => Item | undefined;
  isLoading: boolean;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items from mock data (simulating API call)
  useEffect(() => {
    setTimeout(() => {
      setItems(mockItems);
      setIsLoading(false);
    }, 500);
  }, []);

  // Get current user's items
  const userItems = (userId: string) => {
    return items.filter(item => item.userId === userId);
  };

  // Add a new item report
  const addItem = async (newItem: Omit<Item, 'id' | 'createdAt'>): Promise<Item> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate ID and createdAt
        const createdItem: Item = {
          ...newItem,
          id: (items.length + 1).toString(),
          createdAt: new Date().toISOString(),
        };

        setItems(prevItems => [...prevItems, createdItem]);
        resolve(createdItem);
      }, 1000);
    });
  };

  // Update an item's status
  const updateItemStatus = async (id: string, status: ItemStatus, adminId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === id ? { ...item, status, adminId } : item
          )
        );
        resolve(true);
      }, 800);
    });
  };

  // Get item by ID
  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  return (
    <ItemsContext.Provider 
      value={{ 
        items, 
        userItems: [], // This will be populated in the useItems hook
        addItem, 
        updateItemStatus, 
        getItemById, 
        isLoading 
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook to use the items context
export const useItems = (): ItemsContextType => {
  const context = useContext(ItemsContext);
  const { user } = useAuth();
  
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  
  // Override userItems with the current user's items
  if (user) {
    return {
      ...context,
      userItems: context.items.filter(item => item.userId === user.id)
    };
  }
  
  return context;
};

// Import circular dependency at the end to avoid issues
import { useAuth } from './AuthContext';