import React from 'react';
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {families, fonts} from 'src/theme';

export default function DDropdown({
  data,
  placeholder,
  value,
  setValue,
  containerStyle = {} as StyleProp<ViewStyle>,
  textStyle = {} as StyleProp<TextStyle>,
  placeholderTextStyle = undefined as StyleProp<TextStyle>,
}) {
  return (
    <Dropdown
      data={data}
      style={[styles.dropdownContainer, containerStyle]}
      placeholderStyle={[
        styles.dropdownText,
        placeholderTextStyle ?? textStyle,
      ]}
      selectedTextStyle={[styles.dropdownText, textStyle]}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={item => {
        setValue(item.value);
      }}
    />
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f6f2',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropdownText: {
    fontSize: 30,
    fontFamily: families.oswald,
    textAlign: 'center',
  },
});
