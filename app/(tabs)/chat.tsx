// // import { useState } from 'react';
// // import { 
// //   StyleSheet, 
// //   Text, 
// //   View, 
// //   FlatList, 
// //   TouchableOpacity, 
// //   TextInput 
// // } from 'react-native';
// // import { Colors } from '../../constants/Colors';
// // import { Ionicons } from '@expo/vector-icons';

// // interface Chat {
// //   id: string;
// //   name: string;
// //   lastMessage: string;
// //   time: string;
// //   unread: number;
// //   avatarColor: string;
// // }

// // export default function ChatScreen() {
// //   const [chats, setChats] = useState<Chat[]>([
// //     { id: '1', name: 'Dr. Sarah Johnson', lastMessage: 'How are you feeling today?', time: '10:30 AM', unread: 2, avatarColor: '#4CAF50' },
// //     { id: '2', name: 'Dr. Michael Chen', lastMessage: 'Test results are ready', time: 'Yesterday', unread: 0, avatarColor: '#2196F3' },
// //     { id: '3', name: 'Nurse Emma Wilson', lastMessage: 'Don\'t forget your appointment', time: '2 days ago', unread: 1, avatarColor: '#FF9800' },
// //     { id: '4', name: 'Dr. Robert Kim', lastMessage: 'Prescription sent to pharmacy', time: '3 days ago', unread: 0, avatarColor: '#9C27B0' },
// //     { id: '5', name: 'Support Team', lastMessage: 'How can we help you?', time: '1 week ago', unread: 0, avatarColor: '#607D8B' },
// //   ]);

// //   const [searchQuery, setSearchQuery] = useState('');

// //   const filteredChats = chats.filter(chat =>
// //     chat.name.toLowerCase().includes(searchQuery.toLowerCase())
// //   );

// //   const renderChatItem = ({ item }: { item: Chat }) => (
// //     <TouchableOpacity style={styles.chatItem}>
// //       <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
// //         <Text style={styles.avatarText}>
// //           {item.name.split(' ').map(n => n[0]).join('')}
// //         </Text>
// //       </View>
// //       <View style={styles.chatContent}>
// //         <View style={styles.chatHeader}>
// //           <Text style={styles.chatName}>{item.name}</Text>
// //           <Text style={styles.chatTime}>{item.time}</Text>
// //         </View>
// //         <Text style={styles.lastMessage} numberOfLines={1}>
// //           {item.lastMessage}
// //         </Text>
// //       </View>
// //       {item.unread > 0 && (
// //         <View style={styles.unreadBadge}>
// //           <Text style={styles.unreadText}>{item.unread}</Text>
// //         </View>
// //       )}
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       {/* Search Bar */}
// //       <View style={styles.searchContainer}>
// //         <Ionicons name="search" size={20} color={Colors.textLight} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search chats..."
// //           value={searchQuery}
// //           onChangeText={setSearchQuery}
// //           placeholderTextColor={Colors.textLight}
// //         />
// //       </View>

// //       {/* New Chat Button */}
// //       <TouchableOpacity style={styles.newChatButton}>
// //         <Ionicons name="add-circle" size={24} color={Colors.white} />
// //         <Text style={styles.newChatText}>New Chat</Text>
// //       </TouchableOpacity>

// //       {/* Chat List */}
// //       <FlatList
// //         data={filteredChats}
// //         renderItem={renderChatItem}
// //         keyExtractor={item => item.id}
// //         contentContainerStyle={styles.chatList}
// //         showsVerticalScrollIndicator={false}
// //       />

// //       {/* Empty State */}
// //       {filteredChats.length === 0 && (
// //         <View style={styles.emptyContainer}>
// //           <Ionicons name="chatbubbles-outline" size={80} color={Colors.textLight} />
// //           <Text style={styles.emptyText}>No chats found</Text>
// //           <Text style={styles.emptySubtext}>Try a different search term</Text>
// //         </View>
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: Colors.background,
// //   },
// //   searchContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: Colors.white,
// //     margin: 15,
// //     paddingHorizontal: 15,
// //     paddingVertical: 10,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     borderColor: Colors.border,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     marginLeft: 10,
// //     fontSize: 16,
// //     color: Colors.text,
// //   },
// //   newChatButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: Colors.primary,
// //     marginHorizontal: 15,
// //     marginBottom: 15,
// //     padding: 15,
// //     borderRadius: 10,
// //   },
// //   newChatText: {
// //     color: Colors.white,
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginLeft: 8,
// //   },
// //   chatList: {
// //     paddingBottom: 20,
// //   },
// //   chatItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: Colors.white,
// //     marginHorizontal: 15,
// //     marginBottom: 10,
// //     padding: 15,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     borderColor: Colors.border,
// //   },
// //   avatar: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   avatarText: {
// //     color: Colors.white,
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   chatContent: {
// //     flex: 1,
// //     marginLeft: 15,
// //   },
// //   chatHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 5,
// //   },
// //   chatName: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: Colors.text,
// //   },
// //   chatTime: {
// //     fontSize: 12,
// //     color: Colors.textLight,
// //   },
// //   lastMessage: {
// //     fontSize: 14,
// //     color: Colors.textLight,
// //   },
// //   unreadBadge: {
// //     backgroundColor: Colors.primary,
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginLeft: 10,
// //   },
// //   unreadText: {
// //     color: Colors.white,
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   emptyContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingBottom: 100,
// //   },
// //   emptyText: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: Colors.text,
// //     marginTop: 20,
// //   },
// //   emptySubtext: {
// //     fontSize: 14,
// //     color: Colors.textLight,
// //     marginTop: 5,
// //   },
// // });

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View,
//   StyleSheet,
//   Platform,
//   KeyboardAvoidingView,
//   Text,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   StatusBar,
//   SafeAreaView,
// } from 'react-native';
// import { GiftedChat, IMessage, Bubble, Send, InputToolbar, Composer, Day } from 'react-native-gifted-chat';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   serverTimestamp,
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
//   getDocs,
//   limit,
//   startAfter,
//   DocumentData,
//   QueryDocumentSnapshot,
// } from 'firebase/firestore';
// import { db, auth } from '../../services/firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import { useNavigation, useRoute } from '@react-navigation/native';

// interface ChatParams {
//   userId: string;
//   userName: string;
//   userAvatar?: string;
//   chatId?: string;
// }

// const ChatScreen: React.FC = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
  
//   // Get parameters with safe extraction
//   const getChatParams = (): ChatParams | null => {
//     if (!route.params) {
//       console.log('No route parameters provided');
//       return null;
//     }
    
//     const params = route.params as any;
//     console.log('Route parameters received:', params);
    
//     // Validate required parameters
//     if (!params?.userId) {
//       console.error('Missing required parameter: userId');
//       return null;
//     }
    
//     return {
//       userId: params.userId,
//       userName: params.userName || 'User',
//       userAvatar: params.userAvatar || '',
//       chatId: params.chatId || '',
//     };
//   };

//   const chatParams = getChatParams();
//   const userId = chatParams?.userId || '';
//   const userName = chatParams?.userName || 'User';
//   const userAvatar = chatParams?.userAvatar || '';
//   const existingChatId = chatParams?.chatId || '';

//   // State
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const [chatId, setChatId] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [error, setError] = useState<string>('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMoreMessages, setHasMoreMessages] = useState(true);
  
//   // Refs
//   const lastVisibleRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
//   const messagesPerPage = 20;
//   const chatListenerRef = useRef<() => void>(() => {});
//   const isInitializedRef = useRef(false);

//   // Constants
//   const COLORS = {
//     primary: '#007AFF',
//     secondary: '#5856D6',
//     background: '#FFFFFF',
//     chatBubble: '#F0F0F0',
//     textDark: '#000000',
//     textLight: '#666666',
//     border: '#E8E8E8',
//     error: '#FF3B30',
//     warning: '#FF9500',
//     success: '#34C759',
//     white: '#FFFFFF',
//   };

//   // Debug logs
//   useEffect(() => {
//     console.log('=== ChatScreen Mounted ===');
//     console.log('User ID from params:', userId);
//     console.log('User Name from params:', userName);
//     console.log('Existing Chat ID:', existingChatId);
//     console.log('Current Chat ID:', chatId);
//   }, [userId, userName, existingChatId, chatId]);

//   // Format timestamp
//   const formatTime = useCallback((date: Date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   }, []);

//   // Generate chat ID
//   const generateChatId = useCallback((uid1: string, uid2: string) => {
//     return [uid1, uid2].sort().join('_');
//   }, []);

//   // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       console.log('Auth state changed. User:', currentUser?.uid);
//       setUser(currentUser);
//       setAuthLoading(false);
      
//       if (currentUser) {
//         try {
//           const userRef = doc(db, 'users', currentUser.uid);
//           const userSnap = await getDoc(userRef);
          
//           if (!userSnap.exists()) {
//             await setDoc(userRef, {
//               uid: currentUser.uid,
//               displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
//               email: currentUser.email,
//               photoURL: currentUser.photoURL || null,
//               lastSeen: serverTimestamp(),
//               isOnline: true,
//               createdAt: serverTimestamp(),
//               updatedAt: serverTimestamp(),
//             });
//           } else {
//             await updateDoc(userRef, {
//               lastSeen: serverTimestamp(),
//               isOnline: true,
//             });
//           }
//         } catch (error) {
//           console.error('Error updating user profile:', error);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Initialize chat
//   useEffect(() => {
//     const initializeChat = async () => {
//       console.log('Initializing chat...', {
//         authLoading,
//         user: user?.uid,
//         userId,
//         existingChatId,
//         isInitialized: isInitializedRef.current
//       });

//       if (authLoading) {
//         console.log('Waiting for auth to load...');
//         return;
//       }

//       if (!user) {
//         console.log('No authenticated user');
//         setError('Please log in to chat');
//         setLoading(false);
//         return;
//       }

//       if (!userId) {
//         console.log('No recipient user ID provided');
//         setError('No user selected for chat');
//         setLoading(false);
//         return;
//       }

//       if (isInitializedRef.current) {
//         console.log('Chat already initialized');
//         return;
//       }

//       isInitializedRef.current = true;
//       setLoading(true);

//       try {
//         let finalChatId = existingChatId;
        
//         if (!finalChatId) {
//           finalChatId = generateChatId(user.uid, userId);
//         }
        
//         console.log('Setting chat ID:', finalChatId);
//         setChatId(finalChatId);

//         const chatRef = doc(db, 'chats', finalChatId);
//         const chatSnap = await getDoc(chatRef);
        
//         if (!chatSnap.exists()) {
//           console.log('Creating new chat document...');
          
//           const chatData = {
//             participants: [user.uid, userId],
//             participantNames: {
//               [user.uid]: user.displayName || user.email?.split('@')[0] || 'User',
//               [userId]: userName,
//             },
//             participantPhotos: {
//               [user.uid]: user.photoURL || null,
//               [userId]: userAvatar || null,
//             },
//             createdAt: serverTimestamp(),
//             updatedAt: serverTimestamp(),
//             lastMessage: '',
//             lastMessageAt: serverTimestamp(),
//             lastMessageSender: '',
//             unreadCount: {
//               [user.uid]: 0,
//               [userId]: 0,
//             },
//           };
          
//           await setDoc(chatRef, chatData);
//           console.log('Chat document created');

//           // Create initial system message
//           const messagesRef = collection(db, 'chats', finalChatId, 'messages');
//           await addDoc(messagesRef, {
//             text: `You started a conversation with ${userName}`,
//             createdAt: serverTimestamp(),
//             user: {
//               _id: 'system',
//               name: 'System',
//             },
//             system: true,
//           });
//           console.log('System message created');
//         } else {
//           console.log('Chat document already exists');
//           // Reset unread count for current user
//           await updateDoc(chatRef, {
//             [`unreadCount.${user.uid}`]: 0,
//           });
//         }

//         console.log('Chat initialized successfully');
//         setError('');
        
//       } catch (error: any) {
//         console.error('Error initializing chat:', error);
//         setError(error.message || 'Failed to initialize chat');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeChat();

//     // Cleanup
//     return () => {
//       console.log('Cleaning up chat...');
//       if (user) {
//         const userRef = doc(db, 'users', user.uid);
//         updateDoc(userRef, {
//           isOnline: false,
//           lastSeen: serverTimestamp(),
//         }).catch(console.error);
//       }
      
//       if (chatListenerRef.current) {
//         chatListenerRef.current();
//       }
      
//       isInitializedRef.current = false;
//     };
//   }, [user, userId, userName, userAvatar, existingChatId, authLoading, generateChatId]);

//   // Load initial messages
//   useEffect(() => {
//     const loadInitialMessages = async () => {
//       if (!chatId || !user) {
//         console.log('Waiting for chatId or user...');
//         return;
//       }

//       console.log('Loading initial messages for chat:', chatId);

//       try {
//         const messagesRef = collection(db, 'chats', chatId, 'messages');
//         const q = query(
//           messagesRef,
//           orderBy('createdAt', 'desc'),
//           limit(messagesPerPage)
//         );

//         const querySnapshot = await getDocs(q);
//         console.log('Found', querySnapshot.docs.length, 'messages');
        
//         if (!querySnapshot.empty) {
//           lastVisibleRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
//           setHasMoreMessages(querySnapshot.docs.length === messagesPerPage);
//         } else {
//           setHasMoreMessages(false);
//         }

//         const loadedMessages: IMessage[] = querySnapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             _id: doc.id,
//             text: data.text || '',
//             createdAt: data.createdAt?.toDate() || new Date(),
//             user: {
//               _id: data.user._id,
//               name: data.user.name || '',
//               avatar: data.user.avatar || data.user.photoURL || 
//                 `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name || 'User')}&background=random`,
//             },
//             system: data.system || false,
//           };
//         });

//         setMessages(loadedMessages);
//         console.log('Messages loaded successfully');
//       } catch (error: any) {
//         console.error('Error loading messages:', error);
//         setError('Failed to load messages');
//       }
//     };

//     loadInitialMessages();
//   }, [chatId, user]);

//   // Listen for new messages in real-time
//   useEffect(() => {
//     if (!chatId || !user) {
//       console.log('Cannot setup listener - missing chatId or user');
//       return;
//     }

//     console.log('Setting up real-time listener for chat:', chatId);

//     try {
//       const messagesRef = collection(db, 'chats', chatId, 'messages');
//       const q = query(
//         messagesRef,
//         orderBy('createdAt', 'desc'),
//         limit(1)
//       );

//       const unsubscribe = onSnapshot(q, 
//         (snapshot) => {
//           if (!snapshot.empty) {
//             const newMessageDoc = snapshot.docs[0];
//             const newMessageData = newMessageDoc.data();
            
//             const messageExists = messages.some(msg => msg._id === newMessageDoc.id);
            
//             if (!messageExists) {
//               console.log('New message received:', newMessageData.text);
              
//               const newMessage: IMessage = {
//                 _id: newMessageDoc.id,
//                 text: newMessageData.text || '',
//                 createdAt: newMessageData.createdAt?.toDate() || new Date(),
//                 user: {
//                   _id: newMessageData.user._id,
//                   name: newMessageData.user.name || '',
//                   avatar: newMessageData.user.avatar || newMessageData.user.photoURL || 
//                     `https://ui-avatars.com/api/?name=${encodeURIComponent(newMessageData.user.name || 'User')}&background=random`,
//                 },
//                 system: newMessageData.system || false,
//               };

//               setMessages(prev => [newMessage, ...prev]);

//               // Update chat metadata if message is from other user
//               if (newMessageData.user._id !== user.uid) {
//                 const chatRef = doc(db, 'chats', chatId);
//                 updateDoc(chatRef, {
//                   lastMessage: newMessageData.text,
//                   lastMessageAt: serverTimestamp(),
//                   lastMessageSender: newMessageData.user._id,
//                   updatedAt: serverTimestamp(),
//                   [`unreadCount.${user.uid}`]: 0,
//                 }).catch(console.error);
//               }
//             }
//           }
//         },
//         (error) => {
//           console.error('Error in messages listener:', error);
//           setError('Failed to load new messages');
//         }
//       );

//       chatListenerRef.current = unsubscribe;
//       return unsubscribe;
//     } catch (error: any) {
//       console.error('Error setting up messages listener:', error);
//       setError('Failed to setup real-time updates');
//       return () => {};
//     }
//   }, [chatId, user, messages.length]);

//   // Load more messages (pagination)
//   const loadMoreMessages = async () => {
//     if (!chatId || !user || loadingMore || !hasMoreMessages || !lastVisibleRef.current) {
//       console.log('Cannot load more messages - conditions not met');
//       return;
//     }

//     console.log('Loading more messages...');
//     setLoadingMore(true);

//     try {
//       const messagesRef = collection(db, 'chats', chatId, 'messages');
//       const q = query(
//         messagesRef,
//         orderBy('createdAt', 'desc'),
//         startAfter(lastVisibleRef.current),
//         limit(messagesPerPage)
//       );

//       const querySnapshot = await getDocs(q);
      
//       if (!querySnapshot.empty) {
//         lastVisibleRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
//         setHasMoreMessages(querySnapshot.docs.length === messagesPerPage);
//       } else {
//         setHasMoreMessages(false);
//       }

//       const moreMessages: IMessage[] = querySnapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           _id: doc.id,
//           text: data.text || '',
//           createdAt: data.createdAt?.toDate() || new Date(),
//           user: {
//             _id: data.user._id,
//             name: data.user.name || '',
//             avatar: data.user.avatar || data.user.photoURL || 
//               `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name || 'User')}&background=random`,
//           },
//           system: data.system || false,
//         };
//       });

//       setMessages(prev => [...prev, ...moreMessages]);
//       console.log('Loaded', moreMessages.length, 'more messages');
//     } catch (error: any) {
//       console.error('Error loading more messages:', error);
//       Alert.alert('Error', 'Failed to load more messages');
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   // Handle sending message
//   const onSend = useCallback(async (newMessages: IMessage[] = []) => {
//     console.log('Sending message...');
    
//     if (!chatId || !user) {
//       Alert.alert('Error', 'Chat not initialized');
//       return;
//     }

//     const message = newMessages[0];
//     if (!message.text.trim()) return;

//     try {
//       const messagesRef = collection(db, 'chats', chatId, 'messages');
      
//       const messageData = {
//         text: message.text.trim(),
//         createdAt: serverTimestamp(),
//         user: {
//           _id: user.uid,
//           name: user.displayName || user.email?.split('@')[0] || 'User',
//           avatar: user.photoURL || null,
//         },
//         read: false,
//       };
      
//       console.log('Adding message to Firestore:', messageData);
//       await addDoc(messagesRef, messageData);
//       console.log('Message sent successfully');

//       // Update chat metadata
//       const chatRef = doc(db, 'chats', chatId);
//       const chatSnap = await getDoc(chatRef);
//       const chatData = chatSnap.data();
      
//       if (chatData && userId) {
//         const currentUnread = chatData.unreadCount?.[userId] || 0;
//         await updateDoc(chatRef, {
//           lastMessage: message.text,
//           lastMessageAt: serverTimestamp(),
//           lastMessageSender: user.uid,
//           updatedAt: serverTimestamp(),
//           [`unreadCount.${userId}`]: currentUnread + 1,
//         });
//       } else {
//         await updateDoc(chatRef, {
//           lastMessage: message.text,
//           lastMessageAt: serverTimestamp(),
//           lastMessageSender: user.uid,
//           updatedAt: serverTimestamp(),
//         });
//       }

//     } catch (error: any) {
//       console.error('Error sending message:', error);
//       Alert.alert('Error', 'Failed to send message. Please try again.');
//     }
//   }, [chatId, user, userId]);

//   // Custom bubble styling
//   const renderBubble = useCallback((props: any) => {
//     if (props.currentMessage?.system) {
//       return (
//         <View style={styles.systemMessageContainer}>
//           <Text style={styles.systemMessageText}>
//             {props.currentMessage.text}
//           </Text>
//         </View>
//       );
//     }

//     const isCurrentUser = props.currentMessage.user._id === user?.uid;
    
//     return (
//       <View style={[
//         styles.messageContainer,
//         isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
//       ]}>
//         <Bubble
//           {...props}
//           wrapperStyle={{
//             right: {
//               backgroundColor: COLORS.primary,
//               borderRadius: 18,
//               paddingHorizontal: 12,
//               paddingVertical: 8,
//               marginVertical: 2,
//             },
//             left: {
//               backgroundColor: COLORS.chatBubble,
//               borderRadius: 18,
//               paddingHorizontal: 12,
//               paddingVertical: 8,
//               marginVertical: 2,
//             },
//           }}
//           textStyle={{
//             right: {
//               color: COLORS.white,
//               fontSize: 16,
//               lineHeight: 20,
//             },
//             left: {
//               color: COLORS.textDark,
//               fontSize: 16,
//               lineHeight: 20,
//             },
//           }}
//           timeTextStyle={{
//             right: {
//               color: 'rgba(255, 255, 255, 0.7)',
//               fontSize: 12,
//             },
//             left: {
//               color: 'rgba(0, 0, 0, 0.5)',
//               fontSize: 12,
//             },
//           }}
//           renderTime={() => (
//             <Text style={[
//               styles.timeText,
//               isCurrentUser ? styles.currentUserTime : styles.otherUserTime
//             ]}>
//               {formatTime(new Date(props.currentMessage.createdAt))}
//             </Text>
//           )}
//         />
//       </View>
//     );
//   }, [user, formatTime, COLORS]);

//   // Custom send button
//   const renderSend = useCallback((props: any) => {
//     const isDisabled = !props.text || props.text.trim().length === 0;
    
//     return (
//       <Send
//         {...props}
//         containerStyle={styles.sendButtonContainer}
//         disabled={isDisabled}
//       >
//         <View style={[
//           styles.sendButton,
//           isDisabled && styles.sendButtonDisabled
//         ]}>
//           <Ionicons name="send" size={20} color={COLORS.white} />
//         </View>
//       </Send>
//     );
//   }, [COLORS]);

//   // Custom input toolbar
//   const renderInputToolbar = useCallback((props: any) => (
//     <InputToolbar
//       {...props}
//       containerStyle={styles.inputToolbar}
//       primaryStyle={styles.inputPrimary}
//     />
//   ), []);

//   // Custom composer
//   const renderComposer = useCallback((props: any) => (
//     <Composer
//       {...props}
//       textInputStyle={styles.composer}
//       placeholderTextColor={COLORS.textLight}
//       multiline={true}
//     />
//   ), [COLORS]);

//   // Custom day component
//   const renderDay = useCallback((props: any) => (
//     <Day {...props} textStyle={styles.dayText} />
//   ), []);

//   // Render loading indicator
//   const renderLoading = () => (
//     <View style={styles.loadingContainer}>
//       <ActivityIndicator size="large" color={COLORS.primary} />
//     </View>
//   );

//   // Render empty chat
//   const renderEmptyChat = () => (
//     <View style={styles.emptyContainer}>
//       <Ionicons name="chatbubble-outline" size={64} color="#CCCCCC" />
//       <Text style={styles.emptyTitle}>No messages yet</Text>
//       <Text style={styles.emptySubtitle}>Say hello to start the conversation!</Text>
//     </View>
//   );

//   // Handle back navigation
//   const handleBack = () => {
//     navigation.goBack();
//   };

//   // Header component
//   const renderHeader = () => (
//     <SafeAreaView style={styles.header}>
//       <View style={styles.headerContent}>
//         <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
        
//         <View style={styles.headerInfo}>
//           <Text style={styles.headerTitle} numberOfLines={1}>
//             {userName || 'Chat'}
//           </Text>
//           <Text style={styles.headerSubtitle}>
//             {isTyping ? 'typing...' : 'Online'}
//           </Text>
//         </View>
        
//         <TouchableOpacity style={styles.menuButton}>
//           <Ionicons name="ellipsis-vertical" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );

//   // Test button for development
//   const renderTestButton = () => {
//     if (__DEV__ && !userId) {
//       return (
//         <TouchableOpacity
//           style={styles.testButton}
//           onPress={() => {
//             // Simulate receiving parameters
//             navigation.setParams({
//               userId: 'Cto7uvnA5FR1cM0MkQTvjdHS7Uq2',
//               userName: 'mad',
//               userAvatar: '',
//             });
//             setError('');
//             setLoading(true);
//             isInitializedRef.current = false;
//           }}
//         >
//           <Text style={styles.testButtonText}>Test Chat with Demo User</Text>
//         </TouchableOpacity>
//       );
//     }
//     return null;
//   };

//   // Loading and error states
//   if (authLoading) {
//     return (
//       <View style={styles.fullScreenLoading}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={styles.loadingText}>Loading authentication...</Text>
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.fullScreenContainer}>
//         <Ionicons name="log-in-outline" size={64} color={COLORS.error} />
//         <Text style={styles.errorTitle}>Please log in to use chat</Text>
//         <Text style={styles.errorMessage}>
//           You need to be logged in to access the chat feature.
//         </Text>
//         <TouchableOpacity 
//           style={styles.loginButton}
//           onPress={() => navigation.navigate('Login' as never)}
//         >
//           <Text style={styles.loginButtonText}>Go to Login</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (!userId && !loading) {
//     return (
//       <SafeAreaView style={styles.fullScreenContainer}>
//         <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
//         <View style={styles.errorContent}>
//           <Ionicons name="chatbubble-outline" size={64} color={COLORS.warning} />
//           <Text style={styles.errorTitle}>Select a User to Chat</Text>
//           <Text style={styles.errorMessage}>
//             Please go back and select a user to start a conversation.
//           </Text>
          
//           <View style={styles.debugInfo}>
//             <Text style={styles.debugText}>Debug Information:</Text>
//             <Text style={styles.debugDetail}>• Route params: {route.params ? JSON.stringify(route.params) : 'None'}</Text>
//             <Text style={styles.debugDetail}>• User ID: {userId || 'Not provided'}</Text>
//             <Text style={styles.debugDetail}>• Current User: {user?.uid || 'Not logged in'}</Text>
//           </View>
          
//           {renderTestButton()}
          
//           <TouchableOpacity 
//             style={styles.retryButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="arrow-back" size={20} color={COLORS.white} style={styles.backIcon} />
//             <Text style={styles.retryButtonText}>Go Back to Chat List</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (loading) {
//     return (
//       <View style={styles.fullScreenContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={styles.loadingText}>Setting up chat...</Text>
//         <Text style={styles.debugDetail}>Chat ID: {chatId || 'Generating...'}</Text>
//         <Text style={styles.debugDetail}>With: {userName}</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.fullScreenContainer}>
//         <Ionicons name="warning-outline" size={64} color={COLORS.warning} />
//         <Text style={styles.errorTitle}>Something went wrong</Text>
//         <Text style={styles.errorMessage}>{error}</Text>
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={() => {
//             setError('');
//             setLoading(true);
//             isInitializedRef.current = false;
//           }}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.retryButton, { backgroundColor: COLORS.textLight, marginTop: 12 }]}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.retryButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Main chat interface
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
//       {renderHeader()}
      
//       <GiftedChat
//         messages={messages}
//         onSend={messages => onSend(messages)}
//         user={{
//           _id: user.uid,
//           name: user.displayName || user.email?.split('@')[0] || 'User',
//           avatar: user.photoURL || 
//             `https://ui-avatars.com/api/?name=${encodeURIComponent(
//               user.displayName || user.email?.split('@')[0] || 'User'
//             )}&background=007AFF&color=ffffff`,
//         }}
//         renderBubble={renderBubble}
//         renderSend={renderSend}
//         renderInputToolbar={renderInputToolbar}
//         renderComposer={renderComposer}
//         renderDay={renderDay}
//         renderLoading={renderLoading}
//         renderEmpty={renderEmptyChat}
//         onLoadEarlier={loadMoreMessages}
//         isLoadingEarlier={loadingMore}
//         loadEarlier={hasMoreMessages}
//         alwaysShowSend={true}
//         scrollToBottom={true}
//         scrollToBottomComponent={() => (
//           <View style={styles.scrollToBottomButton}>
//             <Ionicons name="arrow-down-circle" size={32} color={COLORS.primary} />
//           </View>
//         )}
//         placeholder="Type a message..."
//         listViewProps={{
//           style: { backgroundColor: COLORS.background },
//           showsVerticalScrollIndicator: false,
//         }}
//         textInputProps={{
//           maxLength: 1000,
//           blurOnSubmit: false,
//         }}
//         minInputToolbarHeight={56}
//         bottomOffset={Platform.OS === 'ios' ? 0 : 20}
//         infiniteScroll={true}
//         inverted={true}
//         alignTop={false}
//         maxComposerHeight={100}
//         minComposerHeight={44}
//         wrapInSafeArea={false}
//         keyboardShouldPersistTaps="never"
//       />
      
//       {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   fullScreenContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//   },
//   fullScreenLoading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backButton: {
//     padding: 8,
//     marginRight: 8,
//   },
//   headerInfo: {
//     flex: 1,
//     marginHorizontal: 12,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#000000',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#666666',
//     marginTop: 2,
//   },
//   menuButton: {
//     padding: 8,
//   },
//   messageContainer: {
//     marginVertical: 2,
//     marginHorizontal: 8,
//   },
//   currentUserMessage: {
//     alignSelf: 'flex-end',
//   },
//   otherUserMessage: {
//     alignSelf: 'flex-start',
//   },
//   systemMessageContainer: {
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.05)',
//     borderRadius: 16,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     marginVertical: 8,
//   },
//   systemMessageText: {
//     fontSize: 12,
//     color: '#666666',
//     textAlign: 'center',
//   },
//   timeText: {
//     fontSize: 11,
//     marginTop: 4,
//     marginHorizontal: 12,
//   },
//   currentUserTime: {
//     color: 'rgba(255, 255, 255, 0.7)',
//     textAlign: 'right',
//   },
//   otherUserTime: {
//     color: 'rgba(0, 0, 0, 0.5)',
//     textAlign: 'left',
//   },
//   inputToolbar: {
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E8E8E8',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   inputPrimary: {
//     alignItems: 'center',
//   },
//   composer: {
//     backgroundColor: '#F5F5F5',
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginLeft: 0,
//     fontSize: 16,
//     lineHeight: 20,
//     maxHeight: 100,
//     color: '#000000',
//   },
//   sendButtonContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//     marginRight: 4,
//   },
//   sendButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sendButtonDisabled: {
//     backgroundColor: '#CCCCCC',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
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
//     color: '#666666',
//     marginTop: 16,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: '#999999',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#666666',
//     marginTop: 16,
//   },
//   errorTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333333',
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   errorMessage: {
//     fontSize: 16,
//     color: '#666666',
//     marginTop: 8,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   errorContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   debugInfo: {
//     backgroundColor: '#F5F5F5',
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 20,
//     marginBottom: 20,
//     width: '100%',
//   },
//   debugText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333333',
//     marginBottom: 8,
//   },
//   debugDetail: {
//     fontSize: 12,
//     color: '#666666',
//     marginTop: 4,
//   },
//   loginButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 12,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     marginTop: 24,
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   retryButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 12,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     marginTop: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   retryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   backIcon: {
//     marginRight: 8,
//   },
//   scrollToBottomButton: {
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   dayText: {
//     fontSize: 12,
//     color: '#999999',
//     fontWeight: '600',
//   },
//   testButton: {
//     backgroundColor: '#34C759',
//     borderRadius: 12,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   testButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
// });

// export default ChatScreen;