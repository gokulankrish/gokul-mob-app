import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  requiresPrescription: boolean;
  image: string;
  discount?: number;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (medicine: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  cartItems: [],
  cartCount: 0,
  
  addToCart: (medicine) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(item => item.id === medicine.id);
    
    if (existingItem) {
      set({
        cartItems: cartItems.map(item =>
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        cartCount: get().cartCount + 1,
      });
    } else {
      set({
        cartItems: [...cartItems, { ...medicine, quantity: 1 }],
        cartCount: get().cartCount + 1,
      });
    }
  },
  
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(id);
      return;
    }
    
    const { cartItems } = get();
    const oldQuantity = cartItems.find(item => item.id === id)?.quantity || 0;
    const quantityDiff = quantity - oldQuantity;
    
    set({
      cartItems: cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ),
      cartCount: get().cartCount + quantityDiff,
    });
  },
  
  removeFromCart: (id) => {
    const { cartItems } = get();
    const item = cartItems.find(item => item.id === id);
    
    if (item) {
      set({
        cartItems: cartItems.filter(item => item.id !== id),
        cartCount: get().cartCount - item.quantity,
      });
    }
  },
  
  clearCart: () => {
    set({ cartItems: [], cartCount: 0 });
  },
  
  getTotalPrice: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
}));