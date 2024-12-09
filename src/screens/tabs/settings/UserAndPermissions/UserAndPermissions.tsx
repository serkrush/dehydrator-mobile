import React, {useContext, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect, useSelector} from 'react-redux';
import Header, {ViewType} from 'src/components/Headers/UpdatedHeader';
import {useTranslation} from 'react-i18next';
import BaseSettingsScreenLayout from 'src/components/layouts/BaseSettingsScreenLayout';
import {colors, families, fonts} from 'src/theme';
import baseStyles from 'src/styles';

import {AppState, Flag, SettingsOption} from 'src/constants';
import DButton from 'src/components/buttons/DButton';
import ContainerContext from 'src/ContainerContext';
import {useActions} from 'src/hooks/useEntity';
import DTextInput from 'src/components/DTextInput';
import FieldRow from 'src/components/rows/FieldRow';
import DSpinner from 'src/components/DSpinner';
import {IIdentity} from 'acl/types';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import {images} from 'src/theme/images';
import {ButtonStyle} from 'src/components/buttons/DUpdatedImageButton';

// const mapStateToProps = (state: AppState) => {
//     console.log('identity', state.auth.identity, 'users', state.users);
//     let process = undefined as undefined | string;
//     if (state && state.box) {
//         // spinnerActive =
//         //   !!state.flagger[Flag.DeleteUserSpinner] ||
//         //   !!state.flagger[Flag.UpdateDataSpinner];
//         process = state.box[Flag.UserDeleteProcess];
//     }

//     return {
//         currentUser: state.auth.identity,
//         process,
//     };
// };

const settingsScreenColors = {
    background: colors.mainBackground,
    text: {
        textButton: colors.textButton,
        card: colors.card.text,
    },
};

export default function UserAndPermissions() {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const {deleteUser} = useActions('UserEntity');
    const {logout} = useActions('Identity');
    const {updateIdentityData} = useActions('UserEntity');
    const users = useSelector((state: AppState) => {
        return state?.users;
    });

    const identity = useSelector((state: AppState) => {
        return state?.auth?.identity;
    });

    const box = useSelector((state: AppState) => {
        return state.box;
    });

    const process = useMemo(() => {
        return box[Flag.UserDeleteProcess];
    }, [box]);

    const [user, setUser] = useState(identity);
    const [firstName, setFirstName] = useState(identity?.firstName);
    const [lastName, setLastName] = useState(identity?.lastName);
    const [email, setEmail] = useState(identity?.userEmail);

    const [deleteProcess, setDeleteProcess] = useState(process);

    useEffect(() => {
        setUser(identity);
        setFirstName(identity?.firstName);
        setLastName(identity?.lastName);
        setEmail(identity?.userEmail);
    }, [identity]);

    useEffect(() => {
        setDeleteProcess(process);

        if (process == Flag.ACTION_SUCCESS) {
            afterDelete();
        }
    }, [process]);

    const afterDelete = () => {
        logout();
    };

    const changePassword = () => {
        navigator.navigate('ChangePassword');
    };
    const updatePermissions = () => {
        navigator.navigate('UpdateUserPermissionsList');
    };

    const onDeletePress = () => {
        deleteUser({
            uid: identity.userId,
            checkFlag: Flag.UserDeleteProcess,
        });
    };

    const onCancelPress = () => {
        setFirstName(identity?.firstName);
        setLastName(identity?.lastName);
        setEmail(identity.userEmail);
    };

    const onSavePress = () => {
        const actualUser = users[user.userId];
        if (actualUser != undefined) {
            updateIdentityData({
                user: {
                    ...actualUser,
                    access: undefined,
                    groups: undefined,
                    machines: undefined,
                },
                updatedData: {firstName, lastName, email},
            });
        }
    };

    const buttonRow = (fieldTitle, title, onPress) => {
        return (
            <View style={{gap: 8}}>
                <Text style={[baseStyles.baseText]}>
                    {fieldTitle}
                    {':'}
                </Text>
                <DButton
                    style={{
                        // alignItems: 'flex-start',
                        paddingHorizontal: 16,
                    }}
                    textStyle={{
                        color: 'black',
                        fontSize: 20,
                        fontFamily: families.oswald,
                        textAlign: 'left',
                    }}
                    text={title}
                    onPress={onPress}
                />
            </View>
        );
    };

    return (
        <BaseScreenLayout
            style={{backgroundColor: settingsScreenColors.background}}>
            {/* <Header
                title={t(SettingsOption.UserAndPermission).toLowerCase()}
                titleStyle={baseStyles.settingsTitle}
                back={true}
            /> */}
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
                                onPress: () => {},
                                baseStyle: ButtonStyle.Primary,
                                containerStyle: [
                                    {width: 40, height: 40, borderRadius: 100},
                                    {borderWidth: 0},
                                ],
                            },
                        },
                    ]}
                />

                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 20,
                    }}>
                    <View style={{paddingTop: 24, gap: 12}}>
                        <FieldRow
                            fieldTitle={t('placeholder-first-name') + ':'}
                            fieldPlaceholder={t('placeholder-first-name')}
                            value={firstName}
                            setValue={setFirstName}
                        />
                        <FieldRow
                            fieldTitle={t('placeholder-last-name') + ':'}
                            fieldPlaceholder={t('placeholder-last-name')}
                            value={lastName}
                            setValue={setLastName}
                        />
                        <FieldRow
                            fieldTitle={t('placeholder-email') + ':'}
                            fieldPlaceholder={t('placeholder-email')}
                            value={email}
                            setValue={setEmail}
                        />
                        {buttonRow(
                            t('change-password').toUpperCase(),
                            t('change-password').toUpperCase(),
                            changePassword,
                        )}
                        {buttonRow(
                            t('permissions').toUpperCase(),
                            t('update-permissions').toUpperCase(),
                            updatePermissions,
                        )}
                    </View>
                </ScrollView>
                <View style={{gap: 20}}>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <DButton
                            onPress={onDeletePress}
                            style={{width: '60%', height: 36}}
                            textStyle={{
                                color: 'red',
                                fontFamily: families.oswald,
                                fontSize: 18,
                            }}
                            text={t('delete-acc')}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: 20,
                        }}>
                        <DButton
                            onPress={onCancelPress}
                            style={{width: 120, height: 36}}
                            textStyle={baseStyles.settingsUtilButtonText}
                            text={t('cancel').toUpperCase()}
                        />
                        <DButton
                            onPress={onSavePress}
                            style={{width: 120, height: 36}}
                            textStyle={baseStyles.settingsUtilButtonText}
                            text={t('save').toUpperCase()}
                        />
                    </View>
                </View>

                <DSpinner checkEntities={['UserEntity', 'Identity']} />
            </View>
        </BaseScreenLayout>
    );
}

// export default connect(mapStateToProps)(UserAndPermissions);

const styles = StyleSheet.create({});
