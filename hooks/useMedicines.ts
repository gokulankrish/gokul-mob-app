
import { create } from 'zustand';

export interface Medicine {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  discount?: number; 
   stock: number; // Add this optional property
  requiresPrescription?: boolean; // Also check if this exists
}

interface MedicineStore {
  medicines: Medicine[];
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
}

const initialMedicines = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'tablets',
    description: 'Pain relief and fever reducer',
    price: 25,
    discount: 10,
    requiresPrescription: false,
    stock: 150,
    image: 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg',
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    category: 'capsules',
    description: 'Antibiotic for bacterial infections',
    price: 45,
    requiresPrescription: true,
    stock: 75,
    image: 'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg',
  },
  {
    id: '3',
    name: 'Cough Syrup',
    category: 'syrup',
    description: 'Relief from cough and cold symptoms',
    price: 35,
    discount: 15,
    requiresPrescription: false,
    stock: 200,
    image: 'https://images.pexels.com/photos/3683084/pexels-photo-3683084.jpeg',
  },
  {
    id: '4',
    name: 'Insulin Injection',
    category: 'injection',
    description: 'For diabetes management',
    price: 120,
    requiresPrescription: true,
    stock: 25,
    image: 'https://images.pexels.com/photos/4047146/pexels-photo-4047146.jpeg',
  },
  {
    id: '5',
    name: 'Ibuprofen 400mg',
    category: 'tablets',
    description: 'Anti-inflammatory pain relief',
    price: 30,
    discount: 20,
    requiresPrescription: false,
    stock: 180,
    image: 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg',
  },
];

export const useMedicines = create<MedicineStore>((set) => ({
  medicines: initialMedicines,
  
  addMedicine: (medicine) => {
    set(state => ({
      medicines: [...state.medicines, medicine]
    }));
  },
  
  updateMedicine: (id, updates) => {
    set(state => ({
      medicines: state.medicines.map(medicine =>
        medicine.id === id 
          ? { ...medicine, ...updates }
          : medicine
      )
    }));
  },
  
  deleteMedicine: (id) => {
    set(state => ({
      medicines: state.medicines.filter(medicine => medicine.id !== id)
    }));
  },
}));