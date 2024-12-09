import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header, {
    HeaderButtonsType,
    ViewType,
} from 'src/components/Headers/UpdatedHeader';
import baseStyles from 'src/styles';
import {colors} from 'src/theme';

import {GRANT} from '../../../../../acl/types';
import {useFormik} from 'formik';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import DSpinner from 'src/components/DSpinner';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import CardModal from 'src/components/modals/BaseCardModal';
import BaseCardModal from 'src/components/modals/BaseCardModaWithConfirmationField';
import AlertView from 'src/components/views/AlertView';
import Card from 'src/components/views/Card';
import ExclamationView from 'src/components/views/ExclamationView';
import {
    AppState,
    AuthType,
    Flag,
    ProfileData,
    SettingsOption,
} from 'src/constants';
import ContainerContext from 'src/ContainerContext';
import Input from 'src/Form/Input';
import {useAcl} from 'src/hooks/useAcl';
import {useActions} from 'src/hooks/useEntity';
import * as actionTypes from 'src/store/actions';
import {images} from 'src/theme/images';

const settingsScreenColors = {
    background: colors.mainBackground,
    text: {
        textButton: colors.textButton,
        card: colors.card.text,
    },
};

export default function MyProfile() {
    const {allow} = useAcl();
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const {updateIdentityData, deleteUser, getUserDetailed} =
        useActions('UserEntity');
    const {logout} = useActions('Identity');
    const dispatch = useDispatch();

    const identity = useSelector((state: AppState) => {
        return state?.auth?.identity;
    });

    const box = useSelector((state: AppState) => {
        return state.box;
    });

    const userDeleteErrorAlert = useMemo(() => {
        return box[Flag.DeleteErrorOwnMachine];
    }, [box]);

    const users = useSelector((state: AppState) => {
        return state.users;
    });

    const currentUser = useMemo(() => {
        return identity ? users[identity?.userId] : undefined;
    }, [identity, users]);

    const initValues = useMemo(() => {
        return {
            firstName: identity?.firstName,
            lastName: identity?.lastName,
            email: identity?.userEmail,
        };
    }, [identity]);

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
            console.log('onSubmit values');
            if (currentUser != undefined) {
                updateIdentityData({
                    user: {
                        ...currentUser,
                        access: undefined,
                        groups: undefined,
                        machines: undefined,
                    },
                    updatedData: {...values},
                });
            }
        },
    });

    const process = useMemo(() => {
        return box[Flag.UserDeleteProcess];
    }, [box]);

    const [deleteProcess, setDeleteProcess] = useState(process);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

    useEffect(() => {
        getUserDetailed({uid: identity?.userId, flag: Flag.UserInfosReceived});
    }, []);

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

    const changePassword = () => {
        navigator.navigate('ChangePassword');
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

    // const onSavePress = () => {
    //     if (currentUser != undefined) {
    //         updateIdentityData({
    //             user: {
    //                 ...currentUser,
    //                 access: undefined,
    //                 groups: undefined,
    //                 machines: undefined,
    //             },
    //             updatedData: {firstName, lastName, email},
    //         });
    //     }
    // };

    const onChangeOwnerPress = () => {
        navigator.navigate('SelectNewRightsOwner');
    };

    const rightButtons = useMemo(() => {
        const buttons = [
            {
                type: ViewType.ImageButton,
                value: {
                    source: images.delete,
                    imageWidth: 24,
                    imageHeight: 24,
                    text: 'Delete account',
                    tintColor: colors.imageButton.destructive.content,
                    onPress: () => {
                        setDeleteModalVisible(true);
                    },
                    baseStyle: ButtonStyle.Destructive,
                    containerStyle: [{width: 40, height: 40}],
                },
            },
        ];
        if (allow(GRANT.EXECUTE)) {
            buttons.push({
                type: ViewType.ImageButton,
                value: {
                    source: images.settings['settings-my-profile'],
                    imageWidth: 24,
                    imageHeight: 24,
                    text: 'Pass my account to...',
                    tintColor: colors.imageButton.destructive.content,
                    onPress: onChangeOwnerPress,
                    baseStyle: ButtonStyle.Destructive,
                    containerStyle: [{width: 40, height: 40}],
                },
            });
        }
        return buttons;
    }, []);

    return (
        <BaseScreenLayout
            style={{backgroundColor: settingsScreenColors.background}}>
            <View style={{paddingTop: 4, flex: 1}}>
                <Header
                    showBackButton={true}
                    title={t(SettingsOption.MyProfile)}
                    rightButtonsType={
                        allow(GRANT.EXECUTE)
                            ? HeaderButtonsType.ContextMenu
                            : HeaderButtonsType.Buttons
                    }
                    rightButtons={rightButtons}
                />
                <View style={{marginTop: 16}}>
                    <Text style={baseStyles.sectionTitle}>
                        {t('my-profile-title')}
                    </Text>
                    <Text style={baseStyles.sectionDescription}>
                        {t('my-profile-description')}
                    </Text>
                </View>

                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 20,
                    }}>
                    <Card style={{marginTop: 20, borderWidth: 0, gap: 24}}>
                        <Input
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange('firstName')}
                            required={true}
                            error={formik.errors.firstName as string}
                            label={t('placeholder-first-name')}
                        />
                        <Input
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange('lastName')}
                            required={true}
                            error={formik.errors.lastName as string}
                            label={t('placeholder-last-name')}
                        />
                        <Input
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange('email')}
                            required={true}
                            error={formik.errors.email as string}
                            label={t('placeholder-email')}
                        />
                        {/* <BaseTitleInputRow
                            fieldTitle={t('placeholder-first-name')}
                            fieldPlaceholder={t('placeholder-name')}
                            value={firstName}
                            setValue={setFirstName}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={undefined}
                        />
                        <BaseTitleInputRow
                            fieldTitle={t('placeholder-last-name')}
                            fieldPlaceholder={t('placeholder-name')}
                            value={lastName}
                            setValue={setLastName}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={undefined}
                        />
                        <BaseTitleInputRow
                            fieldTitle={t('placeholder-email')}
                            fieldPlaceholder={t('placeholder-email')}
                            value={email}
                            setValue={setEmail}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={undefined}
                        /> */}
                        {(!currentUser?.authType ||
                            currentUser?.authType === AuthType.Default) && (
                            <DUpdatedButton
                                baseStyle={ButtonStyle.Outlined}
                                text={t('change-password')}
                                onPress={changePassword}
                            />
                        )}
                    </Card>
                </ScrollView>
                <View style={{gap: 16, marginBottom: 16}}>
                    <DUpdatedButton
                        baseStyle={ButtonStyle.Primary}
                        onPress={formik.handleSubmit}
                        text={t('save')}
                    />
                    <DUpdatedButton
                        baseStyle={ButtonStyle.Outlined}
                        onPress={formik.resetForm}
                        text={t('cancel')}
                    />
                </View>

                <DSpinner checkEntities={['UserEntity', 'Identity']} />
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

// export default connect(mapStateToProps)(UserAndPermissions);

const styles = StyleSheet.create({});
