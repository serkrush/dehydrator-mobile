import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  StyleProp,
  TextStyle,
} from 'react-native';
import {families, fonts} from 'src/theme';

export default function DText({
  text,
  textStyle = styles.text as StyleProp<TextStyle>,
}) {
  return <Text style={textStyle}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: families.oswald,
  },
});
