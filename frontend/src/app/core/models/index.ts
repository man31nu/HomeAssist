export interface User {
  id?: number;
  name: string;
  email: string;
  role: 'Customer' | 'Provider' | 'Admin';
  phone?: string;
  address?: string;
}

export interface Service {
  id?: number;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  iconUrl?: string;
}

export interface Provider {
  id?: number;
  experienceYears: number;
  bio?: string;
  isVerified: boolean;
  rating: number;
  userId: number;
  serviceId?: number;
  User?: User;
  Service?: Service;
}

export interface Booking {
  id?: number;
  status: 'Pending' | 'Accepted' | 'InProgress' | 'Completed' | 'Cancelled';
  scheduledDate: string | Date;
  totalAmount: number;
  notes?: string;
  address: string;
  customerId: number;
  providerId: number;
  serviceId: number;
  Customer?: User;
  Provider?: Provider;
  Service?: Service;
}

export interface Review {
  id?: number;
  rating: number;
  comment?: string;
  customerId: number;
  providerId: number;
  bookingId: number;
  Customer?: User;
}

export interface Payment {
  id?: number;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  paymentMethod?: string;
  transactionId?: string;
  bookingId: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
}
