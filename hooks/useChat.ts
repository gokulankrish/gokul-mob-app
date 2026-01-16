import { useState, useCallback } from 'react';
import { ChatService } from '../services/chat';
import { Chat, Message } from '../types';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to user chats
  const subscribeToChats = useCallback((userId: string) => {
    setLoading(true);
    setError(null);
    
    const unsubscribe = ChatService.subscribeToUserChats(userId, (chats: Chat[]) => {
      setChats(chats);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Subscribe to chat messages
  const subscribeToMessages = useCallback((chatId: string) => {
    setLoading(true);
    setError(null);
    
    const unsubscribe = ChatService.subscribeToMessages(chatId, (messages: Message[]) => {
      setMessages(messages);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Send message
  const sendMessage = async (chatId: string, message: Partial<Message>) => {
    setError(null);
    const result = await ChatService.sendMessage(chatId, message);
    
    if (!result.success) {
      setError(result.error || 'Failed to send message');
    }
    
    return result;
  };

  // Create chat
  const createChat = async (participants: string[], initialMessage?: any) => {
    if (participants.length !== 2) {
      setError('A chat must have exactly 2 participants');
      return { success: false, error: 'A chat must have exactly 2 participants' };
    }
    
    setError(null);
    const result = await ChatService.findOrCreateChat(participants[0], participants[1], initialMessage);
    
    if (!result.success) {
      setError(result.error || 'Failed to create chat');
    }
    
    return result;
  };

  // Get available users
  const getAvailableUsers = async (currentUserId: string) => {
    setError(null);
    const result = await ChatService.getAvailableUsers(currentUserId);
    
    if (!result.success) {
      setError(result.error || 'Failed to get available users');
    }
    
    return result;
  };

  // Mark messages as read
  const markMessagesAsRead = async (chatId: string, userId: string) => {
    setError(null);
    const result = await ChatService.markMessagesAsRead(chatId, userId);
    
    if (!result.success) {
      setError(result.error || 'Failed to mark messages as read');
    }
    
    return result;
  };

  // Delete message
  const deleteMessage = async (chatId: string, messageId: string) => {
    setError(null);
    const result = await ChatService.deleteMessage(chatId, messageId);
    
    if (!result.success) {
      setError(result.error || 'Failed to delete message');
    }
    
    return result;
  };

  const clearError = () => {
    setError(null);
  };

  return {
    chats,
    messages,
    loading,
    error,
    subscribeToChats,
    subscribeToMessages,
    sendMessage,
    createChat,
    getAvailableUsers,
    markMessagesAsRead,
    deleteMessage,
    clearError
  };
};