// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   Platform,
//   Switch,
//   Alert,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';

// /* 🔔 REQUIRED FOR EXPO SDK 54 */
// Notifications.setNotificationHandler({
//   handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
//     shouldShowAlert: true,
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function SimpleDentalReminder() {
//   const [date, setDate] = useState<Date>(new Date());
//   const [showPicker, setShowPicker] = useState<boolean>(false);
//   const [repeatDaily, setRepeatDaily] = useState<boolean>(false);
//   const [vibration, setVibration] = useState<boolean>(true);
//   const [notificationId, setNotificationId] = useState<string | null>(null);

//   /* 🔐 Request permissions */
//   useEffect(() => {
//     if (!Device.isDevice) {
//       Alert.alert('Error', 'Use a physical device for notifications');
//       return;
//     }
//     Notifications.requestPermissionsAsync();
//   }, []);

//   /* 🔔 Schedule reminder (Expo 54 SAFE) */
//   const scheduleReminder = async (customDate?: Date) => {
//     const selectedDate = customDate ?? date;

//     const trigger: Notifications.NotificationTriggerInput = repeatDaily
//       ? {
//           type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
//           hour: selectedDate.getHours(),
//           minute: selectedDate.getMinutes(),
//           repeats: true,
//         }
//       : {
//           type: Notifications.SchedulableTriggerInputTypes.DATE,
//           date: selectedDate,
//         };

//     const id = await Notifications.scheduleNotificationAsync({
//       content: {
//         title: '🦷 Dental Reminder',
//         body: 'Time for your dental care',
//         sound: 'dental_alarm.mp3', // fallback to default if missing
//         priority: Notifications.AndroidNotificationPriority.MAX,
//         vibrate: vibration ? [0, 400, 400, 400] : undefined,
//       },
//       trigger,
//     });

//     setNotificationId(id);
//     Alert.alert('Success', 'Reminder set');
//   };

//   /* ❌ Cancel reminder */
//   const cancelReminder = async () => {
//     if (!notificationId) return;
//     await Notifications.cancelScheduledNotificationAsync(notificationId);
//     setNotificationId(null);
//     Alert.alert('Cancelled', 'Reminder removed');
//   };

//   /* ⏱ Quick schedule */
//   const quickSet = (minutes: number) => {
//     const quickDate = new Date();
//     quickDate.setMinutes(quickDate.getMinutes() + minutes);
//     setDate(quickDate);
//     scheduleReminder(quickDate);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🦷 Dental Reminder</Text>

//       <Button title="Pick Date & Time" onPress={() => setShowPicker(true)} />
//       <Text style={styles.dateText}>{date.toLocaleString()}</Text>

//       {showPicker && (
//         <DateTimePicker
//           value={date}
//           mode="datetime"
//           display={Platform.OS === 'ios' ? 'inline' : 'default'}
//           onChange={(_, selectedDate) => {
//             setShowPicker(false);
//             if (selectedDate) setDate(selectedDate);
//           }}
//         />
//       )}

//       <View style={styles.row}>
//         <Text>🔁 Repeat Daily</Text>
//         <Switch value={repeatDaily} onValueChange={setRepeatDaily} />
//       </View>

//       <View style={styles.row}>
//         <Text>📳 Vibration</Text>
//         <Switch value={vibration} onValueChange={setVibration} />
//       </View>

//       <View style={styles.quickRow}>
//         <Button title="⏱ 10 min" onPress={() => quickSet(10)} />
//         <Button title="⏰ 1 hour" onPress={() => quickSet(60)} />
//       </View>

//       <Button title="Set Reminder" onPress={() => scheduleReminder()} />

//       {notificationId && (
//         <View style={{ marginTop: 12 }}>
//           <Button
//             title="❌ Cancel Reminder"
//             color="red"
//             onPress={cancelReminder}
//           />
//         </View>
//       )}
//     </View>
//   );
// }

// /* 🎨 Styles */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   dateText: {
//     textAlign: 'center',
//     marginVertical: 12,
//     fontSize: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 8,
//   },
//   quickRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 12,
//   },
// });


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const DAILY_TIMES = [
  { id: 'morning', time: '08:00', label: '🌅 Morning Brush', emoji: '🌅' },
  { id: 'afternoon', time: '13:00', label: '☀️ Afternoon Rinse', emoji: '☀️' },
  { id: 'evening', time: '21:00', label: '🌙 Evening Floss', emoji: '🌙' },
];

export default function DentalReminderApp() {
  const [selectedTimes, setSelectedTimes] = useState<Record<string, boolean>>({
    morning: true,
    afternoon: true,
    evening: true,
  });
  const [scheduledIds, setScheduledIds] = useState<string[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Request permissions
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (!Device.isDevice) {
      Alert.alert('Error', 'Please use a physical device for notifications');
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please enable notifications in settings');
    }
  };

  const scheduleDailyNotification = async (time: { id: string; time: string; label: string; emoji: string }) => {
    const [hours, minutes] = time.time.split(':').map(Number);
    
    const trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
      repeats: true,
    } as Notifications.DailyTriggerInput;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🦷 ${time.label}`,
        body: `Time for your dental care routine! ${time.emoji}`,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
        data: { type: 'dental', timeId: time.id },
      },
      trigger,
    });

    return notificationId;
  };

  const scheduleAllReminders = async () => {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    setScheduledIds([]);

    const newIds: string[] = [];
    
    for (const time of DAILY_TIMES) {
      if (selectedTimes[time.id]) {
        try {
          const id = await scheduleDailyNotification(time);
          newIds.push(id);
        } catch (error) {
          console.error(`Failed to schedule ${time.id}:`, error);
        }
      }
    }

    setScheduledIds(newIds);
    
    // Success animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert(
      '✅ Success!',
      `Set ${newIds.length} daily reminder${newIds.length !== 1 ? 's' : ''}\n` +
      'You\'ll be notified for your dental care routine.'
    );
  };

  const cancelAllReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    setScheduledIds([]);
    
    // Shake animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    Alert.alert('Cancelled', 'All reminders have been removed');
  };

  const toggleTime = (timeId: string) => {
    setSelectedTimes(prev => ({
      ...prev,
      [timeId]: !prev[timeId],
    }));
  };

  const TimeCard = ({ time, index }: { time: typeof DAILY_TIMES[0], index: number }) => {
    const cardAnim = new Animated.Value(0);
    
    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }).start();
    }, []);

    const translateY = cardAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    const isActive = selectedTimes[time.id];

    return (
      <Animated.View
        style={[
          styles.timeCard,
          {
            opacity: cardAnim,
            transform: [{ translateY }],
            backgroundColor: isActive ? '#e3f2fd' : '#f5f5f5',
            borderColor: isActive ? '#2196f3' : '#e0e0e0',
          },
        ]}
      >
        <TouchableOpacity
          style={styles.timeCardContent}
          onPress={() => toggleTime(time.id)}
          activeOpacity={0.7}
        >
          <View style={styles.timeCardLeft}>
            <Text style={styles.timeEmoji}>{time.emoji}</Text>
            <View>
              <Text style={styles.timeLabel}>{time.label}</Text>
              <Text style={styles.timeValue}>{time.time}</Text>
            </View>
          </View>
          <View style={[styles.toggleCircle, isActive && styles.toggleCircleActive]}>
            {isActive && <View style={styles.toggleInnerCircle} />}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#bbdefb', '#e3f2fd']}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <FontAwesome5 name="teeth" size={40} color="#0077b6" />
            <Text style={styles.title}>Dental Care Reminder</Text>
            <Text style={styles.subtitle}>Healthy smile, happy life!</Text>
          </View>

          {/* Daily Times Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Daily Reminders</Text>
            <Text style={styles.sectionSubtitle}>
              Select the times you want to be reminded
            </Text>
            
            {DAILY_TIMES.map((time, index) => (
              <TimeCard key={time.id} time={time} index={index} />
            ))}
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Object.values(selectedTimes).filter(Boolean).length}
              </Text>
              <Text style={styles.statLabel}>Active Reminders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{scheduledIds.length}</Text>
              <Text style={styles.statLabel}>Scheduled</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={scheduleAllReminders}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0077b6', '#0096c7']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialIcons name="notifications-active" size={24} color="white" />
              <Text style={styles.buttonText}>Set Daily Reminders</Text>
            </LinearGradient>
          </TouchableOpacity>

          {scheduledIds.length > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={cancelAllReminders}
              activeOpacity={0.8}
            >
              <MaterialIcons name="notifications-off" size={24} color="#d32f2f" />
              <Text style={[styles.buttonText, { color: '#d32f2f' }]}>
                Cancel All Reminders
              </Text>
            </TouchableOpacity>
          )}

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Dental Care Tips</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Brush for 2 minutes, twice daily</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Floss at least once per day</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Replace toothbrush every 3 months</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0077b6',
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  timeCard: {
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  timeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  timeEmoji: {
    fontSize: 24,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  toggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleCircleActive: {
    borderColor: '#0077b6',
    backgroundColor: '#0077b6',
  },
  toggleInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0077b6',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  button: {
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  primaryButton: {
    height: 56,
  },
  secondaryButton: {
    height: 56,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ffcdd2',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    color: '#0077b6',
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
    lineHeight: 22,
  },
});