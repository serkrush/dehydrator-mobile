import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {IStageEntity} from 'src/entities/EntityTypes';
import StageItem from './StageItem';
import {images} from 'src/theme/images';
import {convertToHoursMinutes} from 'src/utils/helper';
import palette from 'src/theme/colors/palette';
import {Scale, scaledValueMap} from 'src/constants';
import {temperatureConvert} from 'src/utils/scaleConvert';
import {useIdentity} from 'src/hooks/useIdentity';

interface StagesProps {
    stages: IStageEntity[];
}

export default function Stages({stages}: StagesProps) {
    const [isWeightLoss, setIsWeightLoss] = useState(false);
    const {t} = useTranslation();

    const identity = useIdentity();

    const totalTime = useMemo(() => {
        let total = 0;
        stages?.forEach(stage => {
            if (stage.weight && stage.weight > 0) setIsWeightLoss(true);
            total += stage.duration ?? 0;
        });
        return total;
    }, [stages]);

    const renderStageItem = (
        title: string,
        value: string | number,
        iconSource: any,
        style?: any,
    ) => (
        <StageItem
            title={title}
            value={value}
            icon={
                <Image
                    source={iconSource}
                    tintColor={palette.blueDark}
                    style={styles.icon}
                />
            }
            style={style}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('total-time')}</Text>
                <Text style={styles.value}>
                    {`${isWeightLoss ? '>' : ''}${convertToHoursMinutes(
                        totalTime,
                        true,
                    )}`}
                </Text>
            </View>
            <View style={styles.divider} />
            <View>
                {stages?.map((stage, index) => {
                    const viewInitTemperature = Math.floor(
                        identity.scale == Scale.Imperial
                            ? temperatureConvert(stage.initTemperature)
                            : stage.initTemperature,
                    );
                    let degreeString = '';
                    let scale = identity?.scale;
                    let degreeStringValue =
                        scale! + undefined
                            ? scaledValueMap.temperature[scale]
                            : undefined;
                    if (degreeStringValue) {
                        degreeString = `°${degreeStringValue}`;
                    }
                    return (
                        <View key={`stage-${index}`}>
                            <View style={styles.sessionHeader}>
                                <Text style={styles.title}>
                                    {t('time-remaining')}
                                </Text>
                                <Text style={styles.value}>
                                    {stage.weight ? 'Weight Loss' : 'Time'}
                                </Text>
                            </View>

                            <View style={styles.stageContainer}>
                                <View style={styles.stageIndicatorContainer}>
                                    <Text style={styles.stageLabel}>
                                        {t('stages')}
                                    </Text>
                                    <View style={styles.stepsContainer}>
                                        {stages.map((_, i) => (
                                            <View
                                                key={`step-${i}`}
                                                style={[
                                                    styles.step,
                                                    i === index
                                                        ? styles.activeStep
                                                        : styles.inactiveStep,
                                                ]}>
                                                <Text
                                                    style={[
                                                        styles.stepText,
                                                        i === index
                                                            ? styles.activeStepText
                                                            : styles.inactiveStepText,
                                                    ]}>
                                                    {i + 1}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                <View>
                                    {renderStageItem(
                                        t('temperature'),
                                        viewInitTemperature +
                                            ' ' +
                                            degreeString,
                                        images.state.temperature,
                                    )}
                                    {stage.weight
                                        ? renderStageItem(
                                              t('weight'),
                                              `${stage.weight}%`,
                                              images.state.weight,
                                              {marginTop: 20},
                                          )
                                        : renderStageItem(
                                              t('stage-time'),
                                              convertToHoursMinutes(
                                                  stage.duration
                                                      ? stage.duration
                                                      : 0,
                                                  true,
                                              ),
                                              images.state.time,
                                              {marginTop: 20},
                                          )}
                                </View>
                                <View>
                                    {renderStageItem(
                                        t('fan-speed'),
                                        stage.fanPerformance1
                                            ? `${stage.fanPerformance1}%`
                                            : t(stage.fanPerformance1Label),
                                        images.state.fan,
                                    )}
                                    {stage.heatingIntensity &&
                                        renderStageItem(
                                            t('heating-intensity'),
                                            `${stage.heatingIntensity ?? 0}%`,
                                            images.state.heating,
                                            {marginTop: 20},
                                        )}
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    title: {
        color: palette.midGray,
        fontSize: 12,
        fontWeight: '500',
    },
    value: {
        color: palette.blueDark,
        fontSize: 16,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: palette.blueLight,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    stageContainer: {
        backgroundColor: palette.lightGray,
        borderRadius: 7,
        padding: 15,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stageIndicatorContainer: {
        marginBottom: 10,
    },
    stageLabel: {
        color: palette.blueDark,
        fontSize: 12,
        fontWeight: '500',
    },
    stepsContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    step: {
        width: 20,
        height: 20,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
    activeStep: {
        backgroundColor: palette.orange,
        borderColor: palette.orange,
    },
    inactiveStep: {
        backgroundColor: 'transparent',
        borderColor: palette.blueDark,
        borderWidth: 1,
    },
    stepText: {
        color: palette.white,
        fontSize: 15,
    },
    activeStepText: {
        color: palette.white,
    },
    inactiveStepText: {
        color: palette.blueDark,
    },
    icon: {
        width: 17,
        height: 17,
        resizeMode: 'contain',
    },
});
