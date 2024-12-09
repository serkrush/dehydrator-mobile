import React from 'react';
import {
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';

export default function DLabel({
  text,
  style = {} as StyleProp<ViewStyle>,
  textStyle = {} as StyleProp<TextStyle>,
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
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
    justifyContent: 'center',
  },

  text: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: 'black',
  },
});
