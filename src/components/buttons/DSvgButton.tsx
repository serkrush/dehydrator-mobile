import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

export default function DSvgButton({
    svg,
    onPress = () => {},
    disabled = false,
    additionalStyle = {},
}) {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                styles.container,
                additionalStyle,
            ]}
            onPress={onPress}>
            {svg}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
