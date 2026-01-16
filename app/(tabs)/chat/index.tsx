// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   Image,
//   Alert,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../../../hooks/useAuth';
// import { Colors } from '../../../constants/Colors';
// import { Ionicons } from '@expo/vector-icons';
// import { getAllUsers, getUsersByRole, UserProfile } from '../../../services/userService';
// import { collection, onSnapshot } from 'firebase/firestore';
// import { db } from '../../../services/firebase';

// export default function ChatListScreen() {
//   const router = useRouter();
//   const { user, userData } = useAuth();
//   const [users, setUsers] = useState<UserProfile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [recentChats, setRecentChats] = useState<any[]>([]);

//   useEffect(() => {
//     const loadData = async () => {
//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       try {
//         // Load users based on role
//         let loadedUsers: UserProfile[] = [];
        
//         if (userData?.role === 'patient') {
//           // Patients see doctors
//           loadedUsers = await getUsersByRole('doctor', user.uid);
//         } else if (userData?.role === 'doctor') {
//           // Doctors see patients
//           loadedUsers = await getUsersByRole('patient', user.uid);
//         } else {
//           // Default: show all users
//           loadedUsers = await getAllUsers(user.uid);
//         }
        
//         setUsers(loadedUsers);
        
//         // Load recent chats (simplified without index)
//         loadRecentChats();
//       } catch (error) {
//         console.error('Error loading users:', error);
//         // Don't show alert if it's just permission error during development
//         if (error.code !== 'permission-denied') {
//           Alert.alert('Error', 'Failed to load users');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [user, userData]);

//   const loadRecentChats = () => {
//     if (!user) return;

//     try {
//       const chatsRef = collection(db, 'chats');
      
//       const unsubscribe = onSnapshot(chatsRef, 
//         (snapshot) => {
//           const allChats = snapshot.docs.map(doc => {
//             const data = doc.data();
//             return {
//               id: doc.id,
//               ...data,
//             };
//           });
          
//           // Filter for user's chats in memory
//           const userChats = allChats.filter(chat => 
//             chat.participants?.includes(user.uid)
//           );
          
//           // Sort by lastMessageAt
//           userChats.sort((a, b) => {
//             const timeA = a.lastMessageAt?.toDate?.()?.getTime() || 
//                          a.lastMessageAt?.seconds * 1000 || 0;
//             const timeB = b.lastMessageAt?.toDate?.()?.getTime() || 
//                          b.lastMessageAt?.seconds * 1000 || 0;
//             return timeB - timeA; // Descending
//           });
          
//           setRecentChats(userChats);
//         },
//         (error) => {
//           console.error('Error in chats listener:', error);
//           // Silently handle permission errors during development
//           if (error.code !== 'permission-denied') {
//             Alert.alert('Error', 'Failed to load recent chats');
//           }
//         }
//       );

//       return unsubscribe;
//     } catch (error) {
//       console.error('Error setting up chats listener:', error);
//     }
//   };

//   const handleUserSelect = (selectedUser: UserProfile) => {
//     console.log('Starting chat with:', selectedUser.displayName);
    
//     router.push({
//       pathname: '/chat/conversation',
//       params: {
//         userId: selectedUser.uid,
//         userName: selectedUser.displayName || 'User',
//         userAvatar: selectedUser.photoURL || '',
//       }
//     });
//   };

//   const handleChatSelect = (chat: any) => {
//     const otherParticipantId = chat.participants?.find((id: string) => id !== user?.uid);
//     const otherParticipantName = chat.participantNames?.[otherParticipantId] || 'User';
    
//     router.push({
//       pathname: '/chat/conversation',
//       params: {
//         userId: otherParticipantId,
//         userName: otherParticipantName,
//         userAvatar: chat.participantPhotos?.[otherParticipantId] || '',
//         chatId: chat.id,
//       }
//     });
//   };

//   const renderUserItem = ({ item }: { item: UserProfile }) => (
//     <TouchableOpacity
//       style={styles.userItem}
//       onPress={() => handleUserSelect(item)}
//     >
//       <View style={styles.userInfo}>
//         {item.photoURL ? (
//           <Image source={{ uri: item.photoURL }} style={styles.avatar} />
//         ) : (
//           <View style={[
//             styles.avatarPlaceholder,
//             { backgroundColor: item.role === 'doctor' ? Colors.primary : Colors.secondary }
//           ]}>
//             <Text style={styles.avatarText}>
//               {(item.displayName || 'U').charAt(0).toUpperCase()}
//             </Text>
//           </View>
//         )}
//         <View style={styles.userDetails}>
//           <Text style={styles.userName}>{item.displayName || 'User'}</Text>
//           <Text style={styles.userRole}>
//             {item.role === 'doctor' ? 'Doctor' : 'Patient'}
//             {item.specialty ? ` • ${item.specialty}` : ''}
//           </Text>
//         </View>
//         <Ionicons name="chevron-forward" size={24} color={Colors.textLight} />
//       </View>
//     </TouchableOpacity>
//   );

//   const renderChatItem = ({ item }: { item: any }) => {
//     const otherParticipantId = item.participants?.find((id: string) => id !== user?.uid);
//     const otherParticipantName = item.participantNames?.[otherParticipantId] || 'User';
    
//     return (
//       <TouchableOpacity
//         style={styles.chatItem}
//         onPress={() => handleChatSelect(item)}
//       >
//         <View style={styles.chatInfo}>
//           {item.participantPhotos?.[otherParticipantId] ? (
//             <Image 
//               source={{ uri: item.participantPhotos[otherParticipantId] }} 
//               style={styles.chatAvatar} 
//             />
//           ) : (
//             <View style={styles.chatAvatarPlaceholder}>
//               <Text style={styles.chatAvatarText}>
//                 {(otherParticipantName || 'U').charAt(0).toUpperCase()}
//               </Text>
//             </View>
//           )}
//           <View style={styles.chatDetails}>
//             <Text style={styles.chatName}>{otherParticipantName || 'User'}</Text>
//             <Text style={styles.lastMessage} numberOfLines={1}>
//               {item.lastMessage || 'No messages yet'}
//             </Text>
//           </View>
//         </View>
//         <View style={styles.chatMeta}>
//           {item.lastMessageAt && (
//             <Text style={styles.timeText}>
//               {(() => {
//                 try {
//                   const date = item.lastMessageAt?.toDate?.() || 
//                               new Date(item.lastMessageAt?.seconds * 1000);
//                   return date.toLocaleTimeString([], { 
//                     hour: '2-digit', 
//                     minute: '2-digit' 
//                   });
//                 } catch (e) {
//                   return '';
//                 }
//               })()}
//             </Text>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>Please log in to access chat</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>
//           {userData?.role === 'doctor' ? 'Patient Chats' : 'Chat with Doctors'}
//         </Text>
//       </View>

//       {recentChats.length > 0 && (
//         <>
//           <Text style={styles.sectionTitle}>Recent Chats</Text>
//           <FlatList
//             data={recentChats}
//             renderItem={renderChatItem}
//             keyExtractor={(item) => item.id}
//             scrollEnabled={false}
//             contentContainerStyle={styles.recentChatsList}
//           />
//         </>
//       )}

//       <Text style={styles.sectionTitle}>
//         {userData?.role === 'doctor' ? 'All Patients' : 'All Doctors'}
//       </Text>
      
//       {users.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="people-outline" size={64} color={Colors.textLight} />
//           <Text style={styles.emptyTitle}>
//             {userData?.role === 'doctor' ? 'No patients found' : 'No doctors found'}
//           </Text>
//           <Text style={styles.emptySubtitle}>
//             Check your Firestore permissions or try refreshing
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={users}
//           renderItem={renderUserItem}
//           keyExtractor={(item) => item.uid}
//           contentContainerStyle={styles.usersList}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// }

// // Styles remain the same...
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.background,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: Colors.textLight,
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     backgroundColor: Colors.white,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: Colors.textDark,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.textDark,
//     marginTop: 20,
//     marginBottom: 12,
//     marginHorizontal: 20,
//   },
//   recentChatsList: {
//     paddingHorizontal: 20,
//   },
//   usersList: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   chatItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: Colors.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   chatInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   chatAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   chatAvatarPlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: Colors.primaryLight,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   chatAvatarText: {
//     color: Colors.primary,
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   chatDetails: {
//     flex: 1,
//   },
//   chatName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.textDark,
//     marginBottom: 4,
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: Colors.textLight,
//   },
//   chatMeta: {
//     alignItems: 'flex-end',
//   },
//   timeText: {
//     fontSize: 12,
//     color: Colors.textLight,
//   },
//   userItem: {
//     backgroundColor: Colors.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 16,
//   },
//   avatarPlaceholder: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   avatarText: {
//     color: Colors.white,
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   userDetails: {
//     flex: 1,
//   },
//   userName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.textDark,
//     marginBottom: 4,
//   },
//   userRole: {
//     fontSize: 14,
//     color: Colors.textLight,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.textLight,
//     marginTop: 16,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: Colors.textLight,
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: Colors.error,
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useAuth } from '../../../hooks/useAuth';
import { db } from '../../../services/firebase';
import { getAllUsers, getUsersByRole, UserProfile } from '../../../services/userService';

export default function ChatListScreen() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [showAllRecentChats, setShowAllRecentChats] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        let loadedUsers: UserProfile[] = [];
        
        if (userData?.role === 'patient') {
          loadedUsers = await getUsersByRole('doctor', user.uid);
        } else if (userData?.role === 'doctor') {
          loadedUsers = await getUsersByRole('patient', user.uid);
        } else {
          loadedUsers = await getAllUsers(user.uid);
        }
        
        setUsers(loadedUsers);
        setFilteredUsers(loadedUsers);
        
        loadRecentChats();
      } catch (error) {
        console.error('Error loading users:', error);
        if (error.code !== 'permission-denied') {
          Alert.alert('Error', 'Failed to load users');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, userData]);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(userItem =>
        userItem.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userItem.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userItem.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const loadRecentChats = () => {
    if (!user) return;

    try {
      const chatsRef = collection(db, 'chats');
      
      const unsubscribe = onSnapshot(chatsRef, 
        (snapshot) => {
          const allChats = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
            };
          });
          
          const userChats = allChats.filter(chat => 
            chat.participants?.includes(user.uid)
          );
          
          userChats.sort((a, b) => {
            const timeA = a.lastMessageAt?.toDate?.()?.getTime() || 
                         a.lastMessageAt?.seconds * 1000 || 0;
            const timeB = b.lastMessageAt?.toDate?.()?.getTime() || 
                         b.lastMessageAt?.seconds * 1000 || 0;
            return timeB - timeA;
          });
          
          setRecentChats(userChats);
        },
        (error) => {
          console.error('Error in chats listener:', error);
          if (error.code !== 'permission-denied') {
            Alert.alert('Error', 'Failed to load recent chats');
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up chats listener:', error);
    }
  };

  const handleUserSelect = (selectedUser: UserProfile) => {
    router.push({
      pathname: '/chat/conversation',
      params: {
        userId: selectedUser.uid,
        userName: selectedUser.displayName || 'User',
        userAvatar: selectedUser.photoURL || '',
      }
    });
  };

  const handleChatSelect = (chat: any) => {
    const otherParticipantId = chat.participants?.find((id: string) => id !== user?.uid);
    const otherParticipantName = chat.participantNames?.[otherParticipantId] || 'User';
    
    router.push({
      pathname: '/chat/conversation',
      params: {
        userId: otherParticipantId,
        userName: otherParticipantName,
        userAvatar: chat.participantPhotos?.[otherParticipantId] || '',
        chatId: chat.id,
      }
    });
  };

  const handleSeeAllRecentChats = () => {
    setShowAllRecentChats(true);
  };

  const formatMessageTime = (timestamp: any) => {
    try {
      const date = timestamp?.toDate?.() || new Date(timestamp?.seconds * 1000);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (e) {
      return '';
    }
  };

  const getOnlineStatus = (userItem: UserProfile) => {
    // This would come from your backend in a real app
    // For now, we'll simulate based on last activity
    return Math.random() > 0.5; // Simulated
  };

  const renderUserItem = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          {item.photoURL ? (
            <Image source={{ uri: item.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[
              styles.avatarPlaceholder,
              { backgroundColor: item.role === 'doctor' ? Colors.primary : Colors.secondary }
            ]}>
              <Text style={styles.avatarText}>
                {(item.displayName || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {getOnlineStatus(item) && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.userDetails}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{item.displayName || 'User'}</Text>
            {item.role === 'doctor' && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} style={styles.verifiedIcon} />
            )}
          </View>
          <Text style={styles.userRole}>
            {item.role === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}
            {item.specialty ? ` • ${item.specialty}` : ''}
          </Text>
          {item.bio && (
            <Text style={styles.userBio} numberOfLines={1}>
              {item.bio}
            </Text>
          )}
        </View>
        <View style={styles.chevronContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }: { item: any, index?: number }) => {
    const otherParticipantId = item.participants?.find((id: string) => id !== user?.uid);
    const otherParticipantName = item.participantNames?.[otherParticipantId] || 'User';
    const hasUnread = item.unreadCount && item.unreadCount > 0;
    
    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          hasUnread && styles.unreadChatItem,
          showAllRecentChats && styles.fullWidthChatItem
        ]}
        onPress={() => handleChatSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.chatInfo}>
          <View style={styles.avatarContainer}>
            {item.participantPhotos?.[otherParticipantId] ? (
              <Image 
                source={{ uri: item.participantPhotos[otherParticipantId] }} 
                style={styles.chatAvatar} 
              />
            ) : (
              <View style={styles.chatAvatarPlaceholder}>
                <Text style={styles.chatAvatarText}>
                  {(otherParticipantName || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {hasUnread && <View style={styles.unreadBadge} />}
          </View>
          <View style={styles.chatDetails}>
            <View style={styles.chatHeader}>
              <Text style={[
                styles.chatName,
                hasUnread && styles.unreadChatName
              ]}>
                {otherParticipantName || 'User'}
              </Text>
              {item.lastMessageAt && (
                <Text style={styles.timeText}>
                  {formatMessageTime(item.lastMessageAt)}
                </Text>
              )}
            </View>
            <Text 
              style={[
                styles.lastMessage,
                hasUnread && styles.unreadLastMessage
              ]} 
              numberOfLines={showAllRecentChats ? 2 : 1}
            >
              {item.lastMessage || 'No messages yet'}
            </Text>
            {hasUnread && (
              <View style={styles.unreadCountContainer}>
                <View style={styles.unreadCountBadge}>
                  <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecentChatsModal = () => (
    <Modal
      visible={showAllRecentChats}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAllRecentChats(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>All Recent Chats</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowAllRecentChats(false)}
          >
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        
        {recentChats.length === 0 ? (
          <View style={styles.modalEmptyContainer}>
            <Ionicons name="chatbubbles-outline" size={80} color={Colors.lightGray} />
            <Text style={styles.modalEmptyTitle}>No recent chats</Text>
            <Text style={styles.modalEmptySubtitle}>Start a conversation with someone</Text>
          </View>
        ) : (
          <FlatList
            data={recentChats}
            renderItem={({ item }) => renderChatItem({ item })}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.modalChatList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please log in to access chat</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {recentChats.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Chats</Text>
            <TouchableOpacity onPress={handleSeeAllRecentChats}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentChats.slice(0, 5)} // Show only first 5 in preview
            renderItem={({ item }) => renderChatItem({ item })}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentChatsList}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={320}
          />
        </View>
      )}

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {userData?.role === 'doctor' ? 'All Patients' : 'All Doctors'}
          </Text>
          <Text style={styles.sectionCount}>{filteredUsers.length} available</Text>
        </View>
        
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="people-outline" size={80} color={Colors.lightGray} />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No users found' : 
               userData?.role === 'doctor' ? 'No patients found' : 'No doctors found'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try a different search term' : 'Check back later for new users'}
            </Text>
          </View>
        ) : (
          <View style={styles.usersListContainer}>
            {filteredUsers.map((userItem) => (
              <View key={userItem.uid} style={styles.userItemWrapper}>
                {renderUserItem({ item: userItem })}
              </View>
            ))}
          </View>
        )}
      </View>

      {renderRecentChatsModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textLight,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  sectionCount: {
    fontSize: 14,
    color: Colors.textLight,
  },
  recentChatsList: {
    paddingRight: 24,
    paddingBottom: 8,
  },
  chatItem: {
    width: 320,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  fullWidthChatItem: {
    width: '100%',
    marginRight: 0,
    marginBottom: 12,
  },
  unreadChatItem: {
    backgroundColor: Colors.lightPrimary,
    borderColor: Colors.primary,
  },
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  chatAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
  },
  unreadBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  chatDetails: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  unreadChatName: {
    color: Colors.text,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  unreadLastMessage: {
    color: Colors.text,
    fontWeight: '500',
  },
  unreadCountContainer: {
    marginTop: 4,
  },
  unreadCountBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  unreadCountText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '600',
  },
  usersListContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 4,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userItemWrapper: {
    marginBottom: 4,
  },
  userItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  userRole: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  userBio: {
    fontSize: 12,
    color: Colors.textLight,
  },
  chevronContainer: {
    paddingHorizontal: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginTop: 8,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.lightGray + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalChatList: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  modalEmptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  modalEmptySubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});