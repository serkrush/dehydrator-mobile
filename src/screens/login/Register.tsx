/* eslint-disable indent */
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import DSpinner from 'src/components/DSpinner';
import DTextButton from 'src/components/buttons/DTextButton';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import BaseTitleInputRow from 'src/components/rows/BaseTitleInputRow';
import {
    AppState,
    DEFAULT_CURRENCY_SYMBOL,
    DEFAULT_LANGUAGE_CODE,
    DEFAULT_SCALE,
    DEFAULT_TIMEZONE,
    Flag,
} from 'src/constants';
import {useActions} from 'src/hooks/useEntity';
import {colors, fonts} from 'src/theme';
import {capitalize} from 'src/utils/capitalize';
import checkPasswordFormat, {CheckError} from 'src/utils/checkPasswordFormat';

export default function Register() {
    const {t} = useTranslation();

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const language = useSelector((state: AppState) => {
        return state.box && state.box[Flag.AppSettings]
            ? state.box[Flag.AppSettings].language ?? DEFAULT_LANGUAGE_CODE
            : DEFAULT_LANGUAGE_CODE;
    });

    const timezone = useSelector((state: AppState) => {
        return state.box && state.box[Flag.AppSettings]
            ? state.box[Flag.AppSettings].timezone ?? DEFAULT_TIMEZONE
            : DEFAULT_TIMEZONE;
    });

    const scale = useSelector((state: AppState) => {
        return state.box && state.box[Flag.AppSettings]
            ? state.box[Flag.AppSettings].scale ?? DEFAULT_SCALE
            : DEFAULT_SCALE;
    });

    const {register} = useActions('Identity');

    const onSignInTap = () => {
        navigator.navigate('Welcome');
    };

    const onCreateTap = () => {
        if (
            checkPasswordFormat(password, confirmPassword, error => {
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
                email === '' ||
                password === '' ||
                firstName === '' ||
                lastName === '' ||
                language === '' ||
                timezone === '' ||
                scale === ''
            ) {
                Alert.alert(t('default-error-title'), t('empty-fields'));
            } else {
                register({
                    data: {
                        email,
                        password,
                        firstName,
                        lastName,
                        language,
                        timezone,
                        scale,
                        currencySymbol: DEFAULT_CURRENCY_SYMBOL,
                    },
                });
            }
        }
    };

    return (
        <BaseScreenLayout
            cleanSocketSubscriptions={false}
            // eslint-disable-next-line react-native/no-inline-styles
            containerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                backgroundColor: colors.mainBackground,
            }}>
            <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                    flex: 1,
                    justifyContent: 'space-between',
                }}>
                <Text style={styles.signInTitle}>{t('register-desc')}</Text>
                <KeyboardAwareScrollView>
                    <View style={{paddingTop: 36, gap: 16}}>
                        <BaseTitleInputRow
                            fieldTitle={t('placeholder-first-name')}
                            fieldPlaceholder={t('placeholder-first-name')}
                            value={firstName}
                            setValue={setFirstName}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={'#0A4C5E40'}
                        />
                        <BaseTitleInputRow
                            fieldTitle={t('placeholder-last-name')}
                            fieldPlaceholder={t('placeholder-last-name')}
                            value={lastName}
                            setValue={setLastName}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={'#0A4C5E40'}
                        />
                        <BaseTitleInputRow
                            fieldTitle={t('placeholder-email')}
                            fieldPlaceholder={t('placeholder-email')}
                            value={email}
                            setValue={setEmail}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={'#0A4C5E40'}
                        />
                        <BaseTitleInputRow
                            fieldTitle={t('placeholder-password')}
                            fieldPlaceholder={t('placeholder-password')}
                            value={password}
                            setValue={setPassword}
                            secureTextEntry={true}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={'#0A4C5E40'}
                        />
                        <BaseTitleInputRow
                            fieldTitle={t('placeholder-confirm-password')}
                            fieldPlaceholder={t('placeholder-confirm-password')}
                            value={confirmPassword}
                            setValue={setConfirmPassword}
                            secureTextEntry={true}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={'#0A4C5E40'}
                        />
                    </View>
                    <View style={{paddingTop: 42}}>
                        <DUpdatedButton
                            baseStyle={ButtonStyle.Primary}
                            onPress={onCreateTap}
                            text={capitalize(t('register'))}
                        />
                    </View>
                </KeyboardAwareScrollView>

                <View>
                    <View
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            paddingTop: 20,
                            paddingBottom: 24,
                        }}>
                        <Text style={styles.bottomText}>{t('have-acc')}</Text>
                        <DTextButton
                            onPress={onSignInTap}
                            textStyle={styles.bottomActionText}
                            text={capitalize(t('login'))}
                        />
                    </View>
                </View>
            </View>
            <DSpinner checkEntities={'Identity'} />
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    description: {
        textAlign: 'center',
        ...fonts.h1,
        color: colors.header.text.main,
        lineHeight: 52,
    },

    signInTitle: {
        ...fonts.h1,
        color: colors.header.text.main,
        lineHeight: 52,
    },

    separatorLine: {height: 1, flex: 1, backgroundColor: 'white'},

    separatorText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 8,
    },

    bottomText: {color: colors.bottomText, ...fonts.textSizeSL},
    bottomActionText: {
        color: colors.textButton,
        ...fonts.textSizeSL,
    },
});
