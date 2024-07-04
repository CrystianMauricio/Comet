import React, { useState, useRef, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import TodoActionSheet from './todooptions.js';
import TodoItem from './todoitem.js';
import axios from 'axios'; // Ensure axios is imported
import { saveTodos } from '../utils/todoutils.js';
import supabase from '../utils/supabase.js';

export default function TaskListSheet({ todos, setTodos, userProfile }) {
  const snapPoints = useMemo(() => ["33.6%", "93%"], []);
  const bottomSheetRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Initial index

  const handleSheetChanges = (index) => {
    setCurrentIndex(index);
  };

  const [visibleComponents, setVisibleComponents] = useState(new Array(todos.length).fill(false)); // Visibility state array
  const [loadingSubtodos, setLoadingSubtodos] = useState({});

  const { showActionSheet } = TodoActionSheet((action, item) => {
    console.log(`${action} selected for item ${item.id}`);
    switch (action) {
      case 'Delete':
        setTodos(prevTodos => {
          const updatedTodos = prevTodos.filter(todo => todo.id !== item.id);
          saveTodos(updatedTodos); // Save right after updating
          return updatedTodos;
        });
        break;
      case 'Rethink subtasks':
        fillSubtodos(item.id);
        toggleVisibility(item.id, true);
        break;
      case 'Lift subtasks':
        liftSubTodos(item.id);
        break;
      default:
        break;
    }
  });

  const liftSubTodos = (todoId) => {
    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex === -1) return;

    const todo = todos[todoIndex];
    if (!todo.subtodos) return;

    const uncheckedSubTodos = todo.subtodos.filter(subtask => !subtask.checked);
    const remainingSubTodos = todo.subtodos.filter(subtask => subtask.checked);

    // Create new todo items from unchecked subTodos
    const newTodos = uncheckedSubTodos.map(subtask => ({
      id: Date.now() + Math.random(),
      text: subtask.text,
      checked: false,
      subtodos: []
    }));

    // Insert new todos above the current todo item
    todos.splice(todoIndex, 0, ...newTodos);

    // Update the current todo with remaining subTodos
    todos[todoIndex + newTodos.length] = { ...todo, subtodos: remainingSubTodos };

    setTodos([...todos]);
    saveTodos(todos);

    toggleVisibility(todoId, false);
  };

  const fillSubtodos = async (todoId) => {
    setLoadingSubtodos(prev => ({ ...prev, [todoId]: true }));
    try {
      const todo = todos.find(t => t.id === todoId);
      const response = await axios.post('https://usecomet.app/gpt4-chat', {
        model: "gpt-4o",
        messages: [
          {
            role: 'system',
            // content: 'Generate between two and five NECESSARY sub-Todos for the following todo item: ' + todo.text + '\nBe concise, and use a maximum of 6 words. Do not end the message with a period or punctuation. Ensure that the Todos are not unnecessary actions or wasteful of time. Separate each item with only a single newline.'
            content: 'Generate between two and five sub-Todos for the following todo item: ' + todo.text + '\nBe concise, and use a maximum of 6 words and 26 characters. The first sub-task should be the first action necessary to begin working on the todo item. The last sub-task should be the final action that would complete the todo item. SubTodos should never involve waiting, scheduling or choosing a future time for the task unless the task is explicitly about planning. In-between sub-Todos should only be present if they are major and important steps. Ensure that Todos are not unnecessary actions or wasteful of time. Separate each item with only a single newline, and items should not be numbered or end with periods.'
          },
        ],
      });
  
      const newSubtodosTexts = response.data.reply.choices[0].message.content.split(/\s*\n\s*/).map(text => text.trim());
      const newSubtodos = newSubtodosTexts.map(subtodoText => ({ id: Date.now() + Math.random(), text: subtodoText, checked: false }));
  
      setTodos(prevTodos => {
        const updatedTodos = prevTodos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, subtodos: newSubtodos };
          }
          return todo;
        });
        saveTodos(updatedTodos); // Save after updating
        return updatedTodos;
      });
    } catch (error) {
      console.error('Failed to generate subtodo:', error);
    } finally {
      setLoadingSubtodos(prev => ({ ...prev, [todoId]: false }));
    }
  }

  const toggleVisibility = async (todoId, set) => {
    setVisibleComponents(prev => ({
      ...prev,
      [todoId]: set !== undefined ? set : !prev[todoId]
    }));

    if (!visibleComponents[todoId] && todos.find(t => t.id === todoId)?.subtodos.length === 0) {
      fillSubtodos(todoId);
    }
  };

  const animateScale = (newValue) => {
    Animated.spring(scale, {
      toValue: newValue,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enabledContentGestureInteraction={true}
      index={0}
      snapPoints={snapPoints}
      backgroundComponent={({ style }) => (
        <BottomSheetView style={[style, localStyles.borderContainer]}>
          <BottomSheetView style={[localStyles.border, localStyles.borderBlur]} />
          <BlurView
            style={localStyles.blurView}
            tint="dark"
            intensity={100}
          >
            <ImageBackground
              source={require('../assets/white_noise_transparent.png')}
              style={[localStyles.noiseTexture]}
              resizeMode="repeat"
            />
          </BlurView>
          <BottomSheetView style={[localStyles.border, localStyles.borderFront]} />
        </BottomSheetView>
      )}
      handleIndicatorStyle={{ backgroundColor: '#aab7ee70' }}
      onChange={handleSheetChanges}
    >
      <BottomSheetScrollView
        style={localStyles.scrollView}
        scrollEventThrottle={16} // Adjust based on performance
      >
      
      {todos && todos.length > 0 ? (
        todos.map((todo) => {
          if (todo.id === undefined) {
            console.error('Undefined ID for todo:', todo);
            return null; // Skip rendering this item
          }
          return (
            <TodoItem
              key={todo.id.toString()}
              todo={todo}
              toggleVisibility={toggleVisibility}
              visibleComponents={visibleComponents}
              setTodos={setTodos}
              todos={todos}
              showActionSheet={showActionSheet}
              loadingSubtodos={loadingSubtodos}
              bottomSheetRef={bottomSheetRef}
            />
          );
        })
      ) : (
        <BottomSheetView style={localStyles.emptyStateContainer}>
          <Text style={localStyles.welcomeStateTitle}>Welcome to Comet{userProfile && userProfile.name ? `, ${userProfile.name}` : ''}!</Text>
          <Text style={localStyles.welcomeStateText}>Send a message to get started.</Text>
        </BottomSheetView>
      )}
        
        <BottomSheetView style={localStyles.taskListBottomPadding}></BottomSheetView>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const localStyles = StyleSheet.create({
    // Inherit shared styles from the main stylesheet
    blurView: {
        width: "100%",
        height: '100%',
        zIndex: 2, // Set zIndex to be between the borders
        pointerEvents: 'none',
    },
    border: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 23, // Match the BlurView's borderRadius
    },
    borderFront: {
        zIndex: 3, // Ensure it is in front of the BlurView
        borderWidth: 1.5,
        borderColor: 'rgba(120, 80, 255, 0.2)',
      },
    borderContainer: {
      overflow: 'hidden',
      borderRadius: 23,
    },
    scrollView: {
        height: '50%',
        position: 'relative',
    },
    taskListBottomPadding: {
      height: 30,
    },
    todoItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 10,
      marginLeft: 10,
    },
    todoIndex: {
      marginRight: 9,
      bottom: 4,
      width: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    todoIndexText: {
      color: 'rgba(180, 150, 255, 0.6)',
      fontSize: 17,
      fontWeight: '400',
      fontFamily: 'Rubik_500Medium',
    },
    todoItemBar: {
      borderRadius: 8,
      marginBottom: 10,
      overflow: 'hidden',
      flex: 1,
    },
    todoItemBarTop: {
      borderRadius: 8,
      marginBottom: 10,
      overflow: 'hidden',
      backgroundColor: 'rgba(235,245,255,0.9)',
      flex: 1,
    },
    todoItem: {
      padding: 12,
    },
    todoItemTop: {
      padding: 12,
    },
    borderTodo: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 8,
      borderColor: 'rgba(180, 180, 255, 0.2)',
    },
    borderTodoTopBlur: {
      borderWidth: 9, // Thicker border for the top item
      borderLeftWidth: 9.5,
      borderRightWidth: 10,
      borderBottomWidth: 12,
      borderColor: 'rgba(100, 120, 200, 1)', // Different color to stand out
    },
    borderTodoTopFront: {
        borderWidth: 1.75, // Thicker front border for the top item
        borderColor: 'rgba(235, 235, 255, 0.15)', // Lighter color to stand out
        pointerEvents: 'none',
    },
    borderTodoFront: {
        borderWidth: 1.25,
        zIndex: 1,
        pointerEvents: 'none',
        borderColor: 'rgba(120, 80, 255, 0.2)',
    },
    todoItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    borderTodoBlur: {
      borderWidth: 6,
      borderColor: 'rgba(100, 170, 255, 0.1)',
    },
    checkboxTop: {
      aspectRatio: 1,
      marginRight: 10,
      borderRadius: 3,
      borderWidth: 1.5,
      borderColor: 'rgba(0,0,0,0.3)',
      backgroundColor: 'rgba(40, 40, 92, 0.75)',
    },
    checkbox: {
      aspectRatio: 1,
      marginRight: 10,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: 'rgba(180, 180, 255, 0.2)',
    },
    todoText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '400',
      maxWidth: '90%',
      zIndex: 20,
    },
    todoTextTop: {
      color: '#14142a',
      fontSize: 16,
      fontWeight: '700',
      maxWidth: '90%',
      zIndex: 20,
      textShadowColor: 'rgba(225, 235, 255, 1)',
      textShadowRadius: 5,
    },
    noiseTexture: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.13,
      transform: [{ scale: 1 }],
      zIndex: 0,
      pointerEvents: 'none',
    },
    emptyStateContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 130,
      },
    welcomeStateTitle: {
      color: 'rgba(180, 150, 255, 0.6)',
      fontSize: 30,
      fontFamily: 'Rubik_700Bold',
      marginBottom: 6,
    },
    welcomeStateText: {
      color: 'rgba(180, 150, 255, 0.6)',
      fontSize: 17,
      fontFamily: 'Rubik_400Light',
    },
    borderContainer: {
      flex: 1,
      overflow: 'hidden', // Ensures that the border does not extend beyond the blur area
      borderRadius: 23, // Match the BlurView's borderRadius
    },
    borderBlur: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1, // Positioned to blur behind the main BlurView
  
      borderWidth: 22,
      borderColor: 'rgba(170, 170, 255, 0.125)',
      outlineWidth: 10,
    },
    stripeAnimation: {
      position: 'absolute',
      top: 0,
      left: -100,
      right: 0,
      bottom: 0,
      width: '240%',
      height: '240%',
      opacity: 0.14,
    },
    toggleButton: {
      padding: 0,
      color: '#000000',
      position: 'absolute',
      right: 0,
    },
    toggleButtonSymbol: {
      color: '#fff',
      fontSize: 24,
      fontWeight: '400',
      fontFamily: 'Rubik_500Medium',
    },
    toggleButtonTopSymbol: {
      color: '#111',
      fontSize: 24,
      fontWeight: '400',
      fontFamily: 'Rubik_500Medium',
    },
    toggleableComponent: {
      paddingTop: 2,
      marginBottom: 7,
    },
    subtodoItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 10,
      marginLeft: 10,
    },
    subtodoIndex: {
      marginRight: 9,
      bottom: 4,
      width: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 42,
    },
    subtodoIndexText: {
      color: 'rgba(180, 150, 255, 0.6)',
      fontSize: 17,
      fontWeight: '400',
      fontFamily: 'Rubik_500Medium',
    },
    subtodoItemBar: {
      borderRadius: 8,
      marginBottom: 10,
      overflow: 'hidden',
      flex: 1,
    },
    subtodoItem: {
      paddingLeft: 12,
      width: "100%",
      zIndex: 2, // Set zIndex to be between the borders
      pointerEvents: 'none',
    },
    subtodoItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    subtodoText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '400',
      maxWidth: '90%',
      zIndex: 20,
    },
    loadingContainer: {
      padding: 12,
      alignItems: 'center',
    },
    loadingSpinner: {
      width: 18,
      height: 18,
    },
});