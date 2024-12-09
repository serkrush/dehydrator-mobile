import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';

export default function DButton({
    text,
    style = {} as StyleProp<ViewStyle>,
    textStyle = {} as StyleProp<TextStyle>,
    onPress = () => {},
    disabled = false,
}) {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[styles.container, style]}
            onPress={onPress}>
            <Text style={[styles.text, textStyle]}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f5f6f2',
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
        color: 'black',
    },
});
