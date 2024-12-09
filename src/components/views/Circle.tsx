import React from 'react';
import {ColorValue, View} from 'react-native';

export default function Circle({
  diameter,
  color,
}: {
  diameter: number;
  color: ColorValue;
}) {
  return (
    <View
      style={{
        height: diameter,
        width: diameter,
        borderRadius: diameter / 2,
        backgroundColor: color,
      }}
    />
  );
}
