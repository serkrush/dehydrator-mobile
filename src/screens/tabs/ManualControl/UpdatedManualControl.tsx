import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    AppState as appState,
    Alert,
    ScrollView,
    View,
    Text,
    StyleSheet,
} from 'react-native';
import ContainerContext from 'src/ContainerContext';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import {useActions} from 'src/hooks/useEntity';
import {
    AppState,
    DEFAULT_FAN_OPTIONS,
    DEFAULT_HEATING_INTENSITY,
    ENTITY,
    Flag,
    MAX_STAGES_COUNT,
    Scale,
    SessionRunnedBy,
} from 'src/constants';
import * as actionTypes from 'src/store/actions';
import {
    CycleAction,
    CycleStatus,
    IZoneParams,
} from 'src/store/types/MachineTypes';
import baseStyles from 'src/styles';
import BitSet from 'bitset';
import SocketCheckView from 'src/components/buttons/SocketCheckView';
import {
    ZoneAvailableState,
    ZoneBaseInfo,
    ZoneInfo,
    ZoneProps,
} from 'src/entities/models/Machine';
import ZoneCardView from 'src/components/ManualControl/ZoneCardView';
import DSpinner from 'src/components/DSpinner';
import ScheduleDatePickerModal from 'src/components/modals/ScheduleDatePickerModal';
import palette from 'src/theme/colors/palette';
import {colors, fonts} from 'src/theme';
import DImageButton from 'src/components/buttons/DImageButton';
import {images} from 'src/theme/images';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import {capitalizeEachWord} from 'src/utils/capitalizeEachWord';
import {ICycleModel} from 'src/entities/models/ICycleModel';
import {format} from 'date-fns';
import {capitalize} from 'src/utils/capitalize';
import {useIsFocused} from '@react-navigation/native';
import ExclamationView from 'src/components/views/ExclamationView';
import BaseCardModal from 'src/components/modals/BaseCardModal';
import {useAcl} from 'src/hooks/useAcl';
import {GRANT} from '../../../../acl/types';
import {useFormik} from 'formik';
import {
    IFormStageEntity,
    IStageEntity,
    RecipeStageType,
} from 'src/entities/EntityTypes';
import StageList from 'src/components/recipes/StageList';
import BaseTitleDropdown from 'src/components/BaseTitleDropdown';
import {useIdentity} from 'src/hooks/useIdentity';
import {temperatureConvert} from 'src/utils/scaleConvert';
import {DDelayButton} from 'src/components/buttons/DDelayButton';

const manualControlScreenColors = {
    dropdown: colors.input,

    parameters: colors.card.base,

    backgroundColor: colors.mainBackground,
    headerText: colors.header.text.main,
    sectionText: palette.blueDark,
};

interface ManualControlData {
    stages: IFormStageEntity[];
    type_session: RecipeStageType;
}

export const LAST_STAGE_PARAMS_FLAG = 'last-stage-params';

export default function ManualControl() {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const socket = di.resolve('socket');
    const config = di.resolve('config');

    const acl = useAcl();
    const identity = useIdentity();
    const [active, setActive] = useState(true);
    const [connecting, setConnecting] = useState(true);

    const [isValid, setIsValid] = useState(false);
    const [isActiveValid, setIsActiveValid] = useState(false);
    const [recipeId, setRecipeId] = useState(undefined as string | undefined);

    const [runnedBy, setRunnedBy] = useState(SessionRunnedBy.Time);

    const {scheduleCycle} = useActions('CycleEntity');
    const {updateCycle, deleteCycle} = useActions('CycleEntity');

    useEffect(() => {
        console.log('AppState.currentState', appState.currentState);
        if (appState.currentState == 'active') {
            if (socket.check()) {
                socket.resubscribeOnCurrentMachine();
            }
            setActive(socket.active);
            setConnecting(socket.connecting);
        }
    }, [appState.currentState]);

    useEffect(() => {
        setDefaultStages();
        return () => {
            clear();
        };
    }, []);

    const currentMachineId = useSelector((state: AppState) => {
        return state.box ? state.box[Flag.CurrentUpdatedMachineId] : undefined;
    });

    const machines = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE];
    });

    const machine = useMemo(() => {
        return machines[currentMachineId];
    }, [currentMachineId, machines]);

    const actualFanData: {id: string; value: any}[] = useMemo(() => {
        console.log('machine', machine.fanSpeed);
        return (
            machine?.fanSpeed ??
            config?.machine?.cycle?.fanSpeed ??
            DEFAULT_FAN_OPTIONS
        );
    }, [machine]);

    const heatingIntensity = useMemo(() => {
        return machine.heatingIntensity ?? DEFAULT_HEATING_INTENSITY;
    }, []);

    const fanPerformance = useMemo(() => {
        let index = actualFanData.findIndex(value => value.id == 'normal');
        if (index == -1) {
            index = 0;
        }
        return actualFanData[index];
    }, [actualFanData]);

    const isUserAllow = useMemo(() => {
        return acl.allow(GRANT.USER, `machine_${machine.id}`);
    }, [machine]);

    const weightFeatureEnabled = useMemo(() => {
        if (config.forceEnableWeightFeature) {
            return true;
        } else {
            return machine?.weightScaleFeature ?? false;
        }
    }, []);

    const models = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE_MODEL];
    });

    const model = useMemo(() => {
        if (machine) {
            return models[machine.modelId];
        }
        return undefined;
    }, [machine, models]);

    const allZMCycles = useSelector((state: AppState) => {
        return state.zmState;
    });

    const allDBCycles = useSelector((state: AppState) => {
        return state.cycles;
    });

    const {sendProcessAction} = useActions('MachineEntity');

    useEffect(() => {
        if (isFocused) {
            socket.resubscribeOnCurrentMachine();
            setActive(socket.active);
            setConnecting(socket.connecting);
        }
    }, [machine, isFocused]);

    const currentZone = useSelector((state: AppState) => {
        return state.box ? state.box[Flag.CurrentZone] : undefined;
    });

    const currentScheduledId = useSelector((state: AppState) => {
        return state.box ? state.box[Flag.CurrentScheduleId] : undefined;
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

    const makeParamsCopy = (info: {
        base: ZoneBaseInfo;
        state: ZoneAvailableState;
        props: ZoneProps;
    }) => {
        let res: IFormStageEntity[] = [];
        const params = info.props.params;
        for (let i = 0; i < params.length; i++) {
            const element = params[i];
            const hours = Math.floor(element.duration / 60);
            const minutes = element.duration - hours * 60;
            const scale = identity?.scale;

            const temperature = Math.floor(
                scale == Scale.Imperial
                    ? temperatureConvert(element.initTemperature)
                    : element.initTemperature,
            );

            let index = actualFanData.findIndex(
                value => value.value == element.fanPerformance1,
            );
            if (index == -1) {
                index = 0;
            }
            const fanPerformance = actualFanData[index];

            res.push({
                ...element,
                hours,
                minutes,
                viewInitTemperature: temperature,
                fanPerformance1Label: fanPerformance.id,
            });
        }
        return res;
    };

    const [activeParamsCopy, setActiveParamsCopy] = useState(
        zoneInfo?.props?.params ? makeParamsCopy(zoneInfo) : [],
    );

    const [scheduled, setScheduledTime] = useState(
        zoneInfo?.props?.scheduledTime,
    );

    const isActive = useMemo(() => {
        return (
            zoneInfo != undefined &&
            zoneInfo.props?.currentProps != undefined &&
            new BitSet(zoneInfo.props.currentProps.mode).get(0) != 0
        );
    }, [zoneInfo]);

    const isOffline = useMemo(() => {
        return (
            zoneInfo == undefined ||
            zoneInfo.state == ZoneAvailableState.Offline
        );
    }, [zoneInfo]);

    const isScheduled = useMemo(() => {
        return (
            zoneInfo != undefined &&
            zoneInfo.state == ZoneAvailableState.Scheduled
        );
    }, [zoneInfo]);

    const emptyStage = useMemo(() => {
        const params = box[LAST_STAGE_PARAMS_FLAG];
        if (params) {
            const scale = identity?.scale;
            const temp = params?.initTemperature ?? 0;
            const viewInit = Math.round(
                scale === Scale.Imperial
                    ? temperatureConvert(params?.initTemperature ?? 0)
                    : temp,
            );
            return {
                fanPerformance1Label:
                    params?.fanPerformance1Label ?? fanPerformance.id,
                fanPerformance2Label:
                    params?.fanPerformance2Label ?? fanPerformance.id,
                duration: params?.duration ?? 0,
                initTemperature: params?.initTemperature ?? 0,
                weight: params?.weight ?? 0,
                fanPerformance1:
                    params?.fanPerformance1 ?? (fanPerformance.value as number),
                fanPerformance2:
                    params?.fanPerformance2 ?? (fanPerformance.value as number),
                hours: params?.hours ?? 0,
                minutes: params?.minutes ?? 0,
                heatingIntensity,
                viewInitTemperature: viewInit ?? 0,
            };
        }
        return {
            fanPerformance1Label: fanPerformance.id,
            fanPerformance2Label: fanPerformance.id,
            duration: 0,
            initTemperature: 0,
            weight: 0,
            fanPerformance1: fanPerformance.value as number,
            fanPerformance2: fanPerformance.value as number,
            hours: 0,
            minutes: 0,
            heatingIntensity,
            viewInitTemperature: 0,
        };
    }, [box]);

    const getInitialValues = isActiveParams => {
        return {
            stages: isActiveParams
                ? activeParamsCopy
                : activeParamsCopy.length > 0
                ? [activeParamsCopy[activeParamsCopy.length - 1]]
                : [emptyStage],
            type_session:
                weightFeatureEnabled &&
                zoneInfo != undefined &&
                zoneInfo.props?.params.findIndex(value => {
                    return value.weight != 0;
                }) != -1
                    ? RecipeStageType.Weight
                    : RecipeStageType.Time,
        };
    };

    const validate = (values: ManualControlData) => {
        const errors: Partial<ManualControlData> = {};

        if (values.stages && values.stages.length > 0) {
            const stagesErrors: any[] = values.stages.map(
                (stage: IStageEntity, index) => {
                    const stageErrors = {} as any;
                    if (!stage.fanPerformance1) {
                        stageErrors.fanPerformance1 = t('required');
                    }
                    // if (!stage.fanPerformance2) {
                    //     stageErrors.fanPerformance2 = t('required');
                    // }
                    if (!stage.initTemperature) {
                        stageErrors.initTemperature = t('required');
                    }

                    if (
                        values.type_session === RecipeStageType.Weight &&
                        values.stages.length === index + 1 &&
                        !stage.weight
                    ) {
                        stageErrors.weight = t('required');
                    }
                    if (
                        (values.type_session === RecipeStageType.Time ||
                            (values.type_session === RecipeStageType.Weight &&
                                values.stages.length > index + 1)) &&
                        !stage.duration
                    ) {
                        stageErrors.duration = t('required');
                    }

                    return stageErrors;
                },
            );
            const hasstageErrors = stagesErrors.some(
                stageErrors => Object.keys(stageErrors).length > 0,
            );
            if (hasstageErrors) {
                errors.stages = stagesErrors;
            }
        }
        console.log('errors', errors);
        return errors;
    };

    const activeFormik = useFormik({
        validateOnMount: true,
        validateOnChange: true,
        initialValues: getInitialValues(true),
        validate,
        onSubmit: values => {},
    });

    const formik = useFormik({
        initialValues: getInitialValues(false),
        validate,
        validateOnMount: true,
        validateOnChange: true,
        onSubmit: values => {
            if (!socket.active) {
                if (socket.check) {
                    socket.resubscribeOnCurrentMachine();
                }
            }
            const stages = clearStages([...values.stages], values.type_session);
            sendProcessAction({
                deviceId: machine.guid,
                payload: {
                    zoneNumber: zoneInfo?.base?.zoneNumber,
                    stages,
                    action: CycleAction.Start,
                    settings: {
                        heatingIntensity,
                        fanSpeed: actualFanData,
                    },
                },
            });
            dispatch(
                actionTypes.setBox(
                    Flag.CurrentZone,
                    zoneInfo?.base?.zoneNumber,
                ),
            );
        },
    });

    useEffect(() => {
        setIsValid(formik.isValid);
    }, [formik, formik.values, formik.values.stages]);

    useEffect(() => {
        setIsActiveValid(activeFormik.isValid);
    }, [activeFormik, activeFormik.values, activeFormik.values.stages]);

    const [stageActive, setStageActive] = useState(0);

    const handleActiveAddStage = () => {
        if (activeFormik.values.stages.length >= MAX_STAGES_COUNT) {
            Alert.alert(
                'activeFormik.values.stages.length >= maxSrages !!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
            );
            return;
        }
        if (
            activeFormik?.values?.stages &&
            Array.isArray(activeFormik.values.stages)
        ) {
            activeFormik.setFieldValue('stages', [
                ...activeFormik.values.stages,
                emptyStage,
            ]);
            setStageActive(stageActive + 1);
        } else {
            activeFormik.setFieldValue('stages', [emptyStage]);
        }
    };

    const handleActiveRemoveInput = (index, inputName) => {
        if (activeFormik.values.stages.length === 1) {
            activeFormik.setFieldValue('stages', [emptyStage]);
        } else {
            activeFormik.setFieldValue(
                inputName,
                activeFormik.values[inputName].filter((_, i) => i !== index),
            );
        }
        setStageActive(index === 0 ? 0 : stageActive - 1);
    };

    const handleAddStage = () => {
        if (formik.values.stages.length >= MAX_STAGES_COUNT) {
            Alert.alert(
                'formik.values.stages.length >= maxSrages !!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
            );
            return;
        }
        if (formik?.values?.stages && Array.isArray(formik.values.stages)) {
            formik.setFieldValue('stages', [
                ...formik.values.stages,
                emptyStage,
            ]);
            setStageActive(stageActive + 1);
        } else {
            formik.setFieldValue('stages', [emptyStage]);
        }
    };

    const handleRemoveInput = (index, inputName) => {
        if (formik.values.stages.length === 1) {
            formik.setFieldValue('stages', [emptyStage]);
        } else {
            formik.setFieldValue(
                inputName,
                formik.values[inputName].filter((_, i) => i !== index),
            );
        }
        setStageActive(index === 0 ? 0 : stageActive - 1);
    };

    const checkStages = (
        stages: IFormStageEntity[],
        runnedBy: RecipeStageType,
    ): boolean => {
        let allOk = true;
        for (let i = 0; i < stages.length; i++) {
            const stage = stages[i];
            const isLast = i == stages.length - 1;

            const weightParamNotOk =
                runnedBy == RecipeStageType.Weight &&
                isLast &&
                (stage.weight == undefined || stage.weight == 0);

            const timeParamNotOk =
                ((runnedBy == RecipeStageType.Weight && !isLast) ||
                    runnedBy == RecipeStageType.Time) &&
                (stage.duration == undefined || stage.duration == 0);
            if (timeParamNotOk || weightParamNotOk) {
                allOk = false;
                break;
            }

            if (
                stage.fanPerformance1 == undefined ||
                // stage.fanPerformance2 == undefined ||
                stage.heatingIntensity == undefined
            ) {
                allOk = false;
                break;
            }
        }

        return allOk;
    };

    const fanLabelToValue = (label: string, defaultValue: number): number => {
        if (!label) {
            return defaultValue;
        }
        let value = actualFanData.find(data => {
            return data.id == label;
        });

        return value?.value ?? defaultValue;
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
                        fanPerformance1: fanLabelToValue(
                            value.fanPerformance1Label,
                            value.fanPerformance1,
                        ),
                        fanPerformance2: fanLabelToValue(
                            value.fanPerformance2Label,
                            value.fanPerformance2,
                        ),
                        hours: undefined,
                        minutes: undefined,
                        viewInitTemperature: undefined,
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
                            fanPerformance1: fanLabelToValue(
                                value.fanPerformance1Label,
                                value.fanPerformance1,
                            ),
                            fanPerformance2: fanLabelToValue(
                                value.fanPerformance2Label,
                                value.fanPerformance2,
                            ),
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
                            fanPerformance1: fanLabelToValue(
                                value.fanPerformance1Label,
                                value.fanPerformance1,
                            ),
                            fanPerformance2: fanLabelToValue(
                                value.fanPerformance2Label,
                                value.fanPerformance2,
                            ),
                            hours: undefined,
                            minutes: undefined,
                            viewInitTemperature: undefined,
                        } as IZoneParams;
                    }
                });
        }
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const onScheduleUpdatePress = () => {
        setModalVisible(true);
    };

    const onScheduledDateUpdate = (date: Date) => {
        console.log('onScheduledDateUpdate', date);
        if (date > new Date()) {
            setScheduledTime(date.getTime());
            setModalVisible(false);
        } else {
            Alert.alert(t('error'), t('schedule-past-time'));
        }
    };

    const onScheduleConfirm = (date: Date) => {
        if (cycleIsScheduled) {
            onScheduledDateUpdate(date);
        } else {
            if (date > new Date()) {
                if (zoneInfo && machine.id) {
                    scheduleCycle({
                        data: {
                            machineId: machine.id,
                            zoneNumber: zoneInfo?.base?.zoneNumber,
                            scheduledTime: date.getTime(),
                            params: clearStages(
                                [...(formik?.values?.stages ?? [])],
                                formik.values.type_session,
                            ),
                            recipeId,
                        },
                    });
                    setModalVisible(false);
                } else {
                    Alert.alert(t('error'));
                }
            } else {
                Alert.alert(t('error'), t('schedule-past-time'));
            }
        }
    };

    const setDefaultStages = () => {
        const params = zoneInfo?.props?.params;
        const defaultStage: IZoneParams =
            params != undefined && params.length > 0
                ? params[params.length - 1]
                : emptyStage;
        formik.setFieldValue('stages', [defaultStage]);
        setStageActive(0);
    };

    const clear = () => {
        setDefaultStages();
        setStageActive(-1);
        formik.resetForm();
        activeFormik.resetForm();
    };

    const onBackPress = () => {
        clear();
        navigator.pop();
    };

    //ACTIVE ZONE PROCESS ACTIONS

    const cycleIsPaused = useMemo(() => {
        return zoneInfo != undefined &&
            zoneInfo.props?.currentProps != undefined
            ? new BitSet(zoneInfo.props.currentProps.mode).get(1) != 0
            : false;
    }, [zoneInfo]);

    const cycleIsScheduled = zoneInfo?.state == ZoneAvailableState.Scheduled;

    const onStartPause = () => {
        if (!cycleIsPaused) {
            setActiveParamsCopy(
                zoneInfo?.props?.params ? makeParamsCopy(zoneInfo) : [],
            );
            activeFormik.setValues(getInitialValues(true));
            formik.setValues(getInitialValues(true));
        }
        onPauseCycle();
    };

    useEffect(() => {
        if (!isActive) {
            const copy = zoneInfo?.props?.params
                ? makeParamsCopy(zoneInfo)
                : [];
            setActiveParamsCopy(copy);
            activeFormik.setFieldValue('stages', copy);
            formik.setFieldValue('stages', copy);
            setStageActive(0);
        }
    }, [isActive]);

    useEffect(() => {
        const copy = zoneInfo?.props?.params ? makeParamsCopy(zoneInfo) : [];
        activeFormik.setFieldValue('stages', copy);
        setActiveParamsCopy(copy);
        formik.setFieldValue(
            'stages',
            copy.length > 0 ? [copy[copy.length - 1]] : [emptyStage],
        );
    }, []);

    useEffect(() => {
        if (cycleIsPaused) {
            const copy = zoneInfo?.props?.params
                ? makeParamsCopy(zoneInfo)
                : [];
            setActiveParamsCopy(copy);
            activeFormik.setFieldValue('stages', copy);
            formik.setFieldValue('stages', copy);
        }
    }, [cycleIsPaused]);

    const stageIndex = useMemo(() => {
        return zoneInfo?.props?.currentProps
            ? zoneInfo?.props?.currentProps.stage - 1
            : -1;
    }, [zoneInfo]);

    const onPauseCycle = () => {
        let payload = {
            zoneNumber: currentZone,
            action: CycleAction.Pause,
        };

        if (cycleIsPaused) {
            payload['stages'] = clearStages(
                activeFormik.values.stages,
                activeFormik.values.type_session,
            );

            payload['settings'] = {
                heatingIntensity,
                fanSpeed: actualFanData,
            };
        }

        if (!cycleIsPaused || activeFormik.isValid) {
            sendProcessAction({
                deviceId: machine.guid,
                payload,
            });
        }
    };

    const onStopCycle = () => {
        sendProcessAction({
            deviceId: machine.guid,
            payload: {
                zoneNumber: currentZone,
                action: CycleAction.Stop,
            },
        });
    };

    const onCancelPress = () => {
        console.log('onCancelPress');
        activeFormik.resetForm();
        setScheduledTime(zoneInfo?.props?.scheduledTime);
    };

    const onUpdateCycle = () => {
        if (zoneInfo != undefined && zoneInfo.props?.scheduledId) {
            const now = new Date().getTime();
            const actualScheduledTime =
                scheduled ?? zoneInfo.props.scheduledTime ?? now;

            if (actualScheduledTime <= now) {
                Alert.alert(t('error'), t('schedule-past-time'));
                return;
            }

            if (zoneInfo == undefined) {
                Alert.alert(t('error'), t('zone-not-selected'));
                return;
            }

            const zoneNumber = zoneInfo?.base?.zoneNumber;

            if (zoneNumber <= -1) {
                Alert.alert(t('error'), t('invalid-zone-selected'));
                return;
            }

            if (activeParamsCopy.length < 1) {
                Alert.alert(t('error'), t('stages-not-setuped'));
                return;
            }

            const allOk = checkStages(
                activeFormik.values.stages,
                formik.values.type_session,
            );

            if (allOk) {
                const actualStages = clearStages(
                    [...activeFormik.values.stages],
                    formik.values.type_session,
                );
                const data: ICycleModel = {
                    id: zoneInfo?.props?.scheduledId,
                    machineId: zoneInfo?.props?.machineId,
                    status: CycleStatus.Scheduled,
                    zoneNumber: zoneInfo?.props?.zoneNumber,
                    params: [...actualStages],

                    recipeId: zoneInfo?.props?.recipeId,
                    scheduledTime: actualScheduledTime,
                };
                setActiveParamsCopy([...activeFormik.values.stages]);
                updateCycle({cycleId: zoneInfo!.props.scheduledId!, data});
            } else {
                Alert.alert(t('error'), t('stages-invalid-data'));
            }
        }
    };

    const onDeleteCycle = () => {
        setDeleteModalVisible(true);
    };

    const onDeleteCycleConfirm = () => {
        setDeleteModalVisible(false);
        deleteCycle({cycleId: zoneInfo!.props.scheduledId!});
    };

    return (
        <BaseScreenLayout
            cleanSocketSubscriptions={false}
            style={{
                backgroundColor: manualControlScreenColors.backgroundColor,
            }}
            containerStyle={{paddingHorizontal: 16}}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            gap: 8,
                        },
                        {paddingTop: 4},
                    ]}>
                    <DImageButton
                        source={images.arrows.left}
                        width={24}
                        height={24}
                        tintColor={colors.imageButton.outlined.content}
                        additionalStyle={baseStyles.backButton}
                        onPress={onBackPress}
                    />
                    <View
                        style={{
                            alignSelf: 'flex-end',
                        }}>
                        <Text style={[styles.headerText]}>
                            {t('manual-control').toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>
            <ScrollView
                style={{}}
                contentContainerStyle={{
                    rowGap: 16,
                    paddingVertical: 16,
                }}>
                {zoneInfo != undefined && (
                    <ZoneCardView
                        item={zoneInfo}
                        modelInfo={model}
                        disabled={true}
                    />
                )}
                {isUserAllow &&
                    !isOffline &&
                    weightFeatureEnabled &&
                    !isActive && (
                        <BaseTitleDropdown
                            data={[
                                {
                                    label: t(RecipeStageType.Weight),
                                    value: RecipeStageType.Weight,
                                },
                                {
                                    label: t(RecipeStageType.Time),
                                    value: RecipeStageType.Time,
                                },
                            ]}
                            title={`${t('run-session-by')}`}
                            placeholder={t('run-session-by')}
                            value={formik.values.type_session}
                            setValue={data => {
                                formik.setFieldValue('type_session', data);
                                activeFormik.setFieldValue(
                                    'type_session',
                                    data,
                                );
                            }}
                        />
                    )}
                {isUserAllow &&
                    !isOffline &&
                    weightFeatureEnabled &&
                    !isActive &&
                    !isScheduled &&
                    runnedBy == SessionRunnedBy.Weight && (
                        <DUpdatedButton
                            text={t('tare-weight')}
                            source={images.state.weight}
                            reverse={true}
                            baseStyle={ButtonStyle.Primary}
                        />
                    )}

                {isUserAllow && !isOffline && !isActive && !isScheduled && (
                    <View style={{gap: 12, paddingVertical: 16}}>
                        <Text style={styles.subSectionText}>
                            {capitalizeEachWord(t('select-recipe'))}
                        </Text>
                        <View style={{gap: 16}}>
                            <DUpdatedButton
                                text={capitalizeEachWord(t('bf cookbook'))}
                                baseStyle={ButtonStyle.Alternative}
                                containerStyle={{borderWidth: 0}}
                            />
                            <DUpdatedButton
                                text={capitalizeEachWord(t('preset'))}
                                baseStyle={ButtonStyle.Alternative}
                                containerStyle={{borderWidth: 0}}
                            />
                            <DUpdatedButton
                                text={capitalizeEachWord(t('my recipe'))}
                                baseStyle={ButtonStyle.Alternative}
                                containerStyle={{borderWidth: 0}}
                            />
                        </View>
                    </View>
                )}
                {zoneInfo != undefined &&
                    !isOffline &&
                    (isActive || isScheduled) && (
                        <StageList
                            setupedParamsLength={
                                cycleIsScheduled
                                    ? undefined
                                    : activeParamsCopy.length
                            }
                            activeStageIndex={
                                cycleIsScheduled ? undefined : stageIndex
                            }
                            data={
                                cycleIsPaused || cycleIsScheduled
                                    ? activeFormik.values.stages
                                    : makeParamsCopy(zoneInfo)
                            }
                            stageActive={stageActive}
                            setStageActive={setStageActive}
                            handleRemove={handleActiveRemoveInput}
                            handleAdd={handleActiveAddStage}
                            setFieldValue={activeFormik.setFieldValue}
                            typeSession={activeFormik.values.type_session}
                            errors={activeFormik?.errors?.stages}
                            readOnly={
                                !isUserAllow ||
                                (cycleIsScheduled ? false : !cycleIsPaused)
                            }
                        />
                    )}
                {isUserAllow && !isOffline && !isActive && !isScheduled && (
                    <>
                        <StageList
                            data={formik?.values?.stages}
                            stageActive={stageActive}
                            setStageActive={setStageActive}
                            handleRemove={handleRemoveInput}
                            handleAdd={handleAddStage}
                            setFieldValue={formik.setFieldValue}
                            typeSession={formik.values.type_session}
                            errors={formik?.errors?.stages}
                        />
                    </>
                )}
            </ScrollView>
            {isUserAllow && !isOffline && !isActive && !isScheduled && (
                <View style={styles.buttonsContainer}>
                    <DDelayButton
                        baseStyle={ButtonStyle.Primary}
                        disabled={!isValid || !active || connecting}
                        onPress={formik.handleSubmit}
                        text={t('start')}
                    />

                    <DUpdatedButton
                        baseStyle={ButtonStyle.Outlined}
                        onPress={() => {
                            if (formik.isValid) {
                                setModalVisible(true);
                            }
                        }}
                        text={t('schedule')}
                        reverse={true}
                        source={images.schedule}
                        textStyle={{alignSelf: 'flex-end'}}
                    />
                </View>
            )}
            {isUserAllow &&
                zoneInfo != undefined &&
                !isOffline &&
                (isActive || isScheduled) && (
                    <>
                        {cycleIsScheduled && (
                            <View style={styles.buttonsContainer}>
                                <DUpdatedButton
                                    baseStyle={ButtonStyle.Outlined}
                                    text={`${capitalize(t('scheduled'))} ${
                                        scheduled != undefined
                                            ? format(
                                                  scheduled,
                                                  'MMM dd yyyy H:mm',
                                              )
                                            : '-'
                                    }`}
                                    onPress={onScheduleUpdatePress}
                                />

                                <View
                                    style={{
                                        gap: 8,
                                        flexDirection: 'row',
                                    }}>
                                    <DUpdatedButton
                                        baseStyle={ButtonStyle.Primary}
                                        containerStyle={{flex: 1}}
                                        onPress={onUpdateCycle}
                                        text={t('update')}
                                    />
                                    <DUpdatedButton
                                        baseStyle={ButtonStyle.Outlined}
                                        containerStyle={{flex: 1}}
                                        onPress={onCancelPress}
                                        text={t('cancel')}
                                    />
                                    <DUpdatedButton
                                        baseStyle={ButtonStyle.Destructive}
                                        containerStyle={{flex: 1}}
                                        onPress={onDeleteCycle}
                                        text={t('delete')}
                                    />
                                </View>
                            </View>
                        )}
                        {!cycleIsScheduled && (
                            <View style={styles.buttonsContainer}>
                                <DUpdatedButton
                                    disabled={
                                        !isActiveValid || !active || connecting
                                    }
                                    baseStyle={
                                        cycleIsPaused
                                            ? ButtonStyle.Outlined
                                            : ButtonStyle.Primary
                                    }
                                    onPress={onStartPause}
                                    text={
                                        cycleIsPaused ? t('resume') : t('pause')
                                    }
                                />
                                <DUpdatedButton
                                    disabled={!active || connecting}
                                    baseStyle={ButtonStyle.Outlined}
                                    onPress={onStopCycle}
                                    text={t('stop')}
                                />
                            </View>
                        )}
                    </>
                )}

            <DSpinner checkEntities={'CycleEntity'} />
            <SocketCheckView
                needResubscribe={true}
                resubscribeOnCurrent={true}
                socket={socket}
                socketActive={active}
                setSocketActive={setActive}
                socketConnecting={connecting}
                setSocketConnecting={setConnecting}
            />
            <ScheduleDatePickerModal
                visible={modalVisible}
                setVisible={setModalVisible}
                onSchedulePress={onScheduleConfirm}
                startDate={
                    cycleIsScheduled && scheduled
                        ? new Date(scheduled)
                        : new Date()
                }
            />
            {deleteModalVisible && (
                <BaseCardModal
                    imageView={<ExclamationView />}
                    title={t('delete-schedule-title')}
                    description={t('delete-schedule-description')}
                    actionRows={[
                        {
                            text: t('delete'),
                            baseStyle: ButtonStyle.Destructive,
                            onPress: onDeleteCycleConfirm,
                        },
                        {
                            text: t('cancel'),
                            baseStyle: ButtonStyle.Outlined,
                            onPress: () => {
                                setDeleteModalVisible(false);
                            },
                        },
                    ]}
                />
            )}
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    headerText: {
        ...fonts.h2,
        color: manualControlScreenColors.headerText,
    },
    sectionText: {
        ...fonts.textSizeL28,
        color: manualControlScreenColors.sectionText,
    },
    subSectionText: {
        ...fonts.textSizeS20,
        color: manualControlScreenColors.sectionText,
    },

    buttonsContainer: {
        paddingVertical: 16,
        gap: 16,
    },
});
