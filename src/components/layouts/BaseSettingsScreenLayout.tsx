import React from 'react';
import {ColorValue, StyleProp, View, ViewStyle} from 'react-native';
import baseStyles from 'src/styles';
import BackgroundView from 'src/components/BackgroundView';
import {SafeAreaView} from 'react-native-safe-area-context';
import {images} from 'src/theme/images';
import LayerView from '../LayerView';

export default function BaseSettingsScreenLayout({
    children,
    containerStyle = {} as StyleProp<ViewStyle>,
    color = 'black' as ColorValue,
}) {
    return (
        <SafeAreaView style={[baseStyles.safeArea, {backgroundColor: color}]}>
            <LayerView color={color} />
            <View style={[baseStyles.baseContainer, containerStyle ?? {}]}>
                {children}
            </View>
        </SafeAreaView>
    );
}
