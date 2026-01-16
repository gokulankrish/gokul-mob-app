import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase'; // ✅ adjust if your db export path differs

// ✅ EXPORT Appointment TYPE
export type Appointment = {
  id?: string;
  doctorId: string;
  patientId: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt?: any;
};

const COLLECTION_NAME = 'appointments';

// ✅ CREATE APPOINTMENT
export const createAppointment = async (
  doctorId: string,
  patientId: string,
  date: string,
  timeSlot: string
) => {
  await addDoc(collection(db, COLLECTION_NAME), {
    doctorId,
    patientId,
    date,
    timeSlot,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

// ✅ GET APPOINTMENTS BY USER ROLE
export const getAppointmentsByUser = async (
  userId: string,
  role: 'doctor' | 'patient'
): Promise<Appointment[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where(role === 'doctor' ? 'doctorId' : 'patientId', '==', userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Appointment, 'id'>),
  }));
};
