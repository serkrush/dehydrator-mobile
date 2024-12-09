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
    ActivityIndicator,
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

    text?: string;
    textStyle?: StyleProp<TextStyle>;

    source?: ImageSourcePropType;
    imageStyle?: StyleProp<ImageStyle>;
    tintColor?: ColorValue;
    useTintColor?: boolean;
    imageHeight?: number;
    imageWidth?: number;

    disabled?: boolean;
    changeDisabledOpacity?: boolean;
    reverse?: boolean;

    baseStyle?: ButtonStyle;
    showActivity?: boolean;
}

export default function DUpdatedButton({
    onPress,
    containerStyle = {},

    text,
    textStyle = {},

    source,
    imageStyle = {},
    tintColor,
    useTintColor = true,
    imageHeight = 18,
    imageWidth = 18,

    disabled,
    changeDisabledOpacity = true,
    reverse,

    baseStyle,
    showActivity = false,
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
        buttonColors = colors.button[baseStyle];
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
            <View
                style={{
                    flexDirection: reverse ? 'row-reverse' : 'row',
                    gap: 4,
                }}>
                {showActivity && <ActivityIndicator />}
                {text != undefined && (
                    <Text
                        style={[
                            styles.text,
                            buttonColors
                                ? {
                                      color: buttonColors.content,
                                  }
                                : {},
                            textStyle,
                        ]}>
                        {text}
                    </Text>
                )}
                {source != undefined && (
                    <Image
                        source={source}
                        tintColor={
                            useTintColor
                                ? tintColor ??
                                  (buttonColors
                                      ? buttonColors.content
                                      : undefined)
                                : undefined
                        }
                        style={[
                            {
                                resizeMode: 'contain',
                                height: imageHeight,
                                width: imageWidth,
                                tintColor: useTintColor
                                    ? tintColor ??
                                      (buttonColors
                                          ? buttonColors.content
                                          : undefined)
                                    : undefined,
                            },
                            imageStyle,
                        ]}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        borderRadius: 12,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',

        shadowOpacity: 1,
        shadowOffset: {width: 0, height: -2},
        elevation: 2,
        borderWidth: 1,
    },

    text: {
        ...fonts.button,
        alignSelf: 'flex-end',
    },
});
