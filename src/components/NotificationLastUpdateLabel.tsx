import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {updateDateString} from 'src/utils/updateDateString';
import {fonts, normalize} from 'src/theme/fonts';
import palette from 'src/theme/colors/palette';
import {format} from 'date-fns';

export default function NotificationLastUpdateLabel({
    lastUpdateTime,
}: {
    lastUpdateTime: number;
}) {
    const {t} = useTranslation();
    const [checkTime, setCheckTime] = useState(Date.now());

    const actualDateString = () => {
        const agoTime = (checkTime - lastUpdateTime) / 1000;
        const showFullDate = agoTime > 86400;
        return showFullDate
            ? format(lastUpdateTime, 'hh:mm a dd.MM.yyyy')
            : updateDateString(Math.max(agoTime, 0), t);
    };


    useEffect(() => {
        const timeout = setInterval(() => {
            setCheckTime(Date.now());
        }, 30000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <View>
            <Text style={styles.text}>{actualDateString()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        ...fonts.textSizeSL,
        color: palette.orange,
    },
});
