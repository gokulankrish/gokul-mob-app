import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  specialty: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  cancelAppointmentByPatient: (id: string) => Promise<void>;
  getPatientAppointments: (patientEmail: string) => Appointment[];
  getDoctorAppointments: (doctorId: string) => Appointment[];
  getPendingAppointments: (doctorId: string) => Appointment[];
  isLoading: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load appointments from AsyncStorage on mount
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const storedAppointments = await AsyncStorage.getItem('appointments');
        if (storedAppointments) {
          setAppointments(JSON.parse(storedAppointments));
        } else {
          // Initialize with sample data
          const sampleAppointments: Appointment[] = [
            {
              id: '1',
              patientName: 'John Patient',
              patientPhone: '+1 234-567-8901',
              patientEmail: 'patient@demo.com',
              doctorId: 'doctor_001',
              doctorName: 'Dr. Sarah Wilson',
              doctorImage: 'https://images.pexels.com/photos/5214947/pexels-photo-5214947.jpeg',
              specialty: 'Orthodontist',
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
              time: '10:00 AM',
              reason: 'Regular dental checkup and cleaning',
              status: 'confirmed',
              createdAt: new Date().toISOString(),
            },
            {
              id: '2',
              patientName: 'John Patient',
              patientPhone: '+1 234-567-8901',
              patientEmail: 'patient@demo.com',
              doctorId: 'doctor_002',
              doctorName: 'Dr. Michael Brown',
              doctorImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg',
              specialty: 'Dental Surgeon',
              date: '2025-01-20',
              time: '2:30 PM',
              reason: 'Follow-up after root canal treatment',
              status: 'completed',
              createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
            },
          ];
          setAppointments(sampleAppointments);
          await AsyncStorage.setItem('appointments', JSON.stringify(sampleAppointments));
        }
      } catch (error) {
        console.error('Error loading appointments', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Save appointments to AsyncStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      const saveAppointments = async () => {
        try {
          await AsyncStorage.setItem('appointments', JSON.stringify(appointments));
        } catch (error) {
          console.error('Error saving appointments', error);
        }
      };
      saveAppointments();
    }
  }, [appointments, isLoading]);

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === id ? { 
          ...appointment, 
          status,
          updatedAt: new Date().toISOString(),
          updatedBy: 'doctor'
        } : appointment
      )
    );
  };

  const rescheduleAppointment = async (id: string, newDate: string, newTime: string) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === id ? { 
          ...appointment, 
          date: newDate,
          time: newTime,
          status: 'confirmed' as const,
          updatedAt: new Date().toISOString(),
          updatedBy: 'doctor'
        } : appointment
      )
    );
  };

  const deleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  const cancelAppointmentByPatient = async (id: string) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === id ? { 
          ...appointment, 
          status: 'cancelled' as const,
          updatedAt: new Date().toISOString(),
          updatedBy: 'patient'
        } : appointment
      )
    );
  };

  const getPatientAppointments = (patientEmail: string) => {
    return appointments.filter(appointment => appointment.patientEmail === patientEmail);
  };

  const getDoctorAppointments = (doctorId: string) => {
    const doctorAppts = appointments.filter(appointment => appointment.doctorId === doctorId);
    console.log(`Doctor ${doctorId} has ${doctorAppts.length} appointments`);
    return doctorAppts;
  };

  const getPendingAppointments = (doctorId: string) => {
    const pendingAppts = appointments.filter(appointment => 
      appointment.doctorId === doctorId && appointment.status === 'pending'
    );
    console.log(`Doctor ${doctorId} has ${pendingAppts.length} pending appointments`);
    return pendingAppts;
  };
  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        deleteAppointment,
        cancelAppointmentByPatient,
        getPatientAppointments,
        getDoctorAppointments,
        getPendingAppointments,
        isLoading,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

