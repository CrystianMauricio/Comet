import React, { useRef, useState, useEffect } from 'react';
import { Keyboard, SafeAreaView, ImageBackground, StatusBar, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // For handling touch gestures
import axios from 'axios'; // Communicate with the Comet backend
import { useFonts, Rubik_400Regular, Rubik_300Light, Rubik_500Medium, Rubik_700Bold, Rubik_900Black } from '@expo-google-fonts/rubik';
import { LinearGradient } from 'expo-linear-gradient'; // For ensuring visibility of the iOS Status Bar
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './styles.js';

import MessageHistory from './components/messagehistory/index.js';
import TaskListSheet from './components/tasksheet.js'; // Major components
import InputRow from './components/inputrow.js';
import identity from './components/rag/identity.js'; // The identity of the comet accountability partner
import { saveTodos } from './utils/todoutils.js';
import supabase from './utils/supabase.js';

let objective_graph = {
  nodes: [],
  edges: [],
  addEdge: function (from, to) {
      this.edges.push({ from, to });
      if (!this.nodes.includes(from)) this.nodes.push(from);
      if (!this.nodes.includes(to)) this.nodes.push(to);
      this.saveGraph();
  },
  loadGraph: async function() {
      try {
          const data = await AsyncStorage.getItem('graphData');
          const graph = data != null ? JSON.parse(data) : null;
          this.nodes = graph.nodes;
          this.edges = graph.edges;
          console.log('Used loadGraph tool:', this);
      } catch (error) {
          console.error("Failed to load graph:", error);
      }
  },
  saveGraph: function() {
      try {
          const data = JSON.stringify(this, null, 2);
          AsyncStorage.setItem('graphData', data);
          console.log('Saved graph:', this);
      } catch (error) {
          console.error("Failed to save graph:", error);
      }
  },
  removeNode: function(node) {
      const index = this.nodes.indexOf(node);
      if (index !== -1) {
          this.nodes.splice(index, 1);
          this.edges = this.edges.filter(edge => edge.from !== node && edge.to !== node);
          this.saveGraph();
      }
      console.log('Used removeNode tool:', node);
  },
  removeEdge: function(from, to) {
      const index = this.edges.findIndex(edge => edge.from === from && edge.to === to);
      if (index !== -1) {
          this.edges.splice(index, 1);
          this.saveGraph();
      }
      console.log('Used removeEdge tool:', from, to);
  },
};

//objective_graph.loadGraph();

import tools from './components/rag/tools.js';

// In-memory ID counter
let currentId = 0;

// Initialize the ID counter from AsyncStorage when the app starts
const initializeIdCounter = async () => {
  const idString = await AsyncStorage.getItem('nextTodoId');
  currentId = idString ? parseInt(idString, 10) : 0;
};

// Function to get the next ID
const getNextId = () => {
  currentId += 1;  // Increment the in-memory counter
  return currentId;
};

// Function to save the current ID back to AsyncStorage
const saveCurrentIdToStorage = async () => {
  if (currentId !== undefined) {
    await AsyncStorage.setItem('nextTodoId', currentId.toString());
  } else {
    console.error('Attempted to save undefined currentId');
  }
};

// Call this function when the app starts
initializeIdCounter();

const saveMessagesToAsyncStorage = async (newMessage) => {
  try {
    // Retrieve existing messages from AsyncStorage
    const existingMessages = await AsyncStorage.getItem('messages');
    let messages = existingMessages ? JSON.parse(existingMessages) : [];

    // Add the new message to the array
    messages.push(newMessage);

    // Save the updated messages array back to AsyncStorage
    await AsyncStorage.setItem('messages', JSON.stringify(messages));
    console.log('Message saved to AsyncStorage');
  } catch (error) {
    console.error('Failed to save message to AsyncStorage:', error);
  }
};

export default function App() {
  // Track the height of the keyboard for adjusting the message input position
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_300Light,
    Rubik_500Medium,
    Rubik_700Bold,
    Rubik_900Black,
  });


  // if (!fontsLoaded) {
  //   return <Text>Loading...</Text>;
  // }
  // DO NOT UNCOMMENT, throws an error when trying to render hooks

  const flatListRef = useRef(null); // Reference for the FlatList
  const bottomSheetRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([
  ]);
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Load todos on app start
  React.useEffect(() => {
    loadTodos();
  }, []);

  // Function to load todos from AsyncStorage
  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem('todos');
      if (savedTodos !== null) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  };

  // Update addTodo function
  const addTodo = (text) => {
    const newId = getNextId();
    setTodos(prevTodos => {
      const updatedTodos = [...prevTodos, { id: newId, text, checked: false, subtodos: [] }];
      saveTodos(updatedTodos);
      return updatedTodos;
    });
    saveCurrentIdToStorage();
  };

  // Update completeTodo function
  const completeTodo = (index) => {
    const updatedTodos = todos.map((todo, i) => ({
      ...todo,
      checked: i === index ? true : todo.checked
    }));
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const clearTodos = async () => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify([])); // Clear todos in storage
      setTodos([]); // Clear todos in state
    } catch (error) {
      console.error('Failed to clear todos:', error);
    }
  };

  const processMessagesForAPI = (messageHistory, newMessage) => {
    // Map existing message history to the required format
    const formattedHistory = messageHistory.map(item => ({
      role: item.sender === 'user' ? 'user' : 'assistant',
      content: item.text ? item.text : ''
    }));

    // Add the new user message to the array if it exists
    if (newMessage.trim()) {
      formattedHistory.push({
        role: 'user',
        content: newMessage
      });
    }

    return formattedHistory;
  };

  const saveMessageToHistory = async (message) => {
    try {
        const { data, error } = await supabase
            .from('message_history')
            .insert([
                { user_id: user.id, type: message.type, text: message.text, sender: message.sender }
            ]);

        if (error) {
            console.error('Error saving message to database:', error);
        }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: 'user',
        type: 'message'
      };
      const placeholderId = Date.now(); // Unique ID for the placeholder

      // Update the message history immediately with user message and loading indicator
      setMessageHistory(prevHistory => [
        ...prevHistory,
        newMessage,
        { id: placeholderId, text: '', sender: 'comet', loading: true } // Indicate loading with a special flag
      ]);

      setMessage(''); // Clear the input after sending
      Keyboard.dismiss()

      await saveMessageToHistory(newMessage);

      const userName = userProfile ? userProfile.name : 'unknown_username';

      // Prepare the entire query object for GPT-4
      const gptQuery = {
        model: "gpt-4o", // Specify the model
        messages: [
          {
            role: 'system',
            content: identity
          },
          {
            role: 'system',
            content: `${userName}'s todo list: ${todos.map((todo, index) => `${index + 1}. ${todo.text}${todo.subtodos.length ? ' (' + todo.subtodos.map((sub, subIndex) => `${index + 1}.${subIndex + 1} ${sub.text}`).join(', ') + ')' : ''}`).join(', ')}`
          },
          ...processMessagesForAPI(messageHistory, message),
        ],
        tools: tools // Include the function definitions from the tools array
      };

      console.log('Query:', gptQuery);

      // Query your API endpoint to get a response from GPT-4
      try {
        const response = await axios.post('https://usecomet.app/gpt4-chat', gptQuery);
        const cometResponse = {
          text: response.data.reply.choices[0].message.content ? response.data.reply.choices[0].message.content+'\n' : '',
          sender: 'comet'
        };
        const toolUseLogResponse = {
          text: '',
          sender: 'comet',
          type: 'log'
        }

        const toolCalls = response.data.reply.choices[0].message.tool_calls;
        if (toolCalls) {
          toolCalls.forEach(call => {
            if (call.function.name === "add_edge") {
              const args = JSON.parse(call.function.arguments);
              objective_graph.addEdge(args.from, args.to);
              toolUseLogResponse.text += `\nAdded edge from **${args.from}** → **${args.to}** `;
            } else if (call.function.name === "remove_node") {
              const args = JSON.parse(call.function.arguments);
              objective_graph.removeNode(args.node);
              toolUseLogResponse.text += `\nRemoved node **${args.node}** `;
            } else if (call.function.name === "remove_edge") {
              const args = JSON.parse(call.function.arguments);
              objective_graph.removeEdge(args.from, args.to);
              toolUseLogResponse.text += `\nRemoved edge from **${args.from}** to **${args.to}**`;
            } else if (call.function.name === "add_todo") {
              const args = JSON.parse(call.function.arguments);
              const capitalizedTodo = args.todo.charAt(0).toUpperCase() + args.todo.slice(1);
              addTodo(capitalizedTodo);
              toolUseLogResponse.text += `\nAdded todo **${capitalizedTodo}** `;
            } else if (call.function.name === "complete_todo") {
              const args = JSON.parse(call.function.arguments);
              completeTodo(args.index);
              toolUseLogResponse.text += `\nCompleted **${todos[args.index].text}** `;
            }
          });
        }
        // Update the placeholder with the actual response
        setMessageHistory(prevHistory => prevHistory.map(item =>
          item.id === placeholderId ? cometResponse : item
        ));
        if (toolUseLogResponse.text.length > 0) {
          setMessageHistory(prevHistory => [...prevHistory, { id: 'toolUseLog', text: toolUseLogResponse.text, sender: 'comet', type: 'log' }]);
          
          // Save the tool use log to the database if needed
          await saveMessageToHistory(toolUseLogResponse);
        }
        
        // Save the AI's response to the database
        await saveMessageToHistory(cometResponse);
      } catch (error) {
        console.error('Failed to get response from GPT-4:', error);
        const errorResponse = { id: placeholderId, text: 'Failed to load response.', sender: 'comet' };
        setMessageHistory(prevHistory => prevHistory.map(item =>
          item.id === placeholderId ? errorResponse : item
        ));
        
        // Save the error response to the database
        await saveMessageToHistory(errorResponse);
      }
    }
  };

  // useEffect(() => {
  //   clearTodos();
  // }, []);

  useEffect(() => {
    initializeAnonymousAuth();
  }, []);

  const initializeAnonymousAuth = async () => {
    try {
      // Check if there's an existing session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // User is already signed in
        setUser(session.user);
      } else {
        // No existing session, sign in anonymously
        const { data: { user }, error } = await supabase.auth.signInAnonymously();

        if (error) throw error;
        setUser(user);

        // Create a placeholder user profile in your database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{ id: user.id, name: '' }]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }
    } catch (error) {
      console.error('Error during anonymous authentication:', error.message);
    }
  };

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      console.log('User signed out successfully.');
    }
  };

  const resetAndReinitialize = async () => {
    await signOutUser();
    await initializeAnonymousAuth();
  };

  const fetchUserProfile = async (userId) => {
    try {
      let { data, error, status } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    }
  };

  const updateUserProfile = async (userId, updatedProfile) => {
    try {
      let { error } = await supabase
        .from('user_profiles')
        .update(updatedProfile)
        .match({ id: userId });

      if (error) throw error;

      // Update the local state only if the database update is successful
      setUserProfile(prevProfile => ({ ...prevProfile, ...updatedProfile }));
    } catch (error) {
      console.error('Error updating user profile:', error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchLatestMessages = async () => {
      try {
          const { data, error } = await supabase
              .from('message_history')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(30);
  
          if (error) {
              throw error;
          }
  
          const formattedMessages = data.map(msg => ({
              id: msg.id,
              text: msg.text,
              sender: msg.sender,
              type: msg.type || 'message' // Default to 'message' if type is not defined
          }));
  
          setMessageHistory(formattedMessages.reverse()); // Reverse to display the latest message at the bottom
      } catch (error) {
          console.error('Error fetching messages:', error.message);
      }
  };

    fetchLatestMessages();
  }, []);

  const syncMessagesWithDatabase = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('messages');
      const messages = storedMessages ? JSON.parse(storedMessages) : [];

      // Filter messages that need to be synced (e.g., based on a 'synced' flag)
      const unsyncedMessages = messages.filter(msg => !msg.synced);

      // Bulk insert unsynced messages to the database
      const { error } = await supabase.from('message_history').insert(unsyncedMessages);

      if (!error) {
        // Mark all messages as synced
        const updatedMessages = messages.map(msg => ({ ...msg, synced: true }));
        await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
        console.log('Messages synced with database');
      }
    } catch (error) {
      console.error('Error syncing messages:', error);
    }
  };

  return (
    <ImageBackground source={require(`./themes/default_background.png`)}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" />
      <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        <SafeAreaView style={styles.safeAreaView}>
          {/* Ensure the iOS Status Bar remains readable with a fade */}
          <LinearGradient
            colors={['#0f0f0f', '#0f0f0f00']}
            style={styles.statusbarGradient}
          />
          {/* Message History List */}
          <MessageHistory messageHistory={messageHistory} flatListRef={flatListRef} user={user} />
          {/* User input bar */}
          <InputRow message={message} setMessage={setMessage} flatListRef={flatListRef} onSendMessage={sendMessage} />
          {/* Bottom sheet for todos */}
          <TaskListSheet todos={todos} setTodos={setTodos} userProfile={userProfile} bottomSheetRef={bottomSheetRef} />
        </SafeAreaView>
        </ActionSheetProvider>
      </GestureHandlerRootView>
    </ImageBackground>
    );
  }