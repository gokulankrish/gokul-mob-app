import { 
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../constants/Config';
import { Chat, Message, User } from '../types';

// Define interfaces for Firestore document structures
interface ChatDocument {
  participants: string[];
  participantInfo: Record<string, UserInfo>;
  lastMessage: string;
  lastMessageAt: any;
  createdAt: any;
  updatedAt: any;
  unreadCount: Record<string, number>;
}

interface UserInfo {
  name: string;
  email: string;
  role: string;
  avatar: string;
  avatarColor: string;
  specialty: string;
}

interface UserDocument {
  uid: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar: string;
  avatarColor: string;
  specialty: string;
  experience?: string;
  dob?: string;
  medicalHistory?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ChatService = {
  // Find or create a chat between two users
  async findOrCreateChat(user1Id: string, user2Id: string, initialMessage?: Partial<Message>) {
    try {
      // First, check if chat already exists
      const q = query(
        collection(db, COLLECTIONS.CHATS),
        where('participants', 'array-contains', user1Id)
      );
      
      const querySnapshot = await getDocs(q);
      let existingChat: { id: string; data: DocumentData } | null = null;
      
      querySnapshot.forEach((doc) => {
        const chatData = doc.data() as ChatDocument;
        const participants = chatData.participants;
        if (participants.includes(user2Id) && participants.length === 2) {
          existingChat = { id: doc.id, data: chatData };
        }
      });
      
      if (existingChat) {
        return { success: true, chatId: existingChat.id, isNew: false };
      }
      
      // Create new chat
      const user1Info = await this.getUserInfo(user1Id);
      const user2Info = await this.getUserInfo(user2Id);
      
      const chatRef = await addDoc(collection(db, COLLECTIONS.CHATS), {
        participants: [user1Id, user2Id],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: initialMessage?.text || '',
        lastMessageAt: serverTimestamp(),
        unreadCount: {
          [user1Id]: 0,
          [user2Id]: 0
        },
        participantInfo: {
          [user1Id]: user1Info,
          [user2Id]: user2Info
        }
      } as ChatDocument);
      
      // Add initial message if provided
      if (initialMessage) {
        await this.sendMessage(chatRef.id, initialMessage);
      }
      
      return { success: true, chatId: chatRef.id, isNew: true };
    } catch (error: any) {
      console.error('Error creating chat:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user info for chat
  async getUserInfo(userId: string): Promise<UserInfo> {
    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserDocument;
        return {
          name: data.name || '',
          email: data.email || '',
          role: data.role || 'patient',
          avatar: data.avatar || '',
          avatarColor: data.avatarColor || '#3498db',
          specialty: data.specialty || ''
        };
      }
      return {
        name: 'Unknown User',
        email: '',
        role: 'patient',
        avatar: '',
        avatarColor: '#3498db',
        specialty: ''
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return {
        name: 'Unknown User',
        email: '',
        role: 'patient',
        avatar: '',
        avatarColor: '#3498db',
        specialty: ''
      };
    }
  },

  // Send a message
  async sendMessage(chatId: string, message: Partial<Message>) {
    try {
      const messageRef = await addDoc(
        collection(db, COLLECTIONS.CHATS, chatId, COLLECTIONS.MESSAGES),
        {
          ...message,
          createdAt: serverTimestamp(),
          read: false
        }
      );
      
      // Get chat to update unread count
      const chatDoc = await getDoc(doc(db, COLLECTIONS.CHATS, chatId));
      const chatData = chatDoc.data() as ChatDocument;
      
      if (chatData) {
        const participants = chatData.participants;
        const otherParticipants = participants.filter((id: string) => id !== message.senderId);
        
        // Increment unread count for other participants
        const updatedUnreadCount = { ...chatData.unreadCount };
        otherParticipants.forEach((participantId: string) => {
          updatedUnreadCount[participantId] = (updatedUnreadCount[participantId] || 0) + 1;
        });
        
        // Update chat last message and unread counts
        await updateDoc(doc(db, COLLECTIONS.CHATS, chatId), {
          lastMessage: message.text || '',
          lastMessageAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          unreadCount: updatedUnreadCount
        });
      }
      
      return { success: true, messageId: messageRef.id };
    } catch (error: any) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  },

  // Subscribe to messages (realtime)
  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.CHATS, chatId, COLLECTIONS.MESSAGES),
      orderBy('createdAt', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          text: data.text || '',
          senderId: data.senderId || '',
          senderName: data.senderName || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          read: data.read || false,
          readAt: data.readAt?.toDate(),
          deleted: data.deleted || false,
          deletedAt: data.deletedAt?.toDate(),
          replyTo: data.replyTo
        } as Message);
      });
      callback(messages);
    });
  },

  // Subscribe to user chats (realtime)
  subscribeToUserChats(userId: string, callback: (chats: Chat[]) => void): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.CHATS),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );
    
    return onSnapshot(q, async (snapshot) => {
      const chats: Chat[] = [];
      
      for (const docSnapshot of snapshot.docs) {
        const chatData = docSnapshot.data() as ChatDocument;
        const participants = chatData.participants;
        const otherParticipantId = participants.find((id: string) => id !== userId);
        
        let otherParticipant: User | undefined = undefined;
        if (otherParticipantId) {
          // Try to get from participantInfo first
          const participantInfo = chatData.participantInfo || {};
          if (participantInfo[otherParticipantId]) {
            const info = participantInfo[otherParticipantId];
            otherParticipant = {
              uid: otherParticipantId,
              name: info.name || '',
              email: info.email || '',
              role: info.role || 'patient',
              avatar: info.avatar || '',
              avatarColor: info.avatarColor || '#3498db',
              specialty: info.specialty || '',
              createdAt: '',
              updatedAt: ''
            } as User;
          } else {
            // Fallback to fetching from users collection
            const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, otherParticipantId));
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserDocument;
              otherParticipant = {
                uid: otherParticipantId,
                email: userData.email || '',
                name: userData.name || '',
                role: userData.role || 'patient',
                phone: userData.phone || '',
                avatar: userData.avatar || '',
                avatarColor: userData.avatarColor || '#3498db',
                specialty: userData.specialty || '',
                experience: userData.experience || '',
                dob: userData.dob || '',
                medicalHistory: userData.medicalHistory || '',
                isDemo: userData.isDemo || false,
                createdAt: userData.createdAt || '',
                updatedAt: userData.updatedAt || ''
              } as User;
            }
          }
        }
        
        const chat: Chat = {
          id: docSnapshot.id,
          participants: participants,
          participantInfo: chatData.participantInfo || {},
          lastMessage: chatData.lastMessage || '',
          lastMessageAt: chatData.lastMessageAt?.toDate() || new Date(),
          createdAt: chatData.createdAt?.toDate() || new Date(),
          updatedAt: chatData.updatedAt?.toDate() || new Date(),
          unreadCount: chatData.unreadCount || {},
          otherParticipant: otherParticipant
        };
        
        chats.push(chat);
      }
      
      callback(chats);
    });
  },

  // Get available users to chat with
  async getAvailableUsers(currentUserId: string) {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where('uid', '!=', currentUserId)
      );
      
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as UserDocument;
        users.push({
          uid: doc.id,
          email: data.email || '',
          name: data.name || '',
          role: data.role || 'patient',
          phone: data.phone || '',
          avatar: data.avatar || '',
          avatarColor: data.avatarColor || '#3498db',
          specialty: data.specialty || '',
          experience: data.experience || '',
          dob: data.dob || '',
          medicalHistory: data.medicalHistory || '',
          isDemo: data.isDemo || false,
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || ''
        } as User);
      });
      
      return { success: true, users };
    } catch (error: any) {
      console.error('Error getting available users:', error);
      return { success: false, error: error.message };
    }
  },

  // Mark messages as read
  async markMessagesAsRead(chatId: string, userId: string) {
    try {
      const messagesQuery = query(
        collection(db, COLLECTIONS.CHATS, chatId, COLLECTIONS.MESSAGES),
        where('senderId', '!=', userId),
        where('read', '==', false)
      );
      
      const querySnapshot = await getDocs(messagesQuery);
      const updatePromises: Promise<void>[] = [];
      
      querySnapshot.forEach((doc) => {
        updatePromises.push(
          updateDoc(doc.ref, { 
            read: true, 
            readAt: serverTimestamp() 
          })
        );
      });
      
      // Update unread count in chat
      const chatDoc = await getDoc(doc(db, COLLECTIONS.CHATS, chatId));
      const chatData = chatDoc.data() as ChatDocument;
      
      if (chatData && chatData.unreadCount && chatData.unreadCount[userId] > 0) {
        const updatedUnreadCount = { ...chatData.unreadCount };
        updatedUnreadCount[userId] = 0;
        
        updatePromises.push(
          updateDoc(doc(db, COLLECTIONS.CHATS, chatId), {
            unreadCount: updatedUnreadCount
          })
        );
      }
      
      await Promise.all(updatePromises);
      return { success: true };
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete a message
  async deleteMessage(chatId: string, messageId: string) {
    try {
      await setDoc(
        doc(db, COLLECTIONS.CHATS, chatId, COLLECTIONS.MESSAGES, messageId), 
        {
          deleted: true,
          text: 'This message was deleted',
          deletedAt: serverTimestamp()
        }, 
        { merge: true }
      );
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting message:', error);
      return { success: false, error: error.message };
    }
  }
};