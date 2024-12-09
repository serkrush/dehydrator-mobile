import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from 'react-native';
import {fonts} from 'src/theme';
import baseStyles from 'src/styles';
import DDropdown from '../DDropdown';

export default function DropdownRow({
  title,
  data,
  value,
  setValue,
  placeholder,
  textStyle = {} as StyleProp<TextStyle>,
  dropdownContainerStyle = {} as StyleProp<ViewStyle>,
  dropdownTextStyle = {} as StyleProp<TextStyle>,
  dropdownPlaceholderTextStyle = undefined as StyleProp<TextStyle>,
  dropdownWidth = undefined as DimensionValue | undefined,
}) {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text style={[{maxWidth: '55%'}, baseStyles.baseText, textStyle]}>
        {title}
      </Text>
      <View style={{width: dropdownWidth ? dropdownWidth : '45%'}}>
        <DDropdown
          data={data}
          value={value}
          setValue={setValue}
          placeholder={placeholder}
          containerStyle={dropdownContainerStyle}
          textStyle={dropdownTextStyle}
          placeholderTextStyle={dropdownPlaceholderTextStyle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderRadius: 24,
    backgroundColor: '#303030',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },

  text: {
    fontSize: 14,
    color: 'white',
  },
});
