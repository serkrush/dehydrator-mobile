import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {windowHeight} from 'src/utils/size';

export default function BackgroundView({source}) {
  return (
    <Image
      style={{
        width: '100%',
        height: windowHeight,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        resizeMode: 'cover',
      }}
      source={source}
    />
  );
}

const styles = StyleSheet.create({});
