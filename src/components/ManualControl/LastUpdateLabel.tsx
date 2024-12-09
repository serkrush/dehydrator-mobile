import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {updateDateString} from 'src/utils/updateDateString';
import {fonts, normalize} from 'src/theme/fonts';

export default function LastUpdateLabel({
    lastUpdateTime,
}: {
    lastUpdateTime: number;
}) {
    const {t} = useTranslation();
    return (
        <Text style={styles.text}>
            {updateDateString(
                Math.max((new Date().getTime() - lastUpdateTime) / 1000, 0),
                t,
            )}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        ...fonts.decorative,
    },
});
