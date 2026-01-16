// import { create } from 'zustand';


// interface Order {
//   id: string;
//   items: any[];
//   subtotal?: number;
//   discount?: number;
//   gst?: number;
//   total: number;
//   address: any;
//   paymentMethod: string;
//   status: 'pending_approval' | 'confirmed' | 'rejected';
//   needsPrescription: boolean;
//   prescriptionUploaded: boolean;
//   createdAt: string;
// }


// interface OrderStore {
//   orders: Order[];
//   addOrder: (order: Order) => void;
//   approveOrder: (orderId: string) => void;
//   rejectOrder: (orderId: string) => void;
// }

// export const useOrders = create<OrderStore>((set) => ({
//   orders: [],
  
//   addOrder: (order) => {
//     set(state => ({
//       orders: [...state.orders, order]
//     }));
//   },
  
//   approveOrder: (orderId) => {
//     set(state => ({
//       orders: state.orders.map(order =>
//         order.id === orderId 
//           ? { ...order, status: 'confirmed' }
//           : order
//       )
//     }));
//   },
  
//   rejectOrder: (orderId) => {
//     set(state => ({
//       orders: state.orders.map(order =>
//         order.id === orderId 
//           ? { ...order, status: 'rejected' }
//           : order
//       )
//     }));
//   },
// }));

import { create } from 'zustand';
import { Order } from '../types/order';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  approveOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
}

export const useOrders = create<OrderStore>((set) => ({
  orders: [],
  
  addOrder: (order) => {
    set(state => ({
      orders: [...state.orders, order]
    }));
  },
  
  approveOrder: (orderId) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId 
          ? { ...order, status: 'confirmed' }
          : order
      )
    }));
  },
  
  rejectOrder: (orderId) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId 
          ? { ...order, status: 'rejected' }
          : order
      )
    }));
  },
}));