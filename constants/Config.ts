// constants/Config.ts
const firebaseConfig = {
  apiKey: "AIzaSyBaja9Oaus9kobKh5gCcs_4Zw0n2o01CZ4",
  authDomain: "dental-chat-app-2a7fd.firebaseapp.com",
  projectId: "dental-chat-app-2a7fd",
  storageBucket: "dental-chat-app-2a7fd.firebasestorage.app",
  messagingSenderId: "112519937828",
  appId: "1:112519937828:web:7029c0789e0d77dcb5bdb1",
  measurementId: "G-4SDGG5D3YM"
};

export const FIREBASE_CONFIG = {
  // PASTE YOUR FIREBASE CONFIG HERE
  apiKey: "AIzaSyBaja9Oaus9kobKh5gCcs_4Zw0n2o01CZ4",
  authDomain: "dental-chat-app-2a7fd.firebaseapp.com",
  projectId: "dental-chat-app-2a7fd",
  storageBucket: "dental-chat-app-2a7fd.firebasestorage.app",
  messagingSenderId: "112519937828",
  appId: "1:112519937828:web:7029c0789e0d77dcb5bdb1",
  measurementId: "G-4SDGG5D3YM"
};

export const COLLECTIONS = {
  USERS: 'users',
  CHATS: 'chats',
  MESSAGES: 'messages'
} as const;

export const USER_ROLES = {
  PRESCRIPTIONS: 'prescriptions',
  DOCTOR: 'doctor',
  PATIENT: 'patient'
} as const;

// Only 2 specific doctors
export const DOCTOR_IDS = {
  DOCTOR_1: 'doctor-001',
  DOCTOR_2: 'doctor-002'
} as const;



// export const DEMO_ACCOUNTS = {
//   DOCTORS: [
//     {
//       uid: DOCTOR_IDS.DOCTOR_1,
//       email: 'dr.sarah@dentalclinic.com',
//       password: 'Doctor@123',
//       name: 'Dr. Sarah Johnson',
//       phone: '+1 (555) 123-4567',
//       specialty: 'General Dentistry',
//       avatarColor: '#3498db'
//     },
//     {
//       uid: DOCTOR_IDS.DOCTOR_2,
//       email: 'dr.michael@dentalclinic.com',
//       password: 'Doctor@123',
//       name: 'Dr. Michael Chen',
//       phone: '+1 (555) 234-5678',
//       specialty: 'Orthodontics',
//       avatarColor: '#2ecc71'
//     }
//   ],
//   PATIENTS: [
//     {
//       email: 'john.smith@example.com',
//       password: 'Patient@123',
//       name: 'John Smith',
//       phone: '+1 (555) 987-6543',
//       dob: '1990-01-01',
//       avatarColor: '#e74c3c'
//     },
//     {
//       email: 'emma.wilson@example.com',
//       password: 'Patient@123',
//       name: 'Emma Wilson',
//       phone: '+1 (555) 876-5432',
//       dob: '1985-05-15',
//       avatarColor: '#f39c12'
//     },
//     {
//       email: 'robert.brown@example.com',
//       password: 'Patient@123',
//       name: 'Robert Brown',
//       phone: '+1 (555) 765-4321',
//       dob: '1978-11-30',
//       avatarColor: '#1abc9c'
//     },
//     {
//       email: 'sophia.davis@example.com',
//       password: 'Patient@123',
//       name: 'Sophia Davis',
//       phone: '+1 (555) 654-3210',
//       dob: '1992-03-20',
//       avatarColor: '#34495e'
//     }
//   ]
// } as const;
