export type OrderStatus = 'confirmed' | 'pending_approval' | 'rejected';

export interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  requiresPrescription?: boolean;
  discount?: number;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  address: OrderAddress;
  paymentMethod: string;
  status: 'pending_approval' | 'confirmed' | 'rejected';
  needsPrescription: boolean;
  prescriptionUploaded: boolean;
  createdAt: string;
}

