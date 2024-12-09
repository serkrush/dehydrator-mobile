import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {connect} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import AccessView from 'src/components/AccessView';
import DSpinner from 'src/components/DSpinner';
import Header, {ViewType} from 'src/components/Headers/UpdatedHeader';
import {ModalAddList} from 'src/components/modals/ModalAddList';
import {
    AppState,
    ENTITY,
    Flag,
    PermissionLevel,
    ProfileData,
    superAdminLevels,
} from 'src/constants';
import {IMachine} from 'src/entities/models/Machine';
import {IMachineAccess} from 'src/entities/models/MachineAccess';
import {IMachineGroup} from 'src/entities/models/MachineGroup';
import {useActions} from 'src/hooks/useEntity';
import {colors, families, fonts} from 'src/theme';
import dataFunc from 'src/utils/dropdownDataFunc';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import Card from 'src/components/views/Card';
import BaseTitleInputRow from 'src/components/rows/BaseTitleInputRow';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import {images} from 'src/theme/images';
import {capitalizeEachWord} from 'src/utils/capitalizeEachWord';

import {useDispatch, useSelector} from 'react-redux';
import * as actionTypes from 'src/store/actions';
import {IUserEntity} from 'src/entities/EntityTypes';
import baseStyles from 'src/styles';
import {useFormik} from 'formik';
import Input from 'src/Form/Input';
import BaseCardModal from 'src/components/modals/BaseCardModaWithConfirmationField';
import ExclamationView from 'src/components/views/ExclamationView';
import {capitalize} from 'src/utils/capitalize';

export default function UpdateUserPermissions({route}) {
    const auth = useSelector((state: AppState) => {
        return state.auth;
    });

    const box = useSelector((state: AppState) => {
        return state.box;
    });

    const users = useSelector((state: AppState) => {
        return state.users;
    });

    const currentUser = useMemo(() => {
        let res = undefined as IUserEntity | undefined;
        if (box[Flag.CurrentUpdatedUserId]) {
            res = users[box[Flag.CurrentUpdatedUserId]];
        }

        return res;
    }, [users, box]);

    const userInfosReceived = useMemo(() => {
        if (box) {
            return !!box[Flag.UserInfosReceived];
        }
        return false;
    }, [box]);

    const accesses = useSelector((state: AppState) => {
        return state.access;
    });

    const groups = useSelector((state: AppState) => {
        return state.groups;
    });

    const machines = useSelector((state: AppState) => {
        return state.machines;
    });

    const accessList = useMemo(() => {
        let res: IMachineAccess[] = [];
        if (currentUser) {
            currentUser?.access?.forEach(key => {
                const access = accesses[key];
                res.push(access);
            });
        }
        return res;
    }, [currentUser, accesses]);

    const accessedMachines = useMemo(() => {
        let res: {access: IMachineAccess; machine: IMachine}[] = [];

        currentUser?.machines?.forEach(key => {
            const index = accessList.findIndex(x => {
                return x?.machineId == key;
            });
            if (index != -1) {
                res.push({
                    access: accessList[index],
                    machine: {...machines[key]},
                });
            }
        });

        return res;
    }, [accessList]);

    const accessedGroups = useMemo(() => {
        let res: {access: IMachineAccess; group: IMachineGroup}[] = [];

        if (currentUser) {
            currentUser?.groups?.forEach(key => {
                const index = accessList.findIndex(x => {
                    return x?.machineGroupId == key;
                });
                if (index != -1) {
                    res.push({
                        access: accessList[index],
                        group: {...groups[key]},
                    });
                }
            });
        }

        return res;
    }, [accessList]);

    const availableGroups = useMemo(() => {
        let res: IMachineGroup[] = [];
        Object.keys(groups).forEach(groupKey => {
            if (groups[groupKey].creatorId == auth.identity.userId) {
                res.push(groups[groupKey]);
            }
        });
        res = res.sort((a, b) => {
            return a.createdAt - b.createdAt;
        });
        return res;
    }, [auth, groups]);

    const availableMachines = useMemo(() => {
        let res: IMachine[] = [];
        Object.keys(machines).forEach(machineKey => {
            if (machines[machineKey].ownerId == auth.identity.userId) {
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
    }, [auth, groups]);

    const getNewMachines = () => {
        let res = [] as IMachine[];
        (currentAvailableMachines as IMachine[]).forEach(deh => {
            if (
                currentAccessedMachines.findIndex(accessPair => {
                    return accessPair.access.machineId == deh.id;
                }) == -1
            ) {
                res.push(deh);
            }
        });
        return res;
    };
    const getNewGroups = () => {
        let res = [] as IMachineGroup[];
        (currentAvailableGroups as IMachineGroup[]).forEach(group => {
            if (
                currentAccessedGroups.findIndex(accessPair => {
                    return accessPair.access.machineGroupId == group.id;
                }) == -1
            ) {
                res.push(group);
            }
        });
        return res;
    };

    const mode = route?.params?.mode;
    const titleCode = mode == 'add' ? 'add-user-title' : 'update-permissions';
    const data = dataFunc(superAdminLevels, 'permissions');

    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const config = di.resolve('config');
    const guidLength = config?.publicMachineIdLength ?? 8;

    const dispatch = useDispatch();

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteString, setDeleteString] = useState('');
    const deleteConfirmationString = t('delete-confirmation-string');

    const {
        updatePermission,
        getUserDetailed,
        getCurrentUserDetailed,
        sendIviteForNewUser,
        deleteUser,
    } = useActions('UserEntity');

    const initValues = useMemo(() => {
        return {
            firstName: currentUser?.firstName,
            lastName: currentUser?.lastName,
            email: currentUser?.email,
        };
    }, [currentUser]);

    const formik = useFormik({
        initialValues: initValues,
        validate: (values: ProfileData) => {
            const errors: Partial<ProfileData> = {};
            if (!values.firstName || values.firstName == '') {
                errors.firstName = t('required');
            }

            if (!values.lastName || values.lastName == '') {
                errors.lastName = t('required');
            }

            if (!values.email || values.email == '') {
                errors.email = t('required');
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
                errors.email = t('invalid-email');
            }

            return errors;
        },
        onSubmit: values => {
            console.log('onSubmit values', values);
            switch (mode) {
                case 'add':
                    sendIviteForNewUser({
                        receiverFirstName: values.firstName,
                        receiverLastName: values.lastName,
                        receiverEmail: values.email,
                        accessData: [
                            ...currentAccessedGroups.map(pair => pair.access),
                            ...currentAccessedMachines.map(pair => pair.access),
                        ],
                    });
                    break;
                case 'update':
                    break;
            }
        },
    });
    const [infosReceived, setInfosReceived] = useState(false);

    const [currentAccessedGroups, setCurrentAccessedGroups] = useState(
        accessedGroups as {access: IMachineAccess; group: IMachineGroup}[],
    );
    const [currentAccessedMachines, setCurrentAccessedMachines] = useState(
        accessedMachines as {access: IMachineAccess; machine: IMachine}[],
    );

    const [currentAvailableGroups, setCurrentAvailableGroups] =
        useState(availableGroups);
    const [currentAvailableMachines, setCurrentAvailableMachines] =
        useState(availableMachines);

    const [newGroups, setNewGroups] = useState(getNewGroups());
    const [newMachines, setNewMachines] = useState(getNewMachines());

    const [showAddMachineList, setShowAddMachineList] = useState(false);
    const [showAddGroupList, setShowAddGroupList] = useState(false);

    useEffect(() => {
        if (auth?.identity?.userId) {
            console.log('currentActiveUserId', auth.identity.userId);
            getCurrentUserDetailed();
        }
        if (currentUser) {
            getUserDetailed({
                uid: currentUser.uid,
                flag: Flag.UserInfosReceived,
            });
        } else {
            setInfosReceived(true);
        }
    }, []);

    useEffect(() => {
        setInfosReceived(userInfosReceived);
        setCurrentAccessedGroups(accessedGroups);
        setCurrentAccessedMachines(accessedMachines);
    }, [userInfosReceived]);

    // useEffect(() => {
    //   setCurrentAccessedGroups(accessedGroups);
    // }, [accessedGroups]);

    // useEffect(() => {
    //   setCurrentAccessedMachines(accessedMachines);
    // }, [accessedMachines]);

    useEffect(() => {
        setCurrentAvailableGroups(availableGroups);
    }, [availableGroups]);

    useEffect(() => {
        setCurrentAvailableMachines(availableMachines);
    }, [availableMachines]);

    const topCardView = readOnly => {
        return (
            <Card style={{borderWidth: 0, marginTop: 20, gap: 24}}>
                <Input
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange('firstName')}
                    required={true}
                    error={formik.errors.firstName as string}
                    label={t('placeholder-first-name')}
                    readOnly={readOnly}
                />
                <Input
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange('lastName')}
                    required={true}
                    error={formik.errors.lastName as string}
                    label={t('placeholder-last-name')}
                    readOnly={readOnly}
                />
                <Input
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange('email')}
                    required={true}
                    error={formik.errors.email as string}
                    label={t('placeholder-email')}
                    readOnly={readOnly}
                />
            </Card>
        );
    };

    const addTopFieldView = topCardView(false);
    const updateTopFieldView = topCardView(true);

    const onCancelPress = () => {
        setCurrentAccessedGroups([...accessedGroups]);
        setCurrentAccessedMachines([...accessedMachines]);
    };

    const onSavePress = () => {
        console.log([
            ...currentAccessedGroups.map(pair => pair.access),
            ...currentAccessedMachines.map(pair => pair.access),
        ]);
        if (currentUser) {
            updatePermission({
                uid: currentUser.uid,
                accessData: [
                    ...currentAccessedGroups.map(pair => pair.access),
                    ...currentAccessedMachines.map(pair => pair.access),
                ],
            });
        }
    };

    const onGroupEditPress = id => {
        dispatch(actionTypes.setBox(Flag.CurrentUpdatedGroupId, id));
        navigator.navigate('GroupScreen', {mode: 'edit', groupId: id});
    };

    const onMachineEditPress = id => {
        //dispatch(actionTypes.setBox(Flag.CurrentUpdatedMachineId, id));
        navigator.navigate('EditDehydrator', {machineId: id});
    };

    const onGroupPermissionChange = (group, value) => {
        let res = [...currentAccessedGroups];
        const index = res.findIndex(accessPair => {
            return accessPair.access.machineGroupId == group.id;
        });
        if (index > -1) {
            res[index] = {
                ...res[index],
                access: {
                    ...res[index].access,
                    permissionLevel: value,
                },
            };
        }
        setCurrentAccessedGroups(res);
    };

    const onMachinePermissionChange = (machine, value) => {
        let res = [...currentAccessedMachines];
        const index = res.findIndex(accessPair => {
            return accessPair.access.machineId == machine.id;
        });
        if (index > -1) {
            res[index] = {
                ...res[index],
                access: {
                    ...res[index].access,
                    permissionLevel: value,
                },
            };
        }
        setCurrentAccessedMachines(res);
    };

    const onGroupDeletePress = group => {
        let res = [...currentAccessedGroups];
        const index = currentAccessedGroups.findIndex(accessPair => {
            return accessPair.access.machineGroupId == group.id;
        });
        if (index > -1) {
            res.splice(index, 1);
        }
        setCurrentAccessedGroups(res);
    };

    const onMachineDeletePress = machine => {
        let res = [...currentAccessedMachines];
        const index = currentAccessedMachines.findIndex(accessPair => {
            return accessPair.access.machineId == machine.id;
        });
        if (index > -1) {
            res.splice(index, 1);
        }
        setCurrentAccessedMachines(res);
    };

    const onAddGroupPress = () => {
        navigator.navigate('GroupsListScreen', {
            excluded: currentAccessedGroups.map(value => {
                return value.group.id;
            }),
            onChooseCompletion: group => {
                navigator.pop();
                onGroupPress(group);
            },
        });
        // setNewGroups(getNewGroups());
        // setShowAddGroupList(true);
    };

    const onAddMachinePress = () => {
        navigator.navigate('AddDehydratorListScreen', {
            excluded: currentAccessedMachines.map(value => {
                return value.machine.id;
            }),
            onChooseCompletion: machine => {
                navigator.pop();
                onMachinePress(machine);
            },
        });
        // setNewMachines(getNewMachines());
        // setShowAddMachineList(true);
    };

    const onGroupPress = group => {
        const res = [...currentAccessedGroups];
        res.push({
            access: {
                userId: currentUser?.uid ?? '',
                permissionLevel: PermissionLevel.Viewer,
                id: '',
                machineGroupId: group.id,
            },
            group,
        });
        setCurrentAccessedGroups(res);
    };

    const onMachinePress = machine => {
        const res = [...currentAccessedMachines];
        res.push({
            access: {
                userId: currentUser?.uid ?? '',
                permissionLevel: PermissionLevel.Viewer,
                id: '',
                machineId: machine.id,
            },
            machine,
        });
        setCurrentAccessedMachines(res);
    };

    // const onSendInvitePress = () => {
    //     sendIviteForNewUser({
    //         receiverFirstName: firstName,
    //         receiverLastName: lastName,
    //         receiverEmail: email,
    //         accessData: [
    //             ...currentAccessedGroups.map(pair => pair.access),
    //             ...currentAccessedMachines.map(pair => pair.access),
    //         ],
    //     });
    // };

    const onDeleteConfirmPress = () => {
        if (deleteString == deleteConfirmationString && currentUser.uid) {
            deleteUser({
                uid: currentUser.uid,
                checkFlag: Flag.UserDeleteProcess,
            });
            setDeleteModalVisible(false);
            setDeleteString('');
            navigator.replace('UpdateUserPermissionsList');
        } else {
            setDeleteString('');
            Alert.alert(t('invalid-delete-string'));
        }
    };

    return (
        <BaseScreenLayout style={{backgroundColor: colors.mainBackground}}>
            <View style={{paddingTop: 4, flex: 1}}>
                <Header
                    showBackButton={true}
                    title={t(titleCode)}
                    rightButtons={
                        mode === 'add'
                            ? []
                            : [
                                {
                                    type: ViewType.ImageButton,
                                    value: {
                                        source: images.delete,
                                        imageWidth: 24,
                                        imageHeight: 24,
                                        tintColor:
                                              colors.imageButton.destructive
                                                  .content,
                                        onPress: () => {
                                            setDeleteModalVisible(true);
                                        },
                                        baseStyle: ButtonStyle.Destructive,
                                        containerStyle: [
                                            {width: 40, height: 40},
                                        ],
                                    },
                                },
                            ]
                    }
                />
                <ScrollView style={{}}>
                    <View style={{marginTop: 16}}>
                        <Text style={baseStyles.sectionTitle}>
                            {t('update-permissions-title')}
                        </Text>
                        <Text style={baseStyles.sectionDescription}>
                            {t('update-permissions-description')}
                        </Text>
                    </View>

                    {mode == 'add' && addTopFieldView}
                    {mode == 'update' && updateTopFieldView}
                    <View
                        style={{
                            width: '100%',
                            marginTop: 32,
                        }}>
                        <View>
                            <Text style={baseStyles.sectionTitle}>
                                {t('accessible-groups-title')}
                            </Text>
                            <Text style={baseStyles.sectionDescription}>
                                {t('accessible-groups-description')}
                            </Text>
                        </View>
                        <Card
                            style={{
                                marginTop: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 4,
                            }}>
                            {currentUser != undefined && !infosReceived && (
                                <ActivityIndicator />
                            )}
                            {currentAccessedGroups.map((accessPair, index) => {
                                return (
                                    <AccessView
                                        key={accessPair.group.id}
                                        access={accessPair.access}
                                        resource={accessPair.group}
                                        resourceLabel={accessPair.group.name}
                                        accessiblePermissions={data}
                                        onDeletePress={onGroupDeletePress}
                                        onPermissionChange={
                                            onGroupPermissionChange
                                        }
                                        isLast={
                                            index >=
                                            currentAccessedGroups.length - 1
                                        }
                                        onEditPress={item => {
                                            onGroupEditPress(item.id);
                                        }}
                                    />
                                );
                            })}

                            <DUpdatedButton
                                baseStyle={ButtonStyle.Alternative}
                                containerStyle={{
                                    borderWidth: 0,
                                    width: '100%',
                                    marginTop:
                                        currentAccessedGroups.length > 0
                                            ? 4
                                            : 16,
                                    marginBottom: 16,
                                }}
                                text={capitalizeEachWord(t('add-group'))}
                                source={images.add}
                                reverse={true}
                                onPress={onAddGroupPress}
                            />
                        </Card>

                        <View style={{marginTop: 32}}>
                            <Text style={baseStyles.sectionTitle}>
                                {t('accessible-dehydrators-title')}
                            </Text>
                            <Text style={baseStyles.sectionDescription}>
                                {t('accessible-dehydrators-description')}
                            </Text>
                        </View>
                        <Card
                            style={{
                                marginTop: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 4,
                            }}>
                            {currentUser != undefined && !infosReceived && (
                                <ActivityIndicator />
                            )}
                            {currentAccessedMachines.map(
                                (accessPair, index) => {
                                    console.log(accessPair);
                                    let machineName =
                                        accessPair.machine.machineName;
                                    if (machineName.length > 21) {
                                        machineName = `${machineName.substring(
                                            0,
                                            6,
                                        )} ... ${machineName.substring(
                                            machineName.length - 6,
                                        )}`;
                                    }
                                    return (
                                        <AccessView
                                            key={accessPair.machine.id}
                                            access={accessPair.access}
                                            resource={accessPair.machine}
                                            resourceLabel={
                                                machineName +
                                                ` (${accessPair.machine.guid.substring(
                                                    accessPair.machine.guid
                                                        .length - guidLength,
                                                )})`
                                            }
                                            modelId={accessPair.machine.modelId}
                                            imageSource={
                                                images.dehydrators.dehydrator
                                            }
                                            accessiblePermissions={data}
                                            onDeletePress={onMachineDeletePress}
                                            onPermissionChange={
                                                onMachinePermissionChange
                                            }
                                            isLast={
                                                index >=
                                                currentAccessedMachines.length -
                                                    1
                                            }
                                            onEditPress={item => {
                                                onMachineEditPress(item.id);
                                            }}
                                        />
                                    );
                                },
                            )}
                            <DUpdatedButton
                                baseStyle={ButtonStyle.Alternative}
                                containerStyle={{
                                    borderWidth: 0,
                                    width: '100%',
                                    marginTop:
                                        currentAccessedMachines.length > 0
                                            ? 4
                                            : 16,
                                    marginBottom: 16,
                                }}
                                text={capitalizeEachWord(t('add-dehydrator'))}
                                source={images.add}
                                reverse={true}
                                onPress={onAddMachinePress}
                            />
                        </Card>
                    </View>
                </ScrollView>
                <View
                    style={{
                        width: '100%',
                        paddingVertical: 16,
                    }}>
                    {mode == 'add' && (
                        <>
                            <DUpdatedButton
                                text={t('send-invite')}
                                baseStyle={ButtonStyle.Primary}
                                onPress={formik.handleSubmit}
                            />
                        </>
                    )}
                    {/* {mode == 'update' && (
                        <View style={{gap: 8}}>
                            <DUpdatedButton
                                baseStyle={ButtonStyle.Destructive}
                                text={capitalizeEachWord(
                                    t('delete-acc').toLowerCase(),
                                )}
                                onPress={onDeletePress}
                            />
                            <View style={{gap: 8, flexDirection: 'row'}}>
                                <DUpdatedButton
                                    baseStyle={ButtonStyle.Primary}
                                    text={t('save')}
                                    onPress={onSavePress}
                                    containerStyle={{flex: 1}}
                                />
                                <DUpdatedButton
                                    baseStyle={ButtonStyle.Outlined}
                                    text={t('cancel')}
                                    onPress={onCancelPress}
                                    containerStyle={{ flex: 1}}
                                />
                            </View>
                        </View>
                    )} */}
                    {mode == 'update' && (
                        <View style={{gap: 8}}>
                            <DUpdatedButton
                                baseStyle={ButtonStyle.Primary}
                                text={t('save')}
                                onPress={onSavePress}
                            />
                            <DUpdatedButton
                                baseStyle={ButtonStyle.Outlined}
                                text={t('cancel')}
                                onPress={onCancelPress}
                            />
                        </View>
                    )}
                </View>

                <DSpinner checkEntities={'UserEntity'} />
            </View>
            {showAddMachineList && (
                <ModalAddList
                    title={t('dehydrators')}
                    setShowAddList={setShowAddMachineList}
                    list={newMachines}
                    onItemPress={onMachinePress}
                    itemKey={'guid'}
                    itemLabelKey={'machineName'}
                    indicator={false}
                />
            )}
            {showAddGroupList && (
                <ModalAddList
                    title={t('groups')}
                    setShowAddList={setShowAddGroupList}
                    list={newGroups}
                    onItemPress={onGroupPress}
                    itemKey={'id'}
                    itemLabelKey={'name'}
                    indicator={false}
                />
            )}
            {deleteModalVisible && (
                <BaseCardModal
                    imageView={<ExclamationView />}
                    title={t('delete-user-permissions-title')}
                    description={t('delete-user-permissions-message')}
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
                            },
                        },
                    ]}
                />
            )}
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({});
