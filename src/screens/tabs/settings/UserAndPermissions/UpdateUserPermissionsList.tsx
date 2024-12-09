import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header, {ViewType} from 'src/components/Headers/UpdatedHeader';
import {useTranslation} from 'react-i18next';
import {colors, families, fonts} from 'src/theme';
import ContainerContext from 'src/ContainerContext';
import useEntity, {useActions} from 'src/hooks/useEntity';
import {AppState, Flag, RequestStatus, SettingsOption} from 'src/constants';
import {useIsFocused} from '@react-navigation/native';
import * as actionTypes from 'src/store/actions';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import DActivityIndicator from 'src/components/DActivityIndicator';
import {images} from 'src/theme/images';
import {ButtonStyle} from 'src/components/buttons/DUpdatedImageButton';
import palette from 'src/theme/colors/palette';
import DSpinner from 'src/components/DSpinner';
import Card from 'src/components/views/Card';
import baseStyles from 'src/styles';
import DImageButton from 'src/components/buttons/DImageButton';
import BaseCardModal from 'src/components/modals/BaseCardModaWithConfirmationField';
import ExclamationView from 'src/components/views/ExclamationView';
import {capitalize} from 'src/utils/capitalize';

const viewColors = {
    text: {
        description: palette.midGray,
        descriptionSpan: palette.orange,
    },
};

export default function UpdateUserPermissionsList() {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const userEntity = useEntity('UserEntity');
    const {getRelatedUsers, deleteUser} = useActions('UserEntity');
    const {updateIdentity} = useActions('Identity');
    const redux = di.resolve('redux');

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteString, setDeleteString] = useState('');
    const [deleteUserUid, setDeleteUserUid] = useState<any>();
    const deleteConfirmationString = t('delete-confirmation-string');

    const noUserDesc = t('no-user-desc');
    const addUserText = t('adding-a-user');
    const descParts = noUserDesc.split(addUserText);

    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useDispatch();

    const identity = useSelector((state: AppState) => {
        return state.auth.identity;
    });

    const allUsers = useSelector((state: AppState) => {
        return state.users;
    });

    const relatedUsers = useMemo(() => {
        return Object.values(allUsers).filter(
            value =>
                value.parentsId != undefined &&
                value.parentsId?.findIndex(id => id == identity.userId) != -1,
        );
    }, [allUsers, identity]);


    useEffect(() => {
        onRefresh();
    }, []);

    const onRefresh = useCallback(
        (force: boolean = false) => {
            getRelatedUsers({data: {force}});
            updateIdentity({force});
        },
        [getRelatedUsers, updateIdentity],
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

    const onAddPress = () => {
        dispatch(actionTypes.clearBox(Flag.CurrentUpdatedUserId));
        //clearFlagger({key: Flag.CurrentUpdatedUserId});
        navigator.navigate('UpdateUserPermissions', {mode: 'add'});
    };

    const onUpdatePress = user => {
        dispatch(actionTypes.setBox(Flag.CurrentUpdatedUserId, user.uid));
        //setFlagger({key: Flag.CurrentUpdatedUserId, value: user.uid});
        navigator.navigate('UpdateUserPermissions', {mode: 'update'});
    };

    const onDeleteConfirmPress = () => {
        if (deleteString == deleteConfirmationString && deleteUserUid) {
            deleteUser({uid: deleteUserUid, checkFlag: Flag.UserDeleteProcess});
            setDeleteModalVisible(false);
            setDeleteString('');
        } else {
            setDeleteString('');
            Alert.alert(t('invalid-delete-string'));
        }
    };

    const updatedUserRow = (key, name, email, onPress, isLast) => {
        return (
            <View
                key={key}
                style={[
                    isLast
                        ? {borderBottomWidth: 0}
                        : {
                              borderBottomWidth: 1,
                              borderBottomColor: palette.blueLight,
                          },
                ]}>
                {/* <TouchableOpacity
                    key={key}
                    style={[styles.container]}
                    onPress={onPress}>
                    <Text style={styles.text}>{name}</Text>
                    <Image
                        tintColor={colors.card.text.mainContent}
                        source={images.arrows.right}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: colors.card.text.mainContent,
                        }}
                    />
                </TouchableOpacity> */}
                <TouchableOpacity
                    style={[styles.container]}
                    activeOpacity={0.4}
                    onPress={onPress}>
                    <View
                        style={[
                            {
                                gap: 5,
                            },
                        ]}>
                        <Text
                            style={{
                                ...fonts.textSizeM,
                                color: palette.orange,
                                flex: 1,
                            }}>
                            {name}
                        </Text>
                        <Text
                            style={{
                                ...fonts.textSizeM,
                                color: colors.card.text.additionalContent,
                            }}>
                            {email}
                        </Text>
                    </View>
                    <View
                        style={[
                            {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 10,
                            },
                        ]}>
                        <DImageButton
                            tintColor={'black'}
                            source={images.cardEdit}
                            height={20}
                            width={20}
                            onPress={onPress}
                        />

                        <DImageButton
                            tintColor={'red'}
                            source={images.delete}
                            height={20}
                            width={20}
                            onPress={() => {
                                setDeleteUserUid(key);
                                setDeleteModalVisible(true);
                            }}
                        />
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
                    title={t(SettingsOption.UserPermissions)}
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
                {(relatedUsers == undefined || relatedUsers.length <= 0) && (
                    <View style={{marginTop: 16}}>
                        <Text style={styles.noUserDescription}>
                            {descParts[0]}
                            <Text
                                style={styles.noUserDescriptionSpan}
                                onPress={onAddPress}>
                                {addUserText}
                            </Text>
                            {descParts[1]}
                        </Text>
                    </View>
                )}
                {relatedUsers != undefined && relatedUsers.length > 0 && (
                    <View style={{marginTop: 16}}>
                        <Text style={baseStyles.sectionTitle}>
                            {t('user-permissions-list-title')}
                        </Text>
                        <Text style={baseStyles.sectionDescription}>
                            {t('user-permissions-list-description')}
                        </Text>
                    </View>
                )}
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
                    {/* <DActivityIndicator
                                checkEntities={['UserEntity']}
                            /> */}
                    {relatedUsers != undefined && relatedUsers.length > 0 && (
                        <Card style={{marginTop: 20, borderWidth: 0}}>
                            {relatedUsers.map((user, index) => {
                                return updatedUserRow(
                                    user.uid,
                                    user.firstName + ' ' + user.lastName,
                                    user.email,
                                    () => {
                                        onUpdatePress(user);
                                    },
                                    index >= relatedUsers.length - 1,
                                );
                            })}
                        </Card>
                    )}
                </ScrollView>
                <DSpinner checkEntities={['UserEntity']} />
            </View>
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

const styles = StyleSheet.create({
    noUserDescription: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 22,
        color: viewColors.text.description,
    },

    noUserDescriptionSpan: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 22,
        color: viewColors.text.descriptionSpan,
        textDecorationLine: 'underline',
    },

    container: {
        backgroundColor: colors.card.base.background,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: 16,
    },
    text: {
        ...fonts.textSizeML,
        color: colors.card.text.mainContent,
    },
    imageButton: {
        backgroundColor: colors.imageButton.primary.background,
        width: 40,
        height: 40,
        borderRadius: 100,
    },
});
