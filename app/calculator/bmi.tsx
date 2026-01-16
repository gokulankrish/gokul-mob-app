
// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { Button } from '../../components/common/Button';
// import { Input } from '../../components/common/Input';
// import { colors } from '../../constants/Colors';

// export default function BMICalculatorScreen() {
//   const [height, setHeight] = useState('');
//   const [weight, setWeight] = useState('');
//   const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
//   const [bmi, setBMI] = useState<number | null>(null);
//   const [category, setCategory] = useState<string>('');

//   const calculateBMI = () => {
//     if (!height || !weight) return;

//     let bmiValue: number;
//     if (unit === 'metric') {
//       const heightInMeters = parseFloat(height) / 100;
//       bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
//     } else {
//       bmiValue =
//         (parseFloat(weight) * 703) /
//         (parseFloat(height) * parseFloat(height));
//     }

//     const roundedBMI = parseFloat(bmiValue.toFixed(1));
//     setBMI(roundedBMI);

//     if (roundedBMI < 18.5) {
//       setCategory('Underweight');
//     } else if (roundedBMI < 25) {
//       setCategory('Normal weight');
//     } else if (roundedBMI < 30) {
//       setCategory('Overweight');
//     } else {
//       setCategory('Obese');
//     }
//   };

//   const resetCalculator = () => {
//     setHeight('');
//     setWeight('');
//     setBMI(null);
//     setCategory('');
//   };

//   const getBMICategoryColor = () => {
//     switch (category) {
//       case 'Underweight':
//         return colors.warning;
//       case 'Normal weight':
//         return colors.success;
//       case 'Overweight':
//         return colors.warning;
//       case 'Obese':
//         return colors.error;
//       default:
//         return colors.textDark;
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="dark" />



//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.contentWrapper}>
//           <Text style={styles.title}>BMI Calculator</Text>
//           <Text style={styles.subtitle}>
//             Calculate your Body Mass Index
//           </Text>

//           <View style={styles.unitSelector}>
//             {['metric', 'imperial'].map((type) => (
//               <TouchableOpacity
//                 key={type}
//                 style={[
//                   styles.unitButton,
//                   unit === type && styles.selectedUnitButton,
//                 ]}
//                 onPress={() => setUnit(type as 'metric' | 'imperial')}
//               >
//                 <Text
//                   style={[
//                     styles.unitButtonText,
//                     unit === type && styles.selectedUnitButtonText,
//                   ]}
//                 >
//                   {type === 'metric' ? 'Metric' : 'Imperial'}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <View style={styles.inputsContainer}>
//             <Input
//               label={unit === 'metric' ? 'Height (cm)' : 'Height (inches)'}
//               placeholder={unit === 'metric' ? 'e.g. 170' : 'e.g. 65'}
//               keyboardType="numeric"
//               value={height}
//               onChangeText={setHeight}
//             />
//             <Input
//               label={unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
//               placeholder={unit === 'metric' ? 'e.g. 65' : 'e.g. 140'}
//               keyboardType="numeric"
//               value={weight}
//               onChangeText={setWeight}
//             />
//           </View>

//           <View style={styles.buttonsContainer}>
//             <Button
//               title="Calculate BMI"
//               onPress={calculateBMI}
//               variant="primary"
//               size="large"
//               style={styles.button}
//             />
//             <Button
//               title="Reset"
//               onPress={resetCalculator}
//               variant="outline"
//               size="large"
//               style={styles.button}
//             />
//           </View>

//           {bmi !== null && (
//             <View style={styles.resultContainer}>
//               <Text style={styles.resultTitle}>Your BMI</Text>
//               <Text style={styles.bmiValue}>{bmi}</Text>
//               <Text
//                 style={[
//                   styles.bmiCategory,
//                   { color: getBMICategoryColor() },
//                 ]}
//               >
//                 {category}
//               </Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
    
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//   },
//   backText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.primary,
//     marginLeft: 6,
//   },
//   scrollContent: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//   },
//   contentWrapper: {
//     width: '100%',
//     maxWidth: 360,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: colors.textDark,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: colors.textLight,
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   unitSelector: {
//     flexDirection: 'row',
//     backgroundColor: colors.gray[100],
//     borderRadius: 8,
//     marginBottom: 20,
//     width: '100%',
//     padding: 4,
//   },
//   unitButton: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: 'center',
//     borderRadius: 6,
//   },
//   selectedUnitButton: {
//     backgroundColor: colors.white,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   unitButtonText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: colors.textLight,
//   },
//   selectedUnitButtonText: {
//     color: colors.primary,
//   },
//   inputsContainer: {
//     width: '100%',
//     gap: 16,
//     marginBottom: 24,
//   },
//   buttonsContainer: {
//     width: '100%',
//     gap: 12,
//     marginBottom: 32,
//   },
//   button: {
//     width: '100%',
//   },
//   resultContainer: {
//     backgroundColor: colors.white,
//     borderRadius: 16,
//     padding: 24,
//     alignItems: 'center',
//     width: '100%',
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   resultTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.textDark,
//     marginBottom: 12,
//   },
//   bmiValue: {
//     fontSize: 48,
//     fontWeight: '800',
//     color: colors.primary,
//     marginBottom: 4,
//   },
//   bmiCategory: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { colors } from '../../constants/Colors';

export default function BMICalculatorScreen() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBMI] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const resultScaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const calculateBMI = () => {
    if (!height || !weight) {
      // Optional: Add shake animation for empty fields
      return;
    }

    let bmiValue: number;
    if (unit === 'metric') {
      const heightInMeters = parseFloat(height) / 100;
      bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
    } else {
      bmiValue =
        (parseFloat(weight) * 703) /
        (parseFloat(height) * parseFloat(height));
    }

    const roundedBMI = parseFloat(bmiValue.toFixed(1));
    setBMI(roundedBMI);

    // Animate result appearance
    Animated.spring(resultScaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    if (roundedBMI < 18.5) {
      setCategory('Underweight');
    } else if (roundedBMI < 25) {
      setCategory('Normal weight');
    } else if (roundedBMI < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setBMI(null);
    setCategory('');
    resultScaleAnim.setValue(0.9);
  };

  const getBMICategoryColor = () => {
    switch (category) {
      case 'Underweight':
        return '#F59E0B'; // Amber
      case 'Normal weight':
        return '#10B981'; // Emerald
      case 'Overweight':
        return '#F97316'; // Orange
      case 'Obese':
        return '#EF4444'; // Red
      default:
        return colors.textDark;
    }
  };

  const getBMIDescription = () => {
    switch (category) {
      case 'Underweight':
        return 'Consider gaining weight through a balanced diet';
      case 'Normal weight':
        return 'Great! Maintain your current lifestyle';
      case 'Overweight':
        return 'Consider a balanced diet and regular exercise';
      case 'Obese':
        return 'Consult with a healthcare professional';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header with back button */}


      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.contentWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Calculate Your</Text>
            <Text style={styles.titleAccent}>Body Mass Index</Text>
            <Text style={styles.subtitle}>
              Get insights about your weight status
            </Text>
          </View>

          {/* Unit Selector Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Select Unit System</Text>
            <View style={styles.unitSelector}>
              {['metric', 'imperial'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.unitButton,
                    unit === type && styles.selectedUnitButton,
                  ]}
                  onPress={() => {
                    setUnit(type as 'metric' | 'imperial');
                    resetCalculator();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={type === 'metric' ? 'globe' : 'flag'}
                    size={20}
                    color={unit === type ? colors.white : colors.textLight}
                  />
                  <Text
                    style={[
                      styles.unitButtonText,
                      unit === type && styles.selectedUnitButtonText,
                    ]}
                  >
                    {type === 'metric' ? 'Metric' : 'Imperial'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Inputs Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Enter Your Details</Text>
            <View style={styles.inputsContainer}>
              <Input
                label={unit === 'metric' ? 'Height (cm)' : 'Height (inches)'}
                placeholder={unit === 'metric' ? 'Enter height in cm' : 'Enter height in inches'}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                containerStyle={styles.input}
              />
              <Input
                label={unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
                placeholder={unit === 'metric' ? 'Enter weight in kg' : 'Enter weight in lbs'}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                containerStyle={styles.input}
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <Button
              title="Calculate BMI"
              onPress={calculateBMI}
              variant="primary"
              size="large"
              style={styles.primaryButton}
            />
            <Button
              title="Reset All"
              onPress={resetCalculator}
              variant="outline"
              size="large"
              style={styles.secondaryButton}
            />
          </View>

          {/* BMI Result Card */}
          {bmi !== null && (
            <Animated.View 
              style={[
                styles.resultCard,
                {
                  transform: [{ scale: resultScaleAnim }],
                },
              ]}
            >
              <View style={styles.resultHeader}>
                <Ionicons name="medal" size={24} color={colors.primary} />
                <Text style={styles.resultTitle}>Your BMI Result</Text>
              </View>
              
              <View style={styles.bmiValueContainer}>
                <Text style={styles.bmiValue}>{bmi}</Text>
                <View style={styles.bmiBadge}>
                  <Text style={[styles.bmiCategory, { color: getBMICategoryColor() }]}>
                    {category}
                  </Text>
                </View>
              </View>

              <View style={styles.bmiScaleContainer}>
                {['Underweight', 'Normal', 'Overweight', 'Obese'].map((label, index) => (
                  <View key={label} style={styles.scaleSegment}>
                    <View style={[
                      styles.scaleBar,
                      label.toLowerCase().includes(category.toLowerCase().split(' ')[0]) && 
                      { backgroundColor: getBMICategoryColor() }
                    ]} />
                    <Text style={styles.scaleLabel}>{label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.resultDescription}>
                <Ionicons name="information-circle" size={20} color={colors.textLight} />
                <Text style={styles.descriptionText}>{getBMIDescription()}</Text>
              </View>
            </Animated.View>
          )}

          {/* Information Section */}
          {!bmi && (
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={24} color={colors.primary} />
                <Text style={styles.infoTitle}>About BMI</Text>
              </View>
              <Text style={styles.infoText}>
                Body Mass Index (BMI) is a simple calculation using a person's height and weight. 
                It's a useful screening tool for weight categories.
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Light gray background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  titleAccent: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '80%',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 16,
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 4,
  },
  unitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  selectedUnitButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  unitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textLight,
  },
  selectedUnitButtonText: {
    color: colors.white,
  },
  inputsContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButton: {
    borderRadius: 12,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  bmiValueContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bmiValue: {
    fontSize: 64,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 8,
    textShadowColor: 'rgba(99, 102, 241, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bmiBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  bmiCategory: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bmiScaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  scaleSegment: {
    alignItems: 'center',
    flex: 1,
  },
  scaleBar: {
    width: '90%',
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 6,
  },
  scaleLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textLight,
    textAlign: 'center',
  },
  resultDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
  },
});