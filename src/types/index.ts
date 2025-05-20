export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
};

export type ItemStatus = 'pending' | 'verified' | 'resolved';

export type ItemType = 'lost' | 'found';

export type Item = {
  id: string;
  userId: string;
  userName: string;
  itemName: string;
  type: ItemType;
  description: string;
  date: string;
  location: string;
  imageUrl: string | null;
  contactInfo: string;
  status: ItemStatus;
  createdAt: string;
  adminId?: string;
};