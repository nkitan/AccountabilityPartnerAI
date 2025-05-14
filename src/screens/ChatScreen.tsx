import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  TextInput as RNTextInput,
  Animated,
  Dimensions,
  Image,
  Pressable
} from 'react-native';
import { 
  Text, 
  Avatar, 
  IconButton, 
  Surface,
  ActivityIndicator,
  Divider,
  Card
} from 'react-native-paper';
import { useTheme } from '../utils/theme';
import { useAppContext } from '../context/AppContext';
import { AIMessage } from '../types';
import AIPartnerService from '../services/AIPartnerService';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const ChatScreen: React.FC = () => {
  const theme = useTheme();
  const { 
    user, 
    habits, 
    conversation, 
    setUser,
    addMessage
  } = useAppContext();
  
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Create animated values for the typing indicator dots
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));
  
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<RNTextInput>(null);

  // Initialize chat with welcome message if no conversation exists
  useEffect(() => {
    if (conversation && conversation.length > 0) {
      // Use existing conversation
      setMessages(conversation);
    } else {
      // Generate welcome message
      const welcomeMessage = AIPartnerService.generateWelcomeMessage();
      setMessages([welcomeMessage]);
      // Add to global conversation
      addMessage(welcomeMessage);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);
  
  // Animation sequence for typing indicator
  useEffect(() => {
    if (isTyping) {
      const animateDots = () => {
        // Reset values
        dot1.setValue(0);
        dot2.setValue(0);
        dot3.setValue(0);
        
        // Create sequence
        Animated.sequence([
          // Dot 1 animation
          Animated.timing(dot1, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
          }),
          // Dot 2 animation
          Animated.timing(dot2, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
          }),
          // Dot 3 animation
          Animated.timing(dot3, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
          }),
          // Pause at the end
          Animated.delay(300)
        ]).start(() => {
          // Repeat animation if still typing
          if (isTyping) {
            animateDots();
          }
        });
      };
      
      animateDots();
      
      return () => {
        // Cleanup animations on unmount or when typing stops
        dot1.stopAnimation();
        dot2.stopAnimation();
        dot3.stopAnimation();
      };
    }
  }, [isTyping, dot1, dot2, dot3]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Create user message as AIMessage with isUser: true to ensure correct positioning
    const userMessage: AIMessage = {
      id: uuidv4(),
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
      isUser: true
    };
    
    // Add user message to state
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Generate AI response after a delay
    setTimeout(() => {
      const aiResponse = AIPartnerService.generateResponse(userMessage, habits);
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setIsTyping(false);
      
      // Add messages to global conversation
      addMessage(userMessage);
      addMessage(aiResponse);
      
      // Update user's virtual currency as a reward for engaging
      if (user) {
        setUser({
          ...user,
          virtualCurrency: user.virtualCurrency + 5,
          lastActive: new Date().toISOString()
        });
      }
    }, 1500);
  };

  // Render a message bubble with modern styling
  const renderMessage = ({ item, index }: { item: AIMessage, index: number }) => {
    // Determine if the message is from AI or user
    const isAI = !item.isUser;
    const isFirstMessage = index === 0;
    const isLastMessage = index === messages.length - 1;
    
    // Check if this message is part of a sequence from the same sender
    const isPreviousSameSender = index > 0 && (messages[index - 1].isUser === item.isUser);
    const isNextSameSender = index < messages.length - 1 && (messages[index + 1].isUser === item.isUser);
    
    // Adjust bubble styling based on position in conversation
    const getBubbleStyle = () => {
      if (isAI) {
        return {
          borderTopLeftRadius: isPreviousSameSender ? 4 : 20,
          borderBottomLeftRadius: isNextSameSender ? 4 : 20,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          marginTop: isPreviousSameSender ? 2 : 8,
          marginBottom: isNextSameSender ? 2 : 8,
        };
      } else {
        return {
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          borderTopRightRadius: isPreviousSameSender ? 4 : 20,
          borderBottomRightRadius: isNextSameSender ? 4 : 20,
          marginTop: isPreviousSameSender ? 2 : 8,
          marginBottom: isNextSameSender ? 2 : 8,
        };
      }
    };
    
    return (
      <View 
        style={[
          styles.messageContainer,
          isAI ? styles.aiMessageContainer : styles.userMessageContainer
        ]}
      >
        {/* Only show avatar for first message in a sequence */}
        {isAI && !isPreviousSameSender && (
          <Avatar.Icon 
            size={36} 
            icon="robot" 
            style={styles.avatar}
            color="#fff"
            backgroundColor={theme.colors.primary}
          />
        )}
        
        {isAI && isPreviousSameSender && (
          <View style={{ width: 36, marginRight: 8 }} />
        )}
        
        <View style={{ maxWidth: '80%' }}>
          {/* Message bubble with modern styling */}
          {isAI ? (
            <View 
              style={[
                styles.messageBubble,
                getBubbleStyle(),
                { 
                  backgroundColor: theme.dark 
                    ? 'rgba(103, 80, 164, 0.2)' 
                    : 'rgba(103, 80, 164, 0.08)'
                }
              ]}
            >
              <Text 
                style={[
                  styles.messageText,
                  { color: theme.colors.text }
                ]}
              >
                {item.content}
              </Text>
              
              <Text 
                style={[
                  styles.timestamp,
                  { color: theme.colors.placeholder }
                ]}
              >
                {new Date(item.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          ) : (
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryAction]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.messageBubble,
                getBubbleStyle()
              ]}
            >
              <Text 
                style={[
                  styles.messageText,
                  { color: '#fff' }
                ]}
              >
                {item.content}
              </Text>
              
              <Text 
                style={[
                  styles.timestamp,
                  { color: 'rgba(255, 255, 255, 0.7)' }
                ]}
              >
                {new Date(item.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </LinearGradient>
          )}
        </View>
        
        {/* Only show avatar for first message in a sequence */}
        {!isAI && !isPreviousSameSender && (
          <Avatar.Text 
            size={36} 
            label={user?.name?.substring(0, 2).toUpperCase() || 'U'} 
            style={styles.avatar}
            color="#fff"
            backgroundColor={theme.colors.secondary}
          />
        )}
        
        {!isAI && isPreviousSameSender && (
          <View style={{ width: 36, marginLeft: 8 }} />
        )}
      </View>
    );
  };

  // Render the typing indicator with modern animation
  const renderTypingIndicator = () => {
    // Interpolate values for scaling and opacity
    const dot1Scale = dot1.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.8, 1.2, 0.8]
    });
    
    const dot2Scale = dot2.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.8, 1.2, 0.8]
    });
    
    const dot3Scale = dot3.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.8, 1.2, 0.8]
    });
    
    return (
      <View style={[styles.messageContainer, styles.aiMessageContainer]}>
        <Avatar.Icon 
          size={36} 
          icon="robot" 
          style={styles.avatar}
          color="#fff"
          backgroundColor={theme.colors.primary}
        />
        
        <Surface 
          style={[
            styles.messageBubble,
            {
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 20,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              backgroundColor: theme.dark 
                ? 'rgba(103, 80, 164, 0.2)' 
                : 'rgba(103, 80, 164, 0.08)',
              elevation: 0,
              paddingVertical: 12,
              paddingHorizontal: 16
            }
          ]}
        >
          <View style={styles.typingContainer}>
            <Animated.View 
              style={[
                styles.typingDot, 
                { 
                  backgroundColor: theme.colors.primary,
                  transform: [{ scale: dot1Scale }],
                  opacity: dot1
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.typingDot, 
                { 
                  backgroundColor: theme.colors.primary,
                  transform: [{ scale: dot2Scale }],
                  opacity: dot2
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.typingDot, 
                { 
                  backgroundColor: theme.colors.primary,
                  transform: [{ scale: dot3Scale }],
                  opacity: dot3
                }
              ]} 
            />
          </View>
        </Surface>
      </View>
    );
  };

  // Get screen dimensions for responsive design
  const { width: screenWidth } = Dimensions.get('window');
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar style="auto" />
      
      {/* Modern Chat header with blur effect */}
      {Platform.OS === 'ios' ? (
        <BlurView 
          intensity={80} 
          tint={theme.dark ? 'dark' : 'light'}
          style={styles.headerBlur}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Avatar.Icon 
                size={40} 
                icon="robot" 
                style={{ backgroundColor: theme.colors.primary }}
                color="#fff"
              />
              <View style={styles.headerTextContainer}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                  Your Accountability Partner
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.placeholder }]}>
                  {isTyping ? 'Typing...' : 'Online'}
                </Text>
              </View>
            </View>
            
            <IconButton
              icon="information-outline"
              size={24}
              color={theme.colors.primary}
              onPress={() => {
                // Show AI partner information or help
                console.log('Show AI partner info');
              }}
            />
          </View>
          <Divider style={{ backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} />
        </BlurView>
      ) : (
        <Surface 
          style={[
            styles.header, 
            { 
              backgroundColor: theme.colors.surface,
              elevation: 4
            }
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Avatar.Icon 
                size={40} 
                icon="robot" 
                style={{ backgroundColor: theme.colors.primary }}
                color="#fff"
              />
              <View style={styles.headerTextContainer}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                  Your Accountability Partner
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.placeholder }]}>
                  {isTyping ? 'Typing...' : 'Online'}
                </Text>
              </View>
            </View>
            
            <IconButton
              icon="information-outline"
              size={24}
              color={theme.colors.primary}
              onPress={() => {
                // Show AI partner information or help
                console.log('Show AI partner info');
              }}
            />
          </View>
          <Divider style={{ backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} />
        </Surface>
      )}
      
      {/* Messages list with improved rendering */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item, index }) => renderMessage({ item, index })}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        ListHeaderComponent={() => (
          <View style={{ paddingVertical: 8 }}>
            <Card style={styles.welcomeCard}>
              <Card.Content>
                <Text style={styles.welcomeCardTitle}>Welcome to your AI Accountability Partner</Text>
                <Text style={styles.welcomeCardText}>
                  I'm here to help you stay on track with your habits and goals. 
                  Feel free to ask me anything about your progress!
                </Text>
              </Card.Content>
            </Card>
          </View>
        )}
      />
      
      {/* Typing indicator */}
      {isTyping && renderTypingIndicator()}
      
      {/* Modern Input area with blur effect on iOS */}
      {Platform.OS === 'ios' ? (
        <BlurView 
          intensity={80} 
          tint={theme.dark ? 'dark' : 'light'}
          style={styles.inputBlur}
        >
          <View style={styles.inputInnerContainer}>
            <RNTextInput
              ref={inputRef}
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.dark ? 'rgba(30,30,30,0.8)' : 'rgba(240,240,240,0.8)',
                  color: theme.colors.text,
                  borderColor: 'transparent'
                }
              ]}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.placeholder}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            
            <Pressable 
              style={({ pressed }) => [
                styles.sendButton, 
                { 
                  backgroundColor: pressed ? theme.colors.primaryAction : theme.colors.primary,
                  opacity: (!inputText.trim() || isTyping) ? 0.5 : 1
                }
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
            >
              <IconButton
                icon="send"
                size={24}
                color="#fff"
              />
            </Pressable>
          </View>
        </BlurView>
      ) : (
        <Surface 
          style={[
            styles.inputContainer, 
            { 
              backgroundColor: theme.colors.surface,
              elevation: 8
            }
          ]}
        >
          <RNTextInput
            ref={inputRef}
            style={[
              styles.input, 
              { 
                backgroundColor: theme.dark ? 'rgba(30,30,30,0.8)' : 'rgba(240,240,240,0.8)',
                color: theme.colors.text,
                borderColor: 'transparent'
              }
            ]}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.placeholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          
          <Pressable 
            style={({ pressed }) => [
              styles.sendButton, 
              { 
                backgroundColor: pressed ? theme.colors.primaryAction : theme.colors.primary,
                opacity: (!inputText.trim() || isTyping) ? 0.5 : 1
              }
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <IconButton
              icon="send"
              size={24}
              color="#fff"
            />
          </Pressable>
        </Surface>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header styles
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerBlur: {
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  
  // Messages list styles
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    maxWidth: '85%',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    marginTop: 4,
  },
  messageBubble: {
    padding: 12,
    marginHorizontal: 8,
    maxWidth: '90%',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
    letterSpacing: 0.1,
  },
  
  // Welcome card
  welcomeCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  welcomeCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeCardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Typing indicator
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    height: 36,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  
  // Input area
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    alignItems: 'center',
  },
  inputBlur: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    alignItems: 'center',
  },
  inputInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;