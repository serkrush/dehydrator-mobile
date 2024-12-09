import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    StyleSheet,
    LayoutAnimation,
    UIManager,
    Platform,
    Alert,
    View,
} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import CheckBoxRow from '../rows/CheckBoxRow';
import ButtonForm from 'src/Form/ButtonForm';
import palette from 'src/theme/colors/palette';
import {useSelector} from 'react-redux';
import {AppState, DEFAULT_FAN_OPTIONS, DEFAULT_HEATING_INTENSITY, ENTITY, Flag} from 'src/constants';
import {CycleAction, IZoneParams} from 'src/store/types/MachineTypes';
import {ZoneInfo} from 'src/entities/models/Machine';
import {useActions} from 'src/hooks/useEntity';
import ContainerContext from 'src/ContainerContext';
import {
    IFormStageEntity,
    IRecipeEntity,
    RecipeStageType,
} from 'src/entities/EntityTypes';
import DDatePickerRow from '../DDatePickerRow';

// Enable LayoutAnimation for Android (optional)
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function StartModal({
    setVisible,
    zones,
    currentMachineId,
    recipe,
}: {
    setVisible: any;
    zones: any[];
    currentMachineId: string;
    recipe: IRecipeEntity;
}) {
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const socket = di.resolve('socket');
    const config = di.resolve('config');
    const {stages, id: recipeId, type_session} = recipe;
    const {t} = useTranslation();
    const machines = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE];
    });
    const machine = useMemo(() => {
        return machines[currentMachineId];
    }, [currentMachineId, machines]);
    const {sendProcessZonesAction} = useActions('MachineEntity');

    const [selectZones, setSelectZones] = useState<number[]>([]);
    const [check, setCheck] = useState(false);
    const [date, setDate] = useState(new Date());

    const handleSelectZone = (data, zoneNumber) => {
        setSelectZones(prev =>
            data ? [...prev, zoneNumber] : prev.filter(i => i !== zoneNumber),
        );
    };

    const handleCheckChange = (data: boolean) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Apply animation
        setSelectZones([])
        setCheck(data);
    };

    const heatingIntensity = useMemo(() => {
        return machine.heatingIntensity ?? DEFAULT_HEATING_INTENSITY;
    }, []);
    const actualFanData: {id: string; value: any}[] = useMemo(() => {
        return (
            machine?.fanSpeed ??
            config?.machine?.cycle?.fanSpeed ??
            DEFAULT_FAN_OPTIONS
        );
    }, [machine]);

    const {scheduleCycleZones} = useActions('CycleEntity');

    const onStartPress = (isSchedule = false, zoneNumber) => {
        if (!socket.active) {
            if (socket.check) {
                socket.resubscribeOnCurrentMachine();
            }
            return;
        }

        // console.log('zone', zoneInfo);
        console.log('STAGES', stages);
        console.log('isSchedule', isSchedule);



        // if (zoneInfo == undefined) {
        //     Alert.alert(t('error'), t('zone-not-selected'));
        //     return;
        // }

        // const zoneNumber = zoneInfo.base.zoneNumber; //allZones.indexOf(zone);

        if (zoneNumber <= -1) {
            Alert.alert(t('error'), t('invalid-zone-selected'));
            return;
        }

        if (stages.length < 1) {
            Alert.alert(t('error'), t('stages-not-setuped'));
            return;
        }

        // const allOk = checkStages(stages, runnedBy);
        // console.log('machine====>', machine);

        // if (allOk) {
        //     console.log('allOk====>');
        //     const actualStages = clearStages(stages, runnedBy);

        //     if (isSchedule) {
        //         setModalVisible(true);
        //     } else {
        //         console.log('actualStages', actualStages);
        //         sendProcessAction({
        //             deviceId: machine.guid,
        //             payload: {
        //                 zoneNumber: zoneNumber,
        //                 stages: actualStages,
        //                 action: CycleAction.Start,
        //             },
        //         });
        //         dispatch(actionTypes.setBox(Flag.CurrentZone, zoneNumber));
        //         setDefaultStages();
        //         //clear();
        //         // navigator.navigate('DehydrationCycle');
        //     }
        // } else Alert.alert(t('error'), t('stages-invalid-data'));
    };

    const clearStages = (
        stages: IFormStageEntity[],
        runnedBy: RecipeStageType,
    ): IZoneParams[] => {
        switch (runnedBy) {
            case RecipeStageType.Time:
                return stages.map(value => {
                    return {
                        ...value,
                        heatingIntensity:
                            machine.heatingIntensity ??
                            DEFAULT_HEATING_INTENSITY,
                        weight: 0,
                        hours: undefined,
                        minutes: undefined,
                        viewInitTemperature: undefined,
                        fanPerformance1Label:
                            value.fanPerformance1Label ?? undefined,
                            // actualFanData [{"id": "normal", "value": 100}, {"id": "reduced", "value": 85}, {"id": "light", "value": 70}]
                        fanPerformance1: value.fanPerformance1 ?? actualFanData.find((item) => item.id === value.fanPerformance1Label)?.value,
                        fanPerformance2Label:
                            value.fanPerformance2Label ?? undefined,
                        fanPerformance2: value.fanPerformance2 ?? actualFanData.find((item) => item.id === value.fanPerformance2Label)?.value,
                    } as IZoneParams;
                });
            case RecipeStageType.Weight:
                return stages.map((value, index) => {
                    if (index < stages.length - 1) {
                        return {
                            ...value,
                            heatingIntensity:
                                machine.heatingIntensity ??
                                DEFAULT_HEATING_INTENSITY,
                            weight: 0,
                            hours: undefined,
                            minutes: undefined,
                            viewInitTemperature: undefined,
                        } as IZoneParams;
                    } else {
                        return {
                            ...value,
                            heatingIntensity:
                                machine.heatingIntensity ??
                                DEFAULT_HEATING_INTENSITY,
                            duration: 0,
                            hours: undefined,
                            minutes: undefined,
                            viewInitTemperature: undefined,
                        } as IZoneParams;
                    }
                });
        }
    };
    const allZMCycles = useSelector((state: AppState) => {
        return state.zmState;
    });

    const allDBCycles = useSelector((state: AppState) => {
        return state.cycles;
    });
    const box = useSelector((state: AppState) => {
        return state.box;
    });
    const [checkFlag, setCheckFlag] = useState(undefined);
    const lastSocketUpdateTime = useMemo(() => {
        return box[Flag.LastSocketUpdateTime];
    }, [box]);
    useEffect(() => {
        if (checkFlag != lastSocketUpdateTime) {
            setCheckFlag(lastSocketUpdateTime);
        }
    }, [lastSocketUpdateTime]);
    const zoneInfos: ZoneInfo[] = useMemo(() => {
        const infos = di.resolve('zoneInfos');
        return infos(currentMachineId);
    }, [allZMCycles, allDBCycles, currentMachineId, checkFlag]);
    const currentZone = useSelector((state: AppState) => {
        return state.box ? state.box[Flag.CurrentZone] : undefined;
    });
    const currentScheduledId = useSelector((state: AppState) => {
        return state.box ? state.box[Flag.CurrentScheduleId] : undefined;
    });
    const zoneInfo = useMemo(() => {
        return {
            ...zoneInfos.find(value => {
                return (
                    value.base.zoneNumber == currentZone &&
                    value.props.scheduledId == currentScheduledId
                );
            }),
        };
    }, [zoneInfos, currentZone, currentScheduledId]);
    const checkZoneState = (zoneNumber, scheduled = false) => {
        return zoneInfos.some(zoneInfo => 
            zoneInfo.state === (scheduled ? "scheduled" : "in-progress") && 
            zoneInfo.base.zoneNumber === zoneNumber
        );
    }

    return (
        <>
            <Text
                style={{
                    color: palette.blueBlack,
                    fontWeight: '600',
                    fontSize: 18,
                    lineHeight: 28,
                }}>
                {t('start-for')}
            </Text>
            <View
                style={{
                    marginTop: 16,
                    padding: 10,
                    backgroundColor: palette.lightGray,
                    borderRadius: 6,
                }}>
                <Text
                    style={{
                        color: palette.blueDark,
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    {t('zones')}
                </Text>
                {zones?.length > 0 &&
                    zones.map((zone, index) => {
                        const isActive = checkZoneState(index+1, check)
                        return (
                            <View key={zone.zone} style={{marginTop: 15}}>
                                <CheckBoxRow
                                    fieldTitle={zone.zone}
                                    textStyle={{textTransform: 'capitalize'}}
                                    isChecked={
                                        selectZones.indexOf(zone.zoneNumber) >=
                                        0
                                    }
                                    readOnly={isActive}
                                    onChange={data =>
                                        handleSelectZone(data, zone.zoneNumber)
                                    }
                                />
                            </View>
                        );
                    })}
            </View>
            {/* <Text
                style={{
                    color: palette.blueBlack,
                    fontWeight: '600',
                    fontSize: 18,
                    lineHeight: 28,
                    marginTop: 16
                }}>
                {t('schedule')}
            </Text> */}
            <View style={{marginTop: 16}}>
                <CheckBoxRow
                    fieldTitle={t('schedule')}
                    isChecked={check}
                    onChange={handleCheckChange}
                    textStyle={{
                        color: palette.blueBlack,
                        fontWeight: '600',
                        fontSize: 18,
                        lineHeight: 28,
                    }}
                />
            </View>
            {check && (
                <DDatePickerRow
                    startDate={date}
                    onChange={value => {
                        setDate(value);
                    }}
                />
            )}
            <ButtonForm
                text={t('start')}
                actionButton={() => {
                    console.log('start selectZones', selectZones);
                    if (selectZones?.length > 0) {
                        if (check) {
                            if (date > new Date()) {
                                if (machine?.id) {
                                    const sendStages = clearStages(
                                        stages,
                                        type_session,
                                    );

                                    scheduleCycleZones({
                                        data: {
                                            machineId: machine?.id,
                                            scheduledTime: date.getTime(),
                                            params: sendStages,
                                            recipeId,
                                        },
                                        zones: selectZones
                                    });
                                    navigator.navigate('Main');
                                } else {
                                    Alert.alert(t('error'));
                                }
                            } else {
                                Alert.alert(
                                    t('error'),
                                    t('schedule-past-time'),
                                );
                            }
                            // }
                        } else {
                            if (!socket.active) {
                                if (socket.check) {
                                    socket.resubscribeOnCurrentMachine();
                                }
                            }
                            const sendStages = clearStages(
                                stages,
                                type_session,
                            );

                            sendProcessZonesAction({
                                deviceId: machine.guid,
                                payload: {
                                    stages: sendStages,
                                    action: CycleAction.Start,
                                    settings: {
                                        heatingIntensity,
                                        fanSpeed: actualFanData,
                                    },
                                },
                                zones: selectZones,
                            });
                            navigator.navigate('Main');
                        }
                    }
                }}
                style={{...styles.marginTop23, ...{padding: 10}}}
            />
            <ButtonForm
                text={t('cancel')}
                style={styles.cancelForm}
                styleText={{color: palette.blueDark}}
                actionButton={() => setVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    marginTop23: {
        marginTop: 23,
    },
    cancelForm: {
        backgroundColor: palette.white,
        borderWidth: 1,
        borderColor: palette.blueLight,
        marginTop: 12,
        padding: 10,
    },
});
