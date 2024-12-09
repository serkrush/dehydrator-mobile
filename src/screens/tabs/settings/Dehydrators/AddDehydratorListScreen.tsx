import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import DActivityIndicator from 'src/components/DActivityIndicator';
import DLabel from 'src/components/DLabel';
import DSpinner from 'src/components/DSpinner';
import DText from 'src/components/DText';
import FieldRow from 'src/components/rows/FieldRow';
import Header, {ViewType} from 'src/components/Headers/UpdatedHeader';
import DButton from 'src/components/buttons/DButton';
import FieldWithButton from 'src/components/buttons/FieldWithButton';
import BaseSettingsScreenLayout from 'src/components/layouts/BaseSettingsScreenLayout';
import {ModalAddList} from 'src/components/modals/ModalAddList';
import {AppState, ENTITY, Flag} from 'src/constants';
import {IMachine} from 'src/entities/models/Machine';
import {useActions} from 'src/hooks/useEntity';
import baseStyles from 'src/styles';
import {images} from 'src/theme/images';
import * as actionTypes from 'src/store/actions';
import {colors, families, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import {ButtonStyle} from 'src/components/buttons/DUpdatedImageButton';
import {IMachineGroup} from 'src/entities/models/MachineGroup';
import {IMachineAccess} from 'src/entities/models/MachineAccess';
import {IUserEntity} from 'src/entities/EntityTypes';
import AccessView from 'src/components/AccessView';
import DImageButton from 'src/components/buttons/DImageButton';
import Card from 'src/components/views/Card';
import BaseCardModal from 'src/components/modals/BaseCardModaWithConfirmationField';
import ExclamationView from 'src/components/views/ExclamationView';
import {capitalize} from 'src/utils/capitalize';
import {useAcl} from 'src/hooks/useAcl';
import {GRANT} from '../../../../../acl/types';
import ImageStore from 'src/components/ImageStore';

const viewColors = {
    text: {
        description: palette.midGray,
        descriptionSpan: palette.orange,
    },
};

export default function AddDehydratorListScreen({route}) {
    console.log('route', route.params);
    const mode = route?.params?.mode ?? 'add';
    const excluded = route?.params?.excluded ?? [];
    const onChooseCompletion = route?.params?.onChooseCompletion;

    const {t} = useTranslation();

    const acl = useAcl();

    const deleteConfirmationString = t('delete-confirmation-string');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteString, setDeleteString] = useState('');

    const {deleteMachine} = useActions('MachineEntity');

    const [machineDeleteData, setMachineDeleteData] = useState(
        undefined as undefined | IMachine,
    );

    const onDeleteConfirmPress = () => {
        console.log('onDeleteConfirmPress');
        setDeleteModalVisible(false);
        if (deleteString == deleteConfirmationString) {
            setDeleteString('');
            if (machineDeleteData) {
                deleteMachine({
                    machine: machineDeleteData,
                    checkFlag: Flag.MachineDeleteProcess,
                });
            }
            setMachineDeleteData(undefined);
        } else {
            setDeleteString('');
            Alert.alert(t('invalid-delete-string'));
        }
    };

    const auth = useSelector((state: AppState) => {
        return state.auth;
    });

    const box = useSelector((state: AppState) => {
        return state.box;
    });

    const users = useSelector((state: AppState) => {
        return state.users;
    });

    const userInfosReceived = useMemo(() => {
        if (box) {
            return !!box[Flag.UserInfosReceived];
        }
        return false;
    }, [box]);

    const accesses = useSelector((state: AppState) => {
        return state.access;
    });

    const machines = useSelector((state: AppState) => {
        return state.machines;
    });

    const adminAccessList = useMemo(() => {
        let res: IMachineAccess[] = [];
        let admin = users[auth.identity.userId];
        if (admin) {
            admin?.access?.forEach(key => {
                const access = accesses[key];
                res.push(access);
            });
        }
        return res;
    }, [accesses, auth]);

    const adminAccessedMachines = useMemo(() => {
        let res: {access: IMachineAccess; machine: IMachine}[] = [];
        let admin = users[auth.identity.userId];

        admin?.machines?.forEach(key => {
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

        return res;
    }, [adminAccessList]);

    const availableMachines = useMemo(() => {
        let res: IMachine[] = [];
        Object.keys(machines).forEach(machineKey => {
            if (
                (machines[machineKey].ownerId == auth.identity.userId ||
                    adminAccessedMachines.findIndex(value => {
                        return (
                            value.machine.id == machineKey &&
                            acl.allow(
                                GRANT.ADMIN,
                                `machine_${value.machine.id}`,
                            )
                        );
                    }) != -1) &&
                excluded.findIndex(machineId => {
                    return machineId == machineKey;
                }) == -1
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
    }, [auth, machines, adminAccessedMachines]);

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const config = di.resolve('config');
    const guidLength = config?.publicMachineIdLength ?? 8;

    const dispatch = useDispatch();

    let title = t('machine-list-title'); //.toLowerCase();

    const noMachinesDesc = t('add-no-machine-desc');
    const addMachinesText = t('adding-a-machine');
    const descParts = noMachinesDesc.split(addMachinesText);

    const onAddPress = () => {
        navigator.navigate('AddDehydrator');
    };

    const onEditPress = machine => {
        dispatch(actionTypes.setBox(Flag.CurrentUpdatedMachineId, machine.id));
        navigator.navigate('EditDehydrator');
    };

    const onDeletePress = machine => {
        setMachineDeleteData(machine);
        setDeleteModalVisible(true);
    };

    const models = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE_MODEL];
    });

    const machineRow = (machine: IMachine, isLast) => {
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
                    onPress={() => {
                        if (onChooseCompletion) {
                            onChooseCompletion(machine);
                        }
                    }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 16,
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
                        <Text
                            style={{
                                ...fonts.textSizeM,
                                color: palette.orange,
                                flex: 1,
                            }}>
                            {`${machine.machineName}`}
                            <Text
                                style={{
                                    ...fonts.textSizeM,
                                    color: colors.card.text.additionalContent,
                                }}>
                                {` (${machine.guid.substring(
                                    machine.guid.length - guidLength,
                                )})`}
                            </Text>
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}>
                        {acl.allow(GRANT.ADMIN, `machine_${machine.id}`) && (
                            <DImageButton
                                tintColor={'black'}
                                source={images.cardEdit}
                                height={20}
                                width={20}
                                onPress={() => {
                                    onEditPress(machine);
                                }}
                            />
                        )}

                        {acl.allow(GRANT.ADMIN, `machine_${machine.id}`) && (
                            <DImageButton
                                tintColor={'red'}
                                source={images.delete}
                                height={20}
                                width={20}
                                onPress={() => {
                                    onDeletePress(machine);
                                }}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <BaseScreenLayout style={{backgroundColor: colors.mainBackground}}>
            <View style={{paddingTop: 4, flex: 1}}>
                <Header
                    showBackButton={true}
                    title={title}
                    rightButtons={[
                        {
                            type: ViewType.ImageButton,
                            value: {
                                source: images.add,
                                imageWidth: 24,
                                imageHeight: 24,
                                tintColor: colors.imageButton.primary.content,
                                onPress: onAddPress,
                                baseStyle: ButtonStyle.Primary,
                                containerStyle: [
                                    styles.imageButton,
                                    {borderWidth: 0},
                                ],
                            },
                        },
                    ]}
                />

                {availableMachines.length <= 0 && (
                    <View style={{marginTop: 16}}>
                        <Text style={styles.noMachinesDescription}>
                            {descParts[0]}
                            <Text style={styles.noMachinesDescriptionSpan}>
                                {addMachinesText}
                            </Text>
                            {descParts[1]}
                        </Text>
                    </View>
                )}
                {availableMachines.length > 0 && (
                    <>
                        <View style={{marginTop: 16}}>
                            <Text style={baseStyles.sectionTitle}>
                                {t('machine-list-screen-title')}
                            </Text>
                            <Text style={baseStyles.sectionDescription}>
                                {t('machine-list-screen-description')}
                            </Text>
                        </View>
                        <ScrollView>
                            <Card
                                style={{
                                    paddingVertical: 4,
                                    marginVertical: 20,
                                }}>
                                {availableMachines.map((machine, index) => {
                                    return machineRow(
                                        machine,
                                        index >= availableMachines.length - 1,
                                    );
                                })}
                            </Card>
                        </ScrollView>
                    </>
                )}
            </View>
            <DSpinner
                checkEntities={[
                    'MachineGroupEntity',
                    'MachineEntity',
                    'UserEntity',
                ]}
            />
            {deleteModalVisible && (
                <BaseCardModal
                    imageView={<ExclamationView />}
                    title={t('delete-dehydrator-title')}
                    description={t('delete-dehydrator-message')}
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
                            },
                        },
                    ]}
                />
            )}
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    noMachinesDescription: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 22,
        color: viewColors.text.description,
    },

    noMachinesDescriptionSpan: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 22,
        color: viewColors.text.descriptionSpan,
        textDecorationLine: 'underline',
    },

    imageButton: {
        backgroundColor: colors.imageButton.primary.background,
        width: 60,
        height: 48,
        borderRadius: 100,
    },
});
