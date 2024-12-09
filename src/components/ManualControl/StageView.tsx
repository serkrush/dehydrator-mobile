import React, {useContext, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import InputRow from '../rows/InputRow';
import DText from '../DText';
import DButton from '../buttons/DButton';
import {useTranslation} from 'react-i18next';
import {IZoneParams} from 'src/store/types/MachineTypes';
import {
    AppState,
    DEFAULT_FAN_OPTIONS,
    ENTITY,
    Scale,
    SessionRunnedBy,
    StageStatus,
    scaledValueMap,
} from 'src/constants';
import TitleInputRow from '../rows/TitleInputRow';
import baseStyles from 'src/styles';
import TitleDropdown from '../TitleDropdown';
import {IMachine} from 'src/entities/models/Machine';
import dataFunc from 'src/utils/dropdownDataFunc';
import {useIdentity} from 'src/hooks/useIdentity';
import {useSelector} from 'react-redux';
import {temperatureConvert} from 'src/utils/scaleConvert';
import ContainerContext from 'src/ContainerContext';

export enum StageViewMode {
    EDIT = 'edit',
    VIEW = 'view',
}
export interface StageViewParams {
    machine?: IMachine;
    stagesState?: IZoneParams[];
    stageState?: IZoneParams;
    item: IZoneParams;
    actionActive?: boolean;
    number: number;
    actionText?: string;
    onActionButton?: (number) => void;
    readOnly?: boolean;
    status?: StageStatus;
    runnedBy: SessionRunnedBy;
    isLastStage: boolean;
}

export default function StageView({
    machine,
    stagesState,
    stageState,
    item,
    number,
    actionActive,
    actionText,
    onActionButton,
    readOnly,
    status = StageStatus.Unsetted,
    runnedBy,
    isLastStage,
}: StageViewParams) {
    const {t} = useTranslation();

    const di = useContext(ContainerContext);
    const config = di.resolve('config');

    const identity = useIdentity();

    const models = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE_MODEL];
    });

    const model = useMemo(() => {
        return machine?.modelId ? models[machine.modelId] : undefined;
    }, [models, machine]);

    const checkNumberText = (
        input: string,
        name,
        set,
        limitCheck = false,
        min = undefined as number | undefined,
        max = undefined as number | undefined,
    ) => {
        if (input.trim() == '') {
            set(undefined);
        } else {
            const res = Number(input);
            if (res != undefined && !Number.isNaN(res)) {
                if (limitCheck) {
                    const actualMin = min || 0;
                    const actualMax = max || 100;
                    if (res < actualMin) {
                        set(actualMin);
                    } else if (res > actualMax) {
                        set(actualMax);
                    } else {
                        set(res);
                    }
                } else {
                    set(res);
                }

                if (stagesState && name) {
                    stagesState[number - 1][name] = res;
                }
                if (stageState && name) {
                    stageState[name] = res;
                }
            }
        }
    };
    const getItemViewInitTemperature = () => {
        const scale = identity?.scale;
        return scale == Scale.Imperial
            ? Math.floor(temperatureConvert(item['initTemperature']))
            : item['initTemperature'];
    };
    //console.log('item', item);
    const [initTemperature, setInitTemperature] = useState(
        item['initTemperature'],
    );
    const [viewinitTemperature, setViewInitTemperature] = useState(
        getItemViewInitTemperature(),
    );
    const [weight, setWeight] = useState(item['weight']);
    const [heatingIntensity, setIntensity] = useState(item['heatingIntensity']);
    const [fanPerformance1, setFanPerformance1] = useState(
        item['fanPerformance1'],
    );
    const [fanPerformance2, setFanPerformance2] = useState(
        item['fanPerformance2'],
    );
    const [duration, setDuration] = useState(item['duration']);

    const [durationHours, setDurationHours] = useState(
        Math.floor(item['duration'] / 60),
    );
    const [durationMinutes, setDurationMinutes] = useState(
        item['duration'] - durationHours * 60,
    );
    const actualFanData =
        machine?.fanSpeed ??
        config?.machine?.cycle?.fanSpeed ??
        DEFAULT_FAN_OPTIONS;
    const fanDataIds = actualFanData.map(value => value.id);
    const fanData = dataFunc(fanDataIds, undefined);

    const convertPerfomanceToString = perfomance => {
        //console.log('input performance', perfomance);
        //console.log('actualFanData', actualFanData);
        const fanData = actualFanData.find(value => {
            //console.log('value', value);
            return value.value == perfomance;
        });
        //console.log('fanData', fanData);
        if (!fanData) {
            return actualFanData.length > 0 ? actualFanData[0].id : '';
        }

        return fanData?.id;
    };

    const [fanSpeedValue, setFanSpeedValue] = useState(
        convertPerfomanceToString(fanPerformance1),
    );

    useEffect(() => {
        setViewInitTemperature(getItemViewInitTemperature());
        setIntensity(item['heatingIntensity']);
        setFanPerformance1(item['fanPerformance1']);
        setFanPerformance2(item['fanPerformance2']);
        setWeight(item['weight']);
        setDuration(item['duration']);
    }, [item]);

    useEffect(() => {
        const duration = (durationHours ?? 0) * 60 + (durationMinutes ?? 0);
        setDuration(duration);
        if (stagesState) stagesState[number - 1]['duration'] = duration;
        if (stageState) stageState['duration'] = duration;
    }, [durationHours, durationMinutes]);

    useEffect(() => {
        const speed =
            actualFanData.find(value => value.id == fanSpeedValue)?.value ??
            fanPerformance1;
        setFanPerformance1(speed);
        setFanPerformance2(speed);
        if (stagesState) {
            stagesState[number - 1]['fanPerformance1'] = speed;
            stagesState[number - 1]['fanPerformance2'] = speed;
        }
        if (stageState) {
            stageState['fanPerformance1'] = speed;
            stageState['fanPerformance2'] = speed;
        }
    }, [fanSpeedValue]);

    useEffect(() => {
        const scale = identity?.scale;
        const temperature = Math.floor(
            scale == Scale.Imperial
                ? temperatureConvert(viewinitTemperature, false)
                : viewinitTemperature,
        );
        setInitTemperature(temperature);

        if (stagesState)
            stagesState[number - 1]['initTemperature'] = temperature;
        if (stageState) stageState['initTemperature'] = temperature;
        // console.log(
        //     'useEffect',
        //     viewinitTemperature,
        //     temperature,
        //     stagesState ? stagesState[number - 1]['initTemperature'] : '-',
        //     stageState ? stageState['initTemperature'] : '-',
        // );
    }, [viewinitTemperature]);

    const row = (
        rowValue,
        setRowValue,
        rowFieldTitle,
        addition = undefined as string | undefined,
        limitCheck = false,
        min = undefined as number | undefined,
        max = undefined as number | undefined,
    ) => {
        return (
            <TitleInputRow
                readOnly={readOnly ?? false}
                fieldTitle={t(`stage_set_${rowFieldTitle}`)}
                fieldPlaceholder={'-'}
                placeholderTextColor={'white'}
                value={`${rowValue != undefined ? rowValue : ''}`}
                setValue={value => {
                    checkNumberText(
                        value,
                        rowFieldTitle,
                        setRowValue,
                        limitCheck,
                        min,
                        max,
                    );
                }}
                keyboardType={'number-pad'}
                containerStyle={[
                    {
                        height: 'auto',
                        alignItems: 'flex-start',
                    },
                ]}
                inputContainerStyle={[
                    baseStyles.inputContainer,
                    {
                        width: '100%',
                        borderWidth: 1,
                    },
                ]}
                titleStyle={[
                    baseStyles.inputTitleText,
                    {height: 'auto', flex: 1},
                ]}
                inputTextStyle={[baseStyles.inputValueText]}
                label={addition}
            />
        );
    };

    const fanSpeedRow = () => {
        return (
            <TitleDropdown
                disable={readOnly ?? false}
                data={fanData}
                title={t('stage_set_fanPerformance')}
                placeholder={'-'}
                value={fanSpeedValue}
                setValue={setFanSpeedValue}
                containerStyle={[baseStyles.inputContainer, {padding: 8}]}
                titleTextStyle={baseStyles.inputTitleText}
                valueTextStyle={baseStyles.inputValueText}
            />
        );
    };

    const durationRow = () => {
        // row(duration, setDuration, 'duration', t('time_m'))}
        return (
            <View style={{flexDirection: 'row', gap: 8, width: '100%'}}>
                <TitleInputRow
                    readOnly={readOnly ?? false}
                    fieldTitle={t(`stage_set_duration`)}
                    fieldPlaceholder={'-'}
                    placeholderTextColor={'white'}
                    value={`${durationHours ?? ''}`}
                    setValue={value => {
                        checkNumberText(
                            value,
                            undefined,
                            setDurationHours,
                            true,
                            0,
                            Number.MAX_SAFE_INTEGER,
                        );
                    }}
                    keyboardType={'number-pad'}
                    containerStyle={[
                        {
                            height: 'auto',
                            alignItems: 'flex-start',
                            flex: 1,
                        },
                    ]}
                    inputContainerStyle={[
                        baseStyles.inputContainer,
                        {
                            width: '100%',
                            borderWidth: 1,
                        },
                    ]}
                    titleStyle={[
                        baseStyles.inputTitleText,
                        {height: 'auto', flex: 1},
                    ]}
                    inputTextStyle={[baseStyles.inputValueText]}
                    label={t('time_h')}
                />
                <TitleInputRow
                    readOnly={readOnly ?? false}
                    fieldTitle={''}
                    fieldPlaceholder={'-'}
                    placeholderTextColor={'white'}
                    value={`${durationMinutes ?? ''}`}
                    setValue={value => {
                        checkNumberText(
                            value,
                            undefined,
                            setDurationMinutes,
                            true,
                            0,
                            59,
                        );
                    }}
                    keyboardType={'number-pad'}
                    containerStyle={[
                        {
                            height: 'auto',
                            alignItems: 'flex-start',
                            flex: 1,
                        },
                    ]}
                    inputContainerStyle={[
                        baseStyles.inputContainer,
                        {
                            width: '100%',
                            borderWidth: 1,
                        },
                    ]}
                    titleStyle={[
                        baseStyles.inputTitleText,
                        {height: 'auto', flex: 1},
                    ]}
                    inputTextStyle={[baseStyles.inputValueText]}
                    label={t('time_m')}
                />
            </View>
        );
    };

    let borderColor = 'black';
    switch (status) {
        case StageStatus.Unsetted:
            break;
        case StageStatus.Current:
            borderColor = 'green';
            break;
        case StageStatus.Ended:
            borderColor = 'yellow';
            break;
        case StageStatus.Waited:
            borderColor = 'blue';
            break;
    }

    const temperatureRow = () => {
        let degreeString = '';
        let scale = identity?.scale;
        let degreeStringValue =
            scale! + undefined ? scaledValueMap.temperature[scale] : undefined;
        if (degreeStringValue) {
            degreeString = `°${degreeStringValue}`;
        }

        const max = model.temperatureRange.max ?? 100;
        const actualMax =
            scale == Scale.Imperial ? temperatureConvert(max) : max;

        return (
            <TitleInputRow
                readOnly={readOnly ?? false}
                fieldTitle={t(`stage_set_initTemperature`)}
                fieldPlaceholder={'-'}
                placeholderTextColor={'white'}
                value={`${
                    viewinitTemperature != undefined ? viewinitTemperature : ''
                }`}
                setValue={value => {
                    checkNumberText(
                        value,
                        undefined,
                        setViewInitTemperature,
                        true,
                        undefined,
                        actualMax,
                    );
                }}
                keyboardType={'number-pad'}
                containerStyle={[
                    {
                        height: 'auto',
                        alignItems: 'flex-start',
                    },
                ]}
                inputContainerStyle={[
                    baseStyles.inputContainer,
                    {
                        width: '100%',
                        borderWidth: 1,
                    },
                ]}
                titleStyle={[
                    baseStyles.inputTitleText,
                    {height: 'auto', flex: 1},
                ]}
                inputTextStyle={[baseStyles.inputValueText]}
                label={degreeString}
            />
        );

        // return row(
        //     viewinitTemperature,
        //     setViewInitTemperature,
        //     'initTemperature',
        //     degreeString,
        //     true,
        //     0,
        //     actualMax,
        // );
    };

    return (
        <View
            style={{
                gap: 24,
            }}>
            {/* <Text>{initTemperature}</Text>
            <Text>{stageState ? stageState['initTemperature'] : 'NaN'}</Text>
            <Text>{stagesState ? stagesState['initTemperature'] : 'NaN'}</Text> */}
            {temperatureRow()}
            {runnedBy == SessionRunnedBy.Weight &&
                isLastStage &&
                row(weight, setWeight, 'weight_loss', '%', true, 0, 100)}
            {(runnedBy == SessionRunnedBy.Time ||
                (runnedBy == SessionRunnedBy.Weight && !isLastStage)) &&
                durationRow()}
            {/* {row(
                heatingIntensity,
                setIntensity,
                'heatingIntensity',
                '%',
                true,
                0,
                100,
            )} */}
            {/* {row(
                fanPerformance1,
                setFanPerformance1,
                'fanPerformance',
                '%',
                true,
                0,
                100,
            )} */}
            {fanSpeedRow()}
            {/* {row(
                fanPerformance2,
                setFanPerformance2,
                'fanPerformance2',
                undefined,
                true,
                0,
                100,
            )} */}
            {/* {actionActive && (
                <DButton
                    text={actionText}
                    onPress={() => {
                        if (onActionButton) onActionButton(number);
                    }}
                />
            )} */}
        </View>
    );
}

const styles = StyleSheet.create({});
