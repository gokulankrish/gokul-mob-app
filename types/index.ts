export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'doctor' | 'patient';
  phone?: string;
  avatar?: string;
  avatarColor?: string;
  specialty?: string;
  experience?: string;
  dob?: string;
  medicalHistory?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: Date;
  read: boolean;
  readAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
  replyTo?: {
    messageId: string;
    text: string;
    senderName: string;
  };
}

export interface Chat {
  id: string;
  participants: string[];
  doctorId?: string;
  patientId?: string;
  participantInfo?: Record<string, {
    name: string;
    email: string;
    role: string;
    avatar?: string;
    avatarColor?: string;
    specialty?: string;
  }>;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  unreadCount?: Record<string, number>;
  otherParticipant?: User;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'appointment' | 'message' | 'reminder' | 'system';
  data?: any;
}


export type UserRole = 'doctor' | 'patient';

