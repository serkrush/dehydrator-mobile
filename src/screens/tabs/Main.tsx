import {useIsFocused} from '@react-navigation/native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    AppState as appState,
    Image,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DImageButton from 'src/components/buttons/DImageButton';
import DTextButton from 'src/components/buttons/DTextButton';
import SocketCheckView from 'src/components/buttons/SocketCheckView';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import ZoneCardView from 'src/components/ManualControl/ZoneCardView';
import NoDehydratorsView from 'src/components/NoDehydratorsView';
import {AppState, ENTITY, Flag} from 'src/constants';
import ContainerContext from 'src/ContainerContext';
import {ZoneAvailableState, ZoneInfo} from 'src/entities/models/Machine';
import {useActions} from 'src/hooks/useEntity';
import * as actionTypes from 'src/store/actions';
import colors from 'src/theme/colors';
import palette from 'src/theme/colors/palette';
import {fonts} from 'src/theme/fonts';
import {images} from 'src/theme/images';
import {capitalize} from 'src/utils/capitalize';
import messaging from '@react-native-firebase/messaging';

const mainScreenColors = {
    backgroundColor: colors.mainBackground,

    text: {
        textButton: colors.textButton,
        card: colors.card.text,
    },

    card: colors.card.base,
    screenButton: {
        base: {
            image: {
                tint: palette.blue,
                background: '#E5F5FA',
            },
        },
        alt: {
            image: {
                tint: palette.orange,
                background: palette.orangeLightest,
            },
        },
    },

    outsideButton: {
        base: {
            image: {
                tint: 'white',
                background: palette.blue,
            },
            background: '#E5F5FA',
            border: '#C2EAF7',
        },
        alt: {
            image: {
                tint: 'white',
                background: '#F66413',
            },
            background: palette.orangeLightest,
            border: palette.orangeLight,
        },
    },
};

export default function Main() {

    const {t} = useTranslation();

    const di = useContext(ContainerContext);
    const socket = di.resolve('socket');
    const config = di.resolve('config');
    const navigator = di.resolve('navigator');
    const pusher = di.resolve('pusher');

    const [active, setActive] = useState(true);
    const [connecting, setConnecting] = useState(true);
    const {getModelsInfo} = useActions('MachineModelEntity');
    const {getUserDetailed} = useActions('UserEntity');

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const {getMachineScheduledCycles} = useActions('CycleEntity');
    const identity = useSelector((state: AppState) => state?.auth?.identity);

    const machines = useSelector((state: AppState) => {
        return state.machines;
    });
    const currentMachineId = useSelector((state: AppState) => {
        return state.box[Flag.CurrentUpdatedMachineId];
    });

    const machine = useMemo(() => {
        if (currentMachineId == undefined) {
            return undefined;
        }
        return machines[currentMachineId];
    }, [currentMachineId, machines]);

    useEffect(() => {
        console.log('AppState.currentState', appState.currentState);
        if (appState.currentState == 'active' && machine != undefined) {
            if (socket.check()) {
                socket.resubscribeOnCurrentMachine();
            }
            setActive(socket.active);
            setConnecting(socket.connecting);
        }
    }, [appState.currentState]);

    useEffect(() => {
        pusher.requestUserPermission();
    }, []);

    useEffect(() => {
        getUserDetailed({uid: identity?.userId, flag: Flag.UserInfosReceived});
        //getMachinesForUser();
        getModelsInfo();
    }, []);

    const models = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE_MODEL];
    });

    const allZMCycles = useSelector((state: AppState) => {
        return state.zmState;
    });

    const allDBCycles = useSelector((state: AppState) => {
        return state.cycles;
    });

    useEffect(() => {
        if (currentMachineId) {
            getMachineScheduledCycles({machineId: currentMachineId});
        }
    }, [currentMachineId]);

    const weightFeatureEnabled = useMemo(() => {
        if (config.forceEnableWeightFeature) {
            return true;
        } else {
            return machine?.weightScaleFeature ?? false;
        }
    }, []);

    const machinesCount = useMemo(() => {
        if (machines) {
            return Object.values(machines).length;
        }
        return 0;
    }, [machines]);

    useEffect(() => {
        if (isFocused && machine != undefined) {
            socket.check();
            socket.resubscribeOnCurrentMachine();
            setActive(socket.active);
            setConnecting(socket.connecting);
        }
    }, [machine, isFocused]);

    const model = useMemo(() => {
        if (machine) {
            return models[machine.modelId];
        }
        return undefined;
    }, [machine]);

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

    const onZoneCardPress = (item: ZoneInfo) => {
        switch (item.state) {
            case ZoneAvailableState.InProgress:
            case ZoneAvailableState.Available:
            case ZoneAvailableState.Scheduled:
                dispatch(
                    actionTypes.setBox(Flag.CurrentZone, item.base.zoneNumber),
                );
                dispatch(
                    actionTypes.setBox(
                        Flag.CurrentScheduleId,
                        item.props.scheduledId,
                    ),
                );
                navigator.navigate('ManualControl');
                break;
            case ZoneAvailableState.Offline:
                break;
            case ZoneAvailableState.Error:
                break;
        }
    };

    const onSelectMachinePress = () => {
        navigator.navigate('Machines');
    };

    const onAddAMachinePress = () => {
        navigator.navigate('AddDehydrator');
    };

    const screenButtonView = (
        text,
        image,
        isBase = true,
        onPress = () => {},
    ) => {
        const colors = isBase
            ? mainScreenColors.screenButton.base.image
            : mainScreenColors.screenButton.alt.image;
        return (
            <TouchableOpacity
                style={styles.screenButtonContainer}
                onPress={onPress}>
                <View
                    style={[
                        styles.buttonImageContainer,
                        {
                            backgroundColor: colors.background,
                        },
                    ]}>
                    <Image
                        source={image}
                        style={{
                            height: 24,
                            width: 24,
                            resizeMode: 'contain',
                        }}
                        tintColor={colors.tint}
                    />
                </View>
                <Text
                    style={{
                        ...fonts.h4,
                        color: mainScreenColors.text.card.h4,
                    }}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    };

    const outsideButtonView = (
        text,
        description,
        actionText,
        image,
        isBase = true,
        onPress = () => {},
    ) => {
        const colors = isBase
            ? mainScreenColors.outsideButton.base
            : mainScreenColors.outsideButton.alt;

        return (
            <View
                style={[
                    styles.outsideButtonContainer,
                    {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                    },
                ]}>
                <View
                    style={[
                        styles.buttonImageContainer,
                        {
                            backgroundColor: colors.image.background,
                        },
                    ]}>
                    <Image
                        source={image}
                        style={{
                            height: 24,
                            width: 24,
                            resizeMode: 'contain',
                        }}
                        tintColor={colors.image.tint}
                    />
                </View>
                <View style={{gap: 4}}>
                    <Text
                        style={{
                            ...fonts.h2,
                            color: mainScreenColors.text.card.h2,
                        }}>
                        {text}
                    </Text>
                    <Text
                        style={{
                            ...fonts.textSizeS20,
                            color: mainScreenColors.text.card.mainContent,
                        }}>
                        {description}
                    </Text>
                    <TouchableOpacity onPress={onPress} style={{paddingTop: 8}}>
                        <Text
                            style={{
                                ...fonts.textSizeSB,
                                color: mainScreenColors.text.card.h2,
                            }}>
                            {actionText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <>
            <BaseScreenLayout
                cleanSocketSubscriptions={false}
                style={{
                    backgroundColor: mainScreenColors.backgroundColor,
                    paddingTop: 4,
                }}
                containerStyle={{
                    paddingHorizontal: 0,
                }}>
                <View style={{paddingHorizontal: 16, marginTop: 12}}>
                    <View style={{marginBottom: 16}}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                gap: 2,
                            }}>
                            {machine && (
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                    }}>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                        style={[styles.sectionText]}>
                                        {machine?.machineName}
                                    </Text>
                                    <Text style={[styles.sectionSpanText]}>
                                        {model?.model}
                                    </Text>
                                </View>
                            )}
                            {machine == undefined && (
                                <Text style={[styles.sectionText]}>
                                    {t('no-dehydrator')}
                                </Text>
                            )}
                            <View style={{}}>
                                <DImageButton
                                    source={images.add}
                                    width={24}
                                    height={24}
                                    tintColor={
                                        colors.imageButton.primary.content
                                    }
                                    additionalStyle={{
                                        backgroundColor:
                                            colors.imageButton.primary
                                                .background,
                                        width: 40,
                                        height: 40,
                                        borderRadius: 100,
                                    }}
                                    onPress={onAddAMachinePress}
                                />
                            </View>
                        </View>
                        {machinesCount <= 0 && (
                            <NoDehydratorsView
                                onAddAMachinePress={onAddAMachinePress}
                            />
                        )}
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{gap: 16, paddingHorizontal: 16}}>
                        {machine &&
                            zoneInfos
                                .sort((a, b) => {
                                    if (
                                        (a.state !=
                                            ZoneAvailableState.Scheduled &&
                                            b.state !=
                                                ZoneAvailableState.Scheduled) ||
                                        a.state == b.state
                                    ) {
                                        return (
                                            a.base.zoneNumber -
                                            b.base.zoneNumber
                                        );
                                    } else if (
                                        a.state == ZoneAvailableState.Scheduled
                                    ) {
                                        return 1;
                                    } else {
                                        return -1;
                                    }
                                })
                                .map((item, index) => {
                                    return (
                                        <ZoneCardView
                                            key={index}
                                            item={item}
                                            onPress={onZoneCardPress}
                                            showPressButton={false}
                                            modelInfo={model}
                                            weightFeatureEnabled={
                                                weightFeatureEnabled
                                            }
                                        />
                                    );
                                })}
                    </View>
                    <View
                        style={{
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            gap: 16,
                            rowGap: 20,
                            paddingVertical: 16,
                            paddingHorizontal: 16,
                        }}>
                        {screenButtonView(
                            t('presets'),
                            images.mainScreen.presets,
                            true,
                            () => navigator.navigate('PresetsScreen'),
                        )}
                        {screenButtonView(
                            t('bf cookbook'),
                            images.mainScreen.bfCookbook,
                            true,
                            () => navigator.navigate('BenchFoodsScreen'),
                        )}
                        {screenButtonView(
                            t('my recipes'),
                            images.mainScreen.myRecipes,
                            true,
                            () => navigator.navigate('MyRecipesScreen'),
                        )}
                        {screenButtonView(
                            t('data & charts'),
                            images.mainScreen.dataAndCharts,
                        )}
                    </View>
                    <View
                        style={{
                            backgroundColor: 'white',
                            gap: 16,
                            padding: 16,
                        }}>
                        {outsideButtonView(
                            t('forum'),
                            capitalize(t('forum-description')),
                            capitalize(t('tap to visit') + ' ' + t('forum')),
                            images.mainScreen.forum,
                        )}
                        {outsideButtonView(
                            t('liveChat'),
                            capitalize(t('liveChat-description')),
                            capitalize(t('tap to visit') + ' ' + t('liveChat')),
                            images.mainScreen.liveChat,
                            false,
                        )}
                        {outsideButtonView(
                            t('website'),
                            capitalize(t('website-description')),
                            capitalize(t('tap to visit') + ' ' + t('website')),
                            images.mainScreen.website,
                        )}
                    </View>
                </ScrollView>
            </BaseScreenLayout>
            {machine != undefined && (
                <SocketCheckView
                    needResubscribe={true}
                    resubscribeOnCurrent={true}
                    socket={socket}
                    socketActive={active}
                    setSocketActive={setActive}
                    socketConnecting={connecting}
                    setSocketConnecting={setConnecting}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    sectionText: {
        ...fonts.h1,
        color: colors.header.text.main,
        width: '90%',
        maxWidth: '90%',
        minWidth: '90%',
    },

    sectionSpanText: {
        ...fonts.h3,
        color: colors.header.text.additional,
        width: '90%',
        maxWidth: '90%',
        minWidth: '90%',
    },

    selectMachineButtonText: {
        ...fonts.textSizeS20,
        color: mainScreenColors.text.textButton,
    },

    screenButtonContainer: {
        minWidth: '40%',
        flex: 1,
        backgroundColor: mainScreenColors.card.background,
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
        borderWidth: 1,
        borderColor: mainScreenColors.card.border,
        borderRadius: 12,
        gap: 12,
    },

    outsideButtonContainer: {
        flex: 1,
        backgroundColor: mainScreenColors.card.background,
        minHeight: 120,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
    },

    buttonImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
