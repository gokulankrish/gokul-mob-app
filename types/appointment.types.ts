// types/appointment.types.ts
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  specialty: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format (24-hour)
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  symptoms?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: 'doctor';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience: string;
  schedule: DoctorSchedule;
}

export interface DoctorSchedule {
  [key: string]: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
}

export interface TimeSlot {
  time: string; // HH:MM format
  display: string; // Formatted time (e.g., "9:00 AM")
  isAvailable: boolean;
}

export interface MarkedDate {
  marked?: boolean;
  selected?: boolean;
  selectedColor?: string;
  dotColor?: string;
}

export interface MarkedDates {
  [key: string]: MarkedDate;
}

export interface DateValidation {
  valid: boolean;
  reason?: string;
}

export interface AppointmentServiceResponse {
  success: boolean;
  appointmentId?: string;
  error?: string;
}