import React, {useState} from 'react';
import {StyleSheet, StyleProp, ViewStyle, TextStyle, View} from 'react-native';
import BackModalLayer from './BackModalLayer';
import DDatePicker from '../DDatePicker';
import {Button, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {colors, fonts} from 'src/theme';
import DPButton from '../buttons/DPButton';
import DUpdatedButton, {ButtonStyle} from '../buttons/DUpdatedButton';

export default function ScheduleDatePickerModal({
    visible,
    setVisible,
    onSchedulePress,
    startDate = new Date(),
}) {
    const {t} = useTranslation();

    const [date, setDate] = useState(startDate);

    return (
        <>
            {visible && (
                <BackModalLayer>
                    <View
                        style={{
                            width: '100%',
                            padding: 20,
                        }}>
                        <View
                            style={{
                                width: '100%',
                                backgroundColor: colors.card.base.background,
                                alignItems: 'center',
                                padding: 20,
                                borderRadius: 24,
                                gap: 40,
                            }}>
                            <DDatePicker
                                startDate={startDate}
                                onChange={value => {
                                    setDate(value);
                                }}
                            />
                            <View style={{flexDirection: 'row', gap: 20}}>
                                <DUpdatedButton
                                    baseStyle={ButtonStyle.Outlined}
                                    containerStyle={{flex: 1}}
                                    text={t('cancel')}
                                    onPress={() => {
                                        setVisible(false);
                                    }}
                                />
                                <DUpdatedButton
                                    baseStyle={ButtonStyle.Primary}
                                    containerStyle={{flex: 2}}
                                    text={t('schedule')}
                                    onPress={() => onSchedulePress(date)}
                                />
                            </View>
                        </View>
                    </View>
                </BackModalLayer>
            )}
        </>
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
