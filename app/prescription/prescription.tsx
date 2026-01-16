// import React, { useState, useEffect } from 'react';
// import { 
//   StyleSheet, 
//   View, 
//   Text, 
//   FlatList, 
//   TouchableOpacity, 
//   TextInput, 
//   Modal, 
//   Alert, 
//   ScrollView, 
//   ActivityIndicator,
//   Linking
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Search, Plus, Trash2, Mail, Edit2 as Edit3, X, User, Calendar, Weight, Stethoscope, Pill, Clock, Hash, FileText } from 'lucide-react-native';
// import { useAuth } from '../../hooks/useAuth';
// import EmptyState from '@/components/common/EmptyState';
// import {
//   collection,
//   doc,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   query,
//   where,
//   getDocs,
//   onSnapshot,
//   Timestamp,
//   serverTimestamp
// } from 'firebase/firestore';
// import { db } from '../../services/firebase';

// interface Prescription {
//   id: string;
//   patientId: string;
//   patientName: string;
//   patientEmail: string;
//   patientPhone?: string;
//   patientAge?: number;
//   patientWeight?: number;
//   patientGender?: string;
//   patientMedicalHistory?: string;
  
//   doctorId: string;
//   doctorName: string;
//   doctorEmail: string;
//   doctorPhone?: string;
//   doctorSpecialty?: string;
//   doctorExperience?: string;
  
//   diagnosis?: string;
//   symptoms?: string[];
  
//   drugName: string;
//   dosage: string;
//   frequency: string;
//   duration?: string;
//   instructions?: string;
  
//   medications?: Array<{
//     id: string;
//     name: string;
//     dosage: string;
//     frequency: string;
//     duration?: string;
//     instructions?: string;
//   }>;
  
//   status: 'active' | 'completed' | 'cancelled' | 'expired';
//   createdAt: Timestamp;
//   updatedAt: Timestamp;
//   issuedDate?: Timestamp;
//   startDate?: string;
//   endDate?: string;
  
//   notes?: string;
//   followUpDate?: string;
// }

// interface UserData {
//   uid: string;
//   name: string;
//   email: string;
//   role: 'doctor' | 'patient';
//   phone?: string;
//   dob?: string;
//   medicalHistory?: string;
//   specialty?: string;
//   experience?: string;
//   createdAt: string;
//   updatedAt: string;
//   isDemo: boolean;
// }

// interface Medication {
//   id: string;
//   name: string;
//   dosage: string;
//   frequency: string;
//   duration: string;
//   instructions: string;
// }

// interface FormData {
//   patientName: string;
//   patientAge: string;
//   patientWeight: string;
//   patientMedicalHistory: string;
//   diagnosis: string;
//   doctorName: string;
//   drugName: string;
//   dosage: string;
//   frequency: string;
//   duration: string;
//   instructions: string;
//   notes: string;
//   followUpDate: string;
//   startDate: string;
// }

// export default function PrescriptionsScreen() {
//   const router = useRouter();
//   const { userData } = useAuth();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
//   const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
//   const [patients, setPatients] = useState<UserData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPatientId, setSelectedPatientId] = useState<string>('');
//   const [showPatientSelector, setShowPatientSelector] = useState(false);
//   const [showMedicationModal, setShowMedicationModal] = useState(false);
//   const [medications, setMedications] = useState<Medication[]>([]);
//   const [currentMedication, setCurrentMedication] = useState<Medication>({
//     id: '',
//     name: '',
//     dosage: '',
//     frequency: '',
//     duration: '',
//     instructions: ''
//   });

//   const [formData, setFormData] = useState<FormData>({
//     patientName: '',
//     patientAge: '',
//     patientWeight: '',
//     patientMedicalHistory: '',
//     diagnosis: '',
//     doctorName: '',
//     drugName: '',
//     dosage: '',
//     frequency: '',
//     duration: '',
//     instructions: '',
//     notes: '',
//     followUpDate: '',
//     startDate: '',
//   });

//   // Calculate age from DOB
//   const calculateAge = (dob: string): number | null => {
//     if (!dob) return null;
//     try {
//       const birthDate = new Date(dob);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
      
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//       }
//       return age;
//     } catch (error) {
//       return null;
//     }
//   };

//   // Fetch prescriptions in real-time - FIXED VERSION without orderBy
//   useEffect(() => {
//     if (!userData?.uid) return;

//     let unsubscribe: () => void;

//     const setupRealtimeUpdates = async () => {
//       try {
//         const prescriptionsRef = collection(db, 'prescriptions');
        
//         if (userData.role === 'doctor') {
//           // Doctor sees prescriptions they created
//           const q = query(
//             prescriptionsRef, 
//             where('doctorId', '==', userData.uid)
//             // REMOVED orderBy to avoid index error
//           );
//           unsubscribe = onSnapshot(q, (snapshot) => {
//             const fetchedPrescriptions: Prescription[] = [];
//             snapshot.forEach((doc) => {
//               const data = doc.data();
//               fetchedPrescriptions.push({
//                 id: doc.id,
//                 ...data
//               } as Prescription);
//             });
//             // Sort manually on client side
//             const sortedPrescriptions = fetchedPrescriptions.sort((a, b) => {
//               const dateA = a.createdAt?.toDate() || new Date(0);
//               const dateB = b.createdAt?.toDate() || new Date(0);
//               return dateB.getTime() - dateA.getTime(); // Descending
//             });
//             setPrescriptions(sortedPrescriptions);
//             setLoading(false);
//           }, (error) => {
//             console.error('Error fetching prescriptions:', error);
//             setLoading(false);
//           });
//         } else if (userData.role === 'patient') {
//           // Patient sees prescriptions assigned to them
//           const q = query(
//             prescriptionsRef, 
//             where('patientId', '==', userData.uid)
//             // REMOVED orderBy to avoid index error
//           );
//           unsubscribe = onSnapshot(q, (snapshot) => {
//             const fetchedPrescriptions: Prescription[] = [];
//             snapshot.forEach((doc) => {
//               const data = doc.data();
//               fetchedPrescriptions.push({
//                 id: doc.id,
//                 ...data
//               } as Prescription);
//             });
//             // Sort manually on client side
//             const sortedPrescriptions = fetchedPrescriptions.sort((a, b) => {
//               const dateA = a.createdAt?.toDate() || new Date(0);
//               const dateB = b.createdAt?.toDate() || new Date(0);
//               return dateB.getTime() - dateA.getTime(); // Descending
//             });
//             setPrescriptions(sortedPrescriptions);
//             setLoading(false);
//           }, (error) => {
//             console.error('Error fetching prescriptions:', error);
//             setLoading(false);
//           });
//         }
//       } catch (error) {
//         console.error('Error setting up realtime updates:', error);
//         setLoading(false);
//       }
//     };

//     setupRealtimeUpdates();

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//   }, [userData?.uid, userData?.role]);

//   // Fetch patients list for doctors
//   useEffect(() => {
//     if (userData?.role === 'doctor') {
//       const fetchPatients = async () => {
//         try {
//           const usersRef = collection(db, 'users');
//           const q = query(usersRef, where('role', '==', 'patient'));
//           const querySnapshot = await getDocs(q);
//           const patientsList: UserData[] = [];
//           querySnapshot.forEach((doc) => {
//             patientsList.push({ uid: doc.id, ...doc.data() } as UserData);
//           });
//           setPatients(patientsList);
//         } catch (error) {
//           console.error('Error fetching patients:', error);
//         }
//       };
//       fetchPatients();
//     }
//   }, [userData?.role]);

//   const filteredPrescriptions = prescriptions.filter(prescription =>
//     prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     prescription.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     (prescription.diagnosis && prescription.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const resetForm = () => {
//     setFormData({
//       patientName: '',
//       patientAge: '',
//       patientWeight: '',
//       patientMedicalHistory: '',
//       diagnosis: '',
//       doctorName: '',
//       drugName: '',
//       dosage: '',
//       frequency: '',
//       duration: '',
//       instructions: '',
//       notes: '',
//       followUpDate: '',
//       startDate: '',
//     });
//     setSelectedPatientId('');
//     setEditingPrescription(null);
//     setMedications([]);
//     setCurrentMedication({
//       id: '',
//       name: '',
//       dosage: '',
//       frequency: '',
//       duration: '',
//       instructions: ''
//     });
//   };

//   const handleSelectPatient = (patient: UserData) => {
//     setSelectedPatientId(patient.uid);
    
//     const age = patient.dob ? calculateAge(patient.dob) : null;
    
//     setFormData(prev => ({
//       ...prev,
//       patientName: patient.name,
//       patientAge: age ? age.toString() : '',
//       patientMedicalHistory: patient.medicalHistory || '',
//     }));
//     setShowPatientSelector(false);
//   };

//   const addMedication = () => {
//     if (!currentMedication.name.trim() || !currentMedication.dosage.trim() || !currentMedication.frequency.trim()) {
//       Alert.alert('Error', 'Please fill in medication name, dosage, and frequency');
//       return;
//     }

//     const newMedication: Medication = {
//       id: currentMedication.id || Date.now().toString(),
//       name: currentMedication.name.trim(),
//       dosage: currentMedication.dosage.trim(),
//       frequency: currentMedication.frequency.trim(),
//       duration: currentMedication.duration.trim(),
//       instructions: currentMedication.instructions.trim()
//     };

//     setMedications(prev => [...prev, newMedication]);
    
//     if (medications.length === 0) {
//       setFormData(prev => ({
//         ...prev,
//         drugName: currentMedication.name,
//         dosage: currentMedication.dosage,
//         frequency: currentMedication.frequency,
//         duration: currentMedication.duration,
//         instructions: currentMedication.instructions,
//       }));
//     }

//     setCurrentMedication({
//       id: '',
//       name: '',
//       dosage: '',
//       frequency: '',
//       duration: '',
//       instructions: ''
//     });
//     setShowMedicationModal(false);
//   };

//   const removeMedication = (id: string) => {
//     setMedications(prev => prev.filter(med => med.id !== id));
//   };

//   const handleCreatePrescription = async () => {
//     // Basic validation
//     if (!formData.patientName.trim()) {
//       Alert.alert('Error', 'Please enter patient name');
//       return;
//     }

//     if (userData?.role === 'doctor' && !selectedPatientId) {
//       Alert.alert('Error', 'Please select a patient');
//       return;
//     }

//     if (medications.length === 0 && (!formData.drugName.trim() || !formData.dosage.trim() || !formData.frequency.trim())) {
//       Alert.alert('Error', 'Please enter medication details');
//       return;
//     }

//     try {
//       const selectedPatient = patients.find(p => p.uid === selectedPatientId);
      
//       const prescriptionData: any = {
//         patientId: editingPrescription?.patientId || (userData?.role === 'patient' ? userData.uid : selectedPatientId),
//         patientName: formData.patientName.trim(),
//         patientEmail: selectedPatient?.email || userData?.email || '',
//         patientPhone: selectedPatient?.phone || '',
//         patientAge: formData.patientAge ? parseInt(formData.patientAge) : null,
//         patientWeight: formData.patientWeight ? parseFloat(formData.patientWeight) : null,
//         patientMedicalHistory: formData.patientMedicalHistory.trim(),
        
//         doctorId: userData?.role === 'doctor' ? userData.uid : editingPrescription?.doctorId || '',
//         doctorName: userData?.role === 'doctor' ? userData.name || userData.email : formData.doctorName.trim(),
//         doctorEmail: userData?.role === 'doctor' ? userData.email : editingPrescription?.doctorEmail || '',
//         doctorPhone: userData?.phone || '',
//         doctorSpecialty: userData?.specialty || '',
        
//         diagnosis: formData.diagnosis.trim(),
        
//         status: 'active',
//         createdAt: editingPrescription?.createdAt || serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         issuedDate: serverTimestamp(),
//         startDate: formData.startDate || new Date().toISOString().split('T')[0],
        
//         notes: formData.notes.trim(),
//         followUpDate: formData.followUpDate || '',
//       };

//       if (medications.length > 0) {
//         prescriptionData.medications = medications;
//         prescriptionData.drugName = medications[0]?.name || '';
//         prescriptionData.dosage = medications[0]?.dosage || '';
//         prescriptionData.frequency = medications[0]?.frequency || '';
//         prescriptionData.duration = medications[0]?.duration || '';
//         prescriptionData.instructions = medications[0]?.instructions || '';
//       } else {
//         prescriptionData.drugName = formData.drugName.trim();
//         prescriptionData.dosage = formData.dosage.trim();
//         prescriptionData.frequency = formData.frequency.trim();
//         prescriptionData.duration = formData.duration.trim();
//         prescriptionData.instructions = formData.instructions.trim();
//       }

//       if (editingPrescription) {
//         const prescriptionDoc = doc(db, 'prescriptions', editingPrescription.id);
//         await updateDoc(prescriptionDoc, prescriptionData);
//         Alert.alert('Success', 'Prescription updated successfully');
//       } else {
//         await addDoc(collection(db, 'prescriptions'), prescriptionData);
//         Alert.alert('Success', 'Prescription created successfully');
//       }

//       setShowCreateModal(false);
//       resetForm();
//     } catch (error) {
//       console.error('Error saving prescription:', error);
//       Alert.alert('Error', 'Failed to save prescription');
//     }
//   };

//   const handleEditPrescription = (prescription: Prescription) => {
//     setEditingPrescription(prescription);
    
//     setFormData({
//       patientName: prescription.patientName,
//       patientAge: prescription.patientAge?.toString() || '',
//       patientWeight: prescription.patientWeight?.toString() || '',
//       patientMedicalHistory: prescription.patientMedicalHistory || '',
//       diagnosis: prescription.diagnosis || '',
//       doctorName: prescription.doctorName,
//       drugName: prescription.drugName,
//       dosage: prescription.dosage,
//       frequency: prescription.frequency,
//       duration: prescription.duration || '',
//       instructions: prescription.instructions || '',
//       notes: prescription.notes || '',
//       followUpDate: prescription.followUpDate || '',
//       startDate: prescription.startDate || '',
//     });

//     if (prescription.medications && prescription.medications.length > 0) {
//       const meds: Medication[] = prescription.medications.map(med => ({
//         id: med.id,
//         name: med.name,
//         dosage: med.dosage,
//         frequency: med.frequency,
//         duration: med.duration || '',
//         instructions: med.instructions || ''
//       }));
//       setMedications(meds);
//     }

//     setSelectedPatientId(prescription.patientId);
//     setShowCreateModal(true);
//   };

//   const handleDeletePrescription = async (id: string) => {
//     Alert.alert(
//       'Delete Prescription',
//       'Are you sure you want to delete this prescription?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await deleteDoc(doc(db, 'prescriptions', id));
//               Alert.alert('Success', 'Prescription deleted successfully');
//             } catch (error) {
//               console.error('Error deleting prescription:', error);
//               Alert.alert('Error', 'Failed to delete prescription');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleEmailPrescription = async (prescription: Prescription) => {
//     try {
//       let patientEmail = prescription.patientEmail;
//       if (!patientEmail && prescription.patientId) {
//         try {
//           const patientDoc = await getDocs(
//             query(collection(db, 'users'), where('uid', '==', prescription.patientId))
//           );
//           if (!patientDoc.empty) {
//             patientEmail = patientDoc.docs[0].data().email;
//           }
//         } catch (error) {
//           console.error('Error fetching patient email:', error);
//         }
//       }

//       const subject = `Prescription from ${prescription.doctorName}`;
//       const body = generateEmailBody(prescription, patientEmail);
      
//       const mailtoLink = `mailto:${patientEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
//       const canOpen = await Linking.canOpenURL(mailtoLink);
      
//       if (canOpen) {
//         await Linking.openURL(mailtoLink);
//       } else {
//         Alert.alert(
//           'Email App Not Found',
//           'No email app detected.',
//           [{ text: 'OK', style: 'cancel' }]
//         );
//       }
//     } catch (error) {
//       console.error('Error sending email:', error);
//       Alert.alert('Error', 'Failed to open email app');
//     }
//   };

//   const generateEmailBody = (prescription: Prescription, patientEmail?: string): string => {
//     let body = `PRESCRIPTION DETAILS\n`;
//     body += `===================\n\n`;
    
//     body += `PATIENT INFORMATION:\n`;
//     body += `Name: ${prescription.patientName}\n`;
//     if (prescription.patientAge) body += `Age: ${prescription.patientAge}\n`;
//     if (prescription.patientWeight) body += `Weight: ${prescription.patientWeight} kg\n`;
//     if (patientEmail) body += `Email: ${patientEmail}\n`;
    
//     body += `\nDOCTOR INFORMATION:\n`;
//     body += `Doctor: ${prescription.doctorName}\n`;
//     if (prescription.doctorEmail) body += `Email: ${prescription.doctorEmail}\n`;
    
//     body += `\nPRESCRIPTION:\n`;
//     if (prescription.diagnosis) body += `Diagnosis: ${prescription.diagnosis}\n`;
    
//     if (prescription.medications && prescription.medications.length > 0) {
//       prescription.medications.forEach((med, index) => {
//         body += `\n${index + 1}. ${med.name}\n`;
//         body += `   Dosage: ${med.dosage}\n`;
//         body += `   Frequency: ${med.frequency}\n`;
//         if (med.duration) body += `   Duration: ${med.duration}\n`;
//         if (med.instructions) body += `   Instructions: ${med.instructions}\n`;
//       });
//     } else {
//       body += `Medication: ${prescription.drugName}\n`;
//       body += `Dosage: ${prescription.dosage}\n`;
//       body += `Frequency: ${prescription.frequency}\n`;
//       if (prescription.duration) body += `Duration: ${prescription.duration}\n`;
//       if (prescription.instructions) body += `Instructions: ${prescription.instructions}\n`;
//     }
    
//     body += `\nPRESCRIPTION DATE: ${new Date().toLocaleDateString()}\n`;
//     body += `PRESCRIPTION ID: ${prescription.id}\n`;
    
//     return body;
//   };

//   const renderPrescriptionCard = ({ item }: { item: Prescription }) => (
//     <View style={styles.prescriptionCard}>
//       <View style={styles.cardHeader}>
//         <View style={styles.patientInfo}>
//           <Text style={styles.patientName}>{item.patientName}</Text>
//           <Text style={styles.patientDetails}>
//             {item.patientAge && `Age: ${item.patientAge} • `}
//             {item.patientWeight && `Weight: ${item.patientWeight}kg`}
//             <Text style={[styles.statusBadge, styles[`status${item.status}`]]}>
//               {item.status.toUpperCase()}
//             </Text>
//           </Text>
//         </View>
//         <View style={styles.cardActions}>
//           {userData?.role === 'doctor' && (
//             <>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() => handleEditPrescription(item)}
//               >
//                 <Edit3 size={16} color="#0077B6" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() => handleEmailPrescription(item)}
//               >
//                 <Mail size={16} color="#4CAF50" />
//               </TouchableOpacity>
//             </>
//           )}
//           {userData?.role === 'doctor' && (
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => handleDeletePrescription(item.id)}
//             >
//               <Trash2 size={16} color="#FF5252" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       <View style={styles.doctorSection}>
//         <Stethoscope size={16} color="#666" />
//         <Text style={styles.doctorName}>{item.doctorName}</Text>
//       </View>

//       <View style={styles.prescriptionDetails}>
//         <View style={styles.detailRow}>
//           <Pill size={16} color="#666" />
//           <View style={styles.detailContent}>
//             <Text style={styles.detailLabel}>Medication</Text>
//             <Text style={styles.detailValue}>{item.drugName}</Text>
//           </View>
//         </View>

//         <View style={styles.detailRow}>
//           <Hash size={16} color="#666" />
//           <View style={styles.detailContent}>
//             <Text style={styles.detailLabel}>Dosage</Text>
//             <Text style={styles.detailValue}>{item.dosage}</Text>
//           </View>
//         </View>

//         <View style={styles.detailRow}>
//           <Clock size={16} color="#666" />
//           <View style={styles.detailContent}>
//             <Text style={styles.detailLabel}>Frequency</Text>
//             <Text style={styles.detailValue}>{item.frequency}</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.cardFooter}>
//         <Text style={styles.createdDate}>
//           Created: {item.createdAt?.toDate().toLocaleDateString()}
//         </Text>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0077B6" />
//         <Text style={styles.loadingText}>Loading prescriptions...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Prescriptions</Text>
//         {userData?.role === 'doctor' && (
//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => setShowCreateModal(true)}
//           >
//             <Plus size={20} color="#fff" />
//           </TouchableOpacity>
//         )}
//       </View>

//       <View style={styles.searchContainer}>
//         <View style={styles.searchBar}>
//           <Search size={20} color="#999" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search prescriptions..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#999"
//           />
//         </View>
//       </View>

//       {filteredPrescriptions.length > 0 ? (
//         <FlatList
//           data={filteredPrescriptions}
//           renderItem={renderPrescriptionCard}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.prescriptionsList}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <EmptyState
//           icon={<Pill size={60} color="#ccc" />}
//           title="No prescriptions found"
//           description={searchQuery ? "No prescriptions match your search" : "No prescriptions available"}
//           buttonText={userData?.role === 'doctor' ? "Create Prescription" : "Browse Doctors"}
//           onPress={() => {
//             if (userData?.role === 'doctor') {
//               setShowCreateModal(true);
//             } else {
//               router.push('/');
//             }
//           }}
//         />
//       )}

//       {/* Patient Selector Modal - FIXED */}
//       <Modal
//         visible={showPatientSelector}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowPatientSelector(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.patientSelectorModal}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Patient</Text>
//               <TouchableOpacity onPress={() => setShowPatientSelector(false)}>
//                 <X size={24} color="#333" />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={patients}
//               keyExtractor={(item) => item.uid}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.patientItem}
//                   onPress={() => handleSelectPatient(item)}
//                 >
//                   <View>
//                     <Text style={styles.patientItemName}>{item.name}</Text>
//                     <Text style={styles.patientItemEmail}>{item.email}</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Medication Modal - FIXED */}
//       <Modal
//         visible={showMedicationModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowMedicationModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.medicationModal}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add Medication</Text>
//               <TouchableOpacity onPress={() => setShowMedicationModal(false)}>
//                 <X size={24} color="#333" />
//               </TouchableOpacity>
//             </View>
//             <ScrollView style={styles.modalContent}>
//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Medication Name *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter medication name"
//                   value={currentMedication.name}
//                   onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, name: text }))}
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Dosage *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="e.g., 500mg"
//                   value={currentMedication.dosage}
//                   onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, dosage: text }))}
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Frequency *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="e.g., 3 times daily"
//                   value={currentMedication.frequency}
//                   onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, frequency: text }))}
//                 />
//               </View>
//             </ScrollView>

//             <View style={styles.modalFooter}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setShowMedicationModal(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.createButton}
//                 onPress={addMedication}
//               >
//                 <Text style={styles.createButtonText}>Add Medication</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Create/Edit Prescription Modal - FIXED */}
//       <Modal
//         visible={showCreateModal}
//         animationType="slide"
//         onRequestClose={() => {
//           setShowCreateModal(false);
//           resetForm();
//         }}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>
//               {editingPrescription ? 'Edit Prescription' : 'Create Prescription'}
//             </Text>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => {
//                 setShowCreateModal(false);
//                 resetForm();
//               }}
//             >
//               <X size={24} color="#333" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView style={styles.modalContent}>
//             {userData?.role === 'doctor' && !editingPrescription && (
//               <View style={styles.formSection}>
//                 <Text style={styles.sectionTitle}>Select Patient</Text>
//                 <TouchableOpacity
//                   style={styles.patientSelectButton}
//                   onPress={() => setShowPatientSelector(true)}
//                 >
//                   <Text style={selectedPatientId ? styles.patientSelectText : styles.patientSelectPlaceholder}>
//                     {selectedPatientId ? formData.patientName : 'Tap to select patient'}
//                   </Text>
//                   <User size={20} color="#666" />
//                 </TouchableOpacity>
//               </View>
//             )}

//             <View style={styles.formSection}>
//               <Text style={styles.sectionTitle}>Patient Information</Text>
              
//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Patient Name *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter patient name"
//                   value={formData.patientName}
//                   onChangeText={(text) => setFormData(prev => ({ ...prev, patientName: text }))}
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Age</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Age"
//                   value={formData.patientAge}
//                   onChangeText={(text) => setFormData(prev => ({ ...prev, patientAge: text }))}
//                   keyboardType="numeric"
//                 />
//               </View>
//             </View>

//             <View style={styles.formSection}>
//               <Text style={styles.sectionTitle}>Medication</Text>
              
//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Medication Name *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter medication name"
//                   value={formData.drugName}
//                   onChangeText={(text) => setFormData(prev => ({ ...prev, drugName: text }))}
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Dosage *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="e.g., 500mg"
//                   value={formData.dosage}
//                   onChangeText={(text) => setFormData(prev => ({ ...prev, dosage: text }))}
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Frequency *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="e.g., 3 times daily"
//                   value={formData.frequency}
//                   onChangeText={(text) => setFormData(prev => ({ ...prev, frequency: text }))}
//                 />
//               </View>
//             </View>
//           </ScrollView>

//           <View style={styles.modalFooter}>
//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => {
//                 setShowCreateModal(false);
//                 resetForm();
//               }}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.createButton}
//               onPress={handleCreatePrescription}
//             >
//               <Text style={styles.createButtonText}>
//                 {editingPrescription ? 'Update' : 'Create'} Prescription
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 16,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//   },
//   addButton: {
//     width: 40,
//     height: 40,
//     backgroundColor: '#0077B6',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   searchContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     height: 48,
//   },
//   searchIcon: {
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     color: '#333',
//   },
//   prescriptionsList: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   prescriptionCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: '#F0F0F0',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   patientInfo: {
//     flex: 1,
//   },
//   patientName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   patientDetails: {
//     fontSize: 14,
//     color: '#666',
//   },
//   statusBadge: {
//     fontSize: 12,
//     fontWeight: '500',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   statusactive: {
//     backgroundColor: '#E8F5E9',
//     color: '#2E7D32',
//   },
//   statuscompleted: {
//     backgroundColor: '#E3F2FD',
//     color: '#1565C0',
//   },
//   statuscancelled: {
//     backgroundColor: '#FFEBEE',
//     color: '#C62828',
//   },
//   statusexpired: {
//     backgroundColor: '#FFF3E0',
//     color: '#EF6C00',
//   },
//   cardActions: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   actionButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#F5F5F5',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   doctorSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   doctorName: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#0077B6',
//     marginLeft: 8,
//   },
//   prescriptionDetails: {
//     gap: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   detailContent: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   detailLabel: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#666',
//     marginBottom: 2,
//   },
//   detailValue: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//   },
//   cardFooter: {
//     marginTop: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//   },
//   createdDate: {
//     fontSize: 12,
//     color: '#999',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   patientSelectorModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',
//   },
//   medicationModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 8,
//   },
//   patientItem: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   patientItemName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   patientItemEmail: {
//     fontSize: 14,
//     color: '#666',
//   },
//   modalContent: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   formSection: {
//     marginTop: 24,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 16,
//   },
//   patientSelectButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     height: 50,
//     backgroundColor: '#FAFAFA',
//   },
//   patientSelectText: {
//     fontSize: 15,
//     color: '#333',
//   },
//   patientSelectPlaceholder: {
//     fontSize: 15,
//     color: '#999',
//   },
//   inputGroup: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     height: 50,
//     backgroundColor: '#FAFAFA',
//     fontSize: 15,
//     color: '#333',
//   },
//   modalFooter: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//     gap: 12,
//   },
//   cancelButton: {
//     flex: 1,
//     height: 50,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#666',
//   },
//   createButton: {
//     flex: 1,
//     height: 50,
//     borderRadius: 12,
//     backgroundColor: '#0077B6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   createButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },
// });

import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, Trash2, Mail, Edit2 as Edit3, X, User, Calendar, Weight, Stethoscope, Pill, Clock, Hash, FileText } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import EmptyState from '@/components/common/EmptyState';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  patientAge?: number;
  patientWeight?: number;
  patientGender?: string;
  patientMedicalHistory?: string;
  
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  doctorPhone?: string;
  doctorSpecialty?: string;
  doctorExperience?: string;
  
  diagnosis?: string;
  symptoms?: string[];
  
  drugName: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  notes?: string;
  
  medications?: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
    instructions?: string;
  }>;
  
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  issuedDate?: Timestamp;
  startDate?: string;
  endDate?: string;
  
  followUpDate?: string;
}

interface UserData {
  uid: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient';
  phone?: string;
  dob?: string;
  medicalHistory?: string;
  specialty?: string;
  experience?: string;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface FormData {
  patientName: string;
  patientAge: string;
  patientWeight: string;
  patientMedicalHistory: string;
  diagnosis: string;
  doctorName: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  notes: string;
  followUpDate: string;
  startDate: string;
}

export default function PrescriptionsScreen() {
  const router = useRouter();
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentMedication, setCurrentMedication] = useState<Medication>({
    id: '',
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    patientAge: '',
    patientWeight: '',
    patientMedicalHistory: '',
    diagnosis: '',
    doctorName: '',
    drugName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    notes: '',
    followUpDate: '',
    startDate: '',
  });

  // Calculate age from DOB
  const calculateAge = (dob: string): number | null => {
    if (!dob) return null;
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      return null;
    }
  };

  // Fetch prescriptions in real-time - FIXED VERSION without orderBy
  useEffect(() => {
    if (!userData?.uid) return;

    let unsubscribe: () => void;

    const setupRealtimeUpdates = async () => {
      try {
        const prescriptionsRef = collection(db, 'prescriptions');
        
        if (userData.role === 'doctor') {
          // Doctor sees prescriptions they created
          const q = query(
            prescriptionsRef, 
            where('doctorId', '==', userData.uid)
            // REMOVED orderBy to avoid index error
          );
          unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPrescriptions: Prescription[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              fetchedPrescriptions.push({
                id: doc.id,
                ...data
              } as Prescription);
            });
            // Sort manually on client side
            const sortedPrescriptions = fetchedPrescriptions.sort((a, b) => {
              const dateA = a.createdAt?.toDate() || new Date(0);
              const dateB = b.createdAt?.toDate() || new Date(0);
              return dateB.getTime() - dateA.getTime(); // Descending
            });
            setPrescriptions(sortedPrescriptions);
            setLoading(false);
          }, (error) => {
            console.error('Error fetching prescriptions:', error);
            setLoading(false);
          });
        } else if (userData.role === 'patient') {
          // Patient sees prescriptions assigned to them
          const q = query(
            prescriptionsRef, 
            where('patientId', '==', userData.uid)
            // REMOVED orderBy to avoid index error
          );
          unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPrescriptions: Prescription[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              fetchedPrescriptions.push({
                id: doc.id,
                ...data
              } as Prescription);
            });
            // Sort manually on client side
            const sortedPrescriptions = fetchedPrescriptions.sort((a, b) => {
              const dateA = a.createdAt?.toDate() || new Date(0);
              const dateB = b.createdAt?.toDate() || new Date(0);
              return dateB.getTime() - dateA.getTime(); // Descending
            });
            setPrescriptions(sortedPrescriptions);
            setLoading(false);
          }, (error) => {
            console.error('Error fetching prescriptions:', error);
            setLoading(false);
          });
        }
      } catch (error) {
        console.error('Error setting up realtime updates:', error);
        setLoading(false);
      }
    };

    setupRealtimeUpdates();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userData?.uid, userData?.role]);

  // Fetch patients list for doctors
  useEffect(() => {
    if (userData?.role === 'doctor') {
      const fetchPatients = async () => {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('role', '==', 'patient'));
          const querySnapshot = await getDocs(q);
          const patientsList: UserData[] = [];
          querySnapshot.forEach((doc) => {
            patientsList.push({ uid: doc.id, ...doc.data() } as UserData);
          });
          setPatients(patientsList);
        } catch (error) {
          console.error('Error fetching patients:', error);
        }
      };
      fetchPatients();
    }
  }, [userData?.role]);

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (prescription.diagnosis && prescription.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (prescription.notes && prescription.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientAge: '',
      patientWeight: '',
      patientMedicalHistory: '',
      diagnosis: '',
      doctorName: '',
      drugName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      notes: '',
      followUpDate: '',
      startDate: '',
    });
    setSelectedPatientId('');
    setEditingPrescription(null);
    setMedications([]);
    setCurrentMedication({
      id: '',
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
  };

  const handleSelectPatient = (patient: UserData) => {
    setSelectedPatientId(patient.uid);
    
    const age = patient.dob ? calculateAge(patient.dob) : null;
    
    setFormData(prev => ({
      ...prev,
      patientName: patient.name,
      patientAge: age ? age.toString() : '',
      patientMedicalHistory: patient.medicalHistory || '',
    }));
    setShowPatientSelector(false);
  };

  const addMedication = () => {
    if (!currentMedication.name.trim() || !currentMedication.dosage.trim() || !currentMedication.frequency.trim()) {
      Alert.alert('Error', 'Please fill in medication name, dosage, and frequency');
      return;
    }

    const newMedication: Medication = {
      id: currentMedication.id || Date.now().toString(),
      name: currentMedication.name.trim(),
      dosage: currentMedication.dosage.trim(),
      frequency: currentMedication.frequency.trim(),
      duration: currentMedication.duration.trim(),
      instructions: currentMedication.instructions.trim()
    };

    setMedications(prev => [...prev, newMedication]);
    
    if (medications.length === 0) {
      setFormData(prev => ({
        ...prev,
        drugName: currentMedication.name,
        dosage: currentMedication.dosage,
        frequency: currentMedication.frequency,
        duration: currentMedication.duration,
        instructions: currentMedication.instructions,
      }));
    }

    setCurrentMedication({
      id: '',
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
    setShowMedicationModal(false);
  };

  const removeMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const handleCreatePrescription = async () => {
    // Basic validation
    if (!formData.patientName.trim()) {
      Alert.alert('Error', 'Please enter patient name');
      return;
    }

    if (userData?.role === 'doctor' && !selectedPatientId) {
      Alert.alert('Error', 'Please select a patient');
      return;
    }

    if (medications.length === 0 && (!formData.drugName.trim() || !formData.dosage.trim() || !formData.frequency.trim())) {
      Alert.alert('Error', 'Please enter medication details');
      return;
    }

    try {
      const selectedPatient = patients.find(p => p.uid === selectedPatientId);
      
      const prescriptionData: any = {
        patientId: editingPrescription?.patientId || (userData?.role === 'patient' ? userData.uid : selectedPatientId),
        patientName: formData.patientName.trim(),
        patientEmail: selectedPatient?.email || userData?.email || '',
        patientPhone: selectedPatient?.phone || '',
        patientAge: formData.patientAge ? parseInt(formData.patientAge) : null,
        patientWeight: formData.patientWeight ? parseFloat(formData.patientWeight) : null,
        patientMedicalHistory: formData.patientMedicalHistory.trim(),
        
        doctorId: userData?.role === 'doctor' ? userData.uid : editingPrescription?.doctorId || '',
        doctorName: userData?.role === 'doctor' ? userData.name || userData.email : formData.doctorName.trim(),
        doctorEmail: userData?.role === 'doctor' ? userData.email : editingPrescription?.doctorEmail || '',
        doctorPhone: userData?.phone || '',
        doctorSpecialty: userData?.specialty || '',
        
        diagnosis: formData.diagnosis.trim(),
        
        status: 'active',
        createdAt: editingPrescription?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
        issuedDate: serverTimestamp(),
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        
        notes: formData.notes.trim(),
        followUpDate: formData.followUpDate || '',
      };

      if (medications.length > 0) {
        prescriptionData.medications = medications;
        prescriptionData.drugName = medications[0]?.name || '';
        prescriptionData.dosage = medications[0]?.dosage || '';
        prescriptionData.frequency = medications[0]?.frequency || '';
        prescriptionData.duration = medications[0]?.duration || '';
        prescriptionData.instructions = medications[0]?.instructions || '';
      } else {
        prescriptionData.drugName = formData.drugName.trim();
        prescriptionData.dosage = formData.dosage.trim();
        prescriptionData.frequency = formData.frequency.trim();
        prescriptionData.duration = formData.duration.trim();
        prescriptionData.instructions = formData.instructions.trim();
      }

      if (editingPrescription) {
        const prescriptionDoc = doc(db, 'prescriptions', editingPrescription.id);
        await updateDoc(prescriptionDoc, prescriptionData);
        Alert.alert('Success', 'Prescription updated successfully');
      } else {
        await addDoc(collection(db, 'prescriptions'), prescriptionData);
        Alert.alert('Success', 'Prescription created successfully');
      }

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving prescription:', error);
      Alert.alert('Error', 'Failed to save prescription');
    }
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    
    setFormData({
      patientName: prescription.patientName,
      patientAge: prescription.patientAge?.toString() || '',
      patientWeight: prescription.patientWeight?.toString() || '',
      patientMedicalHistory: prescription.patientMedicalHistory || '',
      diagnosis: prescription.diagnosis || '',
      doctorName: prescription.doctorName,
      drugName: prescription.drugName,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration || '',
      instructions: prescription.instructions || '',
      notes: prescription.notes || '',
      followUpDate: prescription.followUpDate || '',
      startDate: prescription.startDate || '',
    });

    if (prescription.medications && prescription.medications.length > 0) {
      const meds: Medication[] = prescription.medications.map(med => ({
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration || '',
        instructions: med.instructions || ''
      }));
      setMedications(meds);
    }

    setSelectedPatientId(prescription.patientId);
    setShowCreateModal(true);
  };

  const handleDeletePrescription = async (id: string) => {
    Alert.alert(
      'Delete Prescription',
      'Are you sure you want to delete this prescription?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'prescriptions', id));
              Alert.alert('Success', 'Prescription deleted successfully');
            } catch (error) {
              console.error('Error deleting prescription:', error);
              Alert.alert('Error', 'Failed to delete prescription');
            }
          },
        },
      ]
    );
  };

  const handleEmailPrescription = async (prescription: Prescription) => {
    try {
      let patientEmail = prescription.patientEmail;
      if (!patientEmail && prescription.patientId) {
        try {
          const patientDoc = await getDocs(
            query(collection(db, 'users'), where('uid', '==', prescription.patientId))
          );
          if (!patientDoc.empty) {
            patientEmail = patientDoc.docs[0].data().email;
          }
        } catch (error) {
          console.error('Error fetching patient email:', error);
        }
      }

      const subject = `Prescription from ${prescription.doctorName}`;
      const body = generateEmailBody(prescription, patientEmail);
      
      const mailtoLink = `mailto:${patientEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      const canOpen = await Linking.canOpenURL(mailtoLink);
      
      if (canOpen) {
        await Linking.openURL(mailtoLink);
      } else {
        Alert.alert(
          'Email App Not Found',
          'No email app detected.',
          [{ text: 'OK', style: 'cancel' }]
        );
      }
    } catch (error) {
      console.error('Error sending email:', error);
      Alert.alert('Error', 'Failed to open email app');
    }
  };

  const generateEmailBody = (prescription: Prescription, patientEmail?: string): string => {
    let body = `PRESCRIPTION DETAILS\n`;
    body += `===================\n\n`;
    
    body += `PATIENT INFORMATION:\n`;
    body += `Name: ${prescription.patientName}\n`;
    if (prescription.patientAge) body += `Age: ${prescription.patientAge}\n`;
    if (prescription.patientWeight) body += `Weight: ${prescription.patientWeight} kg\n`;
    if (patientEmail) body += `Email: ${patientEmail}\n`;
    
    body += `\nDOCTOR INFORMATION:\n`;
    body += `Doctor: ${prescription.doctorName}\n`;
    if (prescription.doctorEmail) body += `Email: ${prescription.doctorEmail}\n`;
    
    body += `\nPRESCRIPTION:\n`;
    if (prescription.diagnosis) body += `Diagnosis: ${prescription.diagnosis}\n`;
    
    if (prescription.medications && prescription.medications.length > 0) {
      prescription.medications.forEach((med, index) => {
        body += `\n${index + 1}. ${med.name}\n`;
        body += `   Dosage: ${med.dosage}\n`;
        body += `   Frequency: ${med.frequency}\n`;
        if (med.duration) body += `   Duration: ${med.duration}\n`;
        if (med.instructions) body += `   Instructions: ${med.instructions}\n`;
      });
    } else {
      body += `Medication: ${prescription.drugName}\n`;
      body += `Dosage: ${prescription.dosage}\n`;
      body += `Frequency: ${prescription.frequency}\n`;
      if (prescription.duration) body += `Duration: ${prescription.duration}\n`;
      if (prescription.instructions) body += `Instructions: ${prescription.instructions}\n`;
    }
    
    if (prescription.notes && prescription.notes.trim() !== '') {
      body += `\nADDITIONAL NOTES:\n${prescription.notes}\n`;
    }
    
    body += `\nPRESCRIPTION DATE: ${new Date().toLocaleDateString()}\n`;
    body += `PRESCRIPTION ID: ${prescription.id}\n`;
    
    return body;
  };

  const renderPrescriptionCard = ({ item }: { item: Prescription }) => (
    <View style={styles.prescriptionCard}>
      <View style={styles.cardHeader}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.patientDetails}>
            {item.patientAge && `Age: ${item.patientAge} • `}
            {item.patientWeight && `Weight: ${item.patientWeight}kg`}
            <Text style={[styles.statusBadge, styles[`status${item.status}`]]}>
              {item.status.toUpperCase()}
            </Text>
          </Text>
        </View>
        <View style={styles.cardActions}>
          {userData?.role === 'doctor' && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditPrescription(item)}
              >
                <Edit3 size={16} color="#0077B6" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEmailPrescription(item)}
              >
                <Mail size={16} color="#4CAF50" />
              </TouchableOpacity>
            </>
          )}
          {userData?.role === 'doctor' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeletePrescription(item.id)}
            >
              <Trash2 size={16} color="#FF5252" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.doctorSection}>
        <Stethoscope size={16} color="#666" />
        <Text style={styles.doctorName}>{item.doctorName}</Text>
      </View>

      <View style={styles.prescriptionDetails}>
        <View style={styles.detailRow}>
          <Pill size={16} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Medication</Text>
            <Text style={styles.detailValue}>{item.drugName}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Hash size={16} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Dosage</Text>
            <Text style={styles.detailValue}>{item.dosage}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Clock size={16} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Frequency</Text>
            <Text style={styles.detailValue}>{item.frequency}</Text>
          </View>
        </View>
        
        {/* EXTRA NOTES SECTION */}
        {item.notes && item.notes.trim() !== '' && (
          <View style={styles.detailRow}>
            <FileText size={16} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.detailValue}>{item.notes}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.createdDate}>
          Created: {item.createdAt?.toDate().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077B6" />
        <Text style={styles.loadingText}>Loading prescriptions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prescriptions</Text>
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
            placeholder="Search prescriptions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {filteredPrescriptions.length > 0 ? (
        <FlatList
          data={filteredPrescriptions}
          renderItem={renderPrescriptionCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.prescriptionsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon={<Pill size={60} color="#ccc" />}
          title="No prescriptions found"
          description={searchQuery ? "No prescriptions match your search" : "No prescriptions available"}
          buttonText={userData?.role === 'doctor' ? "Create Prescription" : "Browse Doctors"}
          onPress={() => {
            if (userData?.role === 'doctor') {
              setShowCreateModal(true);
            } else {
              router.push('/');
            }
          }}
        />
      )}

      {/* Patient Selector Modal */}
      <Modal
        visible={showPatientSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPatientSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.patientSelectorModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Patient</Text>
              <TouchableOpacity onPress={() => setShowPatientSelector(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={patients}
              keyExtractor={(item) => item.uid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.patientItem}
                  onPress={() => handleSelectPatient(item)}
                >
                  <View>
                    <Text style={styles.patientItemName}>{item.name}</Text>
                    <Text style={styles.patientItemEmail}>{item.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Medication Modal */}
      <Modal
        visible={showMedicationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMedicationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.medicationModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Medication</Text>
              <TouchableOpacity onPress={() => setShowMedicationModal(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Medication Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter medication name"
                  value={currentMedication.name}
                  onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, name: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dosage *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 500mg"
                  value={currentMedication.dosage}
                  onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, dosage: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Frequency *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 3 times daily"
                  value={currentMedication.frequency}
                  onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, frequency: text }))}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowMedicationModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={addMedication}
              >
                <Text style={styles.createButtonText}>Add Medication</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create/Edit Prescription Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        onRequestClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingPrescription ? 'Edit Prescription' : 'Create Prescription'}
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

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {userData?.role === 'doctor' && !editingPrescription && (
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Select Patient</Text>
                <TouchableOpacity
                  style={styles.patientSelectButton}
                  onPress={() => setShowPatientSelector(true)}
                >
                  <Text style={selectedPatientId ? styles.patientSelectText : styles.patientSelectPlaceholder}>
                    {selectedPatientId ? formData.patientName : 'Tap to select patient'}
                  </Text>
                  <User size={20} color="#666" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Patient Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Patient Name *</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, patientName: text }))}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Age"
                    value={formData.patientAge}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, patientAge: text }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Weight (kg)</Text>
                <View style={styles.inputContainer}>
                  <Weight size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Weight"
                    value={formData.patientWeight}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, patientWeight: text }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Medical History</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Any relevant medical history, allergies, etc."
                  value={formData.patientMedicalHistory}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, patientMedicalHistory: text }))}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Medical Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Diagnosis/Condition</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter diagnosis or condition"
                  value={formData.diagnosis}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, diagnosis: text }))}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Medication Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Medication Name *</Text>
                <View style={styles.inputContainer}>
                  <Pill size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter medication name"
                    value={formData.drugName}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, drugName: text }))}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dosage *</Text>
                <View style={styles.inputContainer}>
                  <Hash size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 500mg"
                    value={formData.dosage}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, dosage: text }))}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Frequency *</Text>
                <View style={styles.inputContainer}>
                  <Clock size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 3 times daily"
                    value={formData.frequency}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, frequency: text }))}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Duration</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 7 days"
                    value={formData.duration}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, duration: text }))}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Instructions</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Special instructions for taking this medication..."
                  value={formData.instructions}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, instructions: text }))}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* EXTRA NOTES FIELD */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Extra Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add any additional notes or instructions..."
                  value={formData.notes}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Start Date</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD (Optional)"
                    value={formData.startDate}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Follow-up Date</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={formData.followUpDate}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, followUpDate: text }))}
                  />
                </View>
              </View>
            </View>
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
              onPress={handleCreatePrescription}
            >
              <Text style={styles.createButtonText}>
                {editingPrescription ? 'Update' : 'Create'} Prescription
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
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
    fontSize: 15,
    color: '#333',
  },
  prescriptionsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  prescriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusactive: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  statuscompleted: {
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  },
  statuscancelled: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  statusexpired: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
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
  doctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0077B6',
    marginLeft: 8,
  },
  prescriptionDetails: {
    gap: 12,
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
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  cardFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  createdDate: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  patientSelectorModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  medicationModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  patientItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  patientItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  patientItemEmail: {
    fontSize: 14,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  patientSelectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: '#FAFAFA',
  },
  patientSelectText: {
    fontSize: 15,
    color: '#333',
  },
  patientSelectPlaceholder: {
    fontSize: 15,
    color: '#999',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    minHeight: 50,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: '500',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});