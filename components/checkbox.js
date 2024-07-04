import React from 'react';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Checkbox = ({ isChecked, onToggle, style, checkedStyle, checkColor }) => (
  <Pressable
    onPress={onToggle}
    hitSlop={12}
    style={[{
      width: 21,
      height: 21,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      borderWidth: 1,
      borderColor: 'rgba(180, 180, 255, 0.2)',
      backgroundColor: isChecked ? 'rgba(110, 115, 190, 0.7)' : 'transparent',
    }, style, isChecked ? checkedStyle : {}]}
    // End of  Selection
  >
    {isChecked && <MaterialCommunityIcons name="check" size={18} color={checkColor} />}
  </Pressable>
);

export default Checkbox;
