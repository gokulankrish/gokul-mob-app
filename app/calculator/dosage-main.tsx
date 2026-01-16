import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Calculator, Scale, Pill, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dosagemain() {
  const navigateToDosage = () => {
    router.push('/calculator/dosage');
  };

  const navigateToBMI = () => {
    router.push('/calculator/pediatricdosage');
  };

  const navigateHome = () => {
    router.push('/'); // change this to your actual home route
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Back Button */}


      <View style={styles.header}>
        <Text style={styles.title}>Health Calculators</Text>
        <Text style={styles.subtitle}>Choose a calculator to get started</Text>
      </View>
      
      <View style={styles.cardsContainer}>
        <TouchableOpacity 
          style={styles.cardWrapper}
          onPress={navigateToDosage}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            style={styles.card}
          >
            <View style={styles.iconContainer}>
              <Pill size={48} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Drug dosage Calculator</Text>
            <Text style={styles.cardDescription}>
              Calculate medication dosages based on weight, age, and other factors
            </Text>
            <View style={styles.arrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cardWrapper}
          onPress={navigateToBMI}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#10b981', '#047857']}
            style={styles.card}
          >
            <View style={styles.iconContainer}>
              <Scale size={48} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Dosage Doctor Calculator</Text>
            <Text style={styles.cardDescription}>
              Calculate your dosage and get health recommendations
            </Text>
            <View style={styles.arrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    marginLeft: 6,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 20,
  },
  cardWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#e5e7eb',
    lineHeight: 20,
    marginBottom: 16,
  },
  arrow: {
    alignSelf: 'flex-end',
  },
  arrowText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
});
