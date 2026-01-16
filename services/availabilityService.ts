import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export const setDoctorAvailability = async (
  doctorId: string,
  date: string,
  slots: string[]
) => {
  await setDoc(
    doc(db, 'doctorAvailability', doctorId, 'dates', date),
    { slots }
  );
};

export const getDoctorAvailability = async (
  doctorId: string,
  date: string
): Promise<string[]> => {
  const snap = await getDoc(
    doc(db, 'doctorAvailability', doctorId, 'dates', date)
  );

  return snap.exists() ? snap.data().slots : [];
};
