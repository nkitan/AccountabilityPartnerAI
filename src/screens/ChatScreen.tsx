import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  TextInput as RNTextInput
} from 'react-native';
import { 
  Text, 
  Avatar, 
  IconButton, 
  Surface,
  ActivityIndicator
} from 'react-native-paper';
import { useTheme, withOpacity } from '../utils/theme';
import { useAppContext } from '../context/AppContext';
import { AIMessage } from '../types';
import AIPartnerService from '../services/AIPartnerService';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { StatusBar } from 'expo-status-bar';

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

  // Render a message bubble
  const renderMessage = ({ item }: { item: AIMessage }) => {
    // Determine if the message is from AI or user
    const isAI = !item.isUser;
    
    return (
      <View 
        style={[
          styles.messageContainer,
          isAI ? styles.aiMessageContainer : styles.userMessageContainer
        ]}
      >
        {isAI && (
          <Avatar.Icon 
            size={36} 
            icon="robot" 
            style={styles.avatar}
            color="#fff"
            backgroundColor={theme.colors.primary}
          />
        )}
        
        <Surface 
          style={[
            styles.messageBubble,
            isAI 
              ? [styles.aiMessageBubble, { backgroundColor: 'rgba(103, 80, 164, 0.1)' }]
              : [styles.userMessageBubble, { backgroundColor: theme.colors.primary }]
          ]}
        >
          <Text 
            style={[
              styles.messageText,
              { color: isAI ? theme.colors.text : '#fff' }
            ]}
          >
            {item.content}
          </Text>
          
          <Text 
            style={[
              styles.timestamp,
              { color: isAI ? theme.colors.placeholder : 'rgba(255, 255, 255, 0.7)' }
            ]}
          >
            {new Date(item.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </Surface>
        
        {!isAI && (
          <Avatar.Text 
            size={36} 
            label={user?.name?.substring(0, 2).toUpperCase() || 'U'} 
            style={styles.avatar}
            color="#fff"
            backgroundColor={theme.colors.secondary}
          />
        )}
      </View>
    );
  };

  // Render the typing indicator
  const renderTypingIndicator = () => {
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
            styles.aiMessageBubble,
            { backgroundColor: 'rgba(103, 80, 164, 0.1)' }
          ]}
        >
          <View style={styles.typingContainer}>
            <View style={[styles.typingDot, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.typingDot, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.typingDot, { backgroundColor: theme.colors.primary }]} />
          </View>
        </Surface>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar style="auto" />
      
      {/* Chat header */}
      <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <Avatar.Icon 
            size={40} 
            icon="robot" 
            backgroundColor={theme.colors.primary}
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
      </Surface>
      
      {/* Messages list */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Typing indicator */}
      {isTyping && renderTypingIndicator()}
      
      {/* Input area */}
      <Surface style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        <RNTextInput
          ref={inputRef}
          style={[
            styles.input, 
            { 
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              borderColor: theme.colors.placeholder
            }
          ]}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.placeholder}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isTyping}
        >
          <IconButton
            icon="send"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
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
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 8,
    maxWidth: '90%',
    elevation: 1,
  },
  aiMessageBubble: {
    borderTopLeftRadius: 4,
  },
  userMessageBubble: {
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 8,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;