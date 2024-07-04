import { useActionSheet } from '@expo/react-native-action-sheet';

const TodoActionSheet = (onActionSelected) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const showActionSheet = (item) => { 
    const options = ['Delete', 'Rethink subtasks', 'Lift subtasks', 'Cancel'];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        tintColor: '#111', // Text color
      },
      buttonIndex => {
        if (buttonIndex !== cancelButtonIndex) {
          onActionSelected(options[buttonIndex], item);  // Pass 'item' to the callback
        }
      }
    );
  };

  return { showActionSheet };
};

export default TodoActionSheet;
