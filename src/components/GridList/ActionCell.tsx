import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {colors, families } from 'src/theme';

export default function Cell(
    title: string,
    action: () => void,
    height: number = 40,
) {
    return (
        <TouchableOpacity onPress={action} style={[styles.container]}>
            <View style={[styles.card, {height}]}></View>
            <Text style={[styles.title]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },

    card: {
        backgroundColor: '#c2c2c2',
        width: '100%',
        borderRadius: 26,
    },

    title: {
        color: colors.text,
        fontSize: 20,
        fontFamily: families.oswald,
        textAlign: 'center',
    },
});
