// types/chat.types.ts
export type UserRole = 'doctor' | 'patient';

// export interface User {
//   uid: string;
//   email: string;
//   displayName: string;
//   role: UserRole;
//   photoURL?: string;
//   specialization?: string; // For doctors
//   phoneNumber?: string;
//   createdAt?: Date;
//   unreadCount?: number;
// }

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  specialization?: string;
  phoneNumber?: string;
  createdAt?: Date;
  isOnline?: boolean;
  lastSeen?: Date | null;
  fcmToken?: string;
}

export interface Chat {
  id: string;
  participants: string[]; // [userId1, userId2]
  participantNames: { [uid: string]: string };
  participantRoles: { [uid: string]: UserRole };
  lastMessage: string;
  lastMessageAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  unreadCount: { [uid: string]: number };
  metadata?: {
    doctorId: string;
    patientId: string;
    appointmentId?: string;
  };
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  timestamp: Date | null;
  read: boolean;
  readBy?: string[];
  type: 'text' | 'image' | 'prescription' | 'bmi_report' | 'system';
  metadata?: {
    prescriptionData?: PrescriptionData;
    bmiData?: BMIData;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  };
}

export interface ChatListData {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerRole: UserRole;
  lastMessage: string;
  lastMessageAt: Date | null;
  unreadCount: number;
  hasPrescription?: boolean;
  hasBMIShared?: boolean;
  partnerPhotoURL?: string;
}

export interface PrescriptionData {
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  instructions: string;
  followUpDate?: string;
  prescribedBy: string;
  prescribedAt: Date;
}

export interface BMIData {
  bmi: number;
  weight: number;
  height: number;
  category: string;
  date: string;
  notes?: string;
}