
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated, Easing } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Pill, Weight, Cake, Calculator, RotateCcw, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native';

interface DrugForm {
  name: string;
  type: string;
  dose: number;
  unit: string;
  strength?: number;
  extendedRelease?: boolean;
  effervescent?: boolean;
}

interface ComboTablet {
  label: string;
  ibuPerTab?: number;
  paraPerTab?: number;
}

interface ComboLiquid {
  label: string;
  ibuPer5?: number;
  paraPer5?: number;
  ibuPerDose?: number;
  paraPerDose?: number;
  perDoseSize?: number;
}

interface Drug {
  name: string;
  type: 'single' | 'combo' | 'amoxClav';
  mgkgDose: [number, number];
  mgkgDay: [number, number];
  freqs: string[];
  tabs?: (number | string)[];
  syrups?: (number | string)[];
  susps?: (number | string)[];
  comboTablets?: ComboTablet[];
  comboSyrups?: ComboLiquid[];
  comboSusp?: ComboLiquid[];
  comboDT?: ComboTablet[];
  ageLimit?: number;
  note?: string;
  class?: string;
}

const COMPONENTS = {
  "Paracetamol": { mgkgDose: [10, 15], mgkgDay: [0, 60] },
  "Ibuprofen": { mgkgDose: [4, 10], mgkgDay: [0, 40] },
  "Amoxicillin_component": { mgkgDose: [12.5, 22.5], mgkgDay: [25, 45] }
};

const FREQS = {
  "q4h": { label: "q4h (6×/day)", perDay: 6 },
  "q6h": { label: "q6h (4×/day)", perDay: 4 },
  "q8h": { label: "q8h (3×/day)", perDay: 3 },
  "q12h": { label: "q12h (2×/day)", perDay: 2 },
  "q24h": { label: "q24h (1×/day)", perDay: 1 }
};

const DRUGS: Drug[] = [
  {
    name: "Paracetamol",
    type: "single",
    mgkgDose: [10, 15],
    mgkgDay: [0, 60],
    freqs: ["q4h", "q6h"],
    tabs: [80, 125, 250, 500, 625, 650, 1000],
    syrups: [120, 250],
    susps: [125, 250],
    note: "Paracetamol targets",
    class: "Analgesic/Antipyretic"
  },
  {
    name: "Ibuprofen",
    type: "single",
    mgkgDose: [4, 10],
    mgkgDay: [0, 40],
    freqs: ["q6h", "q8h"],
    tabs: [100, 200, 300, 400, 600, 800],
    syrups: [100, 200],
    susps: [100, 200],
    note: "NSAID cautions",
    class: "NSAID"
  },
  {
    name: "Ibugesic Plus (Ibuprofen+Paracetamol)",
    type: "combo",
    mgkgDose: [0, 0],
    mgkgDay: [0, 0],
    freqs: ["q6h", "q8h"],
    note: "Use component targets (Paracetamol 10–15 mg/kg, Ibuprofen 4–10 mg/kg).",
    comboTablets: [
      { label: "Tab Ibu 400 + Para 325", ibuPerTab: 400, paraPerTab: 325 },
      { label: "Tab Ibu 200 + Para 500", ibuPerTab: 200, paraPerTab: 500 }
    ],
    comboSyrups: [
      { label: "Syrup Ibu100 + Para125 per 5 mL", ibuPer5: 100, paraPer5: 125 }
    ],
    comboSusp: [
      { label: "Susp Ibu100 + Para162.5 per 5 mL", ibuPer5: 100, paraPer5: 162.5 },
      { label: "Drops: Ibu50 + Para125 per 1.25 mL", ibuPerDose: 50, paraPerDose: 125, perDoseSize: 1.25 }
    ],
    comboDT: [
      { label: "DT Ibu100 + Para162.5", ibuPerTab: 100, paraPerTab: 162.5 }
    ],
    class: "Combo Analgesic"
  },
  {
    name: "Amoxicillin + Clavulanate",
    type: "amoxClav",
    mgkgDose: [12.5, 22.5],
    mgkgDay: [25, 45],
    freqs: ["q12h"],
    tabs: ["250/125", "500/125", "875/125"],
    syrups: ["125/31.25"],
    susps: ["600/42.9"],
    note: "Dose by amoxicillin component (amox mg / clav mg shown)",
    class: "Antibiotic"
  },
  {
    name: "Cefixime",
    type: "single",
    mgkgDose: [8, 8],
    mgkgDay: [8, 8],
    freqs: ["q24h"],
    tabs: [100, 200, 400],
    syrups: [50, 100],
    susps: [50, 100],
    class: "Antibiotic"
  },
  {
    name: "Azithromycin",
    type: "single",
    mgkgDose: [10, 10],
    mgkgDay: [10, 12],
    freqs: ["q24h"],
    tabs: [250, 500, 600],
    syrups: [100, 200],
    susps: [100, 200],
    note: "Day1 10 mg/kg then 5 mg/kg OD days 2–4",
    class: "Antibiotic"
  },
  {
    name: "Doxycycline",
    type: "single",
    mgkgDose: [2.2, 2.2],
    mgkgDay: [4.4, 4.4],
    freqs: ["q12h"],
    tabs: [50, 100],
    syrups: [25],
    susps: [25],
    ageLimit: 8,
    note: "Avoid <8 y unless specialist",
    class: "Antibiotic"
  }
];

export default function PediatricDosageCalculator() {
  const [selectedDrug, setSelectedDrug] = useState<number>(0);
  const [method, setMethod] = useState<'mgkg' | 'clark'>('mgkg');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [frequency, setFrequency] = useState('');
  const [customFreq, setCustomFreq] = useState('');
  const [formType, setFormType] = useState('syrup');
  const [formStrength, setFormStrength] = useState('');
  const [result, setResult] = useState<any>(null);
  const [availableStrengths, setAvailableStrengths] = useState<Array<{label: string, value: string}>>([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const resultFadeAnim = useRef(new Animated.Value(0)).current;
  const resultScaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const formTypes = [
    { label: 'Syrup (mg/5 mL)', value: 'syrup' },
    { label: 'Suspension (mg/5 mL)', value: 'susp' },
    { label: 'Drops (mg per small dose)', value: 'drops' },
    { label: 'Tablet (per tab)', value: 'tablet' },
    { label: 'Combo liquid', value: 'combo_liquid' },
    { label: 'Combo tablet', value: 'combo_tablet' }
  ];

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();

    updateFreqOptions();
    updateFormOptions();
  }, [selectedDrug]);

  useEffect(() => {
    updateFormOptions();
  }, [formType]);

  const updateFreqOptions = () => {
    const drug = DRUGS[selectedDrug];
    if (drug && drug.freqs.length > 0) {
      setFrequency(drug.freqs[0]);
    }
  };

  const updateFormOptions = () => {
    const drug = DRUGS[selectedDrug];
    if (!drug) return;

    const strengths: Array<{label: string, value: string}> = [];

    if (drug.type === "combo") {
      if (formType === "tablet" || formType === "combo_tablet") {
        drug.comboTablets?.forEach((t, idx) => {
          strengths.push({ label: t.label, value: `tab:${idx}` });
        });
        drug.comboDT?.forEach((t, idx) => {
          strengths.push({ label: t.label, value: `dt:${idx}` });
        });
      }
      if (formType === "syrup" || formType === "combo_liquid") {
        drug.comboSyrups?.forEach((s, idx) => {
          strengths.push({ label: s.label, value: `syr:${idx}` });
        });
      }
      if (formType === "susp") {
        drug.comboSusp?.forEach((s, idx) => {
          strengths.push({ label: s.label, value: `susp:${idx}` });
        });
      }
    } else if (drug.type === "amoxClav") {
      if (formType === "tablet") {
        drug.tabs?.forEach(t => {
          strengths.push({ label: `${t} mg/tab (amox/clav)`, value: String(t) });
        });
      } else if (formType === "syrup") {
        drug.syrups?.forEach(s => {
          strengths.push({ label: `${s} mg/5 mL (amox/clav)`, value: String(s) });
        });
      } else if (formType === "susp") {
        drug.susps?.forEach(s => {
          strengths.push({ label: `${s} mg/5 mL (ES amox/clav)`, value: String(s) });
        });
      }
    } else {
      if (formType === "tablet") {
        drug.tabs?.forEach(t => {
          strengths.push({ label: `${t} mg`, value: String(t) });
        });
      } else if (formType === "syrup") {
        drug.syrups?.forEach(s => {
          strengths.push({ label: `${s} mg/5 mL`, value: String(s) });
        });
      } else if (formType === "susp") {
        drug.susps?.forEach(s => {
          strengths.push({ label: `${s} mg/5 mL`, value: String(s) });
        });
      } else if (formType === "drops") {
        strengths.push({ label: "Use product-specific drops", value: "drops" });
      }
    }

    setAvailableStrengths(strengths);
    setFormStrength(strengths.length > 0 ? strengths[0].value : '');
  };

  const round01 = (x: number) => Math.round(x * 10) / 10;
  const roundQuarter = (x: number) => Math.round(x * 4) / 4;
  const toLbs = (kg: number) => kg * 2.2046226218;

  const clarksRuleDose = (adultDoseMg: number, weightKg: number) => {
    const weightLbs = toLbs(weightKg);
    return adultDoseMg * (weightLbs / 150);
  };

  const getDosesPerDay = () => {
    const preset = FREQS[frequency as keyof typeof FREQS]?.perDay || 0;
    const custom = parseInt(customFreq);
    return (custom && !isNaN(custom) && custom > 0) ? custom : preset;
  };

  const parseAmoxClavString = (str: string) => {
    if (!str || typeof str !== "string") return null;
    const parts = str.split("/");
    const amox = parseFloat(parts[0]);
    const clav = parseFloat(parts[1]);
    return { amox, clav };
  };

  const calcSimple = (drug: Drug, wt: number) => {
    const perLow = drug.mgkgDose[0] * wt;
    const perHigh = drug.mgkgDose[1] * wt;
    const mid = (perLow + perHigh) / 2;
    const doses = getDosesPerDay();
    const total = mid * doses;
    return { perLow, perHigh, mid, doses, total };
  };

  const calcComboProduct = (drug: Drug, wt: number) => {
    const dosesPerDay = getDosesPerDay();
    const pTarget = (COMPONENTS.Paracetamol.mgkgDose[0] + COMPONENTS.Paracetamol.mgkgDose[1]) / 2 * wt;
    const iTarget = (COMPONENTS.Ibuprofen.mgkgDose[0] + COMPONENTS.Ibuprofen.mgkgDose[1]) / 2 * wt;

    const parts = formStrength.split(":");
    let achievedPara = 0, achievedIbu = 0, adminText = "", chosenVol = null, chosenTabs = null;

    if (parts[0] === "tab") {
      const idx = parseInt(parts[1]);
      const variant = drug.comboTablets?.[idx];
      if (variant) {
        if (method === "clark") {
          const childPara = clarksRuleDose(variant.paraPerTab || 0, wt);
          const childIbu = clarksRuleDose(variant.ibuPerTab || 0, wt);
          const tabsNeeded = Math.max(
            childPara / (variant.paraPerTab || 1),
            childIbu / (variant.ibuPerTab || 1)
          );
          chosenTabs = roundQuarter(tabsNeeded);
        } else {
          const tabsNeeded = Math.max(
            pTarget / (variant.paraPerTab || 1),
            iTarget / (variant.ibuPerTab || 1)
          );
          chosenTabs = roundQuarter(tabsNeeded);
        }
        achievedPara = (variant.paraPerTab || 0) * chosenTabs;
        achievedIbu = (variant.ibuPerTab || 0) * chosenTabs;
        adminText = `${chosenTabs} tab(s) (each: para ${variant.paraPerTab} mg / ibu ${variant.ibuPerTab} mg)`;
      }
    } else if (parts[0] === "syr") {
      const idx = parseInt(parts[1]);
      const variant = drug.comboSyrups?.[idx];
      if (variant) {
        const volForPara = pTarget / ((variant.paraPer5 || 0) / 5);
        const volForIbu = iTarget / ((variant.ibuPer5 || 0) / 5);
        const chosen = Math.max(volForPara, volForIbu);
        chosenVol = round01(chosen);
        achievedPara = ((variant.paraPer5 || 0) / 5) * chosenVol;
        achievedIbu = ((variant.ibuPer5 || 0) / 5) * chosenVol;
        adminText = `${chosenVol.toFixed(1)} mL per dose (combo syrup)`;
      }
    } else if (parts[0] === "susp") {
      const idx = parseInt(parts[1]);
      const variant = drug.comboSusp?.[idx];
      if (variant) {
        if (variant.perDoseSize && variant.perDoseSize === 1.25) {
          const countForPara = pTarget / (variant.paraPerDose || 1);
          const countForIbu = iTarget / (variant.ibuPerDose || 1);
          const needed = Math.max(countForPara, countForIbu);
          const neededRounded = Math.ceil(needed);
          chosenVol = neededRounded * variant.perDoseSize;
          achievedPara = (variant.paraPerDose || 0) * neededRounded;
          achievedIbu = (variant.ibuPerDose || 0) * neededRounded;
          adminText = `${chosenVol.toFixed(2)} mL (drops, ${neededRounded} units of ${variant.perDoseSize} mL)`;
        } else {
          const volForPara = pTarget / ((variant.paraPer5 || 0) / 5);
          const volForIbu = iTarget / ((variant.ibuPer5 || 0) / 5);
          const chosen = Math.max(volForPara, volForIbu);
          chosenVol = round01(chosen);
          achievedPara = ((variant.paraPer5 || 0) / 5) * chosenVol;
          achievedIbu = ((variant.ibuPer5 || 0) / 5) * chosenVol;
          adminText = `${chosenVol.toFixed(1)} mL per dose (combo suspension)`;
        }
      }
    }

    const totalPara = achievedPara * dosesPerDay;
    const totalIbu = achievedIbu * dosesPerDay;

    return {
      adminText,
      achievedPara,
      achievedIbu,
      totalPara,
      totalIbu,
      pTarget,
      iTarget,
      dosesPerDay
    };
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const animateResultIn = () => {
    Animated.parallel([
      Animated.timing(resultFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(resultScaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      })
    ]).start();
  };

  const calculateDosage = () => {
    if (!weight) {
      Alert.alert('Error', 'Please enter weight.');
      return;
    }

    const weightNum = parseFloat(weight);
    const ageNum = parseFloat(age);

    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid weight.');
      return;
    }

    const drug = DRUGS[selectedDrug];
    if (!drug) {
      Alert.alert('Error', 'Please select a medicine.');
      return;
    }

    // Age limit check
    if (drug.ageLimit && !isNaN(ageNum) && ageNum < drug.ageLimit) {
      Alert.alert('Warning', `${drug.name} is contraindicated for children under ${drug.ageLimit} years.`);
    }

    let calculationResult: any = {};

    if (drug.type === "combo") {
      const comboResult = calcComboProduct(drug, weightNum);
      calculationResult = {
        type: 'combo',
        drugName: drug.name,
        drugClass: drug.class,
        adminText: comboResult.adminText,
        achievedPara: comboResult.achievedPara,
        achievedIbu: comboResult.achievedIbu,
        totalPara: comboResult.totalPara,
        totalIbu: comboResult.totalIbu,
        pTarget: comboResult.pTarget,
        iTarget: comboResult.iTarget,
        frequency: FREQS[frequency as keyof typeof FREQS]?.label || frequency,
        weight: weightNum,
        age: ageNum,
        method,
        dosesPerDay: comboResult.dosesPerDay
      };
    } else if (drug.type === "amoxClav") {
      const res = calcSimple(drug, weightNum);
      let adminText = "—";
      
      if (formType === "tablet") {
        const parsed = parseAmoxClavString(formStrength);
        if (parsed && parsed.amox) {
          const tabsNeeded = roundQuarter(res.mid / parsed.amox);
          adminText = `${tabsNeeded} tab(s) of ${formStrength} (amox/clav)`;
        }
      } else if (formType === "syrup" || formType === "susp") {
        const parsed = parseAmoxClavString(formStrength);
        if (parsed && parsed.amox) {
          const mL = round01(res.mid / (parsed.amox / 5));
          adminText = `${mL.toFixed(1)} mL (based on ${parsed.amox} mg amox per 5 mL)`;
        }
      }

      calculationResult = {
        type: 'amoxClav',
        drugName: drug.name,
        drugClass: drug.class,
        doseRange: `${res.perLow.toFixed(0)}–${res.perHigh.toFixed(0)} mg (as amoxicillin)`,
        suggested: `${res.mid.toFixed(0)} mg (as amoxicillin)`,
        adminText,
        totalDay: `${(res.mid * res.doses).toFixed(0)} mg/day (amox component)`,
        frequency: FREQS[frequency as keyof typeof FREQS]?.label || frequency,
        weight: weightNum,
        age: ageNum,
        method
      };
    } else {
      const res = calcSimple(drug, weightNum);
      let adminText = "—";

      if (formType === "tablet" && formStrength) {
        const tabMg = parseFloat(formStrength);
        if (!isNaN(tabMg) && tabMg > 0) {
          const tabs = roundQuarter(res.mid / tabMg);
          adminText = `${tabs} tab(s) of ${tabMg} mg`;
        }
      } else if ((formType === "syrup" || formType === "susp") && formStrength) {
        const mgPer5 = parseFloat(formStrength);
        if (!isNaN(mgPer5) && mgPer5 > 0) {
          const mL = round01(res.mid / (mgPer5 / 5));
          adminText = `${mL.toFixed(1)} mL`;
        }
      } else if (formType === "drops" && formStrength === "drops") {
        adminText = "Use product-specific drops (no single generic strength)";
      }

      calculationResult = {
        type: 'single',
        drugName: drug.name,
        drugClass: drug.class,
        doseRange: `${res.perLow.toFixed(0)}–${res.perHigh.toFixed(0)} mg`,
        suggested: `${res.mid.toFixed(0)} mg`,
        adminText,
        totalDay: `${(res.mid * res.doses).toFixed(0)} mg/day`,
        frequency: FREQS[frequency as keyof typeof FREQS]?.label || frequency,
        weight: weightNum,
        age: ageNum,
        method
      };
    }

    setResult(calculationResult);
    animateResultIn();
  };

  const resetForm = () => {
    Animated.sequence([
      Animated.timing(resultFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(resultScaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setSelectedDrug(0);
      setWeight('');
      setAge('');
      setCustomFreq('');
      setResult(null);
      setMethod('mgkg');
      setFormType('syrup');
      setFormStrength('');
    });
  };

  const goBack = () => {
    router.back();
  };

  const currentDrug = DRUGS[selectedDrug];

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[styles.animatedContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Pediatric Dosage Calculator</Text>
        </View>

        <Animated.View style={[styles.disclaimerContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <AlertTriangle size={20} color="#e68a00" />
          <Text style={styles.disclaimerText}>
            This calculator is for educational purposes only and should not replace professional medical advice. Always consult a healthcare provider before administering medication.
          </Text>
        </Animated.View>

        <View style={styles.formContainer}>
          <View style={styles.gridContainer}>
            <Animated.View style={[styles.inputCard, styles.cardElevated]}>
              <View style={styles.labelContainer}>
                <Cake size={16} color="#0066cc" />
                <Text style={styles.label}>Age (years)</Text>
              </View>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="e.g., 5"
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.inputNote}>Age used for age-gates (doxycycline / tramadol warnings)</Text>
            </Animated.View>

            <Animated.View style={[styles.inputCard, styles.cardElevated]}>
              <View style={styles.labelContainer}>
                <Weight size={16} color="#0066cc" />
                <Text style={styles.label}>Weight (kg) *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="e.g., 15"
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.inputNote}>Weight used for mg/kg calculations</Text>
            </Animated.View>

            <Animated.View style={[styles.inputCard, styles.cardElevated]}>
              <View style={styles.labelContainer}>
                <Pill size={16} color="#0066cc" />
                <Text style={styles.label}>Medicine</Text>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDrug}
                  onValueChange={(itemValue) => setSelectedDrug(itemValue)}
                  style={styles.picker}
                >
                  {DRUGS.map((drug, index) => (
                    <Picker.Item 
                      key={index} 
                      label={drug.name} 
                      value={index} 
                      color="#0b1a2b"
                    />
                  ))}
                </Picker>
              </View>
              {currentDrug?.note && (
                <Text style={styles.inputNote}>{currentDrug.note}</Text>
              )}
            </Animated.View>

            <Animated.View style={[styles.inputCard, styles.cardElevated]}>
              <View style={styles.labelContainer}>
                <Calculator size={16} color="#0066cc" />
                <Text style={styles.label}>Calculation method</Text>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={method}
                  onValueChange={(itemValue) => setMethod(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="mg/kg (AAPD targets)" value="mgkg" color="#0b1a2b" />
                  <Picker.Item label="Clark's Rule (derive from adult dose)" value="clark" color="#0b1a2b" />
                </Picker>
              </View>
              <Text style={styles.inputNote}>Clark's Rule uses adult product dose × (weight (lbs)/150).</Text>
            </Animated.View>

            <Animated.View style={[styles.inputCard, styles.cardElevated]}>
              <Text style={styles.label}>Frequency</Text>
              <View style={styles.rowContainer}>
                <View style={[styles.pickerContainer, { flex: 2 }]}>
                  <Picker
                    selectedValue={frequency}
                    onValueChange={(itemValue) => setFrequency(itemValue)}
                    style={styles.picker}
                  >
                    {currentDrug?.freqs.map((freq) => (
                      <Picker.Item 
                        key={freq} 
                        label={FREQS[freq as keyof typeof FREQS]?.label || freq} 
                        value={freq} 
                        color="#0b1a2b"
                      />
                    ))}
                  </Picker>
                </View>
                <TextInput
                  style={[styles.input, styles.customFreqInput]}
                  value={customFreq}
                  onChangeText={setCustomFreq}
                  keyboardType="numeric"
                  placeholder="custom/day"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <Text style={styles.inputNote}>Leave custom empty to use the preset frequency.</Text>
            </Animated.View>

            <Animated.View style={[styles.inputCard, styles.cardElevated]}>
              <Text style={styles.label}>Formulation</Text>
              <View style={styles.columnContainer}>
                <View style={[styles.pickerContainer, { marginBottom: 8 }]}>
                  <Picker
                    selectedValue={formType}
                    onValueChange={(itemValue) => setFormType(itemValue)}
                    style={styles.picker}
                  >
                    {formTypes.map((type) => (
                      <Picker.Item key={type.value} label={type.label} value={type.value} color="#0b1a2b" />
                    ))}
                  </Picker>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formStrength}
                    onValueChange={(itemValue) => setFormStrength(itemValue)}
                    style={styles.picker}
                  >
                    {availableStrengths.map((strength) => (
                      <Picker.Item key={strength.value} label={strength.label} value={strength.value} color="#0b1a2b" />
                    ))}
                  </Picker>
                </View>
              </View>
              {currentDrug?.type === "amoxClav" && (
                <Text style={styles.inputNote}>Conversions use the amoxicillin component.</Text>
              )}
            </Animated.View>
          </View>

          <View style={styles.buttonContainer}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                onPress={() => {
                  animateButtonPress();
                  calculateDosage();
                }} 
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#0066cc', '#004499']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.calculateButton}
                >
                  <Calculator size={20} color="#fff" />
                  <Text style={styles.buttonText}>Calculate Dosage</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity 
              onPress={resetForm} 
              style={styles.resetButton}
              activeOpacity={0.7}
            >
              <RotateCcw size={20} color="#6b7280" />
              <Text style={styles.resetButtonText}>Reset Form</Text>
            </TouchableOpacity>
          </View>

          {result && (
            <Animated.View style={[styles.resultContainer, {
              opacity: resultFadeAnim,
              transform: [{ scale: resultScaleAnim }]
            }]}>
              <Text style={styles.resultTitle}>📊 Calculated Dosage</Text>
              
              <View style={styles.kpiContainer}>
                {result.type === 'combo' ? (
                  <>
                    <View style={[styles.kpiPill, styles.kpiElevated]}>
                      <Text style={styles.kpiLabel}>Per-dose range</Text>
                      <Text style={styles.kpiValue}>
                        Para: {(COMPONENTS.Paracetamol.mgkgDose[0] * parseFloat(weight)).toFixed(0)}–{(COMPONENTS.Paracetamol.mgkgDose[1] * parseFloat(weight)).toFixed(0)} mg
                      </Text>
                      <Text style={styles.kpiValue}>
                        Ibu: {(COMPONENTS.Ibuprofen.mgkgDose[0] * parseFloat(weight)).toFixed(0)}–{(COMPONENTS.Ibuprofen.mgkgDose[1] * parseFloat(weight)).toFixed(0)} mg
                      </Text>
                    </View>
                    <View style={[styles.kpiPill, styles.kpiElevated]}>
                      <Text style={styles.kpiLabel}>Suggested</Text>
                      <Text style={styles.kpiValue}>
                        Para: {Math.round(result.pTarget)} mg
                      </Text>
                      <Text style={styles.kpiValue}>
                        Ibu: {Math.round(result.iTarget)} mg
                      </Text>
                    </View>
                    <View style={[styles.kpiPill, styles.kpiElevated]}>
                      <Text style={styles.kpiLabel}>Administer</Text>
                      <Text style={styles.kpiValue}>{result.adminText}</Text>
                    </View>
                    <View style={[styles.kpiPill, styles.kpiElevated]}>
                      <Text style={styles.kpiLabel}>Total /24h</Text>
                      <Text style={styles.kpiValue}>
                        Para: {result.totalPara.toFixed(0)} mg
                      </Text>
                      <Text style={styles.kpiValue}>
                        Ibu: {result.totalIbu.toFixed(0)} mg
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={[styles.kpiPill, styles.kpiElevated]}>
                      <Text style={styles.kpiLabel}>Per-dose range</Text>
                      <Text style={styles.kpiValue}>{result.doseRange}</Text>
                    </View>
                    <View style={[styles.kpiPill, styles.kpiElevated]}>
                      <Text style={styles.kpiLabel}>Suggested</Text>
                      <Text style={styles.kpiValue}>{result.suggested}</Text>
                    </View>
                    <View style={[styles.kpiPill, styles.kpiElevated]}>
                      <Text style={styles.kpiLabel}>Administer</Text>
                      <Text style={styles.kpiValue}>{result.adminText}</Text>
                    </View>
                    <View style={[styles.kpiPill, styles.kpiElevated]}>
                      <Text style={styles.kpiLabel}>Total /24h</Text>
                      <Text style={styles.kpiValue}>{result.totalDay}</Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.resultDetails}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Drug:</Text>
                  <Text style={styles.resultValue}>{result.drugName}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Class:</Text>
                  <Text style={styles.resultValue}>{result.drugClass}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Method:</Text>
                  <Text style={styles.resultValue}>{result.method}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Frequency:</Text>
                  <Text style={styles.resultValue}>{result.frequency}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Weight:</Text>
                  <Text style={styles.resultValue}>{result.weight} kg</Text>
                </View>
                {result.age && (
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Age:</Text>
                    <Text style={styles.resultValue}>{result.age} years</Text>
                  </View>
                )}
              </View>

              {result.type === 'combo' && (
                <View style={styles.comboDetails}>
                  <Text style={styles.comboDetailsTitle}>Combo calculation details (target vs achieved)</Text>
                  <View style={styles.comboTable}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderText}>Component</Text>
                      <Text style={styles.tableHeaderText}>Target/dose</Text>
                      <Text style={styles.tableHeaderText}>Achieved/dose</Text>
                      <Text style={styles.tableHeaderText}>% of target</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCellText}>Paracetamol</Text>
                      <Text style={styles.tableCellText}>{Math.round(result.pTarget)} mg</Text>
                      <Text style={styles.tableCellText}>{Math.round(result.achievedPara)} mg</Text>
                      <Text style={styles.tableCellText}>
                        {result.pTarget > 0 ? (result.achievedPara / result.pTarget * 100).toFixed(0) : 0}%
                      </Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCellText}>Ibuprofen</Text>
                      <Text style={styles.tableCellText}>{Math.round(result.iTarget)} mg</Text>
                      <Text style={styles.tableCellText}>{Math.round(result.achievedIbu)} mg</Text>
                      <Text style={styles.tableCellText}>
                        {result.iTarget > 0 ? (result.achievedIbu / result.iTarget * 100).toFixed(0) : 0}%
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </Animated.View>
          )}
        </View>

        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>
            Designed & Developed by <Text style={styles.footerLink}>Dr Aafirin...</Text>
          </Text>
        </View> */}
        
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2fb',
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0b1a2b',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.5,
    
  },
  subtitle: {
    textAlign: 'center',
    color: '#4a6078',
    fontSize: 14,
    marginBottom: 16,
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
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e68a00',
    marginBottom: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  gridContainer: {
    gap: 16,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2f0fb',
  },
  cardElevated: {
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e40af',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2f0fb',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#0b1a2b',
    fontWeight: '500',
  },
  inputNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#e2f0fb',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#0b1a2b',
    fontWeight: '500',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  columnContainer: {
    gap: 8,
  },
  customFreqInput: {
    flex: 1,
    height: 50,
  },
  buttonContainer: {
    gap: 16,
    marginTop: 32,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  resetButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 32,
    padding: 24,
    backgroundColor: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#dbeafe',
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  kpiPill: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    minWidth: 160,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  kpiElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  kpiLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4a6078',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0b1a2b',
    textAlign: 'center',
    lineHeight: 22,
  },
  resultDetails: {
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2f0fb',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  resultValue: {
    fontSize: 15,
    color: '#0b1a2b',
    fontWeight: '700',
  },
  comboDetails: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2f0fb',
  },
  comboDetailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  comboTable: {
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1e40af',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2f0fb',
    backgroundColor: '#ffffff',
  },
  tableCellText: {
    flex: 1,
    fontSize: 14,
    color: '#0b1a2b',
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#4a6078',
    fontWeight: '500',
  },
  footerLink: {
    color: '#0066cc',
    fontWeight: '700',
  },
});