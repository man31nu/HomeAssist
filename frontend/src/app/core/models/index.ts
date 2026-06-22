export interface User {
  id?: number;
  name: string;
  full_name?: string;
  email: string;
  role: 'Customer' | 'Provider' | 'Admin';
  phone?: string;
  address?: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

export interface Service {
  id?: number;
  name?: string;
  title?: string;
  description: string;
  category?: string;
  basePrice: number;
  base_price?: number;
  estimatedDuration?: number;
  estimated_duration?: number;
  categoryId?: number;
  status?: string;
  iconUrl?: string;
  Category?: ServiceCategory;
}

export interface Provider {
  id?: number;
  experienceYears: number;
  experience_years?: number;
  bio?: string;
  isVerified: boolean;
  verification_status?: string;
  rating: number;
  userId: number;
  serviceId?: number;
  service_category?: string;
  User?: User;
  Service?: Service;
}

export interface Booking {
  id?: number;
  customerId: number;
  providerId?: number;
  serviceId: number;
  service_category?: string;
  scheduledDate: string;
  scheduled_date?: string;
  status: 'Pending' | 'Accepted' | 'InProgress' | 'Completed' | 'Cancelled';
  totalAmount: number;
  total_amount?: number;
  Service?: Service;
  Customer?: User;
  Provider?: Provider;
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

export interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at?: string;
  user_id?: number;
}
