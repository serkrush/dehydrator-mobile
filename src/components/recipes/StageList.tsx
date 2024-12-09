import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    IFormStageEntity,
    IStageEntity,
    RecipeStageType,
} from 'src/entities/EntityTypes';
import Input from 'src/Form/Input';
import palette from 'src/theme/colors/palette';
import BaseTitleDropdown from '../BaseTitleDropdown';
import {useIdentity} from 'src/hooks/useIdentity';
import {
    AppState,
    DEFAULT_FAN_OPTIONS,
    MAX_STAGES_COUNT,
    Scale,
    scaledValueMap,
} from 'src/constants';
import {temperatureConvert} from 'src/utils/scaleConvert';
import dataFunc from 'src/utils/dropdownDataFunc';
import {useDispatch, useSelector} from 'react-redux';
import {setBox} from 'src/store/actions';
import {LAST_STAGE_PARAMS_FLAG} from 'src/screens/tabs/ManualControl/UpdatedManualControl';

interface StageListProps {
    data: IFormStageEntity[];
    stageActive: any;
    setStageActive: any;
    handleRemove: (index: number, inputName: string) => void;
    handleAdd: () => void;
    setFieldValue: (field: string, value: any) => void;
    typeSession: RecipeStageType;
    errors?: any;

    fanOptions?: {id: string; value: string}[];
    readOnly?: boolean;
    activeStageIndex?: number;
    setupedParamsLength?: number;
}

export default function StageList({
    data,
    stageActive,
    setStageActive,
    handleRemove,
    handleAdd,
    setFieldValue,
    typeSession,
    errors,
    fanOptions = DEFAULT_FAN_OPTIONS,
    readOnly = false,
    activeStageIndex,
    setupedParamsLength,
}: StageListProps) {
    const dispatch = useDispatch();
    const fanData = dataFunc(
        fanOptions.map(value => value.id),
        undefined,
    );
    const box = useSelector((state: AppState) => state?.box ?? {});
    const lastStageParams = useMemo(() => {
        return box[LAST_STAGE_PARAMS_FLAG] ?? {};
    }, [box]);
    const stageReadOnly = activeStageIndex
        ? readOnly || stageActive < activeStageIndex
        : readOnly;
    const removeDisabled =
        data.length <= 1 ||
        stageReadOnly ||
        (setupedParamsLength != undefined &&
            stageActive <= setupedParamsLength - 1);
    const {t} = useTranslation();

    const identity = useIdentity();

    let degreeString = '';
    let scale = identity?.scale;
    let degreeStringValue =
        scale! + undefined ? scaledValueMap.temperature[scale] : undefined;
    if (degreeStringValue) {
        degreeString = `°${degreeStringValue}`;
    }

    const onDurationUpdate = (hours, minutes) => {
        let updatingData: any = {};
        const duration =
            (hours ?? data[stageActive].hours ?? 0) * 60 +
            (minutes ?? data[stageActive].minutes ?? 0);
        if (hours != undefined) {
            setFieldValue(`stages[${stageActive}].hours`, hours);
            updatingData.hours = hours;
        }
        if (minutes != undefined) {
            setFieldValue(`stages[${stageActive}].minutes`, minutes);
            updatingData.minutes = minutes;
        }
        setFieldValue(`stages[${stageActive}].duration`, duration);
        updatingData.duration = duration;
        dispatch(
            setBox(LAST_STAGE_PARAMS_FLAG, {
                ...lastStageParams,
                ...updatingData,
            }),
        );
    };

    const onFanPerformanceLabelChange = value => {
        const updatingData: any = {};
        const index = fanOptions
            ? fanOptions.findIndex(option => {
                  return option.id == value;
              })
            : -1;
        if (index != -1) {
            setFieldValue(
                `stages[${stageActive}].fanPerformance1`,
                fanOptions[index].value,
            );
            updatingData.fanPerformance1 = fanOptions[index].value;
        }
        setFieldValue(`stages[${stageActive}].fanPerformance1Label`, value);
        updatingData.fanPerformance1Label = value;
        dispatch(
            setBox(LAST_STAGE_PARAMS_FLAG, {
                ...lastStageParams,
                ...updatingData,
            }),
        );
    };

    const onTemperatureChange = value => {
        const scale = identity?.scale;
        const temperature = +(
            scale === Scale.Imperial ? temperatureConvert(value, false) : value
        ).toFixed(4);
        dispatch(
            setBox(LAST_STAGE_PARAMS_FLAG, {
                ...lastStageParams,
                initTemperature: temperature,
                viewInitTemperature: value,
            }),
        );
        setFieldValue(`stages[${stageActive}].initTemperature`, temperature);
        setFieldValue(`stages[${stageActive}].viewInitTemperature`, value);
    };

    return (
        <View>
            <Text
                style={{
                    color: palette.blueDark,
                    fontSize: 18,
                    fontWeight: '600',
                    marginTop: 32,
                }}>
                {t('set-parameters')}
            </Text>

            <View
                style={{
                    backgroundColor: palette.white,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: palette.blueLight,
                    paddingHorizontal: 16,
                    paddingVertical: 20,
                    marginTop: 16,
                }}>
                <View style={styles.containerStage}>
                    <Text style={styles.title}>{t('stages')}</Text>
                    <View style={styles.stageControls}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            {data?.length > 0 &&
                                data.map((stage, index) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.stageButton,
                                            index === stageActive &&
                                                styles.activeStageButton,
                                        ]}
                                        onPress={() => setStageActive(index)}
                                        key={`stage-${index}`}>
                                        <Text
                                            style={[
                                                styles.stageButtonText,
                                                index === stageActive &&
                                                    styles.activeStageButtonText,
                                            ]}>
                                            {index + 1}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                        {!readOnly && (
                            <View style={styles.addRemoveButtons}>
                                <TouchableOpacity
                                    disabled={removeDisabled}
                                    onPress={() =>
                                        handleRemove(stageActive, 'stages')
                                    }
                                    style={[
                                        styles.circleButton,
                                        {opacity: removeDisabled ? 0.5 : 1},
                                    ]}>
                                    <Text style={styles.circleButtonText}>
                                        -
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={data.length >= MAX_STAGES_COUNT}
                                    onPress={handleAdd}
                                    style={[
                                        styles.circleButton,
                                        {marginLeft: 10},
                                        {
                                            opacity:
                                                data.length >= MAX_STAGES_COUNT
                                                    ? 0.5
                                                    : 1,
                                        },
                                    ]}>
                                    <Text style={styles.circleButtonText}>
                                        +
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.formContainer}>
                    {data?.length > 0 &&
                        data.map((stage, index) => {
                            if (stageActive !== index) {
                                return null;
                            }
                            return (
                                <View key={`${index}`}>
                                    <Input
                                        name={`stages[${index}].viewInitTemperature`}
                                        type="number"
                                        value={data[index].viewInitTemperature}
                                        onChange={value => {
                                            const parsedValue =
                                                parseFloat(value);
                                            const actualValue = !isNaN(
                                                parsedValue,
                                            )
                                                ? parsedValue
                                                : 0;
                                            onTemperatureChange(actualValue);
                                        }}
                                        required={true}
                                        error={
                                            errors &&
                                            errors.length > 0 &&
                                            errors[index]?.initTemperature
                                        }
                                        label={t('stage_set_initTemperature')}
                                        valueUnit={degreeString}
                                        readOnly={stageReadOnly}
                                    />
                                    <View style={{marginTop: 24}}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                gap: 8,
                                                width: '100%',
                                                alignItems: 'flex-end',
                                            }}>
                                            <Input
                                                styleContainer={{
                                                    width: 'auto',
                                                    flex: 1,
                                                }}
                                                name={`stages[${index}].hours`}
                                                type="number"
                                                value={data[index].hours}
                                                onChange={value => {
                                                    const parsedValue =
                                                        parseFloat(value);
                                                    const actualValue = !isNaN(
                                                        parsedValue,
                                                    )
                                                        ? parsedValue
                                                        : 0;
                                                    onDurationUpdate(
                                                        actualValue,
                                                        undefined,
                                                    );
                                                }}
                                                required={true}
                                                error={
                                                    errors &&
                                                    errors.length > 0 &&
                                                    errors[index]?.duration
                                                }
                                                label={t('stage_set_duration')}
                                                hidden={
                                                    typeSession ===
                                                        RecipeStageType.Weight &&
                                                    data.length === index + 1
                                                }
                                                valueUnit={t('time-h')}
                                                readOnly={stageReadOnly}
                                                min={0}
                                            />
                                            <Input
                                                styleContainer={{
                                                    width: 'auto',
                                                    flex: 1,
                                                }}
                                                name={`stages[${index}].minutes`}
                                                type="number"
                                                value={data[index].minutes}
                                                onChange={value => {
                                                    const parsedValue =
                                                        parseFloat(value);
                                                    const actualValue = !isNaN(
                                                        parsedValue,
                                                    )
                                                        ? parsedValue
                                                        : 0;
                                                    onDurationUpdate(
                                                        undefined,
                                                        actualValue,
                                                    );
                                                }}
                                                required={true}
                                                error={
                                                    errors &&
                                                    errors.length > 0 &&
                                                    errors[index]?.duration
                                                }
                                                hidden={
                                                    typeSession ===
                                                        RecipeStageType.Weight &&
                                                    data.length === index + 1
                                                }
                                                valueUnit={t('time-m')}
                                                readOnly={stageReadOnly}
                                                max={59}
                                                min={0}
                                            />
                                        </View>
                                        <Input
                                            name={`stages[${index}].weight`}
                                            type="number"
                                            value={data[index].weight}
                                            onChange={value => {
                                                const parsedValue =
                                                    parseFloat(value);

                                                setFieldValue(
                                                    `stages[${index}].weight`,
                                                    !isNaN(parsedValue)
                                                        ? parsedValue
                                                        : 0,
                                                );
                                            }}
                                            required={true}
                                            error={
                                                errors &&
                                                errors.length > 0 &&
                                                errors[index]?.weight
                                            }
                                            label={t('stage_set_weight_loss')}
                                            hidden={
                                                typeSession ===
                                                    RecipeStageType.Time ||
                                                index !== data.length - 1
                                            }
                                            valueUnit="%"
                                            readOnly={stageReadOnly}
                                        />
                                    </View>
                                    <View style={{marginTop: 24}}>
                                        <BaseTitleDropdown
                                            data={fanData}
                                            title={`${t(
                                                'stage_set_fanPerformance',
                                            )}`}
                                            placeholder={t(
                                                'stage_set_fanPerformance',
                                            )}
                                            value={
                                                data[index].fanPerformance1Label
                                            }
                                            setValue={data => {
                                                onFanPerformanceLabelChange(
                                                    data,
                                                );
                                            }}
                                            disable={stageReadOnly}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerStage: {
        backgroundColor: palette.lightGray,
        padding: 10,
        paddingTop: 8,
        borderRadius: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: palette.blueDark,
        marginBottom: 10,
    },
    stageControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stageButton: {
        minWidth: 36,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: palette.blueDark,
        borderRadius: 8,
        marginRight: 5,
    },
    activeStageButton: {
        backgroundColor: palette.blueDark,
    },
    stageButtonText: {
        fontSize: 19,
        fontWeight: '500',
        color: palette.blueDark,
    },
    activeStageButtonText: {
        color: '#f5f0dc',
    },
    addRemoveButtons: {
        flexDirection: 'row',
        paddingLeft: 10,
    },
    circleButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    circleButtonText: {
        fontSize: 24,
        color: '#ff6b35',
    },
    formContainer: {
        marginTop: 10,
    },
});
