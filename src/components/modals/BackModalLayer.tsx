import React from 'react';
import {View, StyleSheet, ColorValue} from 'react-native';

export default function BackModalLayer({
    children,
    backgroundColor = '#303030d0' as ColorValue,
}) {
    return (
        <View style={[styles.container, {backgroundColor}]}>{children}</View>
    );
}

const styles = StyleSheet.create({
    container: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#303030d0',
        position: 'absolute',
        zIndex: 100,
    },
});
