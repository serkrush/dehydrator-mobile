import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {Button, Text} from 'react-native-paper';
import palette from 'src/theme/colors/palette';
import {families} from 'src/theme/fonts/families';
import {colors} from 'src/theme';

export default function DPButton({
    text,
    icon,
    style = {} as StyleProp<ViewStyle>,
    textStyle = {} as StyleProp<TextStyle>,
    onPress = () => {},
    disabled = false,
    alternative = false,
}) {
    const buttonColors = alternative
        ? colors.button['outlined']
        : colors.button['primary'];

    return (
        <Button
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
            buttonColor={buttonColors.background}
            mode="elevated"
            onPress={onPress}>
            {text != undefined && text != '' && (
                <Text
                    style={[
                        {
                            color: buttonColors.textColor,
                            fontFamily: families.inter,
                            fontSize: 17,
                            fontWeight: '700',
                        },
                        textStyle,
                    ]}>
                    {text}
                </Text>
            )}
        </Button>
    );
}
