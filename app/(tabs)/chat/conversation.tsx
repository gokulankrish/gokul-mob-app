import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  GiftedChat,
  IMessage,
  Bubble,
  Send,
  InputToolbar,
  Composer,
  Time,
} from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";
import { Colors } from "../../../constants/Colors";
import { chatService, MessageData } from "../../../services/chatService";

// =============================================================================
// CONSTANTS & TYPES
// =============================================================================
const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ChatConversationScreenProps {}

interface ChatHeaderProps {
  userName: string;
  isTyping: boolean;
  onBack: () => void;
}

interface LoadingStateProps {
  fadeAnim: Animated.Value;
}

interface ErrorStateProps {
  fadeAnim: Animated.Value;
  error: string;
  onRetry: () => void;
}

// =============================================================================
// COMPONENTS
// =============================================================================

const ChatHeader = ({ userName, isTyping, onBack }: ChatHeaderProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        activeOpacity={0.6}
      >
        <View style={styles.backButtonInner}>
          <Ionicons name="chevron-back" size={28} color={Colors.white} />
        </View>
      </TouchableOpacity>

      <View style={styles.headerUserInfo}>
        <Animated.View
          style={[
            styles.headerAvatar,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.headerAvatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </Animated.View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {userName}
          </Text>
          <View style={styles.typingContainer}>
            {isTyping ? (
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, styles.typingDotMiddle]} />
                <View style={styles.typingDot} />
              </View>
            ) : (
              <Text style={styles.headerSubtitle}>
                Online • Last seen recently
              </Text>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.menuButton} activeOpacity={0.6}>
        <View style={styles.menuButtonInner}>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.white} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const LoadingState = ({ fadeAnim }: LoadingStateProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.fullScreenContainer}>
      <Animated.View
        style={[
          styles.loadingContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.loadingAnimation}>
          <View style={styles.loadingOrb}>
            <ActivityIndicator size="large" color={Colors.white} />
            <View style={styles.loadingOrbGlow} />
          </View>
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((i) => (
              <Animated.View
                key={i}
                style={[
                  styles.loadingDot,
                  {
                    backgroundColor: Colors.primary,
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0.3, 1],
                    }),
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [1, 1.1],
                          outputRange: [1, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
        <Text style={styles.loadingText}>Loading conversation...</Text>
        <Text style={styles.loadingSubtext}>Getting messages ready</Text>
      </Animated.View>
    </View>
  );
};

const ErrorState = ({ fadeAnim, error, onRetry }: ErrorStateProps) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(shakeAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const shakeInterpolate = shakeAnim.interpolate({
    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    outputRange: [0, -10, 10, -10, 10, -10, 10, -10, 10, -10, 0],
  });

  return (
    <View style={styles.fullScreenContainer}>
      <Animated.View
        style={[
          styles.errorContent,
          {
            opacity: fadeAnim,
            transform: [{ translateX: shakeInterpolate }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.errorIconContainer,
            {
              transform: [
                {
                  rotate: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="shield-checkmark" size={80} color={Colors.warning} />
        </Animated.View>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.retryButtonContent,
              {
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons name="arrow-back-circle" size={24} color={Colors.white} />
            <Text style={styles.retryButtonText}>Go Back</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ChatConversationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, userData } = useAuth();

  // Extract parameters with defaults
  const userId = (params?.userId as string) || "";
  const userName = (params?.userName as string) || "User";
  const userAvatar = (params?.userAvatar as string) || "";
  const existingChatId = (params?.chatId as string) || "";

  // State
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);

  // Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const messageListenerRef = useRef<() => void>(() => {});
  const messageAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const listRef = useRef<any>(null);

  // ===========================================================================
  // EFFECTS
  // ===========================================================================

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      if (!user || !userId) {
        setError("Please log in and select a user");
        setLoading(false);
        return;
      }

      try {
        let chatId = existingChatId;

        if (!chatId) {
          chatId = await chatService.getOrCreateChat(
            user.uid,
            userId,
            userData?.name || user.email?.split("@")[0] || "User",
            userName
          );
        }

        setCurrentChatId(chatId);

        messageListenerRef.current = chatService.listenToMessages(
          chatId,
          (chatMessages: MessageData[]) => {
            // Sort messages by createdAt in DESCENDING order (newest first)
            // This is what GiftedChat expects for inverted=true
            const sortedMessages = [...chatMessages].sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(0);
              const dateB = b.createdAt?.toDate?.() || new Date(0);
              return dateB.getTime() - dateA.getTime(); // Changed to descending
            });

            const giftedMessages: IMessage[] = sortedMessages.map((msg) => {
              const msgId = msg.id || Date.now().toString();
              // Initialize animation value for each message
              if (!messageAnimations.current[msgId]) {
                messageAnimations.current[msgId] = new Animated.Value(0);
              }

              return {
                _id: msgId,
                text: msg.text,
                createdAt: msg.createdAt?.toDate?.() || new Date(),
                user: {
                  _id: msg.senderId,
                  name: msg.senderName,
                  avatar: msg.senderAvatar || getAvatarUrl(msg.senderName),
                },
                system: msg.system || false,
              };
            });

            setMessages(giftedMessages);

            // Animate messages in sequence
            giftedMessages.forEach((msg, index) => {
              Animated.spring(messageAnimations.current[msg._id], {
                toValue: 1,
                delay: index * 50,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
              }).start();
            });

            setLoading(false);
          },
          (error) => {
            console.error("Message listener error:", error);
            setError(
              error.code === "permission-denied"
                ? "Permission denied. Please check Firestore rules."
                : "Failed to load messages"
            );
            setLoading(false);
          }
        );

        await chatService.markAsRead(chatId, user.uid);
        setError("");
      } catch (error: any) {
        console.error("Chat initialization error:", error);
        setError(
          error.code === "permission-denied"
            ? "Permission denied. Please check Firestore rules."
            : "Failed to initialize chat"
        );
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      messageListenerRef.current?.();
    };
  }, [user, userId, userName, userAvatar, existingChatId]);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleSendMessage = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (!currentChatId || !user) {
        Alert.alert("Error", "Chat not initialized");
        return;
      }

      const message = newMessages[0];
      if (!message.text.trim()) return;

      try {
        setIsTyping(false);

        // Add temporary message with animation
        const tempMessage: IMessage = {
          ...message,
          _id: Date.now().toString(),
          createdAt: new Date(),
          sent: true,
          pending: true,
        };

        // Animate the new message
        messageAnimations.current[tempMessage._id] = new Animated.Value(0);
        Animated.spring(messageAnimations.current[tempMessage._id], {
          toValue: 1,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }).start();

        // Add temporary message to UI
        setMessages((previousMessages) =>
          GiftedChat.prepend(previousMessages, [tempMessage])
        );

        // Send to server
        await chatService.sendMessage(
          currentChatId,
          user.uid,
          message.text,
          userData?.name || user.email?.split("@")[0] || "User",
          userData?.avatar
        );
      } catch (error: any) {
        console.error("Error sending message:", error);
        const errorMessage =
          error.code === "permission-denied"
            ? "Cannot send message. Check Firestore rules."
            : "Failed to send message";
        Alert.alert("Error", errorMessage);

        // Remove pending message on error
        setMessages((previousMessages) =>
          previousMessages.filter((msg) => msg._id !== Date.now().toString())
        );
      }
    },
    [currentChatId, user, userData]
  );

  const handleGoBack = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  }, [router, fadeAnim]);

  // ===========================================================================
  // RENDER FUNCTIONS
  // ===========================================================================

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=${encodeURIComponent(Colors.primary)}&color=ffffff&bold=true`;
  };

  const renderBubble = useCallback(
    (props: any) => {
      if (props.currentMessage?.system) {
        return (
          <Animated.View
            style={[
              styles.systemMessageContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.systemMessageContent}>
              <Text style={styles.systemMessageText}>
                {props.currentMessage.text}
              </Text>
            </View>
          </Animated.View>
        );
      }

      const isCurrentUser = props.currentMessage.user._id === user?.uid;
      const animationValue =
        messageAnimations.current[props.currentMessage._id] || fadeAnim;

      return (
        <Animated.View
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
            {
              opacity: animationValue,
              transform: [
                {
                  translateX: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [isCurrentUser ? 50 : -50, 0],
                  }),
                },
                {
                  scale: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {!isCurrentUser && (
            <Animated.View
              style={[
                styles.avatarContainer,
                {
                  opacity: animationValue,
                  transform: [
                    {
                      scale: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.avatarBackground}>
                <Text style={styles.avatarText}>
                  {props.currentMessage.user.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
            </Animated.View>
          )}

          <View
            style={[
              styles.bubbleWrapper,
              isCurrentUser && styles.currentUserBubbleWrapper,
            ]}
          >
            {!isCurrentUser && (
              <Text style={styles.senderName}>
                {props.currentMessage.user.name}
              </Text>
            )}

            <Animated.View
              style={{
                transform: [
                  {
                    scale: animationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              }}
            >
              <Bubble
                {...props}
                wrapperStyle={
                  isCurrentUser
                    ? bubbleWrapperStyles.right
                    : bubbleWrapperStyles.left
                }
                textStyle={
                  isCurrentUser ? bubbleTextStyles.right : bubbleTextStyles.left
                }
                renderTime={(timeProps) => (
                  <Time
                    {...timeProps}
                    timeTextStyle={
                      isCurrentUser ? timeTextStyles.right : timeTextStyles.left
                    }
                  />
                )}
              />
            </Animated.View>
          </View>
        </Animated.View>
      );
    },
    [user, fadeAnim]
  );

  const renderSendButton = useCallback((props: any) => {
    const isDisabled = !props.text || props.text.trim().length === 0;
    const sendAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (props.text && props.text.trim().length > 0) {
        Animated.spring(sendAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(sendAnim, {
          toValue: 0,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }
    }, [props.text]);

    return (
      <Send
        {...props}
        containerStyle={styles.sendButtonContainer}
        disabled={isDisabled}
      >
        <Animated.View
          style={[
            styles.sendButton,
            isDisabled && styles.sendButtonDisabled,
            {
              transform: [
                {
                  scale: sendAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons
            name={isDisabled ? "mic" : "send"}
            size={20}
            color={Colors.white}
          />
        </Animated.View>
      </Send>
    );
  }, []);

  const renderInputToolbar = useCallback(
    (props: any) => (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        <InputToolbar
          {...props}
          containerStyle={styles.inputToolbar}
          primaryStyle={styles.inputPrimary}
        />
      </Animated.View>
    ),
    [fadeAnim]
  );

  const renderComposer = useCallback((props: any) => {
    const composerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(composerAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          flex: 1,
          opacity: composerAnim,
          transform: [
            {
              translateX: composerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        }}
      >
        <Composer
          {...props}
          textInputStyle={styles.composerText}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textLight}
          multiline={true}
        />
      </Animated.View>
    );
  }, []);

  const renderEmptyChat = useCallback(
    () => (
      <Animated.View
        style={[
          styles.emptyChatContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.emptyChatIcon}>
          <Ionicons name="chatbubble-ellipses" size={48} color={Colors.white} />
          <View style={styles.emptyChatIconGlow} />
        </View>
        <Text style={styles.emptyChatTitle}>Start a conversation</Text>
        <Text style={styles.emptyChatDescription}>
          Send your first message to {userName}
        </Text>
        <View style={styles.emptyChatHint}>
          <Ionicons name="arrow-up" size={16} color={Colors.textLight} />
          <Text style={styles.emptyChatHintText}>Type below to begin</Text>
        </View>
      </Animated.View>
    ),
    [userName, fadeAnim]
  );

  // ===========================================================================
  // RENDER STATES
  // ===========================================================================

  if (loading) {
    return <LoadingState fadeAnim={fadeAnim} />;
  }

  if (error) {
    return (
      <ErrorState fadeAnim={fadeAnim} error={error} onRetry={handleGoBack} />
    );
  }

  if (!user) {
    return (
      <View style={styles.fullScreenContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Ionicons name="lock-closed" size={64} color={Colors.primary} />
          <Text style={styles.errorTitle}>Please log in to chat</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ChatHeader
        userName={userName}
        isTyping={isTyping}
        onBack={handleGoBack}
      />

      <Animated.View style={[styles.chatContainer, { opacity: fadeAnim }]}>
        <GiftedChat
          ref={listRef}
          messages={messages}
          onSend={handleSendMessage}
          user={{
            _id: user.uid,
            name: userData?.name || user.email?.split("@")[0] || "User",
            avatar:
              userData?.avatar ||
              getAvatarUrl(
                userData?.name || user.email?.split("@")[0] || "User"
              ),
          }}
          renderBubble={renderBubble}
          renderSend={renderSendButton}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderEmptyChat={renderEmptyChat}
          alwaysShowSend
          placeholder="Type a message..."
          minInputToolbarHeight={80}
          inverted={true} // Keep inverted true for proper GiftedChat behavior
          scrollToBottom
          scrollToBottomComponent={() => (
            <View style={styles.scrollToBottom}>
              <Ionicons name="chevron-down" size={24} color={Colors.primary} />
            </View>
          )}
          infiniteScroll
          isLoadingEarlier={false}
          listViewProps={{
            showsVerticalScrollIndicator: false,
            style: { backgroundColor: "transparent" },
            contentContainerStyle: { paddingBottom: 20 },
            onEndReachedThreshold: 0.5,
          }}
          keyboardShouldPersistTaps="handled"
          timeFormat="HH:mm"
          dateFormat="MMM D, YYYY"
        />
      </Animated.View>
    </SafeAreaView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const bubbleWrapperStyles = {
  right: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    marginVertical: 2,
    borderBottomRightRadius: 8,
    maxWidth: SCREEN_WIDTH * 0.75,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  left: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 8,
    marginVertical: 2,
    borderBottomLeftRadius: 8,
    maxWidth: SCREEN_WIDTH * 0.75,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
};

const bubbleTextStyles = {
  right: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  left: {
    color: Colors.textDark,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
};

const timeTextStyles = {
  right: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    marginTop: 4,
  },
  left: {
    color: Colors.textLight,
    fontSize: 11,
    marginTop: 4,
  },
};

const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  chatContainer: {
    flex: 1,
    color: "black",
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  backButtonInner: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerUserInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  headerAvatarText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 2,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
    marginRight: 4,
  },
  typingDotMiddle: {
    marginHorizontal: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  menuButton: {
    padding: 4,
  },
  menuButtonInner: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  // Messages
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
    marginHorizontal: 16,
  },
  currentUserMessage: {
    justifyContent: "flex-end",
  },
  otherUserMessage: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  bubbleWrapper: {
    maxWidth: "100%",
  },
  currentUserBubbleWrapper: {
    alignItems: "flex-end",
  },
  senderName: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 6,
    marginLeft: 12,
    fontWeight: "600",
  },

  // System Messages
  systemMessageContainer: {
    alignSelf: "center",
    marginVertical: 10,
    padding: 20,
  },
  systemMessageContent: {
    backgroundColor: "rgba(0, 122, 255, 0.15)",
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.3)",
  },
  systemMessageText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

composerText: {
  color: Colors.black,           // typed text always black
  fontSize: 16,
  lineHeight: 22,
  fontWeight: '500',
  paddingHorizontal: 14,
  paddingVertical: 10,
  backgroundColor: Colors.white, // ✅ white bubble for contrast
  borderRadius: 5,              // rounded edges
  borderWidth: 1,
  borderColor: Colors.textLight, // subtle border
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,                   // light shadow for depth
},

inputToolbar: {
  backgroundColor: Colors.lightGray, // soft toolbar background
  borderTopWidth: 0,
  marginHorizontal: 8,
  marginBottom: 6,
  borderRadius: 24,
  paddingHorizontal: 10,
  paddingVertical:5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

inputPrimary: {
  alignItems: 'center',
  flexDirection: 'row',
},




  sendButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 24,
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textLight,
    shadowColor: Colors.textLight,
  },

  // Empty State
  emptyChatContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: -50,
  },
  emptyChatIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  emptyChatIconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    transform: [{ scale: 1.2 }],
  },
  emptyChatTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.textDark,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyChatDescription: {
    fontSize: 17,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyChatHint: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  emptyChatHintText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },

  // Loading State
  loadingContent: {
    alignItems: "center",
  },
  loadingAnimation: {
    marginBottom: 24,
    alignItems: "center",
  },
  loadingOrb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  loadingOrbGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    transform: [{ scale: 1.3 }],
  },
  loadingDots: {
    flexDirection: "row",
    marginTop: 20,
    gap: 12,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  loadingText: {
    fontSize: 20,
    color: Colors.textDark,
    marginTop: 16,
    fontWeight: "600",
  },
  loadingSubtext: {
    fontSize: 15,
    color: Colors.textLight,
    marginTop: 8,
  },

  // Error State
  errorContent: {
    alignItems: "center",
    padding: 24,
  },
  errorIconContainer: {
    padding: 24,
    backgroundColor: "rgba(255, 149, 0, 0.15)",
    borderRadius: 70,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "rgba(255, 149, 0, 0.3)",
  },
  errorTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.textDark,
    marginTop: 20,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 17,
    color: Colors.error,
    marginTop: 12,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 32,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 12,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "600",
  },

  // Misc
  scrollToBottom: {
    backgroundColor: Colors.black,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

