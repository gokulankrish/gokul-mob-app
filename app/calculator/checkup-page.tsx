import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HealthCheckSimple: React.FC = () => {
  const [userName] = useState('John Doe');
  const [lastCheckup] = useState('January 15, 2024');

  // Health metrics data
  const [healthMetrics] = useState([
    {
      id: '1',
      title: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      icon: 'heart',
    },
    {
      id: '2',
      title: 'Heart Rate',
      value: '72',
      unit: 'BPM',
      status: 'normal',
      icon: 'heartbeat',
    },
    {
      id: '3',
      title: 'Body Temperature',
      value: '98.6',
      unit: '°F',
      status: 'normal',
      icon: 'thermometer',
    },
    {
      id: '4',
      title: 'Oxygen Level',
      value: '98',
      unit: '%',
      status: 'normal',
      icon: 'lungs',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'warning': return 'Needs Attention';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      
      {/* Header */}
      {/* <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#3498db" />
        </TouchableOpacity>
      </View> */}

      <ScrollView style={styles.scrollView}>
        {/* Health Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Health Summary</Text>
          <Text style={styles.summarySubtitle}>
            Last checkup: {lastCheckup}
          </Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Vitals Tracked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={[styles.statLabel, { marginTop: 4 }]}>
                All Normal
              </Text>
            </View>
          </View>
        </View>

        {/* Health Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Health Metrics</Text>
          
          {healthMetrics.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Ionicons name={metric.icon as any} size={24} color="#3498db" />
                <View style={styles.metricInfo}>
                  <Text style={styles.metricTitle}>{metric.title}</Text>
                  <View style={styles.statusRow}>
                    <View 
                      style={[
                        styles.statusDot, 
                        { backgroundColor: getStatusColor(metric.status) }
                      ]} 
                    />
                    <Text style={styles.statusText}>
                      {getStatusText(metric.status)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricUnit}>{metric.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Health Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <View style={styles.tipsCard}>
            <View style={styles.tipItem}>
              <Ionicons name="water-outline" size={20} color="#3B82F6" />
              <Text style={styles.tipText}>Drink 8 glasses of water daily</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="walk-outline" size={20} color="#10B981" />
              <Text style={styles.tipText}>30 minutes of exercise daily</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="bed-outline" size={20} color="#8B5CF6" />
              <Text style={styles.tipText}>7-8 hours of sleep nightly</Text>
            </View>
          </View>
        </View>

        {/* Next Checkup Reminder */}
        <View style={styles.reminderCard}>
          <Ionicons name="calendar-outline" size={24} color="#3498db" />
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTitle}>Next Checkup</Text>
            <Text style={styles.reminderDate}>February 15, 2024</Text>
          </View>
          <TouchableOpacity style={styles.reminderButton}>
            <Text style={styles.reminderButtonText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Quick Action Buttons */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFF',
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#3498db',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricInfo: {
    marginLeft: 12,
    flex: 1,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 8,
  },
  metricUnit: {
    fontSize: 16,
    color: '#6B7280',
  },
  tipsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  reminderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  reminderDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  reminderButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reminderButtonText: {
    color: '#3498db',
    fontWeight: '600',
  },
  actionBar: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    marginLeft: 8,
  },
  primaryAction: {
    backgroundColor: '#3498db',
  },
  primaryActionText: {
    color: '#FFF',
  },
});

export default HealthCheckSimple;