import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Plus,
  Trash2,
  CreditCard as Edit3,
  X,
  User,
  Calendar,
  MapPin,
  Phone,
  Briefcase,
  Heart,
  FileText,
  Eye,
  Stethoscope,
  Activity,
  Clipboard,
  Camera,
  Upload,
  Grid3x3,
  ChevronLeft
} from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import EmptyState from '@/components/common/EmptyState';
import * as ImagePicker from 'expo-image-picker';

interface HealthRecord {
  id: string;
  // Demographic Details
  patientName: string;
  age: number;
  dateOfBirth: string;
  sex: 'Male' | 'Female' | 'Other';
  address: string;

  // Chief Complaint & History
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  pastDentalHistory: string;

  // Personal History
  oralHygieneProgram: string;
  toothBrushingAid: string;
  duration: string;
  frequency: string;
  technique: string;
  toothPasteUsed: string;
  otherOralHygieneAids: string;
  abnormalOralHabits: string;

  // Diet History
  dietDiary: string;
  vegNonVegMixed: string;
  recall24Hour: string;
  dietCounseling: string;

  // Behaviour Rating
  behaviourRatingScale: string;
  behaviourManagement: string;

  // General Examination
  statureBuilt: string;
  height: string;
  weight: string;
  gait: string;
  speech: string;
  temperature: string;
  pulse: string;
  bp: string;

  // Extra Oral Examination
  headForm: string;
  cephalicIndex: string;
  faceShape: string;
  faceProfile: string;
  faceSymmetry: string;
  faceHeight: string;
  faceDivergence: string;
  lymphNodes: string;
  tmj: string;
  mouthOpening: string;
  swallow: string;
  lipCompetence: string;
  nasoLabialAngle: string;
  chin: string;

  // Soft Tissue Examination
  lips: string;
  labialBuccalMucosa: string;
  frenum: string;
  tongue: string;
  palate: string;
  floorOfMouth: string;

  // Gingiva
  gingivaColor: string;
  gingivaSize: string;
  gingivaContour: string;
  gingivaShape: string;
  gingivaConsistency: string;
  gingivaSurfaceTexture: string;
  gingivaPosition: string;
  gingivaStippling: string;
  bleedingOnProbing: string;
  periodontalEvaluation: string;

  // Hard Tissue Examination
  dentition: string;
  teethNumber: string;
  malformation: string;
  teethPresent: string;
  teethMissing: string;
  dentalCaries: string;
  deepCaries: string;
  fracturedTeeth: string;
  retainedTeeth: string;
  mobility: string;
  orthodonticProblem: string;
  otherDentalAnomalies: string;
  fluorosis: string;

  // Occlusal Relationship
  primaryMolarLeft: string;
  primaryMolarRight: string;
  permanentMolarLeft: string;
  permanentMolarRight: string;
  overJet: string;
  overBite: string;
  otherMalocclusionFindings: string;

  // Diagnosis & Treatment
  provisionalDiagnosis: string;
  radiographicFindings: string;
  pulpVitality: string;
  finalDiagnosis: string;
  treatmentPlan: string;
  treatmentDone: string;

  // FDI Chart Data
  fdiChartData: { [key: string]: string };

  // Photos
  photos: string[];

  createdDate: string;
  createdBy: string;
  patientId: string;
}

export default function HealthRecordScreen() {
  const router = useRouter();
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      patientName: 'John Smith',
      age: 35,
      dateOfBirth: '1989-05-15',
      sex: 'Male',
      address: '123 Main St, City, State 12345',
      chiefComplaint: 'Severe toothache in upper right molar',
      historyOfPresentIllness:
        'Patient reports sharp, throbbing pain that started 3 days ago. Pain worsens with hot/cold foods.',
      pastMedicalHistory:
        'Hypertension, controlled with medication. No known allergies.',
      pastDentalHistory: 'Regular dental checkups. Last cleaning 6 months ago.',
      oralHygieneProgram: 'Brushing twice daily',
      toothBrushingAid: 'Manual toothbrush',
      duration: '2 minutes',
      frequency: 'Twice daily',
      technique: 'Modified Bass technique',
      toothPasteUsed: 'Fluoride toothpaste',
      otherOralHygieneAids: 'Dental floss',
      abnormalOralHabits: 'None reported',
      dietDiary: 'Regular meals, occasional sweets',
      vegNonVegMixed: 'Mixed',
      recall24Hour:
        'Breakfast: Toast, coffee; Lunch: Sandwich; Dinner: Rice, vegetables',
      dietCounseling: 'Advised to reduce sugar intake',
      behaviourRatingScale: 'Cooperative',
      behaviourManagement: 'Tell-show-do technique',
      statureBuilt: 'Average',
      height: '175 cm',
      weight: '75 kg',
      gait: 'Normal',
      speech: 'Clear',
      temperature: '98.6°F',
      pulse: '72 bpm',
      bp: '120/80 mmHg',
      headForm: 'Normal',
      cephalicIndex: 'Mesocephalic',
      faceShape: 'Oval',
      faceProfile: 'Straight',
      faceSymmetry: 'Symmetrical',
      faceHeight: 'Normal',
      faceDivergence: 'Normal',
      lymphNodes: 'Non-palpable',
      tmj: 'Normal function',
      mouthOpening: '45mm',
      swallow: 'Normal',
      lipCompetence: 'Competent',
      nasoLabialAngle: '90 degrees',
      chin: 'Normal',
      lips: 'Normal color and texture',
      labialBuccalMucosa: 'Pink, moist',
      frenum: 'Normal attachment',
      tongue: 'Normal size and mobility',
      palate: 'Normal arch form',
      floorOfMouth: 'Normal',
      gingivaColor: 'Pink',
      gingivaSize: 'Normal',
      gingivaContour: 'Scalloped',
      gingivaShape: 'Knife-edge',
      gingivaConsistency: 'Firm',
      gingivaSurfaceTexture: 'Stippled',
      gingivaPosition: 'Normal',
      gingivaStippling: 'Present',
      bleedingOnProbing: 'Minimal',
      periodontalEvaluation: 'Mild gingivitis',
      dentition: 'Permanent',
      teethNumber: '28',
      malformation: 'None',
      teethPresent: '28 teeth present',
      teethMissing: 'Third molars',
      dentalCaries: 'Tooth #3 - large carious lesion',
      deepCaries: 'Tooth #3',
      fracturedTeeth: 'None',
      retainedTeeth: 'None',
      mobility: 'Grade 0',
      orthodonticProblem: 'Mild crowding',
      otherDentalAnomalies: 'None',
      fluorosis: 'None',
      primaryMolarLeft: 'N/A',
      primaryMolarRight: 'N/A',
      permanentMolarLeft: 'Class I',
      permanentMolarRight: 'Class I',
      overJet: '3mm',
      overBite: '2mm',
      otherMalocclusionFindings: 'Mild anterior crowding',
      provisionalDiagnosis: 'Acute pulpitis tooth #3',
      radiographicFindings: 'Periapical radiolucency visible on tooth #3',
      pulpVitality: 'Non-vital tooth #3',
      finalDiagnosis: 'Acute pulpitis tooth #3 with periapical periodontitis',
      treatmentPlan: 'Root canal therapy followed by crown restoration',
      treatmentDone: 'Initial examination completed',
      fdiChartData: {
        '11': 'D',
        '21': 'R',
        '16': 'M',
        '26': 'GD',
      },
      photos: [
        'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg',
        'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg',
      ],
      createdDate: '2025-01-15',
      createdBy: 'Dr. Aafirin',
      patientId: 'patient_001',
    },
  ]);

  const [formData, setFormData] = useState<{
    [key: string]: any;
    photos: string[];
    fdiChartData: { [key: string]: string };
    sex: 'Male' | 'Female' | 'Other';
  }>({
    // Demographic Details
    patientName: '',
    age: '',
    dateOfBirth: '',
    sex: 'Male' as 'Male' | 'Female' | 'Other',
    address: '',
    // Chief Complaint & History
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    pastDentalHistory: '',
    // Personal History
    oralHygieneProgram: '',
    toothBrushingAid: '',
    duration: '',
    frequency: '',
    technique: '',
    toothPasteUsed: '',
    otherOralHygieneAids: '',
    abnormalOralHabits: '',
    // Diet History
    dietDiary: '',
    vegNonVegMixed: '',
    recall24Hour: '',
    dietCounseling: '',
    // Behaviour Rating
    behaviourRatingScale: '',
    behaviourManagement: '',
    // General Examination
    statureBuilt: '',
    height: '',
    weight: '',
    gait: '',
    speech: '',
    temperature: '',
    pulse: '',
    bp: '',
    // Extra Oral Examination
    headForm: '',
    cephalicIndex: '',
    faceShape: '',
    faceProfile: '',
    faceSymmetry: '',
    faceHeight: '',
    faceDivergence: '',
    lymphNodes: '',
    tmj: '',
    mouthOpening: '',
    swallow: '',
    lipCompetence: '',
    nasoLabialAngle: '',
    chin: '',
    // Soft Tissue Examination
    lips: '',
    labialBuccalMucosa: '',
    frenum: '',
    tongue: '',
    palate: '',
    floorOfMouth: '',
    // Gingiva
    gingivaColor: '',
    gingivaSize: '',
    gingivaContour: '',
    gingivaShape: '',
    gingivaConsistency: '',
    gingivaSurfaceTexture: '',
    gingivaPosition: '',
    gingivaStippling: '',
    bleedingOnProbing: '',
    periodontalEvaluation: '',
    // Hard Tissue Examination
    dentition: '',
    teethNumber: '',
    malformation: '',
    teethPresent: '',
    teethMissing: '',
    dentalCaries: '',
    deepCaries: '',
    fracturedTeeth: '',
    retainedTeeth: '',
    mobility: '',
    orthodonticProblem: '',
    otherDentalAnomalies: '',
    fluorosis: '',
    // Occlusal Relationship
    primaryMolarLeft: '',
    primaryMolarRight: '',
    permanentMolarLeft: '',
    permanentMolarRight: '',
    overJet: '',
    overBite: '',
    otherMalocclusionFindings: '',
    // Diagnosis & Treatment
    provisionalDiagnosis: '',
    radiographicFindings: '',
    pulpVitality: '',
    finalDiagnosis: '',
    treatmentPlan: '',
    treatmentDone: '',
    // FDI Chart Data
    fdiChartData: {},
    // Photos
    photos: [],
  });

  // Filter records based on user role
  const filteredRecords = healthRecords.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.finalDiagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    // Patients can only see their own records
const filteredRecords = healthRecords.filter((record) => {
  const matchesSearch =
    record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.finalDiagnosis.toLowerCase().includes(searchQuery.toLowerCase());

  // Patients can only see their own records
  if (userData?.role === 'patient') {
   return matchesSearch && record.patientId === userData.uid;
  }

  // Doctors can see all records
  return matchesSearch;
});

    // Doctors can see all records
    return matchesSearch;
  });

  const resetForm = () => {
    setFormData({
      patientName: '',
      age: '',
      dateOfBirth: '',
      sex: 'Male',
      address: '',
      chiefComplaint: '',
      historyOfPresentIllness: '',
      pastMedicalHistory: '',
      pastDentalHistory: '',
      oralHygieneProgram: '',
      toothBrushingAid: '',
      duration: '',
      frequency: '',
      technique: '',
      toothPasteUsed: '',
      otherOralHygieneAids: '',
      abnormalOralHabits: '',
      dietDiary: '',
      vegNonVegMixed: '',
      recall24Hour: '',
      dietCounseling: '',
      behaviourRatingScale: '',
      behaviourManagement: '',
      statureBuilt: '',
      height: '',
      weight: '',
      gait: '',
      speech: '',
      temperature: '',
      pulse: '',
      bp: '',
      headForm: '',
      cephalicIndex: '',
      faceShape: '',
      faceProfile: '',
      faceSymmetry: '',
      faceHeight: '',
      faceDivergence: '',
      lymphNodes: '',
      tmj: '',
      mouthOpening: '',
      swallow: '',
      lipCompetence: '',
      nasoLabialAngle: '',
      chin: '',
      lips: '',
      labialBuccalMucosa: '',
      frenum: '',
      tongue: '',
      palate: '',
      floorOfMouth: '',
      gingivaColor: '',
      gingivaSize: '',
      gingivaContour: '',
      gingivaShape: '',
      gingivaConsistency: '',
      gingivaSurfaceTexture: '',
      gingivaPosition: '',
      gingivaStippling: '',
      bleedingOnProbing: '',
      periodontalEvaluation: '',
      dentition: '',
      teethNumber: '',
      malformation: '',
      teethPresent: '',
      teethMissing: '',
      dentalCaries: '',
      deepCaries: '',
      fracturedTeeth: '',
      retainedTeeth: '',
      mobility: '',
      orthodonticProblem: '',
      otherDentalAnomalies: '',
      fluorosis: '',
      primaryMolarLeft: '',
      primaryMolarRight: '',
      permanentMolarLeft: '',
      permanentMolarRight: '',
      overJet: '',
      overBite: '',
      otherMalocclusionFindings: '',
      provisionalDiagnosis: '',
      radiographicFindings: '',
      pulpVitality: '',
      finalDiagnosis: '',
      treatmentPlan: '',
      treatmentDone: '',
      fdiChartData: {},
      photos: [],
    });
    setEditingRecord(null);
  };

  const handleCreateRecord = () => {
    if (!formData.patientName || !formData.age) {
      Alert.alert('Error', 'Please fill in at least Patient Name and Age');
      return;
    }

    const newRecord: HealthRecord = {
      id: editingRecord ? editingRecord.id : Date.now().toString(),
      patientName: formData.patientName,
      age: parseInt(formData.age) || 0,
      dateOfBirth: formData.dateOfBirth,
      sex: formData.sex,
      address: formData.address,
      chiefComplaint: formData.chiefComplaint,
      historyOfPresentIllness: formData.historyOfPresentIllness,
      pastMedicalHistory: formData.pastMedicalHistory,
      pastDentalHistory: formData.pastDentalHistory,
      oralHygieneProgram: formData.oralHygieneProgram,
      toothBrushingAid: formData.toothBrushingAid,
      duration: formData.duration,
      frequency: formData.frequency,
      technique: formData.technique,
      toothPasteUsed: formData.toothPasteUsed,
      otherOralHygieneAids: formData.otherOralHygieneAids,
      abnormalOralHabits: formData.abnormalOralHabits,
      dietDiary: formData.dietDiary,
      vegNonVegMixed: formData.vegNonVegMixed,
      recall24Hour: formData.recall24Hour,
      dietCounseling: formData.dietCounseling,
      behaviourRatingScale: formData.behaviourRatingScale,
      behaviourManagement: formData.behaviourManagement,
      statureBuilt: formData.statureBuilt,
      height: formData.height,
      weight: formData.weight,
      gait: formData.gait,
      speech: formData.speech,
      temperature: formData.temperature,
      pulse: formData.pulse,
      bp: formData.bp,
      headForm: formData.headForm,
      cephalicIndex: formData.cephalicIndex,
      faceShape: formData.faceShape,
      faceProfile: formData.faceProfile,
      faceSymmetry: formData.faceSymmetry,
      faceHeight: formData.faceHeight,
      faceDivergence: formData.faceDivergence,
      lymphNodes: formData.lymphNodes,
      tmj: formData.tmj,
      mouthOpening: formData.mouthOpening,
      swallow: formData.swallow,
      lipCompetence: formData.lipCompetence,
      nasoLabialAngle: formData.nasoLabialAngle,
      chin: formData.chin,
      lips: formData.lips,
      labialBuccalMucosa: formData.labialBuccalMucosa,
      frenum: formData.frenum,
      tongue: formData.tongue,
      palate: formData.palate,
      floorOfMouth: formData.floorOfMouth,
      gingivaColor: formData.gingivaColor,
      gingivaSize: formData.gingivaSize,
      gingivaContour: formData.gingivaContour,
      gingivaShape: formData.gingivaShape,
      gingivaConsistency: formData.gingivaConsistency,
      gingivaSurfaceTexture: formData.gingivaSurfaceTexture,
      gingivaPosition: formData.gingivaPosition,
      gingivaStippling: formData.gingivaStippling,
      bleedingOnProbing: formData.bleedingOnProbing,
      periodontalEvaluation: formData.periodontalEvaluation,
      dentition: formData.dentition,
      teethNumber: formData.teethNumber,
      malformation: formData.malformation,
      teethPresent: formData.teethPresent,
      teethMissing: formData.teethMissing,
      dentalCaries: formData.dentalCaries,
      deepCaries: formData.deepCaries,
      fracturedTeeth: formData.fracturedTeeth,
      retainedTeeth: formData.retainedTeeth,
      mobility: formData.mobility,
      orthodonticProblem: formData.orthodonticProblem,
      otherDentalAnomalies: formData.otherDentalAnomalies,
      fluorosis: formData.fluorosis,
      primaryMolarLeft: formData.primaryMolarLeft,
      primaryMolarRight: formData.primaryMolarRight,
      permanentMolarLeft: formData.permanentMolarLeft,
      permanentMolarRight: formData.permanentMolarRight,
      overJet: formData.overJet,
      overBite: formData.overBite,
      otherMalocclusionFindings: formData.otherMalocclusionFindings,
      provisionalDiagnosis: formData.provisionalDiagnosis,
      radiographicFindings: formData.radiographicFindings,
      pulpVitality: formData.pulpVitality,
      finalDiagnosis: formData.finalDiagnosis,
      treatmentPlan: formData.treatmentPlan,
      treatmentDone: formData.treatmentDone,
      fdiChartData: formData.fdiChartData,
      photos: formData.photos,
      createdDate: editingRecord
        ? editingRecord.createdDate
        : new Date().toISOString().split('T')[0],
      createdBy: userData?.name || userData?.name || 'Unknown',
      patientId: userData?.role === 'patient' ? userData.uid : `patient_${Date.now()}`,
    };

    if (editingRecord) {
      setHealthRecords((prev) =>
        prev.map((r) => (r.id === editingRecord.id ? newRecord : r))
      );
      Alert.alert('Success', 'Health record updated successfully');
    } else {
      setHealthRecords((prev) => [...prev, newRecord]);
      Alert.alert('Success', 'Health record created successfully');
    }

    setShowCreateModal(false);
    resetForm();
  };

  const handleEditRecord = (record: HealthRecord) => {
    setEditingRecord(record);
    setFormData({
      patientName: record.patientName,
      age: record.age.toString(),
      dateOfBirth: record.dateOfBirth,
      sex: record.sex,
      address: record.address,
      chiefComplaint: record.chiefComplaint,
      historyOfPresentIllness: record.historyOfPresentIllness,
      pastMedicalHistory: record.pastMedicalHistory,
      pastDentalHistory: record.pastDentalHistory,
      oralHygieneProgram: record.oralHygieneProgram,
      toothBrushingAid: record.toothBrushingAid,
      duration: record.duration,
      frequency: record.frequency,
      technique: record.technique,
      toothPasteUsed: record.toothPasteUsed,
      otherOralHygieneAids: record.otherOralHygieneAids,
      abnormalOralHabits: record.abnormalOralHabits,
      dietDiary: record.dietDiary,
      vegNonVegMixed: record.vegNonVegMixed,
      recall24Hour: record.recall24Hour,
      dietCounseling: record.dietCounseling,
      behaviourRatingScale: record.behaviourRatingScale,
      behaviourManagement: record.behaviourManagement,
      statureBuilt: record.statureBuilt,
      height: record.height,
      weight: record.weight,
      gait: record.gait,
      speech: record.speech,
      temperature: record.temperature,
      pulse: record.pulse,
      bp: record.bp,
      headForm: record.headForm,
      cephalicIndex: record.cephalicIndex,
      faceShape: record.faceShape,
      faceProfile: record.faceProfile,
      faceSymmetry: record.faceSymmetry,
      faceHeight: record.faceHeight,
      faceDivergence: record.faceDivergence,
      lymphNodes: record.lymphNodes,
      tmj: record.tmj,
      mouthOpening: record.mouthOpening,
      swallow: record.swallow,
      lipCompetence: record.lipCompetence,
      nasoLabialAngle: record.nasoLabialAngle,
      chin: record.chin,
      lips: record.lips,
      labialBuccalMucosa: record.labialBuccalMucosa,
      frenum: record.frenum,
      tongue: record.tongue,
      palate: record.palate,
      floorOfMouth: record.floorOfMouth,
      gingivaColor: record.gingivaColor,
      gingivaSize: record.gingivaSize,
      gingivaContour: record.gingivaContour,
      gingivaShape: record.gingivaShape,
      gingivaConsistency: record.gingivaConsistency,
      gingivaSurfaceTexture: record.gingivaSurfaceTexture,
      gingivaPosition: record.gingivaPosition,
      gingivaStippling: record.gingivaStippling,
      bleedingOnProbing: record.bleedingOnProbing,
      periodontalEvaluation: record.periodontalEvaluation,
      dentition: record.dentition,
      teethNumber: record.teethNumber,
      malformation: record.malformation,
      teethPresent: record.teethPresent,
      teethMissing: record.teethMissing,
      dentalCaries: record.dentalCaries,
      deepCaries: record.deepCaries,
      fracturedTeeth: record.fracturedTeeth,
      retainedTeeth: record.retainedTeeth,
      mobility: record.mobility,
      orthodonticProblem: record.orthodonticProblem,
      otherDentalAnomalies: record.otherDentalAnomalies,
      fluorosis: record.fluorosis,
      primaryMolarLeft: record.primaryMolarLeft,
      primaryMolarRight: record.primaryMolarRight,
      permanentMolarLeft: record.permanentMolarLeft,
      permanentMolarRight: record.permanentMolarRight,
      overJet: record.overJet,
      overBite: record.overBite,
      otherMalocclusionFindings: record.otherMalocclusionFindings,
      provisionalDiagnosis: record.provisionalDiagnosis,
      radiographicFindings: record.radiographicFindings,
      pulpVitality: record.pulpVitality,
      finalDiagnosis: record.finalDiagnosis,
      treatmentPlan: record.treatmentPlan,
      treatmentDone: record.treatmentDone,
      fdiChartData: record.fdiChartData,
      photos: record.photos,
    });
    setShowCreateModal(true);
  };

  const handleDeleteRecord = (id: string) => {
    Alert.alert(
      'Delete Health Record',
      'Are you sure you want to delete this health record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHealthRecords((prev) => prev.filter((r) => r.id !== id));
            Alert.alert('Success', 'Health record deleted successfully');
          },
        },
      ]
    );
  };

  const handleFDIToothChange = (toothNumber: string, value: string) => {
    const upperValue = value.toUpperCase();
    setFormData((prev) => ({
      ...prev,
      fdiChartData: {
        ...prev.fdiChartData,
        [toothNumber]: upperValue,
      },
    }));
  };

  const getToothStyle = (value: string) => {
    switch (value) {
      case 'D':
        return { backgroundColor: '#e53935', color: '#fff' }; // Decayed
      case 'M':
        return { backgroundColor: '#757575', color: '#fff' }; // Missing
      case 'R':
        return { backgroundColor: '#43a047', color: '#fff' }; // Restored
      case 'RS':
        return { backgroundColor: '#ff9800', color: '#fff' }; // Root Stump
      case 'GD':
        return { backgroundColor: '#8e24aa', color: '#fff' }; // Grossly Decayed
      case 'O':
        return { backgroundColor: '#2196f3', color: '#fff' }; // Others
      default:
        return { backgroundColor: '#fff', color: '#333' };
    }
  };

  const renderFDIChart = () => {
    const adultUpper = [
      18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    ];
    const adultLower = [
      48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
    ];
    const childUpper = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
    const childLower = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

    const renderTeethRow = (teeth: number[], label: string) => (
      <View style={styles.teethSection}>
        <Text style={styles.teethLabel}>{label}</Text>
        <View style={styles.teethRow}>
          {teeth.map((toothNumber) => (
            <View key={toothNumber} style={styles.toothContainer}>
              <Text style={styles.toothNumber}>{toothNumber}</Text>
              <TextInput
                style={[
                  styles.toothInput,
                  getToothStyle(
                    formData.fdiChartData[toothNumber.toString()] || ''
                  ),
                ]}
                value={formData.fdiChartData[toothNumber.toString()] || ''}
                onChangeText={(value) =>
                  handleFDIToothChange(toothNumber.toString(), value)
                }
                maxLength={2}
                placeholder=""
                placeholderTextColor="#999"
              />
            </View>
          ))}
        </View>
      </View>
    );

    return (
      <View style={styles.fdiChartContainer}>
        {renderTeethRow(adultUpper, 'Upper Jaw – Adult Teeth')}
        {renderTeethRow(childUpper, 'Upper Jaw – Child Teeth')}
        {renderTeethRow(childLower, 'Lower Jaw – Child Teeth')}
        {renderTeethRow(adultLower, 'Lower Jaw – Adult Teeth')}

        <View style={styles.fdiReference}>
          <Text style={styles.fdiReferenceTitle}>Status Reference:</Text>
          <View style={styles.fdiReferenceGrid}>
            <Text style={styles.fdiReferenceItem}>
              <Text style={styles.bold}>D</Text> – Decayed (Red)
            </Text>
            <Text style={styles.fdiReferenceItem}>
              <Text style={styles.bold}>M</Text> – Missing (Gray)
            </Text>
            <Text style={styles.fdiReferenceItem}>
              <Text style={styles.bold}>R</Text> – Restored (Green)
            </Text>
            <Text style={styles.fdiReferenceItem}>
              <Text style={styles.bold}>RS</Text> – Root Stump (Orange)
            </Text>
            <Text style={styles.fdiReferenceItem}>
              <Text style={styles.bold}>GD</Text> – Grossly Decayed (Purple)
            </Text>
            <Text style={styles.fdiReferenceItem}>
              <Text style={styles.bold}>O</Text> – Others (Blue)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const handleImagePicker = () => {
    Alert.alert('Select Photo', 'Choose how you want to add a photo', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Camera', onPress: () => openCamera() },
      { text: 'Gallery', onPress: () => openGallery() },
    ]);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Camera permission is required to take photos'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, result.assets[0].uri],
      }));
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Gallery permission is required to select photos'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, result.assets[0].uri],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const renderRecordCard = ({ item }: { item: HealthRecord }) => (
    <View style={styles.recordCard}>
      <View style={styles.cardHeader}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.patientDetails}>
            {item.age} years • {item.sex} • DOB: {item.dateOfBirth}
          </Text>
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditRecord(item)}
          >
            <Edit3 size={16} color="#0077B6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteRecord(item.id)}
          >
            <Trash2 size={16} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recordDetails}>
        <View style={styles.detailRow}>
          <Heart size={16} color="#FF6B6B" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Chief Complaint</Text>
            <Text style={styles.detailValue} numberOfLines={2}>
              {item.chiefComplaint || 'Not specified'}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Clipboard size={16} color="#45B7D1" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Clinical Findings</Text>
            <Text style={styles.detailValue} numberOfLines={2}>
              {Object.keys(item.fdiChartData).length > 0
                ? Object.entries(item.fdiChartData)
                    .map(([tooth, status]) => `${tooth}: ${status}`)
                    .join(', ')
                : 'To be determined'}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Stethoscope size={16} color="#4ECDC4" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Final Diagnosis</Text>
            <Text style={styles.detailValue} numberOfLines={2}>
              {item.finalDiagnosis || 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Clipboard size={16} color="#45B7D1" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Treatment Plan</Text>
            <Text style={styles.detailValue} numberOfLines={2}>
              {item.treatmentPlan || 'To be determined'}
            </Text>
          </View>
        </View>



        {item.photos && item.photos.length > 0 && (
          <View style={styles.detailRow}>
            <Camera size={16} color="#FF9800" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Photos</Text>
              <Text style={styles.detailValue}>
                {item.photos.length} photo(s) attached
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.createdBy}>Created by: {item.createdBy}</Text>
        <Text style={styles.createdDate}>
          {new Date(item.createdDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderFormSection = (
    title: string,
    icon: React.ReactNode,
    children: React.ReactNode
  ) => (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    multiline = false,
    placeholder?: string
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        placeholderTextColor="#999"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <Text style={styles.headerTitle}>Health record</Text>
        {userData?.role === 'doctor' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search health records..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {filteredRecords.length > 0 ? (
        <FlatList
          data={filteredRecords}
          renderItem={renderRecordCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.recordsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon={<FileText size={60} color="#ccc" />}
          title="No health records found"
          description={
            searchQuery
              ? 'No records match your search'
              : 'No health records available'
          }
          buttonText="Create Health Record"
          onPress={() => setShowCreateModal(true)}
        />
      )}

      {/* Create/Edit Health Record Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingRecord ? 'Edit Health Record' : 'Create Health Record'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Demographic Details */}
            {renderFormSection(
              'DEMOGRAPHIC DETAILS',
              <User size={20} color="#0077B6" />,
              <>
                {renderInput(
                  'Name of the Patient',
                  formData.patientName,
                  (text) =>
                    setFormData((prev) => ({ ...prev, patientName: text }))
                )}

                <View style={styles.inputRow}>
                  <View
                    style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}
                  >
                    {renderInput('Age', formData.age, (text) =>
                      setFormData((prev) => ({ ...prev, age: text }))
                    )}
                  </View>
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    {renderInput(
                      'Date of Birth',
                      formData.dateOfBirth,
                      (text) =>
                        setFormData((prev) => ({ ...prev, dateOfBirth: text })),
                      false,
                      'YYYY-MM-DD'
                    )}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Sex</Text>
                  <View style={styles.pickerContainer}>
                    {['Male', 'Female', 'Other'].map((sex) => (
                      <TouchableOpacity
                        key={sex}
                        style={[
                          styles.pickerOption,
                          formData.sex === sex && styles.pickerOptionSelected,
                        ]}
                        onPress={() =>
                          setFormData((prev) => ({ ...prev, sex: sex as any }))
                        }
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            formData.sex === sex && styles.pickerTextSelected,
                          ]}
                        >
                          {sex}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {renderInput(
                  'Address',
                  formData.address,
                  (text) => setFormData((prev) => ({ ...prev, address: text })),
                  true
                )}
              </>
            )}

            {/* Chief Complaint & History */}
            {renderFormSection(
              'CHIEF COMPLAINT & HISTORY',
              <Heart size={20} color="#FF6B6B" />,
              <>
                {renderInput(
                  'Chief Complaint of the Patient',
                  formData.chiefComplaint,
                  (text) =>
                    setFormData((prev) => ({ ...prev, chiefComplaint: text })),
                  true
                )}
                {renderInput(
                  'History of Present Illness',
                  formData.historyOfPresentIllness,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      historyOfPresentIllness: text,
                    })),
                  true
                )}
                {renderInput(
                  'Past Medical History',
                  formData.pastMedicalHistory,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      pastMedicalHistory: text,
                    })),
                  true
                )}
                {renderInput(
                  'Past Dental History',
                  formData.pastDentalHistory,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      pastDentalHistory: text,
                    })),
                  true
                )}
              </>
            )}

            {/* Personal History */}
            {renderFormSection(
              'PERSONAL HISTORY',
              <User size={20} color="#8E24AA" />,
              <>
                <Text style={styles.subSectionTitle}>
                  Oral Hygiene Program:
                </Text>
                {renderInput(
                  'Oral Hygiene Program',
                  formData.oralHygieneProgram,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      oralHygieneProgram: text,
                    }))
                )}
                {renderInput(
                  'Tooth Brushing Aid',
                  formData.toothBrushingAid,
                  (text) =>
                    setFormData((prev) => ({ ...prev, toothBrushingAid: text }))
                )}
                {renderInput('Duration', formData.duration, (text) =>
                  setFormData((prev) => ({ ...prev, duration: text }))
                )}
                {renderInput('Frequency', formData.frequency, (text) =>
                  setFormData((prev) => ({ ...prev, frequency: text }))
                )}
                {renderInput('Technique', formData.technique, (text) =>
                  setFormData((prev) => ({ ...prev, technique: text }))
                )}
                {renderInput(
                  'Tooth Paste Used',
                  formData.toothPasteUsed,
                  (text) =>
                    setFormData((prev) => ({ ...prev, toothPasteUsed: text }))
                )}
                {renderInput(
                  'Other Oral Hygiene Aids',
                  formData.otherOralHygieneAids,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherOralHygieneAids: text,
                    }))
                )}
                {renderInput(
                  'Abnormal Oral Habits',
                  formData.abnormalOralHabits,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      abnormalOralHabits: text,
                    })),
                  true
                )}

                <Text style={styles.subSectionTitle}>Diet History:</Text>
                {renderInput(
                  'Diet Diary / Snacking Habit',
                  formData.dietDiary,
                  (text) =>
                    setFormData((prev) => ({ ...prev, dietDiary: text })),
                  true
                )}
                {renderInput(
                  'Veg / Non-veg / Mixed',
                  formData.vegNonVegMixed,
                  (text) =>
                    setFormData((prev) => ({ ...prev, vegNonVegMixed: text }))
                )}
                {renderInput(
                  '24 Hour Recall Period',
                  formData.recall24Hour,
                  (text) =>
                    setFormData((prev) => ({ ...prev, recall24Hour: text })),
                  true
                )}
                {renderInput(
                  'Diet Counseling',
                  formData.dietCounseling,
                  (text) =>
                    setFormData((prev) => ({ ...prev, dietCounseling: text })),
                  true
                )}

                <Text style={styles.subSectionTitle}>Behaviour Rating:</Text>
                {renderInput(
                  'Behaviour Rating Scale',
                  formData.behaviourRatingScale,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      behaviourRatingScale: text,
                    }))
                )}
                {renderInput(
                  'Behaviour Management',
                  formData.behaviourManagement,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      behaviourManagement: text,
                    })),
                  true
                )}
              </>
            )}

            {/* General Examination */}
            {renderFormSection(
              'EXAMINATION OF PATIENT - GENERAL',
              <Activity size={20} color="#4CAF50" />,
              <>
                <Text style={styles.subSectionTitle}>General Examination:</Text>
                {renderInput('Stature / Built', formData.statureBuilt, (text) =>
                  setFormData((prev) => ({ ...prev, statureBuilt: text }))
                )}
                {renderInput('Height', formData.height, (text) =>
                  setFormData((prev) => ({ ...prev, height: text }))
                )}
                {renderInput('Weight', formData.weight, (text) =>
                  setFormData((prev) => ({ ...prev, weight: text }))
                )}
                {renderInput('Gait', formData.gait, (text) =>
                  setFormData((prev) => ({ ...prev, gait: text }))
                )}
                {renderInput('Speech', formData.speech, (text) =>
                  setFormData((prev) => ({ ...prev, speech: text }))
                )}

                <Text style={styles.subSectionTitle}>Vital Signs:</Text>
                {renderInput('Temperature', formData.temperature, (text) =>
                  setFormData((prev) => ({ ...prev, temperature: text }))
                )}
                {renderInput('Pulse', formData.pulse, (text) =>
                  setFormData((prev) => ({ ...prev, pulse: text }))
                )}
                {renderInput('BP', formData.bp, (text) =>
                  setFormData((prev) => ({ ...prev, bp: text }))
                )}
              </>
            )}

            {/* Extra Oral Examination */}
            {renderFormSection(
              'EXTRA ORAL EXAMINATION',
              <Eye size={20} color="#FF9800" />,
              <>
                <Text style={styles.subSectionTitle}>Head:</Text>
                {renderInput('Form', formData.headForm, (text) =>
                  setFormData((prev) => ({ ...prev, headForm: text }))
                )}
                {renderInput('Cephalic Index', formData.cephalicIndex, (text) =>
                  setFormData((prev) => ({ ...prev, cephalicIndex: text }))
                )}

                <Text style={styles.subSectionTitle}>Face:</Text>
                {renderInput('Shape', formData.faceShape, (text) =>
                  setFormData((prev) => ({ ...prev, faceShape: text }))
                )}
                {renderInput('Profile', formData.faceProfile, (text) =>
                  setFormData((prev) => ({ ...prev, faceProfile: text }))
                )}
                {renderInput('Symmetry', formData.faceSymmetry, (text) =>
                  setFormData((prev) => ({ ...prev, faceSymmetry: text }))
                )}
                {renderInput('Height', formData.faceHeight, (text) =>
                  setFormData((prev) => ({ ...prev, faceHeight: text }))
                )}
                {renderInput('Divergence', formData.faceDivergence, (text) =>
                  setFormData((prev) => ({ ...prev, faceDivergence: text }))
                )}
                {renderInput('Lymph Nodes', formData.lymphNodes, (text) =>
                  setFormData((prev) => ({ ...prev, lymphNodes: text }))
                )}
                {renderInput('TMJ', formData.tmj, (text) =>
                  setFormData((prev) => ({ ...prev, tmj: text }))
                )}
                {renderInput('Mouth Opening', formData.mouthOpening, (text) =>
                  setFormData((prev) => ({ ...prev, mouthOpening: text }))
                )}
                {renderInput('Swallow', formData.swallow, (text) =>
                  setFormData((prev) => ({ ...prev, swallow: text }))
                )}
                {renderInput('Lip Competence', formData.lipCompetence, (text) =>
                  setFormData((prev) => ({ ...prev, lipCompetence: text }))
                )}
                {renderInput(
                  'Naso Labial Angle',
                  formData.nasoLabialAngle,
                  (text) =>
                    setFormData((prev) => ({ ...prev, nasoLabialAngle: text }))
                )}
                {renderInput('Chin', formData.chin, (text) =>
                  setFormData((prev) => ({ ...prev, chin: text }))
                )}
              </>
            )}

            {/* Intra Oral Examination */}
            {renderFormSection(
              'INTRA ORAL EXAMINATION',
              <Stethoscope size={20} color="#2196F3" />,
              <>
                <Text style={styles.subSectionTitle}>
                  Soft Tissue Examination:
                </Text>
                {renderInput('Lips', formData.lips, (text) =>
                  setFormData((prev) => ({ ...prev, lips: text }))
                )}
                {renderInput(
                  'Labial and Buccal Mucosa',
                  formData.labialBuccalMucosa,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      labialBuccalMucosa: text,
                    }))
                )}
                {renderInput('Frenum', formData.frenum, (text) =>
                  setFormData((prev) => ({ ...prev, frenum: text }))
                )}
                {renderInput('Tongue', formData.tongue, (text) =>
                  setFormData((prev) => ({ ...prev, tongue: text }))
                )}
                {renderInput('Palate', formData.palate, (text) =>
                  setFormData((prev) => ({ ...prev, palate: text }))
                )}
                {renderInput(
                  'Floor of the Mouth',
                  formData.floorOfMouth,
                  (text) =>
                    setFormData((prev) => ({ ...prev, floorOfMouth: text }))
                )}

                <Text style={styles.subSectionTitle}>Gingiva:</Text>
                {renderInput('Color', formData.gingivaColor, (text) =>
                  setFormData((prev) => ({ ...prev, gingivaColor: text }))
                )}
                {renderInput('Size', formData.gingivaSize, (text) =>
                  setFormData((prev) => ({ ...prev, gingivaSize: text }))
                )}
                {renderInput('Contour', formData.gingivaContour, (text) =>
                  setFormData((prev) => ({ ...prev, gingivaContour: text }))
                )}
                {renderInput('Shape', formData.gingivaShape, (text) =>
                  setFormData((prev) => ({ ...prev, gingivaShape: text }))
                )}
                {renderInput(
                  'Consistency',
                  formData.gingivaConsistency,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      gingivaConsistency: text,
                    }))
                )}
                {renderInput(
                  'Surface Texture',
                  formData.gingivaSurfaceTexture,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      gingivaSurfaceTexture: text,
                    }))
                )}
                {renderInput('Position', formData.gingivaPosition, (text) =>
                  setFormData((prev) => ({ ...prev, gingivaPosition: text }))
                )}
                {renderInput('Stippling', formData.gingivaStippling, (text) =>
                  setFormData((prev) => ({ ...prev, gingivaStippling: text }))
                )}
                {renderInput(
                  'Bleeding on Probing',
                  formData.bleedingOnProbing,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      bleedingOnProbing: text,
                    }))
                )}
                {renderInput(
                  'Periodontal Evaluation',
                  formData.periodontalEvaluation,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      periodontalEvaluation: text,
                    })),
                  true
                )}
              </>
            )}

            {/* Hard Tissue Examination */}
            {renderFormSection(
              'HARD TISSUE EXAMINATION',
              <Clipboard size={20} color="#795548" />,
              <>
                <Text style={styles.subSectionTitle}>
                  Examination of Teeth:
                </Text>
                {/* FDI Chart */}
                {renderFormSection(
                  'FDI CHART',
                  <Grid3x3 size={20} color="#607D8B" />,
                  renderFDIChart()
                )}

                {renderInput('Dentition', formData.dentition, (text) =>
                  setFormData((prev) => ({ ...prev, dentition: text }))
                )}
                {renderInput('Number', formData.teethNumber, (text) =>
                  setFormData((prev) => ({ ...prev, teethNumber: text }))
                )}
                {renderInput('Malformation', formData.malformation, (text) =>
                  setFormData((prev) => ({ ...prev, malformation: text }))
                )}
                {renderInput(
                  'Teeth Present',
                  formData.teethPresent,
                  (text) =>
                    setFormData((prev) => ({ ...prev, teethPresent: text })),
                  true
                )}
                {renderInput('Teeth Missing', formData.teethMissing, (text) =>
                  setFormData((prev) => ({ ...prev, teethMissing: text }))
                )}
                {renderInput('Dental Caries', formData.dentalCaries, (text) =>
                  setFormData((prev) => ({ ...prev, dentalCaries: text }))
                )}
                {renderInput(
                  'Deep Caries / Grossly Decayed Teeth',
                  formData.deepCaries,
                  (text) =>
                    setFormData((prev) => ({ ...prev, deepCaries: text }))
                )}
                {renderInput(
                  'Fractured Teeth',
                  formData.fracturedTeeth,
                  (text) =>
                    setFormData((prev) => ({ ...prev, fracturedTeeth: text }))
                )}
                {renderInput('Retained Teeth', formData.retainedTeeth, (text) =>
                  setFormData((prev) => ({ ...prev, retainedTeeth: text }))
                )}
                {renderInput('Mobility', formData.mobility, (text) =>
                  setFormData((prev) => ({ ...prev, mobility: text }))
                )}
                {renderInput(
                  'Orthodontic Problem',
                  formData.orthodonticProblem,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      orthodonticProblem: text,
                    }))
                )}
                {renderInput(
                  'Other Dental Anomalies',
                  formData.otherDentalAnomalies,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherDentalAnomalies: text,
                    }))
                )}
                {renderInput('Fluorosis', formData.fluorosis, (text) =>
                  setFormData((prev) => ({ ...prev, fluorosis: text }))
                )}
              </>
            )}

            {/* Occlusal Relationship */}
            {renderFormSection(
              'OCCLUSAL RELATIONSHIP',
              <Activity size={20} color="#9C27B0" />,
              <>
                <Text style={styles.subSectionTitle}>
                  Primary Molar Relation:
                </Text>
                <View style={styles.inputRow}>
                  <View
                    style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}
                  >
                    {renderInput('Left', formData.primaryMolarLeft, (text) =>
                      setFormData((prev) => ({
                        ...prev,
                        primaryMolarLeft: text,
                      }))
                    )}
                  </View>
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    {renderInput('Right', formData.primaryMolarRight, (text) =>
                      setFormData((prev) => ({
                        ...prev,
                        primaryMolarRight: text,
                      }))
                    )}
                  </View>
                </View>

                <Text style={styles.subSectionTitle}>
                  Permanent Molar Relation:
                </Text>
                <View style={styles.inputRow}>
                  <View
                    style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}
                  >
                    {renderInput('Left', formData.permanentMolarLeft, (text) =>
                      setFormData((prev) => ({
                        ...prev,
                        permanentMolarLeft: text,
                      }))
                    )}
                  </View>
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    {renderInput(
                      'Right',
                      formData.permanentMolarRight,
                      (text) =>
                        setFormData((prev) => ({
                          ...prev,
                          permanentMolarRight: text,
                        }))
                    )}
                  </View>
                </View>

                {renderInput('Over Jet', formData.overJet, (text) =>
                  setFormData((prev) => ({ ...prev, overJet: text }))
                )}
                {renderInput('Over Bite', formData.overBite, (text) =>
                  setFormData((prev) => ({ ...prev, overBite: text }))
                )}
                {renderInput(
                  'Other Malocclusion Findings',
                  formData.otherMalocclusionFindings,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherMalocclusionFindings: text,
                    })),
                  true
                )}
              </>
            )}

            {/* Diagnosis & Treatment */}
            {renderFormSection(
              'DIAGNOSIS & TREATMENT',
              <FileText size={20} color="#E91E63" />,
              <>
                {renderInput(
                  'Provisional Diagnosis',
                  formData.provisionalDiagnosis,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      provisionalDiagnosis: text,
                    })),
                  true
                )}

                <Text style={styles.subSectionTitle}>Investigations:</Text>
                {renderInput(
                  'Radiographic Findings',
                  formData.radiographicFindings,
                  (text) =>
                    setFormData((prev) => ({
                      ...prev,
                      radiographicFindings: text,
                    })),
                  true
                )}
                {renderInput(
                  'Pulp Vitality',
                  formData.pulpVitality,
                  (text) =>
                    setFormData((prev) => ({ ...prev, pulpVitality: text })),
                  true
                )}

                {renderInput(
                  'Final Diagnosis',
                  formData.finalDiagnosis,
                  (text) =>
                    setFormData((prev) => ({ ...prev, finalDiagnosis: text })),
                  true
                )}
                {renderInput(
                  'Treatment Plan',
                  formData.treatmentPlan,
                  (text) =>
                    setFormData((prev) => ({ ...prev, treatmentPlan: text })),
                  true
                )}
                {renderInput(
                  'Treatment Done',
                  formData.treatmentDone,
                  (text) =>
                    setFormData((prev) => ({ ...prev, treatmentDone: text })),
                  true
                )}
              </>
            )}

            {/* FDI Chart */}
            {/* {renderFormSection('FDI CHART', <Grid3x3 size={20} color="#607D8B" />, renderFDIChart())} */}

            {/* Photos Section */}
            {renderFormSection(
              'PATIENT PHOTOS',
              <Camera size={20} color="#FF9800" />,
              <View style={styles.photosSection}>
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handleImagePicker}
                >
                  <Camera size={20} color="#0077B6" />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>

                {formData.photos.length > 0 && (
                  <View style={styles.photosGrid}>
                    {formData.photos.map((photo, index) => (
                      <View key={index} style={styles.photoContainer}>
                        <Image
                          source={{ uri: photo }}
                          style={styles.photoPreview}
                        />
                        <TouchableOpacity
                          style={styles.removePhotoButton}
                          onPress={() => removePhoto(index)}
                        >
                          <X size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateRecord}
            >
              <Text style={styles.createButtonText}>
                {editingRecord ? 'Update' : 'Create'} Record
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    alignItems: 'center',
    fontSize: 24,
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#0077B6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#333',
  },
  recordsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  patientDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  address: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  createdBy: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#0077B6',
  },
  createdDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#E3F2FD',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  subSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0077B6',
    marginTop: 16,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  pickerOptionSelected: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  pickerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#666',
  },
  pickerTextSelected: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#666',
  },
  createButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  fdiChartContainer: {
    marginTop: 16,
  },
  teethSection: {
    marginBottom: 20,
  },
  teethLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  teethRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  toothContainer: {
    alignItems: 'center',
    margin: 2,
  },
  toothNumber: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  toothInput: {
    width: 35,
    height: 35,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    borderWidth: 1,
    borderColor: '#0077B6',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  fdiReference: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fdiReferenceTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  fdiReferenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fdiReferenceItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    width: '48%',
  },
  bold: {
    fontFamily: 'Inter-Bold',
  },
  photosSection: {
    marginTop: 16,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#0077B6',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0077B6',
    marginLeft: 8,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  photoContainer: {
    position: 'relative',
  },
    backButton: {
    padding: 8,
    marginRight: 8,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
