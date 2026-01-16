import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { ArrowLeft, Pill, Weight, Cake, Calculator, RotateCcw, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native';
import { colors } from '../../constants/Colors';

interface DrugForm {
  name: string;
  type: string;
  dose: number;
  unit: string;
  strength?: number;
  extendedRelease?: boolean;
  effervescent?: boolean;
}

interface Drug {
  adultDose: number;
  maxDailyDose: number;
  frequency: string;
  forms: DrugForm[];
  class: string;
}

interface DrugData {
  [key: string]: Drug;
}

const drugData: DrugData = {
// ---------------- Analgesics & NSAIDs ----------------
  "Paracetamol": {
    adultDose: 1000,
    maxDailyDose: 4000,
    frequency: "Every 6 hours",
    forms: [
      { name: "Tab Paracetamol 80 mg (Chewable)", type: "Tablet", dose: 80, unit: "mg" },
      { name: "Tab Paracetamol 125 mg (Chewable)", type: "Tablet", dose: 125, unit: "mg" },
      { name: "Tab Paracetamol 250 mg", type: "Tablet", dose: 250, unit: "mg" },
      { name: "Tab Paracetamol 500 mg", type: "Tablet", dose: 500, unit: "mg" },
      { name: "Tab Paracetamol 625 mg (Extended release)", type: "Tablet", dose: 625, unit: "mg", extendedRelease: true },
      { name: "Tab Paracetamol 650 mg (Extended release)", type: "Tablet", dose: 650, unit: "mg", extendedRelease: true },
      { name: "Tab Paracetamol 1 g (Effervescent)", type: "Tablet", dose: 1, unit: "mg", effervescent: true },
      { name: "Syp Paracetamol 60 mg/5 mL", type: "Syrup", dose: 60, strength: 12, unit: "mg/mL" },
      { name: "Syp Paracetamol 125 mg/5 mL", type: "Syrup", dose: 125, strength: 25, unit: "mg/mL" },
      { name: "Syp Paracetamol 250 mg/5 mL", type: "Syrup", dose: 250, strength: 50, unit: "mg/mL" },
      { name: "Susp Paracetamol 125 mg/5 mL", type: "Suspension", dose: 125, strength: 25, unit: "mg/mL" },
      { name: "Susp Paracetamol 250 mg/5 mL", type: "Suspension", dose: 250,strength: 50, unit: "mg/mL" }
    ],
    class: "Analgesic/Antipyretic"
  },

  "Ibuprofen": {
    adultDose: 400,
    maxDailyDose: 3200,
    frequency: "Every 6 hours",
    
    forms: [
      { name: "Tab Ibuprofen 100 mg (Chewable)", type: "Tablet", dose: 100, unit: "mg" },
      { name: "Tab Ibuprofen 200 mg", type: "Tablet", dose: 200, unit: "mg" },
      { name: "Tab Ibuprofen 300 mg", type: "Tablet", dose: 300, unit: "mg" },
      { name: "Tab Ibuprofen 400 mg", type: "Tablet", dose: 400, unit: "mg" },
      { name: "Tab Ibuprofen 600 mg (SR/OTC varies)", type: "Tablet", dose: 600, unit: "mg"},
      { name: "Tab Ibuprofen 800 mg (SR)", type: "Tablet", dose: 800, unit: "mg" },
      { name: "Syp Ibuprofen 100 mg/5 mL", type: "Syrup", dose: 100, strength: 20, unit: "mg/mL" },
      { name: "Syp Ibuprofen 200 mg/5 mL", type: "Syrup", dose: 200, strength: 40, unit: "mg/mL" },
      { name: "Susp Ibuprofen 50 mg/1.25 mL (drops)", type: "Suspension", dose: 50, strength: 40, unit: "mg/mL" },
      { name: "Susp Ibuprofen 100 mg/5 mL", type: "Suspension", dose: 100, strength: 20, unit: "mg/mL" },
      { name: "DT Ibuprofen 100 mg", type: "Dispersible Tablet", dose: 100, unit: "mg" }
    ],
    class: "NSAID"
  },

  // ---------------- Antibiotics ----------------
  "Cefixime": {
    adultDose: 200,
    maxDailyDose: 400,
    frequency: "Every 12–24 hours",
    forms: [
      { name: "Tab Cefixime 100 mg", type: "Tablet", dose: 100, unit: "mg" },
      { name: "Tab Cefixime 200 mg", type: "Tablet", dose: 200, unit: "mg" },
      { name: "Tab Cefixime 400 mg", type: "Tablet", dose: 400, unit: "mg" },
      { name: "Susp Cefixime 50 mg/5 mL", type: "Suspension", dose: 50, strength: 10, unit: "mg/mL" },
      { name: "Susp Cefixime 100 mg/5 mL", type: "Suspension", dose: 100, strength: 20, unit: "mg/mL" },
      { name: "DT Cefixime 100 mg", type: "Dispersible Tablet", dose: 100, unit: "mg" },
      { name: "DT Cefixime 200 mg", type: "Dispersible Tablet", dose: 200, unit: "mg" }
    ],
    class: "Antibiotic"
  },

  "Cefadroxil": {
    adultDose: 500,
    maxDailyDose: 2000,
    frequency: "Every 12 hours",
    forms: [
      { name: "Tab Cefadroxil 250 mg", type: "Tablet", dose: 250, unit: "mg" },
      { name: "Tab Cefadroxil 500 mg", type: "Tablet", dose: 500, unit: "mg" },
      { name: "Tab Cefadroxil 1 g", type: "Tablet", dose: 1, unit: "mg" },
      { name: "Syp Cefadroxil 125 mg/5 mL", type: "Syrup", dose: 125, strength: 25, unit: "mg/mL" },
      { name: "Susp Cefadroxil 125 mg/5 mL", type: "Suspension", dose: 125, strength: 25, unit: "mg/mL" },
      { name: "Susp Cefadroxil 250 mg/5 mL", type: "Suspension", dose: 250, strength: 50, unit: "mg/mL" },
      { name: "DT Cefadroxil 250 mg", type: "Dispersible Tablet", dose: 250, unit: "mg" }
    ],
    class: "Antibiotic"
  },

  "Azithromycin": {
    adultDose: 500,
    maxDailyDose: 500,
    frequency: "Once daily",
    forms: [
      { name: "Tab Azithromycin 250 mg", type: "Tablet", dose: 250, unit: "mg" },
      { name: "Tab Azithromycin 500 mg", type: "Tablet", dose: 500, unit: "mg" },
      { name: "Tab Azithromycin 600 mg", type: "Tablet", dose: 600, unit: "mg" },
      { name: "Tab Azithromycin 1 g", type: "Tablet", dose: 1, unit: "mg" },
      { name: "Syp Azithromycin 100 mg/5 mL", type: "Syrup", dose: 100, strength: 20, unit: "mg/mL" },
      { name: "Syp Azithromycin 200 mg/5 mL", type: "Syrup", dose: 200, strength: 40, unit: "mg/mL" },
      { name: "Susp Azithromycin 100 mg/5 mL", type: "Suspension", dose: 100, strength: 20, unit: "mg/mL" },
      { name: "Susp Azithromycin 200 mg/5 mL", type: "Suspension", dose: 200, strength: 40, unit: "mg/mL" },
      { name: "DT Azithromycin 250 mg", type: "Dispersible Tablet", dose: 250, unit: "mg" }
    ],
    class: "Antibiotic"
  },

  "Diclofenac": {
    adultDose: 50,
    maxDailyDose: 150,
    frequency: "Every 8 hours (3 times/day)",
    forms: [
      { name: "Tab Diclofenac 25 mg", type: "Tablet", dose: 25, unit: "mg" },
      { name: "Tab Diclofenac 50 mg", type: "Tablet", dose: 50, unit: "mg" },
      { name: "Tab Diclofenac SR 75 mg", type: "Tablet", dose: 75, unit: "mg" },
      { name: "Tab Diclofenac SR 100 mg", type: "Tablet", dose: 100, unit: "mg" },
      { name: "DT Diclofenac 25 mg", type: "Dispersible Tablet", dose: 25, unit: "mg" }
    ],
    class: "Antibiotic"
  },

  "Erythromycin": {
    adultDose: 250,
    maxDailyDose: 2000,
    frequency: "Every 6 hours",
    forms: [
      { name: "Tab Erythromycin 250 mg", type: "Tablet", dose: 250, unit: "mg" },
      { name: "Tab Erythromycin 500 mg", type: "Tablet", dose: 500, unit: "mg" },
      { name: "Syp Erythromycin 125 mg/5 mL", type: "Syrup", dose: 125, strength: 25, unit: "mg/mL" },
      { name: "Syp Erythromycin 250 mg/5 mL", type: "Syrup", dose: 250, strength: 50, unit: "mg/mL" },
      { name: "Susp Erythromycin 125 mg/5 mL", type: "Suspension", dose: 125, strength: 25, unit: "mg/mL" },
      { name: "Susp Erythromycin 250 mg/5 mL", type: "Suspension", dose: 250, strength: 50, unit: "mg/mL" },
      { name: "DT Erythromycin 125 mg", type: "Dispersible Tablet", dose: 125, unit: "mg" }
    ],
    class: "Antibiotic"
  },

  "Naproxen": {
    adultDose: 250,
    maxDailyDose: 500,
    frequency: "Every 12 hours (OTC)",
    forms: [
      { name: "Tab Naproxen 250 mg", type: "Tablet", dose: 250, unit: "mg" },
      { name: "Tab Naproxen 275 mg (OTC variant)", type: "Tablet", dose: 275, unit: "mg" },
      { name: "Tab Naproxen 375 mg (SR)", type: "Tablet", dose: 375, unit: "mg" },
      { name: "Tab Naproxen 500 mg", type: "Tablet", dose: 500, unit: "mg" },
      { name: "Susp Naproxen 125 mg/5 mL ", type: "Suspension", dose: 25, strength: 25, unit: "mg/mL" },
    ],
    class: "Antibiotic"
  },

  "Mefenamic Acid ": {
    adultDose: 250,
    maxDailyDose: 1000,
    frequency: "Every 6 hours",
    forms: [
      { name: "Tab Mefenamic acid 250 mg", type: "Tablet", dose: 250, unit: "mg" },
      { name: "Tab Mefenamic acid 500 mg", type: "Tablet", dose: 500, unit: "mg" },
      { name: "Syp Mefenamic acid 50 mg/5 mL", type: "Syrup", dose: 10, strength: 25, unit: "mg/mL" },
      { name: "Syp Mefenamic acid 100 mg/5", type: "Syrup", dose: 20, strength: 50, unit: "mg/mL" },
      { name: "DT Mefenamic acid 100 mg", type: "Dispersible Tablet", dose: 100, unit: "mg" }
    ],
    class: "Antibiotic"
  },

  "Clindamycin": {
    adultDose: 300,
    maxDailyDose: 900,
    frequency: "Every 8 hours",
    forms: [
      { name: "Tab Clindamycin 150 mg", type: "Tablet", dose: 150, unit: "mg" },
      { name: "Tab Clindamycin 300 mg", type: "Tablet", dose: 300, unit: "mg" },
      { name: "Tab Clindamycin 450 mg", type: "Tablet", dose: 450, unit: "mg" },
      { name: "Syp Clindamycin 75 mg/5 mL", type: "Syrup", dose: 75, strength: 15, unit: "mg/mL" },
      { name: "Syp Clindamycin 150 mg/5 mL", type: "Syrup", dose: 150, strength: 30, unit: "mg/mL" }
    ],
    class: "Antibiotic"
  },
  "Metronidazole": {
    adultDose: 400,
    maxDailyDose: 2400,
    frequency: "Every 8 hours",
    forms: [
      { name: "Tab Metronidazole 200 mg", type: "Tablet", dose: 200, unit: "mg" },
      { name: "Tab Metronidazole 400 mg", type: "Tablet", dose: 400, unit: "mg" },
      { name: "Tab Metronidazole 500 mg", type: "Tablet", dose: 500, unit: "mg" },
      { name: "Tab Metronidazole 600 mg", type: "Tablet", dose: 600, unit: "mg" },
      { name: "Syp Metronidazole 200 mg/5 mL", type: "Syrup", dose: 200, strength: 40, unit: "mg/mL" }
    ],
    class: "Antibiotic / Antiprotozoal"
  },

  "Doxycycline": {
    adultDose: 100,
    maxDailyDose: 200,
    frequency: "Once or twice daily",
    forms: [
      { name: "Tab Doxycycline 50 mg", type: "Tablet", dose: 50, unit: "mg" },
      { name: "Tab Doxycycline 100 mg", type: "Tablet", dose: 100, unit: "mg" },
	  { name: "Tab Doxycycline (modified release) 100 mg", type: "Tablet", dose: 100, unit: "mg" },
      { name: "Syp Doxycycline 25 mg/5 mL ", type: "Syrup", dose: 25,  strength: 5, unit: "mg/mL" },
      { name: "DT Doxycycline 100 mg", type: "Dispersible Tablet", dose: 100, unit: "mg" }
    ],
    class: "Antibiotic"
  },

  "Linezolid": {
    adultDose: 600,
    maxDailyDose: 1200,
    frequency: "Every 12 hours",
    forms: [
      { name: "Tab Linezolid 300 mg", type: "Tablet", dose: 300, unit: "mg" },
      { name: "Tab Linezolid 600 mg", type: "Tablet", dose: 600, unit: "mg" },
      { name: "Susp Linezolid 100 mg/5 mL", type: "Suspension", dose: 100, strength: 20, unit: "mg/mL" }
    ],
    class: "Antibiotic"
  },
  
  "Tramadol": {
    adultDose: 50,
    maxDailyDose: 400,
    frequency: "Every 4-6 hours",
    forms: [
      { name: "Tab Tramadol 50 mg (immediate release)", type: "Tablet", dose: 50, unit: "mg" },
      { name: "Tab Tramadol 100 mg (SR/ER variants)", type: "Tablet", dose: 100, unit: "mg" },
      { name: "Tab Tramadol 150 mg (SR/ER)", type: "Tablet", dose: 150, unit: "mg" }
    ],
    class: "Antibiotic"
  },

  "Ketorolac": {
    adultDose: 10,
    maxDailyDose: 40,
    frequency: "Every 6 hours",
    forms: [
      { name: "Tab Ketorolac 10 mg", type: "Tablet", dose: 10, unit: "mg" },
      { name: "Tab Ketorolac 20 mg", type: "Tablet", dose: 20, unit: "mg" },
    ],
    class: "Antibiotic"
  },
"Amoxicillin": {
  adultDose:500,
  maxDailyDose: 1500 ,
  frequency: "Every 8 hours",
  forms: [
    { name: "Tab Amoxicillin 125 mg", type: "Tablet", dose: 125, unit: "mg" },
    { name: "Tab Amoxicillin 250 mg", type: "Tablet", dose: 250, unit: "mg" },
    { name: "Tab Amoxicillin 500 mg", type: "Tablet", dose: 500, unit: "mg" },
    { name: "Tab Amoxicillin 875 mg", type: "Tablet", dose: 875, unit: "mg" },
    { name: "Tab Amoxicillin 1 g", type: "Tablet", dose: 1, unit: "mg" },
    
    { name: "Syp Amoxicillin 125 mg/5 mL", type: "Syrup", dose: 125,  "strength": 25, unit: "mg/mL" },
    { name: "Syp Amoxicillin 250 mg/5 mL", type: "Syrup", dose: 250, "strength": 50, unit: "mg/mL" },
    
    { name: "Susp Amoxicillin 125 mg/5 mL", type: "Suspension", dose: 125,  "strength": 25, unit: "mg/mL" },
    { name: "Susp Amoxicillin 250 mg/5 mL", type: "Suspension", dose: 250,  "strength": 50, unit: "mg/mL" }
  ],
  class: "Antibiotic (Beta-lactam, Penicillin group)"
},

  "Acyclovir": {
    adultDose: 400,
    maxDailyDose: 1200,
    frequency: "Every 8 hours",
    forms: [
      { name: "Tab Acyclovir 200 mg", type: "Tablet", dose: 200, unit: "mg" },
      { name: "Tab Acyclovir 400 mg", type: "Tablet", dose: 400, unit: "mg" },
      { name: "Tab Acyclovir 800 mg", type: "Tablet", dose: 800, unit: "mg" }
    ],
    class: "Antibiotic"
  },

  "Dexamethasone": {
    adultDose: 4,
    maxDailyDose: 4,
    frequency: "Every 8 hours",
    forms: [
      { name: "Tab Dexamethasone 0.5 mg", type: "Tablet", dose: 0.5, unit: "mg" },
      { name: "Tab Dexamethasone 1 mg", type: "Tablet", dose: 1, unit: "mg" },
      { name: "Tab Dexamethasone 2 mg", type: "Tablet", dose: 2, unit: "mg" },
	  { name: "Tab Dexamethasone 4 mg", type: "Tablet", dose: 4, unit: "mg" }
    ],
    class: "Antibiotic"
  },

};

export default function DosageCalculator() {
  const [selectedForm, setSelectedForm] = useState('');
  const [selectedDrug, setSelectedDrug] = useState('');
  const [method, setMethod] = useState<'weight' | 'age'>('weight');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [availableDrugs, setAvailableDrugs] = useState<Array<{name: string, drugName: string, formData: DrugForm}>>([]);
  const [result, setResult] = useState<any>(null);

  const forms = ['Tablet', 'Syrup', 'Suspension', 'Dispersible Tablet'];

  useEffect(() => {
    populateDrugs();
  }, [selectedForm]);

  const populateDrugs = () => {
    if (!selectedForm) {
      setAvailableDrugs([]);
      return;
    }

    let formulations: Array<{name: string, drugName: string, formData: DrugForm}> = [];
    Object.keys(drugData).forEach(drug => {
      drugData[drug].forms.forEach(formItem => {
        if (formItem.type === selectedForm) {
          formulations.push({ name: formItem.name, drugName: drug, formData: formItem });
        }
      });
    });
    
    formulations.sort((a, b) => a.name.localeCompare(b.name));
    setAvailableDrugs(formulations);
    setSelectedDrug('');
  };

  const calculateDosage = () => {
    if (!selectedDrug) {
      Alert.alert('Error', 'Please select a drug formulation.');
      return;
    }

    const selectedDrugData = availableDrugs.find(drug => drug.name === selectedDrug);
    if (!selectedDrugData) return;

    const { drugName, formData } = selectedDrugData;
    const drug = drugData[drugName];
    const adultDose = drug.adultDose;
    let childDose = 0;
    let weightValue = 0;
    let ageValue = 0;

    if (method === 'weight') {
      weightValue = parseFloat(weight);
      if (!weightValue || weightValue <= 0) {
        Alert.alert('Error', 'Please enter a valid weight.');
        return;
      }
      const weightLb = weightValue * 2.20462;
      childDose = (weightLb / 150) * adultDose;
    } else {
      ageValue = parseFloat(age);
      if (!ageValue || ageValue <= 0) {
        Alert.alert('Error', 'Please enter a valid age.');
        return;
      }
      childDose = (ageValue / (ageValue + 12)) * adultDose;
    }

    let volume = null;
    let percentageInfo = "";

    if (["Syrup", "Suspension"].includes(formData.type) && formData.strength) {
      volume = (childDose / formData.strength).toFixed(2);
    } else if (["Tablet", "Capsule", "Sachet"].includes(formData.type)) {
      const unitStrength = formData.dose;
      const totalPercent = (childDose / unitStrength) * 100;
      if (totalPercent >= 100) {
        const fullUnits = Math.floor(childDose / unitStrength);
        const remainderPercent = ((childDose % unitStrength) / unitStrength) * 100;
        percentageInfo = `${fullUnits} full + ${remainderPercent.toFixed(1)}%`;
      } else {
        percentageInfo = `${totalPercent.toFixed(1)}% of 1 unit`;
      }
    }

    setResult({
      drugName: formData.name,
      drugClass: drug.class,
      childDose: childDose.toFixed(2),
      unit: formData.unit,
      volume,
      percentageInfo,
      frequency: drug.frequency,
      maxDailyDose: drug.maxDailyDose,
      weight: weightValue,
      age: ageValue,
      method
    });
  };

  const resetForm = () => {
    setSelectedForm('');
    setSelectedDrug('');
    setWeight('');
    setAge('');
    setResult(null);
    setMethod('weight');
  };

  const goBack = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>

        <Text style={styles.title}>Pediatric Dosage Calculator</Text>
        <View style={styles.iconContainer}>
          <Pill size={32} color={colors.primary} />
        </View>
      </View>

      <View style={styles.disclaimerContainer}>
        <AlertTriangle size={20} color="#f97316" />
        <Text style={styles.disclaimerText}>
          This calculator is for educational purposes only and should not replace professional medical advice. Always consult a healthcare provider before administering medication.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Form</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedForm}
              onValueChange={(itemValue) => setSelectedForm(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="-- Select Form --" value="" />
              {forms.map((form) => (
                <Picker.Item key={form} label={form} value={form} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Drug Formulation</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDrug}
              onValueChange={(itemValue) => setSelectedDrug(itemValue)}
              style={styles.picker}
              enabled={availableDrugs.length > 0}
            >
              <Picker.Item label="-- Select Drug Formulation --" value="" />
              {availableDrugs.map((drug) => (
                <Picker.Item key={drug.name} label={drug.name} value={drug.name} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.methodToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, method === 'weight' && styles.toggleBtnActive]}
            onPress={() => setMethod('weight')}
          >
            <Weight size={20} color={method === 'weight' ? '#fff' : '#6b7280'} />
            <Text style={[styles.toggleText, method === 'weight' && styles.toggleTextActive]}>
              By Weight
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, method === 'age' && styles.toggleBtnActive]}
            onPress={() => setMethod('age')}
          >
            <Cake size={20} color={method === 'age' ? '#fff' : '#6b7280'} />
            <Text style={[styles.toggleText, method === 'age' && styles.toggleTextActive]}>
              By Age
            </Text>
          </TouchableOpacity>
        </View>

        {method === 'weight' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="Enter weight in kg"
              placeholderTextColor="#9ca3af"
            />
          </View>
        )}

        {method === 'age' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter Age (years)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="Enter age in years"
              placeholderTextColor="#9ca3af"
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={calculateDosage} activeOpacity={0.8}>
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              style={styles.calculateButton}
            >
              <Calculator size={20} color="#fff" />
              <Text style={styles.buttonText}>Calculate</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetForm} style={styles.resetButton}>
            <RotateCcw size={20} color="#6b7280" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Calculated Dosage</Text>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Drug Formulation:</Text>
              <Text style={styles.resultValue}>{result.drugName}</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Class:</Text>
              <Text style={styles.resultValue}>{result.drugClass}</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Child Dosage:</Text>
              <Text style={[styles.resultValue, styles.dosageValue]}>
                {result.childDose} {result.unit}
              </Text>
            </View>

            {result.volume && (
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Volume to Administer:</Text>
                <Text style={[styles.resultValue, styles.volumeValue]}>
                  {result.volume} mL
                </Text>
              </View>
            )}

            {result.percentageInfo && (
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Tablet/Solid Unit Equivalent:</Text>
                <Text style={styles.resultValue}>{result.percentageInfo}</Text>
              </View>
            )}

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Frequency:</Text>
              <Text style={styles.resultValue}>{result.frequency}</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Max Daily Dose:</Text>
              <Text style={styles.resultValue}>{result.maxDailyDose} {result.unit}</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>
                {result.method === 'weight' ? 'Weight:' : 'Age:'}
              </Text>
              <Text style={styles.resultValue}>
                {result.method === 'weight' ? `${result.weight} kg` : `${result.age} years`}
              </Text>
            </View>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff7ed',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
    marginBottom: 20,
    gap: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1f2937',
  },
  methodToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 16,
    color: '#6b7280',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  resetButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  resultContainer: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  resultValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
  dosageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  volumeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
});