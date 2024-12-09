import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  View,
  ColorValue,
} from 'react-native';
import DImageButton from './DImageButton';

export default function GroupButton({
  text,
  style = {} as StyleProp<ViewStyle>,
  textStyle = {} as StyleProp<TextStyle>,
  onPress = () => {},
  tintColor = 'white' as ColorValue,
  additionalActionIcon = undefined as undefined | ImageSourcePropType,
  onAdditionalPress = () => {},
}) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
      {additionalActionIcon != undefined && (
        <DImageButton
          tintColor={tintColor}
          source={additionalActionIcon}
          height={32}
          width={32}
          onPress={onAdditionalPress}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f6f2',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    flexDirection: 'row',
  },

  text: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: 'black',
    flexWrap: 'wrap',
  },
});
