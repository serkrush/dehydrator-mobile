import React from 'react';
import {View, StyleSheet} from 'react-native';
import container from 'src/container';
import DImageButton from '../buttons/DImageButton';
import {images} from 'src/theme/images';

export default function BackArrowHeader({
  onPress = () => {
    container.resolve('navigator').pop();
  },
}) {
  return (
    <View style={[styles.header]}>
      <DImageButton
        tintColor={'white'}
        onPress={onPress}
        source={images.arrows.back}
        width={20}
        height={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
});
