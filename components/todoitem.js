import React, { useRef } from 'react';
import { Animated, Pressable, View, Text, StyleSheet, Image } from 'react-native';
import { BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import Checkbox from './checkbox.js';

const TodoItem = ({ todo, toggleVisibility, visibleComponents, setTodos, todos, showActionSheet, loadingSubtodos, bottomSheetRef, currentIndex }) => {
  const itemScale = useRef(new Animated.Value(1)).current;

  const animateScale = (newValue) => {
    Animated.spring(itemScale, {
      toValue: newValue,
      useNativeDriver: true,
      friction: 20 // Higher friction for slower animation
    }).start();
  };

  return (
    <BottomSheetView>
    <Pressable
      onPressIn={() => animateScale(1.025)}
      onPressOut={() => animateScale(1)}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        showActionSheet(todo);
      }}
      delayLongPress={500}
    >
      <BottomSheetView style={localStyles.todoItemContainer}>
        <BottomSheetView style={localStyles.todoIndex}>
          <Text style={localStyles.todoIndexText}>{todos.findIndex(t => t.id === todo.id) + 1}</Text>
        </BottomSheetView>
        <Animated.View style={[
          localStyles.todoItemBar,
          todos[0].id === todo.id ? localStyles.todoItemBarTop : null,
          { transform: [{ scale: itemScale }] }
        ]}>
          <BottomSheetView style={[localStyles.borderTodo, todos[0].id === todo.id ? localStyles.borderTodoTopBlur : localStyles.borderTodoBlur]} />
          <BlurView style={todos[0].id === todo.id ? localStyles.todoItemTop : localStyles.todoItem} intensity={todos[0].id === todo.id ? 35 : 22} tint="light">
            {todos[0].id === todo.id && (
              <Image
                source={require('../assets/loading_effect.png')}
                style={[localStyles.stripeAnimation]}
                resizeMode="center"
              />
            )}
            <BottomSheetView style={localStyles.todoItemContent}>
              <Checkbox
                isChecked={todo.checked}
                onToggle={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  const updatedTodos = todos.map((item, idx) => {
                    if (idx === todos.findIndex(t => t.id === todo.id)) {
                      return { ...item, checked: !item.checked };
                    }
                    return item;
                  });
                  setTodos(updatedTodos);
                }}
                style={todos[0].id === todo.id ? localStyles.checkboxTop : localStyles.checkbox}
                checkColor={'#fff'}
              />
              <BottomSheetTextInput
                suppressHighlighting={true}
                value={todo.text}
                onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
                keyboardAppearance="dark"

                onChangeText={(text) => {
                  const updatedTodos = todos.map((item, idx) => {
                    if (idx === todos.findIndex(t => t.id === todo.id)) {
                      return { ...item, text: text };
                    }
                    return item;
                  });
                  setTodos(updatedTodos);
                }}
                hitSlop={12}
                style={[
                  todos[0].id === todo.id ? localStyles.todoTextTop : localStyles.todoText,
                  { pointerEvents: visibleComponents[todo.id] ? 'auto' : 'none' }
                ]}
              />
              <Pressable
                onPress={() => {
                  toggleVisibility(todo.id);
                }}
                style={localStyles.toggleButton}
                hitSlop={12}
              >
                <MaterialCommunityIcons
                  style={todos[0].id === todo.id ? localStyles.toggleButtonTopSymbol : localStyles.toggleButtonSymbol}
                  name={visibleComponents[todo.id] ? "chevron-down" : "chevron-right"}
                  size={24}
                  color="#fff"
                />
              </Pressable>
            </BottomSheetView>
          </BlurView>
          <BottomSheetView style={[localStyles.borderTodo, todos[0].id === todo.id ? localStyles.borderTodoTopFront : localStyles.borderTodoFront]} />
        </Animated.View>
      </BottomSheetView>
    </Pressable>
    {visibleComponents[todo.id] && (
        <BottomSheetView style={localStyles.toggleableComponent}>
          {loadingSubtodos[todo.id] ? (
            <BottomSheetView style={localStyles.loadingContainer}>
              <Image
                source={require('../assets/spinner_transparent.gif')}
                style={localStyles.loadingSpinner}
              />
            </BottomSheetView>
          ) : (
            todo.subtodos.map((subtodo, subtodoIndex) => (
              <BottomSheetView key={subtodoIndex} style={localStyles.subtodoItemContainer}>
              <BottomSheetView style={localStyles.subtodoIndex}>
                <Text style={[localStyles.subtodoIndexText, subtodo.checked ? { color: 'rgba(170, 170, 255, 0.37)' } : {}]}>{subtodoIndex + 1}</Text>
              </BottomSheetView>
              <Pressable
                hitSlop={1}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  const updatedTodos = todos.map((item, idx) => {
                    if (idx === todos.findIndex(t => t.id === todo.id)) {
                      return {
                        ...item,
                        subtodos: item.subtodos.map((sub, subIdx) => {
                          if (subIdx === subtodoIndex) {
                            return { ...sub, checked: !sub.checked };
                          }
                          return sub;
                        })
                      };
                    }
                    return item;
                  });
                  setTodos(updatedTodos);
                }}
                style={localStyles.subtodoItemBar}
              >
                <BottomSheetView style={localStyles.subtodoItem}>
                  <BottomSheetView style={localStyles.subtodoItemContent}>
                    <Checkbox
                      isChecked={subtodo.checked}
                      style={[localStyles.checkboxSubtodo, { backgroundColor: 'transparent' }]}
                      checkedStyle={{borderColor: 'rgba(180, 180, 255, 0.2)'}}
                      checkColor={'rgba(180, 180, 255, 0.2)'}
                    />
                    <BottomSheetTextInput
                      suppressHighlighting={true}
                      value={subtodo.text}
                      onChangeText={(text) => {
                        const updatedTodos = todos.map((item, idx) => {
                          if (idx === todos.findIndex(t => t.id === todo.id)) {
                            return {
                              ...item,
                              subtodos: item.subtodos.map((sub, subIdx) => {
                                if (subIdx === subtodoIndex) {
                                  return { ...sub, text: text };
                                }
                                return sub;
                              })
                            };
                          }
                          return item;
                        });
                        setTodos(updatedTodos);
                      }}
                      style={[localStyles.subtodoText, subtodo.checked ? { color: 'rgba(170, 170, 255, 0.35)' } : {}]}
                    />
                  </BottomSheetView>
                </BottomSheetView>
              </Pressable>
            </BottomSheetView>
          )
        )
        )}
        </BottomSheetView>
    )}
    </BottomSheetView>
  );
};

export default TodoItem;

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
    paddingBottom: 2,
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
    borderColor: 'rgba(100, 120, 200, 0.94)', // Different color to stand out
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
    width: '81%',
    fontWeight: '400',
    maxWidth: '90%',
    zIndex: 20,
  },
  todoTextTop: {
    color: '#14142a',
    fontSize: 16,
    fontWeight: '700',
    width: '81%',
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
    overflow: 'hidden',
    borderRadius: 23,
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
    color: '#14142a',
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
    marginRight: 6.5,
    bottom: 4,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 42,
  },
  subtodoIndexText: {
    color: 'rgba(170, 165, 255, 0.5)',
    fontSize: 17,
    fontWeight: '400',
    fontFamily: 'Rubik_500Medium',
    paddingBottom: 2,
  },
  subtodoItemBar: {
    marginBottom: 10,
    overflow: 'hidden',
    flex: 1,
  },
  subtodoItem: {
    width: "100%",
    zIndex: 2, // Set zIndex to be between the borders
    pointerEvents: 'none',
  },
  subtodoItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtodoText: {
    color: 'rgba(170, 165, 245, 0.6)',
    fontSize: 16,
    fontWeight: '400',
    maxWidth: '80%',
    zIndex: 20,
    paddingLeft: 0.5,
  },
  checkboxSubtodo: {
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 100,
    borderWidth: 1.21,
    width: 23,
    height: 23,
  },
  loadingContainer: {
    marginLeft: 10,
    alignItems: 'left',
  },
  loadingSpinner: {
    width: 18,
    height: 18,
    marginLeft: 73.5,
    marginBottom: 5,
    tintColor: 'rgba(170, 165, 245)',
  },
});



