import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTodos = async (todos) => {
    try {
    await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
    console.error('Failed to save todos:', error);
    }
};