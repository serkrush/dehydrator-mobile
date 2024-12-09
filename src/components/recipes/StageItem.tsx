import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import palette from 'src/theme/colors/palette';

interface StageItemProps {
    title: string;
    value: string;
    icon: any;
    style?: object;
}

function StageItem({title, icon, value, style}: StageItemProps) {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.valueContainer}>
                {icon}
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
}

export default StageItem;

const styles = StyleSheet.create({
    container: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
    title: {
        fontSize: 12,
        fontWeight: '500',
        color: palette.blueDark,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    value: {
        fontSize: 18,
        color: palette.blueDark,
        fontWeight: '400',
        marginLeft: 6,
    },
});
