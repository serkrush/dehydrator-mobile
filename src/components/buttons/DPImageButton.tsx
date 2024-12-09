import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {IconButton} from 'react-native-paper';
import {colors} from 'src/theme';

export default function DPImageButton({
    icon,
    style = {} as StyleProp<ViewStyle>,
    onPress = () => {},
    disabled = false,
    alternative = false,
}) {
    const buttonColors = alternative
        ? colors.button['outlined']
        : colors.button['primary'];

    return (
        <IconButton
            icon={icon}
            disabled={disabled}
            style={[
                {
                    height: 48,
                    borderRadius: 12,
                    justifyContent: 'center',
                    shadowColor: buttonColors.shadow,
                    shadowOpacity: 1,
                    shadowOffset: {width: 0, height: -2},
                },
                style,
            ]}
            onPress={onPress}></IconButton>
    );
}
