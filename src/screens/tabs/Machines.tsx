import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    ActivityIndicator,
    AppState as appState,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import ContainerContext from 'src/ContainerContext';
import {useDispatch, useSelector} from 'react-redux';
import TitleHeader from 'src/components/Headers/TitleHeader';
import {useTranslation} from 'react-i18next';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import {AppState, ENTITY, Flag, RequestStatus} from 'src/constants';
import {useActions} from 'src/hooks/useEntity';
import DActivityIndicator from 'src/components/DActivityIndicator';
import {
    ZoneAvailableState,
    ZoneBaseInfo,
    ZoneInfo,
} from 'src/entities/models/Machine';
import BitSet from 'bitset';
import * as actionTypes from '../../store/actions';
import DMachineRow from 'src/components/ManualControl/DMachineRow';
import {ICycleState} from 'src/store/types/MachineTypes';
import {useIsFocused} from '@react-navigation/native';
import {images} from 'src/theme/images';
import DPImageButton from 'src/components/buttons/DPImageButton';
import {mapICycleStateToZoneCardViewProps} from 'src/utils/mapToZoneCardViewProps';
import {families, fonts} from 'src/theme';
import {normalize} from 'src/theme/fonts';
import colors from 'src/theme/colors';
import palette from 'src/theme/colors/palette';
import NoDehydratorsView from 'src/components/NoDehydratorsView';
import DImageButton from 'src/components/buttons/DUpdatedImageButton';
import baseStyles from 'src/styles';
import {Zone} from 'src/entities/models/MachineModel';
import DSpinner from 'src/components/DSpinner';
import Header, {ViewType} from 'src/components/Headers/UpdatedHeader';
import DUpdatedImageButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedImageButton';
import {GRANT, ROLE} from '../../../acl/types';
import {useAcl} from 'src/hooks/useAcl';
import {useIdentity} from 'src/hooks/useIdentity';
import {IMachineAccess} from 'src/entities/models/MachineAccess';

const machinesScreenColors = {
    backgroundColor: colors.mainBackground,
    sectionText: colors.header.text.main,
    groupText: colors.header.text.main,
};

export default function Machines() {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const [refreshing, setRefreshing] = useState(false);

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const {updateAllMachinesStatuses} = useActions('ZMStateEntity');

    const acl = useAcl();
    const identity = useIdentity();

    const models = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE_MODEL];
    });

    const machines = useSelector((state: AppState) => {
        return state.machines;
    });

    const users = useSelector((state: AppState) => {
        return state.users;
    });

    const currentUser = useMemo(() => {
        return users[identity.userId];
    }, [users, identity]);

    const access = useSelector((state: AppState) => {
        return state.access;
    });

    const accessList = useMemo(() => {
        let res: IMachineAccess[] = [];
        if (currentUser) {
            currentUser?.access?.forEach(key => {
                const element = access[key];
                res.push(element);
            });
        }
        return res;
    }, [access, currentUser]);

    const accessedMachines = useMemo(() => {
        return Object.values(machines).filter(value => {
            return (
                accessList.findIndex(accessElement => {
                    return (
                        accessElement.machineId == value.id &&
                        accessElement.userId == identity?.userId
                    );
                }) != -1
            );
        });
    }, [machines, accessList, identity]);

    // console.log("access", access)

    const machinesCount = useMemo(() => {
        if (machines) {
            return Object.values(machines).length;
        }
        return 0;
    }, [machines]);

    const groups = useSelector((state: AppState) => {
        return state.groups;
    });

    const accessedGroups = useMemo(() => {
        return Object.values(groups).filter(value => {
            return (
                accessList.findIndex(accessElement => {
                    return (
                        accessElement.machineGroupId == value.id &&
                        accessElement.userId == identity?.userId
                    );
                }) != -1
            );
        });
    }, [groups, accessList, identity]);

    const allCycles = useSelector((state: AppState) => {
        return state.zmState;
    });

    const statusUpdateCompleted = useSelector((state: AppState) => {
        return state.box[Flag.StatusUpdateCompleted] ?? true;
    });

    const machinesCycles = useMemo(() => {
        let res: {[key: string]: ICycleState[]} = {};
        Object.values(machines).forEach(machine => {
            const machineCycles = Object.values(allCycles).filter(cycle => {
                return cycle.machineId == machine.guid;
            });
            if (machine.id) {
                res[machine.id] = machineCycles;
            }
        });
        return res;
    }, [machines, allCycles]);

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

    const machineZoneInfos = useMemo(() => {
        const infos = di.resolve('zoneInfos');

        var res = {};
        Object.values(machines).forEach(machine => {
            if (machine && machine.id) {
                res[machine.id] = infos(machine.id);
            }
        });

        return res;
    }, [machinesCycles, checkFlag]);

    const {getModelsInfo} = useActions('MachineModelEntity');
    const {getUserDetailed} = useActions('UserEntity');

    useEffect(() => {
        getModelsInfo();
        getUserDetailed({uid: identity?.userId, flag: Flag.UserInfosReceived});
    }, []);

    useEffect(() => {
        updateAllMachinesStatuses();
    }, []);

    const compressZoneInfos = (infos: ZoneInfo[]): ZoneInfo[] => {
        let res: ZoneInfo[] = [];

        if (infos.length > 0) {
            const notOffline = infos.findIndex(value => {
                return value.state != ZoneAvailableState.Offline;
            });
            if (notOffline == -1) {
                res = [infos[0]];
            } else {
                let statusIndex = infos.findIndex(value => {
                    return value.state == ZoneAvailableState.Error;
                });

                if (statusIndex == -1) {
                    statusIndex = infos.findIndex(value => {
                        return value.state == ZoneAvailableState.InProgress;
                    });

                    if (statusIndex == -1) {
                        statusIndex = infos.findIndex(value => {
                            return value.state == ZoneAvailableState.Scheduled;
                        });
                        if (statusIndex == -1) {
                            statusIndex = infos.findIndex(value => {
                                return (
                                    value.state == ZoneAvailableState.Available
                                );
                            });
                        }
                    }
                }

                res = [infos[statusIndex]];
            }
        }

        return res;
    };

    const onMachineRowPress = id => {
        dispatch(actionTypes.setBox(Flag.CurrentUpdatedMachineId, id));
        navigator.navigate('Main');
    };

    const onUpdatePress = () => {
        updateAllMachinesStatuses();
    };

    const onBackPress = () => {
        navigator.navigate('Main');
    };

    const onAddAMachinePress = () => {
        navigator.navigate('AddDehydrator');
    };

    const onRefresh = () => {
        console.log('onRefresh');
        getUserDetailed({
            uid: identity?.userId,
            flag: Flag.UserInfosReceived,
            force: true,
        });
        updateAllMachinesStatuses();
    };

    const requestStatuses = useSelector(
        (state: AppState) => state.requestStatus,
    );

    const requestData = useMemo(() => {
        return requestStatuses.UserEntity;
    }, [requestStatuses]);

    useEffect(() => {
        if (requestData) {
            if (requestData.status === RequestStatus.LOADING) {
                setRefreshing(true);
            } else if (
                requestData.status === RequestStatus.SUCCESS ||
                requestData.status === RequestStatus.ERROR
            ) {
                setRefreshing(false);
            }
        } else {
            setRefreshing(false);
        }
    }, [requestStatuses]);

    return (
        <BaseScreenLayout
            cleanSocketSubscriptions={false}
            style={{backgroundColor: machinesScreenColors.backgroundColor}}
            containerStyle={{paddingHorizontal: 16}}>
            <View style={{paddingTop: 4, flex: 1}}>
                <Header
                    showBackButton={true}
                    backAction={onBackPress}
                    title={t('select-machine').toUpperCase()}
                    rightButtons={[
                        {
                            type: ViewType.Element,
                            value: (
                                <>
                                    {!statusUpdateCompleted && (
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 40,
                                                height: 40,
                                            }}>
                                            <ActivityIndicator />
                                        </View>
                                    )}
                                </>
                            ),
                        },
                        {
                            type: ViewType.Element,
                            value: (
                                <>
                                    {statusUpdateCompleted &&
                                        DUpdatedImageButton({
                                            source: images.refresh,
                                            imageWidth: 24,
                                            imageHeight: 24,
                                            tintColor:
                                                colors.imageButton.primary
                                                    .content,
                                            onPress: onUpdatePress,
                                            baseStyle: ButtonStyle.Primary,
                                            containerStyle: [
                                                styles.imageButton,
                                                {borderWidth: 0},
                                            ],
                                        })}
                                </>
                            ),
                        },
                        {
                            type: ViewType.ImageButton,
                            value: {
                                source: images.add,
                                imageWidth: 24,
                                imageHeight: 24,
                                tintColor: colors.imageButton.primary.content,
                                onPress: onAddAMachinePress,
                                baseStyle: ButtonStyle.Primary,
                                containerStyle: [
                                    styles.imageButton,
                                    {borderWidth: 0},
                                ],
                            },
                        },
                    ]}
                />
                {machinesCount <= 0 && (
                    <NoDehydratorsView
                        onAddAMachinePress={onAddAMachinePress}
                    />
                )}
                <ScrollView
                    style={{}}
                    contentContainerStyle={{gap: 16, paddingTop: 16}}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    <DActivityIndicator checkEntities={['MachineEntity']} />
                    {machines &&
                        accessedMachines &&
                        accessedMachines.map(machine => {
                            if (machine.id) {
                                let infos: ZoneInfo[] =
                                    machineZoneInfos[machine.id];

                                infos = compressZoneInfos(infos);

                                const model = models[machine.modelId];
                                return (
                                    <View key={machine.id}>
                                        <DMachineRow
                                            key={`row-${machine.id}`}
                                            zoneInfos={infos}
                                            onPress={onMachineRowPress}
                                            machine={machine}
                                            modelInfo={model}
                                        />
                                    </View>
                                );
                            } else {
                                return <View />;
                            }
                        })}
                    {/* <Text
                        style={{
                            paddingVertical: 16,
                            fontSize: 16,
                            fontWeight: 'bold',
                        }}>
                        {t('groups')}
                    </Text> */}
                    <DActivityIndicator checkEntities={'MachineGroupEntity'} />
                    {acl.allow(GRANT.WRITE, 'Machines') &&
                        groups &&
                        accessedGroups
                            .filter(value => {
                                return value.machineIds.length > 0;
                            })
                            .map(group => {
                                return (
                                    <View key={group.id} style={{gap: 16}}>
                                        <View key={group.id} style={{}}>
                                            <Text style={styles.groupTitleText}>
                                                {group.name}
                                            </Text>
                                        </View>
                                        {group.machineIds.map(machineKey => {
                                            const machine =
                                                machines[machineKey];

                                            if (machine && machine.id) {
                                                const model =
                                                    models[machine.modelId];
                                                let infos =
                                                    machineZoneInfos[
                                                        machine.id
                                                    ];
                                                infos =
                                                    compressZoneInfos(infos);
                                                return (
                                                    <DMachineRow
                                                        key={`group-${group.id}-row-${machine.id}`}
                                                        zoneInfos={infos}
                                                        onPress={
                                                            onMachineRowPress
                                                        }
                                                        machine={machine}
                                                        modelInfo={model}
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <View />
                                                    // <Text>{`MACHINE NOT EXiST ${machineKey}`}</Text>
                                                );
                                            }
                                        })}
                                    </View>
                                );
                            })}
                </ScrollView>
                <DSpinner checkEntities={['MachineModelEntity']} />
            </View>
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    sectionText: {
        ...fonts.h2,
        color: machinesScreenColors.sectionText,
    },

    groupTitleText: {
        ...fonts.h2,
        color: machinesScreenColors.groupText,
        lineHeight: undefined,
    },

    imageButton: {
        backgroundColor: colors.imageButton.primary.background,
        width: 40,
        height: 40,
        borderRadius: 100,
    },
});
