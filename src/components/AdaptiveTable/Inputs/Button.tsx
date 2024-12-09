import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import palette from 'src/theme/colors/palette';

interface ButtonProps {
    icon?: ReactNode;
    text?: string | null;
    style?: ViewStyle;
    textStyle?: TextStyle;
    actionButton?: () => void;
    disabled?: boolean;
}

function Button({
    text = null,
    icon = null,
    style = {},
    textStyle = {},
    actionButton = undefined,
    disabled = false,
}: ButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                style,
                disabled && styles.disabledButton,
            ]}
            onPress={actionButton}
            disabled={disabled}
            activeOpacity={0.7}
        >
            {icon}
            {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor:palette.white,
        width: 44,
        height: 44,
        borderRadius: 8,
        borderColor: palette.blueLight,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabledButton: {
        backgroundColor: '#a3a3a3', // Gray color for disabled state
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
});

export default Button;
