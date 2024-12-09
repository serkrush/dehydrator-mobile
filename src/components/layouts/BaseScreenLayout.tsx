import React from 'react';
import {View} from 'react-native';
import baseStyles from 'src/styles';
import BackgroundView from 'src/components/BackgroundView';
import {SafeAreaView} from 'react-native-safe-area-context';
import {images} from 'src/theme/images';

export default class BaseScreenLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={baseStyles.safeArea}>
        <BackgroundView source={images.background} />
        <View style={baseStyles.baseContainer}>
          {(this.props as any).children}
        </View>
      </SafeAreaView>
    );
  }
}
