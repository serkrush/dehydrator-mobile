import React from 'react';
import {ColorValue, Image, View} from 'react-native';
import {colors} from 'src/theme';
import {images} from 'src/theme/images';

export default function AlertView({
    size = 48,
    exclamationMarkSize = 20,
    borderWidth = 8,
    exclamationMarkColor = colors.aletView.content,
    backgroundColor = colors.aletView.background,
    borderColor = colors.aletView.border,
}: {
    size?: number;
    exclamationMarkSize?: number;
    borderWidth?: number;
    exclamationMarkColor?: ColorValue;
    backgroundColor?: ColorValue;
    borderColor?: ColorValue;
}) {
    return (
        <View
            style={{
                height: size,
                width: size,
                borderRadius: size / 2,
                backgroundColor,
                borderWidth,
                borderColor,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Image
                style={{
                    height: exclamationMarkSize,
                    width: exclamationMarkSize,
                    tintColor: exclamationMarkColor,
                    resizeMode: 'contain',
                }}
                source={images.exclamationMark}
                tintColor={exclamationMarkColor}
            />
        </View>
    );
}
