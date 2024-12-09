import React, {useContext} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from 'src/theme';
import palette from 'src/theme/colors/palette';
import ContainerContext from 'src/ContainerContext';

export default function OwnerEditDehydratorModal({
    setVisible,
    resetToFactory,
    changeOwner,
}) {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);

    const resetToFactoryPress = () => {
        setVisible(false);
        resetToFactory();
    };

    const changeOwnerPress = () => {
        setVisible(false);
        changeOwner();
    };

    return (
        <>
            <View style={styles.container}>
                <Pressable
                    style={styles.widthFull}
                    onPress={resetToFactoryPress}>
                    <Text style={styles.textLine}>{t('reset-to-factory')}</Text>
                </Pressable>
                <View style={styles.line} />
                <Pressable style={styles.widthFull} onPress={changeOwnerPress}>
                    <Text style={styles.textLine}>{t('change-owner')}</Text>
                </Pressable>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.card.base.background,
        alignItems: 'center',
    },
    line: {
        backgroundColor: palette.blueLight,
        width: '100%',
        height: 1,
        marginVertical: 10,
    },
    widthFull: {
        width: '100%',
    },
    textLine: {
        fontSize: 16,
        color: palette.blueBlack,
        fontWeight: '500',
    },
});
