import React from 'react';
import {View, StyleSheet} from 'react-native';

export default function LayerView({color, opacity = 1.0}) {
  return (
    <View
      style={{
        width: '100%',
        height: '200%',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: color,
        opacity: opacity,
      }}
    />
  );
}

const styles = StyleSheet.create({});
