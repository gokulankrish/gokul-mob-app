import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calculator, Apple, Milk, Beef, Candy, Heart, Activity } from 'lucide-react-native';

interface FoodScores {
  milk: string;
  meat: string;
  fruits: string;
  vitc: string;
  bread: string;
  other: string;
}

interface SweetScores {
  liquid: string;
  sticky: string;
  slow: string;
}

interface NutrientChecks {
  protein: boolean;
  iron: boolean;
  folicAcid: boolean;
  riboflavin: boolean;
  vitaminC: boolean;
  calcium: boolean;
  phosphorus: boolean;
}

export default function DietChartScreen() {
  const router = useRouter();
  const [foodScores, setFoodScores] = useState<FoodScores>({
    milk: '',
    meat: '',
    fruits: '',
    vitc: '',
    bread: '',
    other: '',
  });

  const [sweetScores, setSweetScores] = useState<SweetScores>({
    liquid: '',
    sticky: '',
    slow: '',
  });

  const [nutrients, setNutrients] = useState<NutrientChecks>({
    protein: false,
    iron: false,
    folicAcid: false,
    riboflavin: false,
    vitaminC: false,
    calcium: false,
    phosphorus: false,
  });

  const [results, setResults] = useState<{
    foodScore: number;
    nutrientScore: number;
    sweetScore: number;
    totalScore: number;
  } | null>(null);

  const calculateScore = () => {
    // Calculate Food Score
    const milk = (parseInt(foodScores.milk) || 0) * 8;
    const meat = (parseInt(foodScores.meat) || 0) * 12;
    const fruits = (parseInt(foodScores.fruits) || 0) * 6;
    const vitc = (parseInt(foodScores.vitc) || 0) * 6;
    const bread = (parseInt(foodScores.bread) || 0) * 6;
    const other = (parseInt(foodScores.other) || 0) * 6;

    const foodScore = milk + meat + fruits + vitc + bread + other;

    // Calculate Nutrient Score
    const nutrientScore = Object.values(nutrients).filter(Boolean).length;

    // Calculate Sweet Score
    const sweetScore = 
      (parseInt(sweetScores.liquid) || 0) * 5 +
      (parseInt(sweetScores.sticky) || 0) * 10 +
      (parseInt(sweetScores.slow) || 0) * 15;

    // Calculate Total Score
    const totalScore = foodScore + nutrientScore - sweetScore;

    setResults({
      foodScore,
      nutrientScore,
      sweetScore,
      totalScore,
    });
  };

  const resetForm = () => {
    setFoodScores({
      milk: '',
      meat: '',
      fruits: '',
      vitc: '',
      bread: '',
      other: '',
    });
    setSweetScores({
      liquid: '',
      sticky: '',
      slow: '',
    });
    setNutrients({
      protein: false,
      iron: false,
      folicAcid: false,
      riboflavin: false,
      vitaminC: false,
      calcium: false,
      phosphorus: false,
    });
    setResults(null);
  };

  const renderFoodInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    multiplier: number,
    description: string,
    icon: React.ReactNode
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputHeader}>
        {icon}
        <View style={styles.inputLabelContainer}>
          <Text style={styles.inputLabel}>{label} (×{multiplier})</Text>
          <Text style={styles.inputDescription}>{description}</Text>
        </View>
      </View>
      <TextInput
        style={styles.numberInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor="#999"
      />
    </View>
  );

  const renderNutrientCheckbox = (
    key: keyof NutrientChecks,
    label: string,
    description: string,
    icon: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.checkboxContainer, nutrients[key] && styles.checkboxSelected]}
      onPress={() => setNutrients(prev => ({ ...prev, [key]: !prev[key] }))}
    >
      {icon}
      <View style={styles.checkboxLabelContainer}>
        <Text style={[styles.checkboxLabel, nutrients[key] && styles.checkboxLabelSelected]}>
          {label}
        </Text>
        <Text style={[styles.checkboxDescription, nutrients[key] && styles.checkboxDescriptionSelected]}>
          {description}
        </Text>
      </View>
      <View style={[styles.checkbox, nutrients[key] && styles.checkboxChecked]}>
        {nutrients[key] && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Dental Diet History</Text>

        {/* Food Score Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Apple size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>🍱 Category 1: Food Score</Text>
          </View>
          
          {renderFoodInput(
            'Milk',
            foodScores.milk,
            (text) => setFoodScores(prev => ({ ...prev, milk: text })),
            8,
            'Milk, curd, paneer, cheese, lassi',
            <Milk size={20} color="#4CAF50" />
          )}

          {renderFoodInput(
            'Meat',
            foodScores.meat,
            (text) => setFoodScores(prev => ({ ...prev, meat: text })),
            12,
            'Chicken, fish, mutton, egg',
            <Beef size={20} color="#FF6B6B" />
          )}

          {renderFoodInput(
            'Fruits & Vegetables',
            foodScores.fruits,
            (text) => setFoodScores(prev => ({ ...prev, fruits: text })),
            6,
            'Apple, banana, spinach, carrot',
            <Apple size={20} color="#FF9800" />
          )}

          {renderFoodInput(
            'Vitamin C',
            foodScores.vitc,
            (text) => setFoodScores(prev => ({ ...prev, vitc: text })),
            6,
            'Orange, lemon, amla, kiwi',
            <Activity size={20} color="#FFC107" />
          )}

          {renderFoodInput(
            'Bread & Cereals',
            foodScores.bread,
            (text) => setFoodScores(prev => ({ ...prev, bread: text })),
            6,
            'Rice, chapati, oats, idli',
            <Activity size={20} color="#795548" />
          )}

          {renderFoodInput(
            'Other',
            foodScores.other,
            (text) => setFoodScores(prev => ({ ...prev, other: text })),
            6,
            'Plain idli, upma, ragi',
            <Activity size={20} color="#9E9E9E" />
          )}
        </View>

        {/* Nutrient Score Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={24} color="#E91E63" />
            <Text style={styles.sectionTitle}>🧬 Category 2: Nutrient Score</Text>
          </View>

          {renderNutrientCheckbox('protein', 'Protein', 'Egg, paneer, fish, tofu', <Activity size={20} color="#FF6B6B" />)}
          {renderNutrientCheckbox('iron', 'Iron', 'Dates, jaggery, greens', <Activity size={20} color="#795548" />)}
          {renderNutrientCheckbox('folicAcid', 'Folic Acid', 'Spinach, legumes', <Activity size={20} color="#4CAF50" />)}
          {renderNutrientCheckbox('riboflavin', 'Riboflavin', 'Almond, milk, egg', <Activity size={20} color="#FF9800" />)}
          {renderNutrientCheckbox('vitaminC', 'Vitamin C', 'Orange, amla, kiwi', <Activity size={20} color="#FFC107" />)}
          {renderNutrientCheckbox('calcium', 'Calcium', 'Ragi, tofu, milk', <Activity size={20} color="#9C27B0" />)}
          {renderNutrientCheckbox('phosphorus', 'Phosphorus', 'Lentils, egg, whole grains', <Activity size={20} color="#607D8B" />)}
        </View>

        {/* Sweet Score Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Candy size={24} color="#E91E63" />
            <Text style={styles.sectionTitle}>🍬 Category 3: Sweet Score</Text>
          </View>

          {renderFoodInput(
            'Liquid',
            sweetScores.liquid,
            (text) => setSweetScores(prev => ({ ...prev, liquid: text })),
            5,
            'Juice, chocolate milk, sweet drinks',
            <Activity size={20} color="#2196F3" />
          )}

          {renderFoodInput(
            'Solid & Sticky',
            sweetScores.sticky,
            (text) => setSweetScores(prev => ({ ...prev, sticky: text })),
            10,
            'Cake, jam, caramel',
            <Candy size={20} color="#E91E63" />
          )}

          {renderFoodInput(
            'Slowly Dissolving',
            sweetScores.slow,
            (text) => setSweetScores(prev => ({ ...prev, slow: text })),
            15,
            'Candy, lollipop, toffee',
            <Candy size={20} color="#9C27B0" />
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.calculateButton} onPress={calculateScore}>
            <Calculator size={20} color="#fff" />
            <Text style={styles.calculateButtonText}>Calculate Total Score</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
            <Text style={styles.resetButtonText}>Reset Form</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {results && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>📊 Diet Score Results</Text>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>🍱 Food Score:</Text>
              <Text style={styles.resultValue}>{results.foodScore}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>🧬 Nutrient Score:</Text>
              <Text style={styles.resultValue}>{results.nutrientScore}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>🍬 Sweet Score:</Text>
              <Text style={styles.resultValue}>{results.sweetScore}</Text>
            </View>

            <View style={[styles.resultRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>🧮 Total Dental Diet Score:</Text>
              <Text style={[styles.totalValue, { color: results.totalScore >= 0 ? '#4CAF50' : '#FF5252' }]}>
                {results.totalScore}
              </Text>
            </View>

            <View style={styles.interpretationContainer}>
              <Text style={styles.interpretationTitle}>📋 Interpretation:</Text>
              <Text style={styles.interpretationText}>
                {results.totalScore >= 50 ? '✅ Excellent dental diet!' :
                 results.totalScore >= 30 ? '⚠️ Good diet, but room for improvement' :
                 results.totalScore >= 10 ? '⚠️ Fair diet, needs improvement' :
                 '❌ Poor diet, significant changes needed'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#0077B6',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#0077B6',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
    marginLeft: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputLabelContainer: {
    marginLeft: 12,
    flex: 1,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  inputDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  numberInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  checkboxSelected: {
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    borderColor: '#0077B6',
  },
  checkboxLabelContainer: {
    flex: 1,
    marginLeft: 12,
  },
  checkboxLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  checkboxLabelSelected: {
    color: '#0077B6',
  },
  checkboxDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  checkboxDescriptionSelected: {
    color: '#0077B6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  checkmark: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  calculateButton: {
    flexDirection: 'row',
    backgroundColor: '#0077B6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  calculateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  resetButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0077B6',
  },
  resetButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0077B6',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  resultsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resultLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
  },
  resultValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#666',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  interpretationContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0077B6',
  },
  interpretationTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  interpretationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});