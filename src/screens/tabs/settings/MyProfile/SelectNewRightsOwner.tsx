/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useMemo, useState} from 'react';
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
import {ButtonStyle} from 'src/components/buttons/DUpdatedImageButton';
import DSpinner from 'src/components/DSpinner';
import Header, { ViewType } from 'src/components/Headers/UpdatedHeader';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import BaseCardModal from 'src/components/modals/BaseCardModaWithConfirmationField';
import Card from 'src/components/views/Card';
import ExclamationView from 'src/components/views/ExclamationView';
import {AppState, CONFIRM_STRING, Flag, RequestStatus} from 'src/constants';
import {useActions} from 'src/hooks/useEntity';
import baseStyles from 'src/styles';
import {colors, families, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {capitalize} from 'src/utils/capitalize';
import * as actionTypes from 'src/store/actions';
import ContainerContext from 'src/ContainerContext';
import { images } from 'src/theme/images';

export default function SelectNewRightsOwner() {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const allUsers = useSelector((state: AppState) => {
        return state.users;
    });
    const identity = useSelector((state: AppState) => {
        return state.auth.identity;
    });
    const {getRelatedUsers, transferAllRights} = useActions('UserEntity');
    const noUserDesc = t('no-user-desc');
    const addUserText = t('adding-a-user');
    const descParts = noUserDesc.split(addUserText);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        //redux.dispatch(userEntity.actions.getRelatedUsers({force: false}));
        getRelatedUsers({data: {force: false}});
    }, []);

    const [changeModalVisible, setChangeModalVisible] = useState(false);
    const [changeString, setChangeString] = useState('');
    const [selectedUserUid, setSelectedUserUid] = useState('');
    const changeConfirmationString = CONFIRM_STRING;

    const relatedUsers = useMemo(() => {
        return Object.values(allUsers).filter(
            value =>
                value.parentsId !== undefined &&
                value.parentsId?.findIndex(id => id === identity.userId) !== -1,
        );
    }, [allUsers, identity]);

    const onRefresh = () => {
        console.log('onRefresh, getRelatedUsers');
        getRelatedUsers({data: {force: true}});
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
                <TouchableOpacity
                    style={[styles.container]}
                    activeOpacity={0.5}
                    onPress={() => onPress(key)}>
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
                </TouchableOpacity>
            </View>
        );
    };

    const onUserPress = (uid: string) => {
        setChangeModalVisible(true);
        setSelectedUserUid(uid);
    };

    const onChangeOwnerPress = () => {
        if (changeString === changeConfirmationString) {
            transferAllRights({newUser: selectedUserUid});
            setChangeModalVisible(false);
            setChangeString('');
        } else {
            Alert.alert(t('invalid-confirmation-string'));
        }
    };

    const onAddPress = () => {
        dispatch(actionTypes.clearBox(Flag.CurrentUpdatedUserId));
        //clearFlagger({key: Flag.CurrentUpdatedUserId});
        navigator.navigate('UpdateUserPermissions', {mode: 'add'});
    };

    return (
        <BaseScreenLayout style={{backgroundColor: colors.mainBackground}}>
            <View style={{paddingTop: 4, flex: 1}}>
                <Header
                    showBackButton={true}
                    title={t('select-user')}
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
                {(relatedUsers === undefined || relatedUsers.length <= 0) && (
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
                {relatedUsers !== undefined && relatedUsers.length > 0 && (
                    <View style={{marginTop: 16}}>
                        <Text
                            style={[
                                baseStyles.sectionTitle,
                                {color: palette.red},
                            ]}>
                            {t('user-transferring-list-title')}
                        </Text>
                        <Text
                            style={[
                                baseStyles.sectionDescription,
                                {color: palette.red},
                            ]}>
                            {t('user-transferring-list-description')}
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
                            onRefresh={onRefresh}
                        />
                    }>
                    {relatedUsers !== undefined && relatedUsers.length > 0 && (
                        <Card style={{marginTop: 20, borderWidth: 0}}>
                            {relatedUsers.map((user, index) => {
                                return updatedUserRow(
                                    user.uid,
                                    user.firstName + ' ' + user.lastName,
                                    user.email,
                                    onUserPress,
                                    index >= relatedUsers.length - 1,
                                );
                            })}
                        </Card>
                    )}
                </ScrollView>
            </View>
            {changeModalVisible && (
                <BaseCardModal
                    imageView={<ExclamationView />}
                    title={t('transferring-rights-title')}
                    description={t('transfer-rights-all-resources-message')}
                    fieldValue={changeString}
                    fieldSetValue={setChangeString}
                    fieldTitle={capitalize(t('confirmation'))}
                    actionRows={[
                        {
                            text: t('confirm'),
                            baseStyle: ButtonStyle.Destructive,
                            onPress: onChangeOwnerPress,
                        },
                        {
                            text: t('cancel'),
                            baseStyle: ButtonStyle.Outlined,
                            onPress: () => {
                                setChangeString('');
                                setChangeModalVisible(false);
                            },
                        },
                    ]}
                />
            )}
            <DSpinner checkEntities={['UserEntity']} />
        </BaseScreenLayout>
    );
}
const viewColors = {
    text: {
        description: palette.midGray,
        descriptionSpan: palette.orange,
    },
};

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
    imageButton: {
        backgroundColor: colors.imageButton.primary.background,
        width: 40,
        height: 40,
        borderRadius: 100,
    },
});
