import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
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
import {ModalAddList} from 'src/components/modals/ModalAddList';
import {AppState, ENTITY, Flag} from 'src/constants';
import {IMachine} from 'src/entities/models/Machine';
import {useActions} from 'src/hooks/useEntity';
import baseStyles from 'src/styles';
//import {families} from 'src/theme/fonts';
import {useFormik} from 'formik';
import Input from 'src/Form/Input';
import ImageStore from 'src/components/ImageStore';
import DImageButton from 'src/components/buttons/DImageButton';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import Card from 'src/components/views/Card';
import {useAcl} from 'src/hooks/useAcl';
import * as actionTypes from 'src/store/actions';
import {colors, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {images} from 'src/theme/images';
import {GRANT} from '../../../../../acl/types';

export default function GroupScreen({route}) {
    const getNewDehydrators = () => {
        let res = [] as IMachine[];
        (currentAvailableDehydrators as IMachine[]).forEach(deh => {
            if (!currentGroupDehydrators.includes(deh)) {
                res.push(deh);
            }
        });
        return res;
    };

    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const config = di.resolve('config');
    const guidLength = config?.publicMachineIdLength ?? 8;

    const dispatch = useDispatch();

    const mode = route.params.mode ?? 'add';
    const groupId = route?.params?.groupId;

    const identity = useSelector((state: AppState) => state.auth.identity);
    const machines = useSelector((state: AppState) => state.machines);

    const acl = useAcl();

    const box = useSelector((state: AppState) => {
        return state.box;
    });

    const groups = useSelector((state: AppState) => {
        return state.groups;
    });

    const currentGroupId = useMemo(() => {
        return groupId ?? box[Flag.CurrentUpdatedGroupId];
    }, [box]);

    const group = useMemo(() => {
        return groups[currentGroupId];
    }, [currentGroupId, groups]);

    const initValues = useMemo(() => {
        return {
            name: group?.name,
        };
    }, [group]);

    const formik = useFormik({
        initialValues: initValues,
        validate: values => {
            const errors: Partial<{name: string}> = {};
            if (!values.name || values.name == '') {
                errors.name = t('required');
            }

            return errors;
        },
        onSubmit: values => {
            console.log('onSubmit values', values);
            if (currentGroup) {
                if (acl.allow(GRANT.ADMIN, `group_${group.id}`)) {
                    updateGroup({
                        data: {
                            ...currentGroup,
                            name: values.name,
                            location,
                            machineIds: currentGroupDehydrators.map(machine => {
                                return machine.id;
                            }),
                            access: undefined,
                        },
                    });
                }
            } else {
                addGroup({
                    data: {
                        name: values.name,
                        location,
                        machineIds: currentGroupDehydrators.map(machine => {
                            return machine.id;
                        }),
                        access: undefined,
                    },
                });
            }
        },
    });

    const process = useSelector(
        (state: AppState) => state.box[Flag.GroupDeleteProcess],
    );

    const groupDehydrators = useMemo(() => {
        console.log('useMemo groupDehydrators');
        const res: IMachine[] = [];
        Object.keys(machines).forEach(machineKey => {
            if (group?.machineIds?.includes(machineKey)) {
                res.push(machines[machineKey]);
            }
        });
        return res;
    }, [machines, group]);

    const availableDehydrators = useMemo(() => {
        const res: IMachine[] = [];
        Object.keys(machines).forEach(machineKey => {
            if (machines[machineKey].ownerId == identity.userId) {
                res.push(machines[machineKey]);
            }
        });
        return res;
    }, [machines, identity]);

    const {addGroup, updateGroup, deleteGroup} =
        useActions('MachineGroupEntity');

    const [currentGroup, setCurrentGroup] = useState(group);
    const [currentGroupDehydrators, setCurrentGroupDehydrators] =
        useState(groupDehydrators);
    const [currentAvailableDehydrators, setCurrentAvailableDehydrators] =
        useState(availableDehydrators);
    const [newDehydrators, setNewDehydrators] = useState(getNewDehydrators());

    const [location, setLocation] = useState(group?.location ?? '');
    const [deleteProcess, setDeleteProcess] = useState(process);
    const [showAddList, setShowAddList] = useState(false);

    let title = mode != undefined ? t(`group-${mode}-title`) : t('group-title');

    useEffect(() => {
        setNewDehydrators(getNewDehydrators());
    }, [currentGroupDehydrators, currentAvailableDehydrators]);

    useEffect(() => {
        setDeleteProcess(process);

        if (process == Flag.ACTION_SUCCESS) {
            afterDelete();
        }
    }, [process]);

    useEffect(() => {
        setCurrentGroup(group);
    }, [group]);

    const onDeletePress = () => {
        deleteGroup({data: currentGroup, checkFlag: Flag.GroupDeleteProcess});
    };

    const afterDelete = () => {
        dispatch(actionTypes.clearBox(Flag.GroupDeleteProcess));
        //clearFlagger({key: Flag.GroupDeleteProcess});
        navigator.pop();
    };

    const onCancelPress = () => {
        formik.resetForm();
        setLocation(currentGroup?.location ?? '');
        setCurrentAvailableDehydrators([...availableDehydrators]);
        setCurrentGroupDehydrators([...groupDehydrators]);
    };

    const onAddDehydratorPress = () => {
        navigator.navigate('AddDehydratorListScreen', {
            excluded: currentGroupDehydrators.map(value => {
                return value.id;
            }),
            onChooseCompletion: machine => {
                navigator.pop();
                onMachinePress(machine);
            },
        });
        return;
    };

    const onDehydratorDeletePress = machine => {
        let res = [...currentGroupDehydrators] as IMachine[];
        const index = res.indexOf(machine, 0);
        if (index > -1) {
            res.splice(index, 1);
        }
        setCurrentGroupDehydrators(res);
    };

    const onMachinePress = machine => {
        const res = [...currentGroupDehydrators];
        res.push(machine);
        setCurrentGroupDehydrators(res);
    };

    const onSharePermissionsPress = () => {
        navigator.navigate('ShareGroupPermission');
    };

    const onMachineEditPress = machine => {
        //dispatch(actionTypes.setBox(Flag.CurrentUpdatedMachineId, machine.id));
        navigator.navigate('EditDehydrator', {machineId: machine.id});
    };

    const onMachineDeletePress = machine => {
        onDehydratorDeletePress(machine);
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
                    activeOpacity={0.4}
                    onPress={() => {
                        if (
                            machine != undefined &&
                            acl.allow(GRANT.ADMIN, `machine_${machine.id}`)
                        ) {
                            onMachineEditPress(machine);
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
                        <View style={styles.imageContainer}>
                            <ImageStore
                                folder={`models/${model.model.toLowerCase()}`}
                                name={image}
                                style={{
                                    backgroundColor: palette.gray,
                                    height: 40,
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
                        {machine != undefined &&
                            acl.allow(GRANT.ADMIN, `machine_${machine.id}`) && (
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

                        {(group == undefined ||
                            acl.allow(GRANT.ADMIN, `group_${group.id}`)) && (
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

    return (
        <BaseScreenLayout style={{backgroundColor: colors.mainBackground}}>
            <View style={{paddingTop: 4, flex: 1}}>
                <Header title={title} showBackButton={true} />
                {mode != 'view' &&
                    (!group?.id ||
                        acl.allow(GRANT.ADMIN, `group_${group?.id}`)) && (
                    <View style={{marginTop: 16}}>
                        <Text style={baseStyles.sectionTitle}>
                            {t('group-screen-title')}
                        </Text>
                        <Text style={baseStyles.sectionDescription}>
                            {t('group-screen-description')}
                        </Text>
                    </View>
                )}
                <ScrollView>
                    <Card style={{marginTop: 20}}>
                        <View
                            style={[
                                currentGroupDehydrators.length > 0
                                    ? {
                                          paddingBottom: 32,
                                          borderBottomWidth: 1,
                                          borderBottomColor:
                                              colors.card.base.border,
                                      }
                                    : {},
                            ]}>
                            <Input
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange('name')}
                                required={true}
                                error={formik.errors.name as string}
                                label={t('group-name')}
                                placeholder={t('group-name-placeholder')}
                                readOnly={
                                    mode === 'view' &&
                                    (!!group?.id ||
                                        !acl.allow(
                                            GRANT.ADMIN,
                                            `group_${group?.id}`,
                                        ))
                                }
                            />
                        </View>
                        {currentGroupDehydrators &&
                            currentGroupDehydrators.map((machine, index) => {
                                return machineRow(
                                    machine,
                                    index >= currentGroupDehydrators.length - 1,
                                );
                            })}
                        {mode != 'view' &&
                            (!group?.id ||
                                acl.allow(
                                    GRANT.ADMIN,
                                    `group_${group?.id}`,
                                )) && (
                            <DUpdatedButton
                                baseStyle={ButtonStyle.Alternative}
                                containerStyle={[
                                    {borderWidth: 0},
                                    currentGroupDehydrators.length > 0
                                        ? {marginTop: 8}
                                        : {marginTop: 24},
                                ]}
                                text={t('add-machine-to-group')}
                                source={images.add}
                                reverse={true}
                                onPress={onAddDehydratorPress}
                            />
                        )}
                    </Card>
                </ScrollView>
                {mode != 'view' &&
                    (!group?.id ||
                        acl.allow(GRANT.ADMIN, `group_${group?.id}`)) && (
                    <View style={{gap: 8, paddingVertical: 16}}>
                        <DUpdatedButton
                            baseStyle={ButtonStyle.Primary}
                            text={t('save')}
                            onPress={formik.handleSubmit}
                        />
                        <DUpdatedButton
                            baseStyle={ButtonStyle.Outlined}
                            text={t('cancel')}
                            onPress={onCancelPress}
                        />
                    </View>
                )}
            </View>
            {showAddList && (
                <ModalAddList
                    title={t('dehydrators')}
                    setShowAddList={setShowAddList}
                    list={newDehydrators}
                    onItemPress={onMachinePress}
                    itemKey={'guid'}
                    itemLabelKey={'machineName'}
                    indicator={false}
                />
            )}
            <DSpinner checkEntities={'MachineGroupEntity'} />
            <DSpinner checkEntities={'MachineEntity'} />
            <DSpinner checkEntities={'Identity'} />
        </BaseScreenLayout>
    );
}

// export default connect(mapStateToProps)(GroupScreen);

const styles = StyleSheet.create({
    imageContainer: {
        backgroundColor: palette.gray,
        height: 50,
        width: 50,
        borderRadius: 8,
    },
});
