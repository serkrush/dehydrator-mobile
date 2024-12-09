import React, {useContext, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import DSpinner from 'src/components/DSpinner';
import Header, {ViewType} from 'src/components/Headers/UpdatedHeader';
import DImageButton from 'src/components/buttons/DImageButton';
import {ButtonStyle} from 'src/components/buttons/DUpdatedImageButton';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import BaseCardModal from 'src/components/modals/BaseCardModaWithConfirmationField';
import Card from 'src/components/views/Card';
import ExclamationView from 'src/components/views/ExclamationView';
import {AppState, Flag} from 'src/constants';
import {IMachineAccess} from 'src/entities/models/MachineAccess';
import {IMachineGroup} from 'src/entities/models/MachineGroup';
import {useAcl} from 'src/hooks/useAcl';
import {useActions} from 'src/hooks/useEntity';
import * as actionTypes from 'src/store/actions';
import baseStyles from 'src/styles';
import {colors, families, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {images} from 'src/theme/images';
import {capitalize} from 'src/utils/capitalize';
import {GRANT} from '../../../../../acl/types';

const viewColors = {
    text: {
        description: palette.midGray,
        descriptionSpan: palette.orange,
    },
};

export default function GroupsListScreen({route}) {
    const excluded = route?.params?.excluded ?? [];
    const onChooseCompletion = route?.params?.onChooseCompletion;

    const acl = useAcl();

    const {t} = useTranslation();

    const deleteConfirmationString = t('delete-confirmation-string');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteString, setDeleteString] = useState('');

    const {deleteGroup} = useActions('MachineGroupEntity');

    const [groupDeleteData, setGroupDeleteData] = useState(
        undefined as undefined | IMachineGroup,
    );

    const onDeleteConfirmPress = () => {
        console.log('onDeleteConfirmPress');
        setDeleteModalVisible(false);
        if (deleteString == deleteConfirmationString) {
            setDeleteString('');
            if (groupDeleteData) {
                deleteGroup({
                    data: groupDeleteData,
                    checkFlag: Flag.MachineDeleteProcess,
                });
            }
            setGroupDeleteData(undefined);
        } else {
            setDeleteString('');
            Alert.alert(t('invalid-delete-string'));
        }
    };

    const auth = useSelector((state: AppState) => {
        return state.auth;
    });

    const users = useSelector((state: AppState) => {
        return state.users;
    });

    const accesses = useSelector((state: AppState) => {
        return state.access;
    });

    const groups = useSelector((state: AppState) => {
        return state.groups;
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

    const adminAccessedGroups = useMemo(() => {
        let res: {access: IMachineAccess; group: IMachineGroup}[] = [];
        let admin = users[auth.identity.userId];

        if (admin) {
            admin?.groups?.forEach(key => {
                const index = adminAccessList.findIndex(x => {
                    return x?.machineGroupId === key;
                });
                if (index !== -1) {
                    res.push({
                        access: adminAccessList[index],
                        group: {...groups[key]},
                    });
                }
            });
        }

        return res;
    }, [adminAccessList]);

    const availableGroups = useMemo(() => {
        let res: IMachineGroup[] = [];
        console.log('adminAccessedGroup');
        Object.keys(groups).forEach(groupKey => {
            if (
                (groups[groupKey].creatorId === auth.identity.userId ||
                    adminAccessedGroups.findIndex(value => {
                        return (
                            value.group.id === groupKey &&
                            acl.allow(GRANT.ADMIN, `group_${value.group.id}`)
                        );
                    }) != -1) &&
                excluded.findIndex(groupId => {
                    return groupId == groupKey;
                }) == -1
            ) {
                res.push(groups[groupKey]);
            }
        });
        res = res.sort((a, b) => {
            return a.createdAt - b.createdAt;
        });
        return res;
    }, [auth, groups, adminAccessedGroups]);

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');

    const dispatch = useDispatch();

    let title = t('group-list-title'); //.toLowerCase();

    const noGroupsDesc = t('no-groups-desc');
    const addGroupsText = t('adding-a-group');
    const descParts = noGroupsDesc.split(addGroupsText);

    const onAddPress = () => {
        dispatch(actionTypes.clearBox(Flag.CurrentUpdatedGroupId));
        navigator.navigate('GroupScreen', {mode: 'add'});
    };

    const onEditPress = group => {
        dispatch(actionTypes.setBox(Flag.CurrentUpdatedGroupId, group.id));
        navigator.navigate('GroupScreen', {mode: 'edit'});
    };

    const onDeletePress = group => {
        setGroupDeleteData(group);
        setDeleteModalVisible(true);
    };

    const groupRow = (group, isLast) => {
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
                            onChooseCompletion(group);
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
                        }}>
                        {/* <Image
                            source={images.dehydrators.dehydrator}
                            style={{
                                backgroundColor: palette.gray,
                                height: 48,
                                width: 60,
                                borderRadius: 8,
                            }}
                        /> */}
                        <Text
                            style={{
                                ...fonts.textSizeM,
                                color: palette.orange,
                            }}>
                            {group.name}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}>
                        {acl.allow(GRANT.ADMIN, `group_${group.id}`) && (
                            <DImageButton
                                tintColor={'black'}
                                source={images.cardEdit}
                                height={20}
                                width={20}
                                onPress={() => {
                                    onEditPress(group);
                                }}
                            />
                        )}

                        {acl.allow(GRANT.ADMIN, `group_${group.id}`) && (
                            <DImageButton
                                tintColor={'red'}
                                source={images.delete}
                                height={20}
                                width={20}
                                onPress={() => {
                                    onDeletePress(group);
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

                {availableGroups.length <= 0 && (
                    <View style={{marginTop: 16}}>
                        <Text style={styles.noGroupsDescription}>
                            {descParts[0]}
                            <Text style={styles.noGroupsDescriptionSpan}>
                                {addGroupsText}
                            </Text>
                            {descParts[1]}
                        </Text>
                    </View>
                )}
                {availableGroups.length > 0 && (
                    <>
                        <View style={{marginTop: 16}}>
                            <Text style={baseStyles.sectionTitle}>
                                {t('group-list-screen-title')}
                            </Text>
                            <Text style={baseStyles.sectionDescription}>
                                {t('group-list-screen-description')}
                            </Text>
                        </View>
                        <ScrollView>
                            <Card
                                style={{
                                    paddingVertical: 4,
                                    marginVertical: 20,
                                }}>
                                {availableGroups.map((group, index) => {
                                    return groupRow(
                                        group,
                                        index >= availableGroups.length - 1,
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
                    title={t('delete-dehydrator=group-title')}
                    description={t('delete-dehydrator-group-message')}
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
                                setGroupDeleteData(undefined);
                            },
                        },
                    ]}
                />
            )}
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    noGroupsDescription: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 22,
        color: viewColors.text.description,
    },

    noGroupsDescriptionSpan: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 22,
        color: viewColors.text.descriptionSpan,
        textDecorationLine: 'underline',
    },

    imageButton: {
        backgroundColor: colors.imageButton.primary.background,
        width: 40,
        height: 40,
        borderRadius: 100,
    },
});
