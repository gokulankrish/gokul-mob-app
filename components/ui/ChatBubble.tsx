import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Message, User } from '../../types';

interface ChatBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  userData: User | null;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isCurrentUser, userData }) => {
  const bubbleStyle = isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble;
  const textStyle = isCurrentUser ? styles.currentUserText : styles.otherUserText;
  const timeStyle = isCurrentUser ? styles.currentUserTime : styles.otherUserTime;
  const containerStyle = isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer;

  const formattedTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : '';

  return (
    <View style={[styles.container, containerStyle]}>
      {!isCurrentUser && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}
      <View style={[styles.bubble, bubbleStyle]}>
        <Text style={[styles.messageText, textStyle]}>{message.text}</Text>
        <Text style={[styles.timeText, timeStyle]}>{formattedTime}</Text>
        {isCurrentUser && message.read && (
          <Text style={styles.readText}>✓ Read</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 2,
    marginLeft: 8,
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
  },
  currentUserBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: Colors.chatBubblePatient,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: Colors.white,
  },
  otherUserText: {
    color: Colors.text,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
  },
  currentUserTime: {
    color: Colors.white,
    opacity: 0.8,
  },
  otherUserTime: {
    color: Colors.gray,
  },
  readText: {
    fontSize: 10,
    color: Colors.white,
    marginTop: 2,
    fontStyle: 'italic',
  }
});

export default ChatBubble;