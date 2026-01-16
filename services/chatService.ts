import { 
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';
import { db } from './firebase';

export interface ChatData {
  id?: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantPhotos?: Record<string, string>;
  lastMessage?: string;
  lastMessageAt?: any;
  lastMessageSender?: string;
  unreadCount?: Record<string, number>;
  createdAt?: any;
  updatedAt?: any;
}

export interface MessageData {
  id?: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: any;
  read: boolean;
  system?: boolean;
}

export const chatService = {
  // Get or create chat
  async getOrCreateChat(userId1: string, userId2: string, userName1: string, userName2: string): Promise<string> {
    try {
      const chatId = [userId1, userId2].sort().join('_');
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (!chatSnap.exists()) {
        const chatData: ChatData = {
          participants: [userId1, userId2],
          participantNames: {
            [userId1]: userName1,
            [userId2]: userName2,
          },
          participantPhotos: {},
          lastMessage: '',
          lastMessageAt: serverTimestamp(),
          lastMessageSender: '',
          unreadCount: {
            [userId1]: 0,
            [userId2]: 0,
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        
        await setDoc(chatRef, chatData);
        
        // Add welcome message
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
          text: `Chat started between ${userName1} and ${userName2}`,
          senderId: 'system',
          senderName: 'System',
          createdAt: serverTimestamp(),
          read: true,
          system: true,
        });
      }
      
      return chatId;
    } catch (error) {
      console.error('Error creating/getting chat:', error);
      throw error;
    }
  },
  
  // Send message
  async sendMessage(chatId: string, senderId: string, text: string, senderName: string, senderAvatar?: string): Promise<void> {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      
      const messageData: MessageData = {
        text: text.trim(),
        senderId,
        senderName,
        senderAvatar,
        createdAt: serverTimestamp(),
        read: false,
      };
      
      await addDoc(messagesRef, messageData);
      
      // Update chat metadata
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      const chatData = chatSnap.data() as ChatData;
      
      if (chatData) {
        const participants = chatData.participants || [];
        const receiverId = participants.find(id => id !== senderId);
        
        const updates: any = {
          lastMessage: text,
          lastMessageAt: serverTimestamp(),
          lastMessageSender: senderId,
          updatedAt: serverTimestamp(),
        };
        
        if (receiverId) {
          const currentUnread = chatData.unreadCount?.[receiverId] || 0;
          updates[`unreadCount.${receiverId}`] = currentUnread + 1;
        }
        
        await updateDoc(chatRef, updates);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  // Listen to messages
  listenToMessages(chatId: string, callback: (messages: MessageData[]) => void, errorCallback?: (error: any) => void) {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      
      return onSnapshot(q, 
        (snapshot) => {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as MessageData[];
          
          callback(messages);
        },
        (error) => {
          console.error('Error listening to messages:', error);
          if (errorCallback) errorCallback(error);
        }
      );
    } catch (error) {
      console.error('Error setting up message listener:', error);
      if (errorCallback) errorCallback(error);
      return () => {}; // Return empty cleanup function
    }
  },
  
  // Get chat by ID
  async getChat(chatId: string): Promise<ChatData | null> {
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (chatSnap.exists()) {
        return {
          id: chatSnap.id,
          ...chatSnap.data(),
        } as ChatData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting chat:', error);
      throw error;
    }
  },
  
  // Get user's chats
  async getUserChats(userId: string): Promise<ChatData[]> {
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('participants', 'array-contains', userId));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatData[];
    } catch (error) {
      console.error('Error getting user chats:', error);
      return [];
    }
  },
  
  // Mark messages as read
  async markAsRead(chatId: string, userId: string): Promise<void> {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        [`unreadCount.${userId}`]: 0,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  },
};