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

export default function FieldWithButton({
  text,
  style = {} as StyleProp<ViewStyle>,
  textStyle = {} as StyleProp<TextStyle>,
  onPress = () => {},
  tintColor = 'white' as ColorValue,
  additionalActionIcon = undefined as undefined | ImageSourcePropType,
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
      {additionalActionIcon != undefined && (
        <DImageButton
          tintColor={tintColor}
          source={additionalActionIcon}
          height={32}
          width={32}
          onPress={onPress}
        />
      )}
    </View>
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
    gap: 12,
  },

  text: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: 'black',
    flex: 1,
    flexWrap: 'wrap',
  },
});
