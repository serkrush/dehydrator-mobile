import React from 'react';
import {View} from 'react-native';
import baseStyles from 'src/styles';
import BackgroundView from 'src/components/BackgroundView';
import {SafeAreaView} from 'react-native-safe-area-context';
import {images} from 'src/theme/images';
import LayerView from '../LayerView';

export default class BaseLoginScreenLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={[baseStyles.safeArea]}>
        <BackgroundView source={images.loginBackground} />
        <LayerView color={'black'} opacity={0.7} />
        <View style={baseStyles.baseLoginContainer}>
          {(this.props as any).children}
        </View>
      </SafeAreaView>
    );
  }
}
