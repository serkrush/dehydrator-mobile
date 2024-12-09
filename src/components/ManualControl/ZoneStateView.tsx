import React from 'react';
import {PixelRatio, StyleSheet, Text, View} from 'react-native';
import {
    ZoneAdditionalStatus,
    ZoneAvailableState,
} from 'src/entities/models/Machine';
import Circle from '../views/Circle';
import {
    backgroundColorForState,
    colorForState,
    textForState,
} from 'src/utils/colorForState';
import {useTranslation} from 'react-i18next';
import {families, fonts} from 'src/theme';
import {normalize} from 'src/theme/fonts';
import {capitalize} from 'src/utils/capitalize';
import {capitalizeEachWord} from 'src/utils/capitalizeEachWord';
import {
    CardColors,
    colorsForAdditionalStatus,
    colorsForState,
} from 'src/utils/colorForZoneState';
import {statusNumberToStatus} from 'src/utils/statusNumberToStatus';

export default function ZoneStateView({
    state,
    showText = true,
    showCircle = true,
    circleDiameter = 8,
    alternative = false,
    itemMode,
}: {
    state?: ZoneAvailableState;
    showText?: boolean;
    showCircle?: boolean;
    circleDiameter?: number;
    alternative?: boolean;
    itemMode?: number;
}) {
    const {t} = useTranslation();
    let colors: CardColors = {
        content: 'black',
        border: 'black',
        background: 'white',
    };
    let text = '';
    if (state != undefined) {
        colors = colorsForState(state);
        text = capitalizeEachWord(t(state));
    } else if (itemMode != undefined) {
        const status = statusNumberToStatus(itemMode);
        if (status == ZoneAdditionalStatus.None) {
            return <View />;
        }
        colors = colorsForAdditionalStatus(status);
        text = capitalizeEachWord(t(status));
    } else {
        return <View />;
    }

    return (
        <>
            {!alternative && (
                <View
                    style={[
                        styles.container,
                        {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                        },
                    ]}>
                    {showText && (
                        <Text style={[styles.text, {color: colors.content}]}>
                            {text}
                        </Text>
                    )}

                    {showCircle && (
                        <Circle
                            diameter={circleDiameter}
                            color={colors.content}
                        />
                    )}
                </View>
            )}
            {alternative && (
                <View
                    style={[
                        styles.container,
                        {
                            backgroundColor: colors.content,
                            borderColor: colors.background,
                        },
                    ]}>
                    {showCircle && (
                        <Circle diameter={circleDiameter} color={'white'} />
                    )}
                    {showText && (
                        <Text style={[styles.text, {color: 'white'}]}>
                            {text}
                        </Text>
                    )}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 100,
        gap: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 4,
        borderWidth: 1,
    },

    text: {
        ...fonts.textSizeXS,
        textAlign: 'center',
    },
});
