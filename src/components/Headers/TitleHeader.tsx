import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {colors} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {fonts} from 'src/theme/fonts';

export default function TitleHeader(title) {
    return (
        <View style={[styles.header]}>
            <Text style={[styles.title]}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        // alignContent: 'center',
        // alignItems: 'center',
        // paddingVertical: 4,
        // backgroundColor: '#f5f6f240',
        // borderRadius: 100,
    },

    title: {
        // textAlign: 'center',
        // fontFamily: families.oswald,
        // fontSize: 30,
        // fontWeight: '500',
        // color: colors.text,
        ...fonts.h1,
        color: palette.blueBlack,
    },
});
