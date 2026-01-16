import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { Ionicons } from "@expo/vector-icons";

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Colors constant with better color palette
const Colors = {
  primary: "#3498db",
  primaryLight: "#5dade2",
  primaryDark: "#21618c",
  secondary: "#2ecc71",
  secondaryLight: "#58d68d",
  white: "#ffffff",
  black: "#000000",
  gray: "#95a5a6",
  grayLight: "#ecf0f1",
  grayLighter: "#f8f9fa",
  grayDark: "#7b8a8b",
  border: "#d5d5d5",
  borderLight: "#e8e8e8",
  text: "#2c3e50",
  textLight: "#34495e",
  error: "#e74c3c",
  errorLight: "#fadbd8",
  success: "#2ecc71",
  successLight: "#d5f4e6",
  warning: "#f39c12",
  warningLight: "#fdebd0",
  info: "#3498db",
  infoLight: "#d6eaf8",
};

// Extended time slots
const TIME_SLOTS = [
  "08:00 - 08:30",
  "08:30 - 09:00",
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30",
  "11:30 - 12:00",
  "14:00 - 14:30",
  "14:30 - 15:00",
  "15:00 - 15:30",
  "15:30 - 16:00",
  "16:00 - 16:30",
  "16:30 - 17:00",
];

// Add interfaces
interface Doctor {
  id: string;
  uid: string;
  name: string;
  specialization: string;
  email?: string;
}

interface Appointment {
  id: string;
  date: string;
  timeSlot: string;
  doctorId: string;
  doctorName: string;
  doctorEmail?: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  status: "confirmed" | "pending" | "cancelled";
  reason?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "pending" | "past" | "cancelled"
  >("upcoming");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const user = auth.currentUser;
  const [userData, setUserData] = useState<any>(null);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userQuery = query(
            collection(db, "users"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUserData({ id: userDoc.id, ...userDoc.data() });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const doctorsQuery = query(
          collection(db, "users"),
          where("role", "==", "doctor")
        );

        const querySnapshot = await getDocs(doctorsQuery);
        const doctorsList: Doctor[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          doctorsList.push({
            id: doc.id,
            uid: data.uid,
            name: data.name || data.displayName || "Doctor",
            specialization: data.specialization || "General Practitioner",
            email: data.email,
          });
        });
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        Alert.alert("Error", "Failed to load doctors list");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // Real-time appointments listener with animation
  useEffect(() => {
    if (!user || !userData) return;

    let appointmentsQuery;
    const currentUserId = user.uid;
    const isDoctor = userData?.role === "doctor";

    if (isDoctor) {
      appointmentsQuery = query(
        collection(db, "appointments"),
        where("doctorId", "==", currentUserId),
        orderBy("date", "asc"),
        orderBy("timeSlot", "asc")
      );
    } else {
      appointmentsQuery = query(
        collection(db, "appointments"),
        where("patientId", "==", currentUserId),
        orderBy("date", "asc"),
        orderBy("timeSlot", "asc")
      );
    }

    const unsubscribe = onSnapshot(
      appointmentsQuery,
      (snapshot) => {
        const appointmentsList: Appointment[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          appointmentsList.push({
            id: doc.id,
            date: data.date || "",
            timeSlot: data.timeSlot || "",
            doctorId: data.doctorId || "",
            doctorName: data.doctorName || "Doctor",
            doctorEmail: data.doctorEmail,
            patientId: data.patientId || "",
            patientName: data.patientName || "Patient",
            patientEmail: data.patientEmail,
            status: data.status || "confirmed",
            reason: data.reason,
            createdAt: data.createdAt || Timestamp.now(),
            updatedAt: data.updatedAt || Timestamp.now(),
          });
        });

        // Sort appointments
        appointmentsList.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          if (dateCompare !== 0) return dateCompare;
          return a.timeSlot.localeCompare(b.timeSlot);
        });

        // Animate list update
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        setAppointments(appointmentsList);
      },
      (error) => {
        console.error("Error fetching appointments:", error);
        Alert.alert("Error", "Failed to load appointments");
      }
    );

    return () => unsubscribe();
  }, [user, userData, fadeAnim, slideAnim]);

  const isDoctor = userData?.role === "doctor";

  const resetForm = () => {
    setSelectedSlot("");
    setSelectedDoctor("");
    setAppointmentReason("");
    setShowDetailsModal(false);
  };

  const handleTimeSlotSelect = (slot: string) => {
    if (!selectedDate) {
      Alert.alert("Select Date", "Please select a date first");
      return;
    }

    const existingAppointment = appointments.find(
      (appointment) =>
        appointment.date === selectedDate &&
        appointment.timeSlot === slot &&
        appointment.status !== "cancelled" &&
        (!selectedDoctor || appointment.doctorId === selectedDoctor)
    );

    if (existingAppointment) {
      Alert.alert(
        "Slot Unavailable",
        "This time slot is already booked. Please choose another time."
      );
      return;
    }

    setSelectedSlot(slot);
    setShowDetailsModal(true);
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !appointmentReason.trim()) {
      Alert.alert(
        "Missing Information",
        "Please select a doctor and provide a reason for the appointment."
      );
      return;
    }

    if (!user || !userData) {
      Alert.alert("Error", "User not found. Please login again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const doctor = doctors.find((d) => d.id === selectedDoctor);

      if (!doctor) {
        throw new Error("Doctor not found");
      }

      const appointmentData = {
        date: selectedDate,
        timeSlot: selectedSlot,
        doctorId: doctor.uid,
        doctorName: doctor.name,
        doctorEmail: doctor.email,
        patientId: user.uid,
        patientName: userData.name || user.displayName || "Patient",
        patientEmail: user.email,
        status: "confirmed",
        reason: appointmentReason,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, "appointments"), appointmentData);

      Alert.alert(
        "✅ Appointment Booked!",
        "Your appointment has been booked successfully. The doctor has been notified.",
        [
          {
            text: "OK",
            onPress: () => {
              resetForm();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Booking error:", error);
      Alert.alert(
        "Error",
        error.message || "Booking failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              if (!appointment.id) return;

              const appointmentRef = doc(db, "appointments", appointment.id);
              await updateDoc(appointmentRef, {
                status: "cancelled",
                updatedAt: Timestamp.now(),
              });

              Alert.alert("Success", "Appointment cancelled successfully");
            } catch (error) {
              console.error("Error cancelling appointment:", error);
              Alert.alert("Error", "Failed to cancel appointment");
            }
          },
        },
      ]
    );
  };

  const handleAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const refreshAppointments = useCallback(async () => {
    setRefreshing(true);
    // Add a small delay for better UX
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Select a date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeSlot: string) => {
    return timeSlot.replace(" - ", " to ");
  };

  const getAppointmentsByStatus = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];

    switch (activeTab) {
      case "upcoming":
        return appointments.filter(
          (app) => app.status === "confirmed" && app.date >= today
        );
      case "pending":
        return appointments.filter(
          (app) => app.status === "pending" && app.date >= today
        );
      case "past":
        return appointments.filter(
          (app) =>
            (app.status === "confirmed" || app.status === "pending") &&
            app.date < today
        );
      case "cancelled":
        return appointments.filter((app) => app.status === "cancelled");
      default:
        return appointments;
    }
  }, [appointments, activeTab]);

  const isSlotBooked = useCallback(
    (slot: string) => {
      return appointments.some(
        (appointment) =>
          appointment.date === selectedDate &&
          appointment.timeSlot === slot &&
          appointment.status !== "cancelled"
      );
    },
    [appointments, selectedDate]
  );

  const renderDoctorOption = (doctor: Doctor) => (
    <TouchableOpacity
      key={doctor.id}
      style={[
        styles.doctorOption,
        selectedDoctor === doctor.id && styles.selectedDoctorOption,
      ]}
      onPress={() => setSelectedDoctor(doctor.id)}
      disabled={isSubmitting}
    >
      <View style={styles.doctorAvatar}>
        <Ionicons
          name="person-circle-outline"
          size={40}
          color={selectedDoctor === doctor.id ? Colors.white : Colors.primary}
        />
      </View>
      <View style={styles.doctorInfoContainer}>
        <Text
          style={[
            styles.doctorName,
            selectedDoctor === doctor.id && styles.selectedDoctorText,
          ]}
        >
          {doctor.name}
        </Text>
        <Text
          style={[
            styles.doctorSpecialization,
            selectedDoctor === doctor.id && styles.selectedDoctorText,
          ]}
        >
          {doctor.specialization}
        </Text>
        {doctor.email && (
          <Text
            style={[
              styles.doctorEmail,
              selectedDoctor === doctor.id && styles.selectedDoctorText,
            ]}
          >
            {doctor.email}
          </Text>
        )}
      </View>
      {selectedDoctor === doctor.id && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    const appointmentDate = new Date(item.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = appointmentDate < today;
    const isToday = item.date === new Date().toISOString().split("T")[0];

    const getStatusIcon = () => {
      switch (item.status) {
        case "confirmed":
          return "checkmark-circle";
        case "pending":
          return "time-outline";
        case "cancelled":
          return "close-circle";
        default:
          return "calendar-outline";
      }
    };

    const getStatusColor = () => {
      switch (item.status) {
        case "confirmed":
          return Colors.success;
        case "pending":
          return Colors.warning;
        case "cancelled":
          return Colors.error;
        default:
          return Colors.gray;
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.appointmentCard,
          isPast && styles.pastAppointmentCard,
          isToday && styles.todayAppointmentCard,
        ]}
        onPress={() => handleAppointmentDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.appointmentCardHeader}>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateIndicator}>
              <Text style={styles.dateDay}>
                {new Date(item.date).getDate()}
              </Text>
              <Text style={styles.dateMonth}>
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "short",
                })}
              </Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.cardTime}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={Colors.primary}
                />{" "}
                {formatTime(item.timeSlot)}
              </Text>
              <Text style={styles.cardDate}>
                {new Date(item.date).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor() + "20" },
            ]}
          >
            <Ionicons
              name={getStatusIcon()}
              size={16}
              color={getStatusColor()}
            />
            <Text style={[styles.statusBadgeText, { color: getStatusColor() }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.appointmentCardBody}>
          <View style={styles.appointmentInfoRow}>
            <Ionicons name="person-outline" size={18} color={Colors.grayDark} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>
                {isDoctor ? "Patient" : "Doctor"}
              </Text>
              <Text style={styles.infoValue}>
                {isDoctor ? item.patientName : item.doctorName}
              </Text>
            </View>
          </View>

          {item.reason && (
            <View style={styles.appointmentInfoRow}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={Colors.grayDark}
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Reason</Text>
                <Text style={styles.reasonText} numberOfLines={2}>
                  {item.reason}
                </Text>
              </View>
            </View>
          )}
        </View>

        {item.status === "confirmed" && !isPast && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelActionButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleCancelAppointment(item);
              }}
            >
              <Ionicons
                name="close-circle-outline"
                size={18}
                color={Colors.error}
              />
              <Text style={styles.cancelActionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTabButton = (
    tab: "upcoming" | "pending" | "past" | "cancelled",
    label: string,
    icon: string
  ) => {
    const isActive = activeTab === tab;
    const appointmentsCount = getAppointmentsByStatus().length;

    return (
      <TouchableOpacity
        style={[styles.tabButton, isActive && styles.activeTabButton]}
        onPress={() => setActiveTab(tab)}
      >
        <Ionicons
          name={icon as any}
          size={20}
          color={isActive ? Colors.white : Colors.grayDark}
        />
        <Text
          style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}
        >
          {label}
        </Text>
        {appointmentsCount > 0 && (
          <View style={[styles.tabBadge, isActive && styles.activeTabBadge]}>
            <Text style={styles.tabBadgeText}>{appointmentsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isDoctor ? "Doctor Calendar" : "My Appointments"}
        </Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={refreshAppointments}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Ionicons name="refresh-outline" size={24} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAppointments}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Select Appointment Date</Text>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: Colors.primary,
                selectedTextColor: Colors.white,
              },
              ...appointments.reduce((acc, appointment) => {
                if (appointment.status === "confirmed") {
                  acc[appointment.date] = {
                    marked: true,
                    dotColor: Colors.primary,
                    dotRadius: 4,
                  };
                }
                return acc;
              }, {} as any),
            }}
            theme={{
              backgroundColor: Colors.white,
              calendarBackground: Colors.white,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.white,
              todayTextColor: Colors.primary,
              dayTextColor: Colors.text,
              textDisabledColor: Colors.gray,
              arrowColor: Colors.primary,
              monthTextColor: Colors.text,
              indicatorColor: Colors.primary,
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
            minDate={new Date().toISOString().split("T")[0]}
            hideExtraDays={true}
            enableSwipeMonths={true}
          />
        </View>

        {/* Patient Booking Interface */}
        {!isDoctor && (
          <>
            {/* Time Slots Section */}
            <View style={styles.slotsSection}>
              <Text style={styles.sectionTitle}>Available Time Slots</Text>
              {selectedDate ? (
                <FlatList
                  horizontal
                  data={TIME_SLOTS}
                  keyExtractor={(item) => item}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.slotsContainer}
                  renderItem={({ item }) => {
                    const booked = isSlotBooked(item);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.slot,
                          selectedSlot === item && styles.selectedSlot,
                          booked && styles.bookedSlot,
                        ]}
                        onPress={() => !booked && handleTimeSlotSelect(item)}
                        disabled={booked || isSubmitting}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.slotText,
                            selectedSlot === item && styles.selectedSlotText,
                            booked && styles.bookedSlotText,
                          ]}
                        >
                          {item.split(" - ")[0]}
                        </Text>
                        <Text
                          style={[
                            styles.slotSubText,
                            selectedSlot === item && styles.selectedSlotText,
                            booked && styles.bookedSlotText,
                          ]}
                        >
                          {item.split(" - ")[1]}
                        </Text>
                        {booked && (
                          <View style={styles.bookedOverlay}>
                            <Ionicons
                              name="close-circle"
                              size={24}
                              color={Colors.error}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : (
                <View style={styles.noDateContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={48}
                    color={Colors.grayLight}
                  />
                  <Text style={styles.noDateText}>
                    Select a date to view available time slots
                  </Text>
                </View>
              )}
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.success}
                />
                <Text style={styles.statNumber}>
                  {
                    appointments.filter(
                      (a) =>
                        a.status === "confirmed" &&
                        a.date >= new Date().toISOString().split("T")[0]
                    ).length
                  }
                </Text>
                <Text style={styles.statLabel}>Upcoming</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={Colors.warning}
                />
                <Text style={styles.statNumber}>
                  {appointments.filter((a) => a.status === "pending").length}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons
                  name="medical-outline"
                  size={24}
                  color={Colors.primary}
                />
                <Text style={styles.statNumber}>{doctors.length}</Text>
                <Text style={styles.statLabel}>Doctors</Text>
              </View>
            </View>
          </>
        )}

        {/* Appointments Tabs */}
        <View style={styles.tabsSection}>
          <View style={styles.tabsContainer}>
            {renderTabButton("upcoming", "Upcoming", "calendar-outline")}
            {renderTabButton("pending", "Pending", "time-outline")}
            {renderTabButton("past", "Past", "archive-outline")}
            {renderTabButton("cancelled", "Cancelled", "close-circle-outline")}
          </View>

          {/* Appointments List */}
          <Animated.View
            style={[
              styles.appointmentsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {getAppointmentsByStatus().length > 0 ? (
              <FlatList
                data={getAppointmentsByStatus()}
                keyExtractor={(item) => item.id}
                renderItem={renderAppointmentItem}
                scrollEnabled={false}
                contentContainerStyle={styles.appointmentsList}
                ItemSeparatorComponent={() => (
                  <View style={styles.listSeparator} />
                )}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name={
                    activeTab === "upcoming"
                      ? "calendar-outline"
                      : activeTab === "pending"
                      ? "time-outline"
                      : activeTab === "past"
                      ? "archive-outline"
                      : "close-circle-outline"
                  }
                  size={60}
                  color={Colors.grayLight}
                />
                <Text style={styles.emptyStateTitle}>
                  {activeTab === "upcoming"
                    ? "No Upcoming Appointments"
                    : activeTab === "pending"
                    ? "No Pending Appointments"
                    : activeTab === "past"
                    ? "No Past Appointments"
                    : "No Cancelled Appointments"}
                </Text>
                <Text style={styles.emptyStateText}>
                  {activeTab === "upcoming" && !isDoctor
                    ? "Book your first appointment by selecting a date and time above"
                    : "No appointments found in this category"}
                </Text>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Spacer for bottom padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Appointment Booking Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => !isSubmitting && setShowDetailsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Book Appointment</Text>
            <TouchableOpacity
              onPress={() => setShowDetailsModal(false)}
              disabled={isSubmitting}
            >
              <Ionicons name="close" size={28} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.appointmentSummaryCard}>
              <View style={styles.summaryRow}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryValue}>
                  {formatDate(selectedDate)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryValue}>{selectedSlot}</Text>
              </View>
            </View>

            <Text style={styles.modalSectionTitle}>Select Doctor</Text>

            {loadingDoctors ? (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={styles.loadingIndicator}
              />
            ) : doctors.length === 0 ? (
              <View style={styles.noDoctorsContainer}>
                <Ionicons
                  name="person-remove-outline"
                  size={48}
                  color={Colors.grayLight}
                />
                <Text style={styles.noDoctorsText}>No doctors available</Text>
              </View>
            ) : (
              <View style={styles.doctorList}>
                {doctors.map(renderDoctorOption)}
              </View>
            )}

            <Text style={styles.modalSectionTitle}>Reason for Visit</Text>
            <View style={styles.reasonInputContainer}>
              <TextInput
                style={styles.reasonInput}
                placeholder="Describe your symptoms or reason for appointment..."
                placeholderTextColor={Colors.gray}
                multiline
                numberOfLines={4}
                maxLength={500}
                value={appointmentReason}
                onChangeText={setAppointmentReason}
                editable={!isSubmitting}
              />
              <View style={styles.charCountContainer}>
                <Text style={styles.charCount}>
                  {appointmentReason.length}/500 characters
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelModalButton]}
              onPress={() => setShowDetailsModal(false)}
              disabled={isSubmitting}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.text} />
              <Text style={styles.cancelModalButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.submitModalButton,
                (!selectedDoctor ||
                  !appointmentReason.trim() ||
                  isSubmitting) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleBooking}
              disabled={
                isSubmitting || !selectedDoctor || !appointmentReason.trim()
              }
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={styles.submitModalButtonText}>
                    Book Appointment
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.detailsModalOverlay}>
            <View style={styles.detailsModalContent}>
              <ScrollView>
                <View style={styles.detailsHeader}>
                  <Text style={styles.detailsTitle}>Appointment Details</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color={Colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailsCard}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={Colors.primary}
                    />
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedAppointment.date)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={Colors.primary}
                    />
                    <Text style={styles.detailLabel}>Time:</Text>
                    <Text style={styles.detailValue}>
                      {formatTime(selectedAppointment.timeSlot)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={Colors.primary}
                    />
                    <Text style={styles.detailLabel}>
                      {isDoctor ? "Patient:" : "Doctor:"}
                    </Text>
                    <Text style={styles.detailValue}>
                      {isDoctor
                        ? selectedAppointment.patientName
                        : selectedAppointment.doctorName}
                    </Text>
                  </View>

                  {selectedAppointment.reason && (
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="document-text-outline"
                        size={20}
                        color={Colors.primary}
                      />
                      <Text style={styles.detailLabel}>Reason:</Text>
                      <Text style={styles.detailValue}>
                        {selectedAppointment.reason}
                      </Text>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color={Colors.primary}
                    />
                    <Text style={styles.detailLabel}>Status:</Text>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor:
                            selectedAppointment.status === "confirmed"
                              ? Colors.success + "20"
                              : selectedAppointment.status === "pending"
                              ? Colors.warning + "20"
                              : Colors.error + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              selectedAppointment.status === "confirmed"
                                ? Colors.success
                                : selectedAppointment.status === "pending"
                                ? Colors.warning
                                : Colors.error,
                          },
                        ]}
                      >
                        {selectedAppointment.status.charAt(0).toUpperCase() +
                          selectedAppointment.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                {selectedAppointment.status === "confirmed" &&
                  new Date(selectedAppointment.date) >= new Date() && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setModalVisible(false);
                        handleCancelAppointment(selectedAppointment);
                      }}
                    >
                      <Ionicons
                        name="close-circle-outline"
                        size={20}
                        color={Colors.error}
                      />
                      <Text style={styles.cancelButtonText}>
                        Cancel Appointment
                      </Text>
                    </TouchableOpacity>
                  )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Floating Action Button for Patients */}
      {!isDoctor && selectedDate && !showDetailsModal && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            if (!selectedSlot) {
              Alert.alert("Select Time", "Please select a time slot first");
              return;
            }
            setShowDetailsModal(true);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayLighter,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.primaryDark,
  },
  scrollView: {
    flex: 1,
  },
  calendarSection: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  slotsSection: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  slotsContainer: {
    paddingVertical: 8,
  },
  slot: {
    backgroundColor: Colors.grayLighter,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedSlot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bookedSlot: {
    backgroundColor: Colors.errorLight,
    borderColor: Colors.error,
    position: "relative",
  },
  slotText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  slotSubText: {
    color: Colors.gray,
    fontSize: 12,
  },
  selectedSlotText: {
    color: Colors.white,
  },
  bookedSlotText: {
    color: Colors.error,
  },
  bookedOverlay: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 2,
  },
  noDateContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noDateText: {
    textAlign: "center",
    color: Colors.gray,
    fontSize: 14,
    marginTop: 12,
    fontStyle: "italic",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: Colors.white,
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: "center",
  },
  tabsSection: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.grayLighter,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.grayDark,
    marginLeft: 6,
  },
  activeTabButtonText: {
    color: Colors.white,
  },
  tabBadge: {
    backgroundColor: Colors.gray,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  activeTabBadge: {
    backgroundColor: Colors.white,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.white,
  },
  appointmentsContainer: {
    padding: 16,
  },
  appointmentsList: {
    paddingBottom: 8,
  },
  appointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pastAppointmentCard: {
    opacity: 0.7,
  },
  todayAppointmentCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.infoLight,
  },
  appointmentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIndicator: {
    backgroundColor: Colors.primaryLight,
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
  dateMonth: {
    fontSize: 12,
    color: Colors.white,
    textTransform: "uppercase",
  },
  timeInfo: {
    flex: 1,
  },
  cardTime: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 13,
    color: Colors.gray,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  appointmentCardBody: {
    marginBottom: 12,
  },
  appointmentInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "500",
  },
  reasonText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelActionButton: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  cancelActionButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  listSeparator: {
    height: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    color: Colors.gray,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  bottomSpacer: {
    height: 80,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
  },
  modalScrollView: {
    flex: 1,
    padding: 20,
  },
  appointmentSummaryCard: {
    backgroundColor: Colors.grayLighter,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 12,
    marginRight: "auto",
  },
  summaryValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "600",
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  loadingIndicator: {
    marginVertical: 32,
  },
  noDoctorsContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noDoctorsText: {
    textAlign: "center",
    color: Colors.gray,
    fontSize: 14,
    marginTop: 12,
    fontStyle: "italic",
  },
  doctorList: {
    marginBottom: 24,
  },
  doctorOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.grayLighter,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedDoctorOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  doctorAvatar: {
    marginRight: 12,
  },
  doctorInfoContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 2,
  },
  doctorEmail: {
    fontSize: 12,
    color: Colors.grayDark,
  },
  selectedDoctorText: {
    color: Colors.white,
  },
  selectedIndicator: {
    marginLeft: 8,
  },
  reasonInputContainer: {
    marginBottom: 24,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    color: Colors.text,
    backgroundColor: Colors.grayLighter,
  },
  charCountContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    color: Colors.gray,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  cancelModalButton: {
    backgroundColor: Colors.grayLighter,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submitModalButton: {
    backgroundColor: Colors.primary,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray,
    opacity: 0.6,
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  submitModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 8,
  },
  detailsModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  detailsModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: "100%",
    maxHeight: "80%",
    padding: 20,
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  detailsCard: {
    backgroundColor: Colors.grayLighter,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 12,
    marginRight: 8,
    width: 60,
  },
  detailValue: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: "500",
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.error,
    marginLeft: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
