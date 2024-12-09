import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import DSpinner from 'src/components/DSpinner';
import Header from 'src/components/Headers/UpdatedHeader';
import ImageStore from 'src/components/ImageStore';
import DImageButton from 'src/components/buttons/DImageButton';
import DUpdatedImageButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedImageButton';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import BaseCardModal from 'src/components/modals/BaseCardModaWithConfirmationField';
import Card from 'src/components/views/Card';
import ExclamationView from 'src/components/views/ExclamationView';
import {
    AppState,
    ENTITY,
    Flag,
    PermissionLevel,
    RequestStatus,
    SettingsOption,
} from 'src/constants';
import {IMachine, MachineType} from 'src/entities/models/Machine';
import {IMachineAccess} from 'src/entities/models/MachineAccess';
import {IMachineGroup} from 'src/entities/models/MachineGroup';
import {useAcl} from 'src/hooks/useAcl';
import {useActions} from 'src/hooks/useEntity';
import * as actionTypes from 'src/store/actions';
import baseStyles from 'src/styles';
import {colors, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {images} from 'src/theme/images';
import {capitalize} from 'src/utils/capitalize';
import {GRANT} from '../../../../../acl/types';
import {RESULTS} from 'react-native-permissions';
import {EPermissionTypes, usePermissions} from 'src/utils/usePermissions';
import {goToSettings} from 'src/utils/helper';
import QRScannerComponent from 'src/components/QRScannerComponent';
import DFlagSpinner from 'src/components/DFlagSpinner';
import {useIdentity} from 'src/hooks/useIdentity';

export default function Dehydrators() {
    const {t} = useTranslation();

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');

    const [refreshing, setRefreshing] = useState(false);

    const deleteConfirmationString = t('delete-confirmation-string');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteString, setDeleteString] = useState('');

    const [machineDeleteData, setMachineDeleteData] = useState(
        undefined as undefined | IMachine,
    );
    const [groupDeleteData, setGroupDeleteData] = useState(
        undefined as undefined | IMachineGroup,
    );
    const [isMachineDelete, setIsMachineDelete] = useState(false);

    const dispatch = useDispatch();

    const {deleteGroup} = useActions('MachineGroupEntity');
    const {getUserDetailed} = useActions('UserEntity');
    const {updateIdentity} = useActions('Identity');
    const {deleteMachineAccess} = useActions('MachineAccessEntity');
    const acl = useAcl();

    useEffect(() => {
        dispatch(actionTypes.clearBox(Flag.ConfirmResetRequested));
        onRefresh();
    }, []);

    const identity = useIdentity();

    const onRefresh = useCallback(
        (force: boolean = false) => {
            updateIdentity({force});
            getUserDetailed({
                uid: identity?.userId,
                flag: Flag.UserInfosReceived,
                force,
            });
        },
        [identity, getUserDetailed, updateIdentity],
    );

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

    const box = useSelector((state: AppState) => {
        return state.box;
    });

    const machineDeleteProcess = useMemo(() => {
        return box[Flag.MachineDeleteProcess];
    }, [box]);

    const groupDeleteProcess = useMemo(() => {
        return box[Flag.GroupDeleteProcess];
    }, [box]);

    useEffect(() => {
        if (machineDeleteProcess == Flag.ACTION_SUCCESS) {
            console.log('machineDeleteProcess success');
            dispatch(actionTypes.clearBox(Flag.MachineDeleteProcess));
        }
    }, [machineDeleteProcess]);

    useEffect(() => {
        if (groupDeleteProcess == Flag.ACTION_SUCCESS) {
            console.log('groupDeleteProcess success');
            dispatch(actionTypes.clearBox(Flag.GroupDeleteProcess));
        }
    }, [groupDeleteProcess]);

    const users = useSelector((state: AppState) => {
        return state.users;
    });

    const currentUser = useMemo(() => {
        return users[identity.userId];
    }, [users, identity]);

    const accesses = useSelector((state: AppState) => {
        //console.log('access keys', Object.keys(state.access));
        // console.log("values", Object.values(state.access).map((value) => {
        //     return { id: value.id, level: value.permissionLevel, machineId: value.machineId}
        // }))
        return state.access;
    });

    const machines = useSelector((state: AppState) => {
        return state.machines;
    });

    const adminAccessList = useMemo(() => {
        let res: IMachineAccess[] = [];
        if (currentUser) {
            currentUser?.access?.forEach(key => {
                const access = accesses[key];
                res.push(access);
            });
        }
        return res;
    }, [accesses, currentUser]);

    const groups = useSelector((state: AppState) => {
        return state.groups;
    });

    const adminAccessedGroups = useMemo(() => {
        let res: {access: IMachineAccess; group: IMachineGroup}[] = [];
        //console.log('admin', admin);
        if (currentUser) {
            currentUser?.groups?.forEach(key => {
                const index = adminAccessList.findIndex(x => {
                    return x?.machineGroupId == key;
                });
                if (index != -1) {
                    res.push({
                        access: adminAccessList[index],
                        group: {...groups[key]},
                    });
                }
            });
        }
        return res;
    }, [adminAccessList, currentUser]);

    const availableGroups = useMemo(() => {
        let res: IMachineGroup[] = [];
        console.log('adminAccessedGroup');
        Object.keys(groups).forEach(groupKey => {
            if (
                groups[groupKey].creatorId == identity.userId ||
                adminAccessedGroups.findIndex(value => {
                    return value.group.id == groupKey;
                }) != -1
            ) {
                res.push(groups[groupKey]);
            }
        });
        res = res.sort((a, b) => {
            return a.createdAt - b.createdAt;
        });
        return res;
    }, [identity, groups, adminAccessedGroups]);

    const adminAccessedMachines = useMemo(() => {
        let res: {access: IMachineAccess; machine: IMachine}[] = [];

        currentUser?.machines?.forEach(key => {
            const index = adminAccessList.findIndex(x => {
                return x?.machineId == key;
            });
            if (index != -1) {
                res.push({
                    access: adminAccessList[index],
                    machine: {...machines[key]},
                });
            }
        });
        // console.log(
        //     'res',
        //     res.length,
        //     'adminAccessList',
        //     adminAccessList.length,
        //     'admin.machines',
        //     currentUser?.machines,
        // );
        return res;
    }, [adminAccessList, currentUser]);

    const availableMachines = useMemo(() => {
        let res: IMachine[] = [];
        Object.keys(machines).forEach(machineKey => {
            if (
                machines[machineKey].ownerId == identity.userId ||
                adminAccessedMachines.findIndex(value => {
                    return value.machine.id == machineKey;
                }) != -1
            ) {
                res.push(machines[machineKey]);
            }
        });
        res = res.sort((a, b) => {
            return (
                (a.createdAt ?? new Date().getTime()) -
                (b.createdAt ?? new Date().getTime())
            );
        });
        return res;
    }, [identity, machines, adminAccessedMachines]);

    const availableDehydrators = useMemo(() => {
        return availableMachines.filter(value => {
            return value.machineType == MachineType.Dehydrator;
        });
    }, [availableMachines]);

    const groupRow = (group, permissionLevel, isLast) => {
        return (
            <View
                style={[
                    isLast
                        ? {}
                        : {
                              borderBottomWidth: 1,
                              borderBottomColor: colors.card.base.border,
                          },
                ]}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 16,
                    }}
                    activeOpacity={0.4}
                    onPress={() => {
                        if (
                            !acl.allow(GRANT.ADMIN, `group_${group?.id}`) &&
                            acl.allow(GRANT.VIEWER, `group_${group?.id}`)
                        ) {
                            onGroupViewPress(group);
                        } else if (
                            acl.allow(GRANT.ADMIN, `group_${group?.id}`)
                        ) {
                            onGroupEditPress(group);
                        }
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}>
                        <View style={{gap: 4}}>
                            <Text
                                style={{
                                    ...fonts.textSizeM,
                                    color: palette.orange,
                                }}>
                                {group.name} ({group?.machineIds?.length ?? 0})
                            </Text>
                            {permissionLevel != undefined && (
                                <Text
                                    style={{
                                        ...fonts.textSizeM,
                                        color: colors.card.text
                                            .additionalContent,
                                    }}>
                                    {t(`permissions_${permissionLevel}`)}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}>
                        {!acl.allow(GRANT.ADMIN, `group_${group?.id}`) &&
                            acl.allow(GRANT.VIEWER, `group_${group?.id}`) && (
                                <DImageButton
                                    tintColor={'black'}
                                    source={images.arrows.right}
                                    height={20}
                                    width={20}
                                    onPress={() => {
                                        onGroupViewPress(group);
                                    }}
                                />
                            )}
                        {acl.allow(GRANT.ADMIN, `group_${group?.id}`) && (
                            <DImageButton
                                tintColor={'black'}
                                source={images.cardEdit}
                                height={20}
                                width={20}
                                onPress={() => {
                                    onGroupEditPress(group);
                                }}
                            />
                        )}

                        {acl.allow(GRANT.ADMIN, `group_${group?.id}`) && (
                            <DImageButton
                                tintColor={'red'}
                                source={images.delete}
                                height={20}
                                width={20}
                                onPress={() => {
                                    onGroupDeletePress(group);
                                }}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const highestPermissionsForMachine = (machine: IMachine) => {
        const accessValues = adminAccessList.filter(access => {
            return access.machineId == machine.id;
        });
        if (accessValues.length == 0) {
            return undefined;
        }
        const permissionOrder = Object.values(PermissionLevel);
        return accessValues.sort(
            (a, b) =>
                permissionOrder.indexOf(a.permissionLevel) -
                permissionOrder.indexOf(b.permissionLevel),
        )[0].permissionLevel;
    };

    const highestPermissionsForGroup = (group: IMachineGroup) => {
        const accessValues = adminAccessList.filter(access => {
            return access.machineGroupId == group.id;
        });
        if (accessValues.length == 0) {
            return undefined;
        }
        const permissionOrder = Object.values(PermissionLevel);
        return accessValues.sort(
            (a, b) =>
                permissionOrder.indexOf(a.permissionLevel) -
                permissionOrder.indexOf(b.permissionLevel),
        )[0].permissionLevel;
    };
    const models = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE_MODEL];
    });
    const machineRow = (machine: IMachine, permissionLevel, isLast) => {
        const model = machine.modelId
            ? models[machine.modelId] ?? models[machine.modelId.toLowerCase()]
            : undefined;
        let image = '';
        if (model && model.mediaResources) {
            image = model.mediaResources;
        }
        return (
            <View
                style={[
                    isLast
                        ? {}
                        : {
                              borderBottomWidth: 1,
                              borderBottomColor: colors.card.base.border,
                          },
                ]}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 16,
                    }}
                    activeOpacity={0.4}
                    disabled={!acl.allow(GRANT.ADMIN, `machine_${machine.id}`)}
                    onPress={() => {
                        if (acl.allow(GRANT.ADMIN, `machine_${machine.id}`)) {
                            onMachineEditPress(machine);
                        }
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                            flex: 1,
                            paddingRight: 10,
                        }}>
                        <View>
                            <ImageStore
                                folder={`models/${model.model.toLowerCase()}`}
                                name={image}
                                style={{
                                    backgroundColor: palette.gray,
                                    height: 48,
                                    width: 50,
                                    borderRadius: 8,
                                }}
                            />
                        </View>
                        <View style={{flex: 1, gap: 4}}>
                            <Text
                                style={{
                                    ...fonts.textSizeM,
                                    color: palette.orange,
                                }}>
                                {`${machine.machineName}`}
                            </Text>
                            {permissionLevel != undefined && (
                                <Text
                                    style={{
                                        ...fonts.textSizeM,
                                        color: colors.card.text
                                            .additionalContent,
                                    }}>
                                    {t(`permissions_${permissionLevel}`)}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}>
                        {acl.allow(GRANT.ADMIN, `machine_${machine?.id}`) && (
                            <DImageButton
                                tintColor={'black'}
                                source={images.cardEdit}
                                height={20}
                                width={20}
                                onPress={() => {
                                    onMachineEditPress(machine);
                                }}
                            />
                        )}
                        {acl.allow(GRANT.ADMIN, `machine_${machine?.id}`) && (
                            <DImageButton
                                tintColor={'red'}
                                source={images.delete}
                                height={20}
                                width={20}
                                onPress={() => {
                                    onMachineDeletePress(machine);
                                }}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const {resetConnected} = useActions('MachineEntity');

    const [cameraShown, setCameraShown] = useState(false);

    const isUidString = value => {
        const uuidString =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const res = uuidString.test(value);
        console.log(value, 'isUidString', res);
        return res;
    };

    const handleReadCode = (value: string) => {
        if (isUidString(value)) {
            console.log('onScanQR SCANNED DATA', value);
            if (machineDeleteData?.guid == value) {
                resetConnected({
                    machineGuid: value,
                    checkFlag: Flag.MachineDeleteProcess,
                });
                setMachineDeleteData(undefined);
            } else {
                Alert.alert(t('guid not match'));
            }
        } else {
            Alert.alert(t('invalid data'));
        }
    };

    const {askPermissions} = usePermissions(EPermissionTypes.CAMERA);
    const takePermissions = async () => {
        askPermissions()
            .then(response => {
                //permission given for camera
                if (
                    response.type === RESULTS.LIMITED ||
                    response.type === RESULTS.GRANTED
                ) {
                    setCameraShown(true);
                }
            })
            .catch(error => {
                //permission is denied/blocked or camera feature not supported
                if ('isError' in error && error.isError) {
                    Alert.alert(
                        t(error.errorMessage) ||
                            t(
                                'Something went wrong while taking camera permission',
                            ),
                    );
                }
                if ('type' in error) {
                    if (error.type === RESULTS.UNAVAILABLE) {
                        Alert.alert(
                            t('This feature is not supported on this device'),
                        );
                    } else if (
                        error.type === RESULTS.BLOCKED ||
                        error.type === RESULTS.DENIED
                    ) {
                        Alert.alert(
                            t('Permission Denied'),
                            t(
                                'Please give permission from settings to continue using camera.',
                            ),
                            [
                                {
                                    text: t('cancel'),
                                    onPress: () =>
                                        console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                {
                                    text: t('Go To Settings'),
                                    onPress: () => goToSettings(),
                                },
                            ],
                        );
                    }
                }
            });
    };

    const onDeleteConfirmPress = () => {
        console.log('onDeleteConfirmPress');
        setDeleteModalVisible(false);
        if (deleteString == deleteConfirmationString) {
            setDeleteString('');
            if (isMachineDelete && machineDeleteData) {
                // deleteMachine({
                //     machine: machineDeleteData,
                //     checkFlag: Flag.MachineDeleteProcess,
                // });
                deleteMachineAccess({
                    userId: identity.userId,
                    machineId: machineDeleteData.id,
                    checkFlag: Flag.MachineDeleteProcess,
                });
                onRefresh(true);
                setMachineDeleteData(undefined);
            } else if (groupDeleteData) {
                deleteGroup({
                    data: groupDeleteData,
                    checkFlag: Flag.GroupDeleteProcess,
                });
                setGroupDeleteData(undefined);
            }
        } else {
            setDeleteString('');
            Alert.alert(t('invalid-delete-string'));
        }
    };

    const onMachineDeletePress = machine => {
        if (acl.allow(GRANT.EXECUTE)) {
            setMachineDeleteData(machine);
            takePermissions();
        } else if (acl.allow(GRANT.READ)) {
            setDeleteModalVisible(true);
            setMachineDeleteData(machine);
            setIsMachineDelete(true);
        }
    };

    const onGroupDeletePress = group => {
        setDeleteModalVisible(true);
        setGroupDeleteData(group);
        setIsMachineDelete(false);
    };

    const onMachineEditPress = machine => {
        navigator.navigate('EditDehydrator', {machineId: machine.id});
    };

    const onGroupEditPress = group => {
        dispatch(actionTypes.setBox(Flag.CurrentUpdatedGroupId, group.id));
        navigator.navigate('GroupScreen', {mode: 'edit', groupId: group.id});
    };

    const onGroupViewPress = group => {
        dispatch(actionTypes.setBox(Flag.CurrentUpdatedGroupId, group.id));
        navigator.navigate('GroupScreen', {mode: 'view', groupId: group.id});
    };

    const onAddMachinePress = () => {
        navigator.navigate('AddDehydrator');
    };

    const onAddGroupPress = () => {
        dispatch(actionTypes.clearBox(Flag.CurrentUpdatedGroupId));
        navigator.navigate('GroupScreen', {mode: 'add'});
    };

    return (
        <>
            <BaseScreenLayout style={{backgroundColor: colors.mainBackground}}>
                <View style={{paddingTop: 4, flex: 1}}>
                    <Header
                        title={t(SettingsOption.MyMachines)}
                        showBackButton={true}
                    />
                    <ScrollView
                        contentContainerStyle={{
                            paddingBottom: 20,
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => onRefresh(true)}
                            />
                        }>
                        <View
                            style={{
                                flex: 1,
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                }}>
                                {availableDehydrators && (
                                    <>
                                        <View
                                            style={{
                                                marginTop: 16,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}>
                                            <View>
                                                <Text
                                                    style={
                                                        baseStyles.sectionTitle
                                                    }>
                                                    {t(
                                                        'current-dehydrators-title',
                                                    )}
                                                </Text>
                                                <Text
                                                    style={
                                                        baseStyles.sectionDescription
                                                    }>
                                                    {t(
                                                        'current-dehydrators-description',
                                                    )}
                                                </Text>
                                            </View>
                                            <DUpdatedImageButton
                                                source={images.add}
                                                imageWidth={24}
                                                imageHeight={24}
                                                tintColor={
                                                    colors.imageButton.primary
                                                        .content
                                                }
                                                onPress={onAddMachinePress}
                                                baseStyle={ButtonStyle.Primary}
                                                containerStyle={[
                                                    styles.imageButton,
                                                    {borderWidth: 0},
                                                ]}
                                            />
                                        </View>
                                        <ScrollView>
                                            {availableDehydrators.length >
                                                0 && (
                                                <Card
                                                    style={{
                                                        paddingVertical: 4,
                                                        marginVertical: 20,
                                                    }}>
                                                    {availableDehydrators.map(
                                                        (machine, index) => {
                                                            return machineRow(
                                                                machine,
                                                                highestPermissionsForMachine(
                                                                    machine,
                                                                ),
                                                                index >=
                                                                    availableDehydrators.length -
                                                                        1,
                                                            );
                                                        },
                                                    )}
                                                </Card>
                                            )}
                                        </ScrollView>
                                    </>
                                )}

                                {availableGroups && (
                                    <>
                                        <View
                                            style={{
                                                marginTop: 16,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}>
                                            <View>
                                                <Text
                                                    style={
                                                        baseStyles.sectionTitle
                                                    }>
                                                    {t('current-groups-title')}
                                                </Text>
                                                <Text
                                                    style={
                                                        baseStyles.sectionDescription
                                                    }>
                                                    {t(
                                                        'current-groups-description',
                                                    )}
                                                </Text>
                                            </View>
                                            <DUpdatedImageButton
                                                source={images.add}
                                                imageWidth={24}
                                                imageHeight={24}
                                                tintColor={
                                                    colors.imageButton.primary
                                                        .content
                                                }
                                                onPress={onAddGroupPress}
                                                baseStyle={ButtonStyle.Primary}
                                                containerStyle={[
                                                    styles.imageButton,
                                                    {borderWidth: 0},
                                                ]}
                                            />
                                        </View>
                                        <ScrollView>
                                            {availableGroups.length > 0 && (
                                                <Card
                                                    style={{
                                                        paddingVertical: 4,
                                                        marginVertical: 20,
                                                    }}>
                                                    {availableGroups.map(
                                                        (group, index) => {
                                                            return groupRow(
                                                                group,
                                                                highestPermissionsForGroup(
                                                                    group,
                                                                ),
                                                                index >=
                                                                    availableGroups.length -
                                                                        1,
                                                            );
                                                        },
                                                    )}
                                                </Card>
                                            )}
                                        </ScrollView>
                                    </>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </View>
                {deleteModalVisible && (
                    <BaseCardModal
                        imageView={<ExclamationView />}
                        title={
                            isMachineDelete
                                ? t('delete-dehydrator-title')
                                : t('delete-dehydrator-group-title')
                        }
                        description={
                            isMachineDelete
                                ? t('delete-dehydrator-message')
                                : t('delete-dehydrator-group-message')
                        }
                        fieldValue={deleteString}
                        fieldSetValue={setDeleteString}
                        fieldTitle={capitalize(t('confirmation'))}
                        actionRows={[
                            {
                                text: t('delete'),
                                baseStyle: ButtonStyle.Destructive,
                                onPress: onDeleteConfirmPress,
                            },
                            {
                                text: t('cancel'),
                                baseStyle: ButtonStyle.Outlined,
                                onPress: () => {
                                    setDeleteString('');
                                    setDeleteModalVisible(false);
                                    setMachineDeleteData(undefined);
                                    setGroupDeleteData(undefined);
                                },
                            },
                        ]}
                    />
                )}
                <DSpinner
                    checkEntities={[
                        'MachineEntity',
                        'MachineGroupEntity',
                        'MachineAccessEntity',
                    ]}
                />

                <DFlagSpinner checkFlags={Flag.ConfirmResetRequested} />
            </BaseScreenLayout>
            <QRScannerComponent
                cameraShown={cameraShown}
                setCameraShown={setCameraShown}
                handleReadCode={handleReadCode}
            />
        </>
    );
}

const styles = StyleSheet.create({
    imageButton: {
        backgroundColor: colors.imageButton.primary.background,
        width: 40,
        height: 40,
        borderRadius: 100,
    },
});
