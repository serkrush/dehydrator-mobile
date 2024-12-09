import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    StyleProp,
    ViewStyle,
    TextStyle,
    Image,
    ImageSourcePropType,
    ImageStyle,
    ColorValue,
    View,
} from 'react-native';
import {colors, fonts} from 'src/theme';

export enum ButtonStyle {
    Primary = 'primary',
    Alternative = 'alternative',
    Outlined = 'outlined',
    Destructive = 'destructive',
}

export interface ButtonProps {
    onPress?: () => void;
    containerStyle?: StyleProp<ViewStyle>;

    source: ImageSourcePropType;
    imageStyle?: StyleProp<ImageStyle>;
    tintColor?: ColorValue;
    imageHeight?: number;
    imageWidth?: number;

    disabled?: boolean;
    changeDisabledOpacity?: boolean;

    baseStyle?: ButtonStyle;
}

export default function DUpdatedImageButton({
    onPress,
    containerStyle = {},
    source,
    imageStyle = {},
    tintColor,
    imageHeight = 18,
    imageWidth = 18,

    disabled,
    changeDisabledOpacity = true,

    baseStyle,
}: ButtonProps) {
    let buttonColors = undefined as
        | {
              background: ColorValue;
              content: ColorValue;
              shadow: ColorValue;
              border: ColorValue;
          }
        | undefined;
    if (baseStyle) {
        buttonColors = colors.imageButton[baseStyle];
    }

    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                styles.container,
                buttonColors
                    ? {
                          backgroundColor: buttonColors.background,
                          borderColor: buttonColors.border,
                          shadowColor: buttonColors.shadow,
                      }
                    : {},
                {opacity: disabled && changeDisabledOpacity ? 0.5 : 1},
                containerStyle,
            ]}
            onPress={onPress}>
            <Image
                source={source}
                tintColor={
                    tintColor ??
                    (buttonColors ? buttonColors.content : undefined)
                }
                style={[
                    {
                        resizeMode: 'contain',
                        height: imageHeight,
                        width: imageWidth,
                        tintColor:
                            tintColor ??
                            (buttonColors ? buttonColors.content : undefined),
                    },
                    imageStyle,
                ]}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        borderRadius: 8,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,

        shadowOpacity: 1,
        shadowOffset: {width: 0, height: -2},
        elevation: 2,
    },

    text: {
        ...fonts.button,
        alignSelf: 'flex-end',
    },
});
