import React from 'react';
import {
    ColorValue,
    Image,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import {colors} from 'src/theme';
import {images} from 'src/theme/images';

export default function Card({
    children,
    style = {},
    selected,
}: {
    children: any;
    style?: StyleProp<ViewStyle>;
    selected?: boolean;
}) {
    return (
        <View
            style={[
                styles.containerBase,
                selected ? styles.selectedContainer : styles.baseContainer,
                style,
            ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    containerBase: {
        paddingHorizontal: 16,
        paddingVertical: 20,

        borderWidth: 1,

        shadowOpacity: 1,
        shadowOffset: {width: 0, height: -2},
        elevation: 2,

        borderRadius: 12,
    },

    baseContainer: {
        backgroundColor: colors.card.base.background,
        borderColor: colors.card.base.border,

        shadowColor: colors.card.base.shadow,
    },

    selectedContainer: {
        backgroundColor: colors.card.selected.background,
        borderColor: colors.card.selected.border,

        shadowColor: colors.card.selected.shadow,
    },
});
