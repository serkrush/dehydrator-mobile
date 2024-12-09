import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect, useDispatch, useSelector} from 'react-redux';
import Header, {ViewType} from 'src/components/Headers/UpdatedHeader';
import {useTranslation} from 'react-i18next';
import BaseSettingsScreenLayout from 'src/components/layouts/BaseSettingsScreenLayout';
import {colors, fonts} from 'src/theme';

import {
    AppState,
    ENTITY,
    Flag,
    RequestStatus,
    SettingsOption,
} from 'src/constants';
import DButton from 'src/components/buttons/DButton';
import ContainerContext from 'src/ContainerContext';
import {useActions} from 'src/hooks/useEntity';
import Spinner from 'react-native-loading-spinner-overlay';
import checkPasswordFormat, {CheckError} from 'src/utils/checkPasswordFormat';
import FieldRow from 'src/components/rows/FieldRow';
import CheckBoxRow from 'src/components/rows/CheckBoxRow';
import baseStyles from 'src/styles';
import {useIsFocused} from '@react-navigation/native';
import DSpinner from 'src/components/DSpinner';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import {images} from 'src/theme/images';
import {ButtonStyle} from 'src/components/buttons/DUpdatedImageButton';
import BaseTitleInputRow from 'src/components/rows/BaseTitleInputRow';
import DUpdatedButton from 'src/components/buttons/DUpdatedButton';
import BaseCardModal from 'src/components/modals/BaseCardModaWithConfirmationField';
import ExclamationView from 'src/components/views/ExclamationView';
import Card from 'src/components/views/Card';
import * as actionTypes from 'src/store/actions';
import CardModal from 'src/components/modals/BaseCardModal';
import AlertView from 'src/components/views/AlertView';

const settingsScreenColors = {
    background: colors.mainBackground,
    text: {
        textButton: colors.textButton,
        card: colors.card.text,
    },
};

export default function ChangePassword({}) {
    const {t} = useTranslation();
    const isFocused = useIsFocused();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const dispatch = useDispatch();

    const {updatePassword, logout} = useActions('Identity');

    // const [user, setUser] = useState(currentUser);

    const identity = useSelector((state: AppState) => state.auth.identity);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [logoutFromAll, setLogout] = useState(true);

    const {deleteUser} = useActions('UserEntity');

    const box = useSelector((state: AppState) => {
        return state.box;
    });

    const userDeleteErrorAlert = useMemo(() => {
        return box[Flag.DeleteErrorOwnMachine];
    }, [box]);

    const process = useMemo(() => {
        return box[Flag.UserDeleteProcess];
    }, [box]);

    const [deleteProcess, setDeleteProcess] = useState(process);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

    useEffect(() => {
        setDeleteProcess(process);

        if (process == Flag.ACTION_SUCCESS) {
            afterDelete();
            dispatch(actionTypes.clearBox(Flag.UserDeleteProcess));
        }
    }, [process]);

    const afterDelete = () => {
        logout();
    };

    const onDeletePress = () => {
        if (deleteConfirmationText == identity.firstName) {
            deleteUser({
                uid: identity.userId,
                checkFlag: Flag.UserDeleteProcess,
            });
        } else {
            Alert.alert(t('delete-user-wrong-name'));
        }
    };

    const onCancelPress = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setLogout(true);
    };

    const onSavePress = () => {
        if (
            checkPasswordFormat(newPassword, confirmNewPassword, error => {
                switch (error) {
                    case CheckError.DontMatch:
                        Alert.alert(
                            t('password-not-valide-alert-title'),
                            t('password-dont-match-alert-message'),
                        );
                        break;
                    case CheckError.InvalidLength:
                        Alert.alert(
                            t('password-not-valide-alert-title'),
                            t('password-invalid-length-alert-message'),
                        );
                        break;
                    case CheckError.InvalidCases:
                        Alert.alert(
                            t('password-not-valide-alert-title'),
                            t('password-invalid-cases-alert-message'),
                        );
                        break;
                    case CheckError.DigitRequire:
                        Alert.alert(
                            t('password-not-valide-alert-title'),
                            t('password-invalid-digit-alert-message'),
                        );
                        break;
                    default:
                        Alert.alert(t('default-error-title'));
                        break;
                }
            })
        ) {
            if (
                currentPassword == '' ||
                newPassword == '' ||
                confirmNewPassword == ''
            ) {
                Alert.alert(t('default-error-title'), t('empty-fields'));
            } else {
                updatePassword({identity, currentPassword, newPassword});
            }
        }
    };

    return (
        <BaseScreenLayout
            style={{backgroundColor: settingsScreenColors.background}}>
            <View style={{paddingTop: 4, flex: 1}}>
                <Header
                    showBackButton={true}
                    title={t('change-password').toLowerCase()}
                    rightButtons={[
                        {
                            type: ViewType.ImageButton,
                            value: {
                                source: images.delete,
                                imageWidth: 24,
                                imageHeight: 24,
                                onPress: () => {
                                    setDeleteModalVisible(true);
                                },
                                baseStyle: ButtonStyle.Destructive,
                                containerStyle: [{width: 40, height: 40}],
                            },
                        },
                    ]}
                />
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 20,
                    }}>
                    <Card
                        style={[
                            {
                                marginTop: 20,
                                borderWidth: 0,
                                gap: 24,
                            },
                        ]}>
                        <BaseTitleInputRow
                            fieldTitle={t('current-password')}
                            fieldPlaceholder={t('current-password')}
                            value={currentPassword}
                            setValue={setCurrentPassword}
                            secureTextEntry={true}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={'#0A4C5E40'}
                        />
                        <BaseTitleInputRow
                            fieldTitle={t('new-password')}
                            fieldPlaceholder={t('new-password')}
                            value={newPassword}
                            setValue={setNewPassword}
                            secureTextEntry={true}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={'#0A4C5E40'}
                        />
                        <BaseTitleInputRow
                            fieldTitle={t('confirm-new-password')}
                            fieldPlaceholder={t('confirm-new-password')}
                            value={confirmNewPassword}
                            setValue={setConfirmNewPassword}
                            secureTextEntry={true}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={'#0A4C5E40'}
                        />
                        <CheckBoxRow
                            fieldTitle={t('logout-all-devices')}
                            isChecked={logoutFromAll}
                            onChange={setLogout}
                        />
                    </Card>
                </ScrollView>
                <View style={{gap: 16, marginBottom: 16}}>
                    <DUpdatedButton
                        baseStyle={ButtonStyle.Primary}
                        onPress={onSavePress}
                        text={t('save')}
                    />
                    <DUpdatedButton
                        baseStyle={ButtonStyle.Outlined}
                        onPress={onCancelPress}
                        text={t('cancel')}
                    />
                </View>
                <DSpinner checkEntities={['Identity', 'UserEntity']} />
            </View>
            {deleteModalVisible && (
                <BaseCardModal
                    imageView={<ExclamationView />}
                    title={t('delete-user-title')}
                    description={t('delete-user-description')}
                    fieldValue={deleteConfirmationText}
                    fieldSetValue={setDeleteConfirmationText}
                    fieldTitle={t('name-of-user')}
                    actionRows={[
                        {
                            text: t('delete'),
                            baseStyle: ButtonStyle.Destructive,
                            onPress: onDeletePress,
                        },
                        {
                            text: t('cancel'),
                            baseStyle: ButtonStyle.Outlined,
                            onPress: () => {
                                setDeleteConfirmationText('');
                                setDeleteModalVisible(false);
                            },
                        },
                    ]}
                />
            )}
            {userDeleteErrorAlert && (
                <CardModal
                    imageView={<AlertView />}
                    title={t('delete-user-error-title')}
                    description={t('delete-user-error-own-description')}
                    actionRows={[
                        {
                            text: t('close'),
                            baseStyle: ButtonStyle.Primary,
                            onPress: () => {
                                dispatch(
                                    actionTypes.clearBox(
                                        Flag.DeleteErrorOwnMachine,
                                    ),
                                );
                            },
                        },
                    ]}
                />
            )}
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    title: {
        ...fonts.textSizeL28,
        color: colors.card.text.mainContent,
    },
    description: {
        ...fonts.textSizeSL,
        color: colors.card.text.mainContent,
    },
});
