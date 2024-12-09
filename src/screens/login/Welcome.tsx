/* eslint-disable react-native/no-inline-styles */
import i18next from 'i18next';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import userDefaults from 'react-native-user-defaults';
import {useSelector} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import DSpinner from 'src/components/DSpinner';
import DTextButton from 'src/components/buttons/DTextButton';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import LanguageModal from 'src/components/modals/LanguageModal';
import BaseTitleInputRow from 'src/components/rows/BaseTitleInputRow';
import {
    AppState,
    DEFAULT_LANGUAGE_CODE,
    DEFAULT_SCALE,
    DEFAULT_TIMEZONE,
    Flag,
    languages,
    AuthType,
    DEFAULT_CURRENCY_SYMBOL,
} from 'src/constants';
import {useActions} from 'src/hooks/useEntity';
import {colors, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {images} from 'src/theme/images';
import {capitalize} from 'src/utils/capitalize';

export default function WelcomeScreen() {
    const showAlternative = true;
    const {t} = useTranslation();

    const di = useContext(ContainerContext);
    const config = di.resolve('config');
    const navigator = di.resolve('navigator');
    const {setLanguageCode} = useActions('Identity');

    const [email, setEmail] = useState(config?.testLogin ?? '');
    const [password, setPassword] = useState(config?.testPassword ?? '');
    const [started, setStarted] = useState(false);
    const languageCode = useSelector((state: AppState) => {
        if (state?.box) {
            if (state.box[Flag.LanguageCode]) {
                return state.box[Flag.LanguageCode];
            } else if (state?.auth?.identity?.languageCode) {
                return state?.auth?.identity?.languageCode;
            }
        }
        return undefined;
    });
    const [language, setLanguage] = useState(languageCode);
    const [languageVisible, setLanguageVisible] = useState(false);

    const {login, tryAutologin, loginWithSocial} = useActions('Identity');

    const isFirstStart = useSelector((state: AppState) => {
        return state?.box?.isFirstStart;
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

    const languageFromAppSettings = useSelector((state: AppState) => {
        return state.box && state.box[Flag.AppSettings]
            ? state.box[Flag.AppSettings].language ?? DEFAULT_LANGUAGE_CODE
            : DEFAULT_LANGUAGE_CODE;
    });

    useEffect(() => {
        tryAutologin();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isFirstStart) {
                navigator.navigate('Onboarding');
                clearTimeout(timeout);
            }
        }, 0);
    }, [isFirstStart]);

    const onRegisterTap = () => {
        navigator.navigate('Register');
    };

    const onForgotPasswordTap = () => {
        navigator.navigate('ForgotPassword');
    };

    const languageTap = () => {
        setLanguageVisible(!languageVisible);
    };

    const saveLanguageTap = () => {
        if (language) {
            setLanguageCode({value: language});
        }
    };
    const socialButton = (social: AuthType) => {
        return (
            <DUpdatedButton
                useTintColor={false}
                baseStyle={ButtonStyle.Outlined}
                text={capitalize(t('login-with'))}
                source={images.social[social]}
                onPress={() => onSocialButtonClick(social)}
            />
        );
    };

    const onSocialButtonClick = useCallback(
        (social: string) => {
            loginWithSocial({
                data: {
                    language: language ?? languageFromAppSettings,
                    timezone,
                    scale,
                    currencySymbol: DEFAULT_CURRENCY_SYMBOL,
                },
                social,
            });
        },
        [loginWithSocial, language, timezone, scale, languageFromAppSettings],
    );

    useEffect(() => {
        userDefaults.get(Flag.LanguageCode).then(data => {
            console.log('userDefaults language', data);
            if (data) {
                i18next.changeLanguage(data);
            }
        });
        console.log('data.language', languageCode);
        if (languageCode && languageCode !== i18next.language) {
            console.log('set data.language', languageCode);
            i18next.changeLanguage(languageCode);
        }
    }, [languageCode]);

    const onSignInTap = () => {
        if (email === '' || password === '') {
            Alert.alert(t('default-error-title'), t('empty-fields'));
        } else {
            login({
                data: {
                    email,
                    password,
                },
            });
        }
    };

    const onLanguagePress = () => {
        navigator.navigate('Onboarding');
    };

    return (
        <BaseScreenLayout
            cleanSocketSubscriptions={false}
            containerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                backgroundColor: colors.mainBackground,
            }}>
            {!started && (
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <View>
                        <Text style={styles.description}>
                            {t('welcome-desc')}
                        </Text>
                    </View>
                    <View style={{gap: 16}}>
                        <DUpdatedButton
                            baseStyle={ButtonStyle.Primary}
                            text={t('get-started')}
                            onPress={() => {
                                setStarted(true);
                            }}
                        />
                        <DUpdatedButton
                            baseStyle={ButtonStyle.Outlined}
                            source={images.language}
                            imageHeight={24}
                            imageWidth={24}
                            tintColor={palette.blueBlack}
                            onPress={onLanguagePress}
                        />
                    </View>
                </View>
            )}
            {started && (
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <Text style={styles.signInTitle}>{t('sign-in-desc')}</Text>
                    <KeyboardAwareScrollView>
                        <View style={{paddingTop: 36, gap: 16}}>
                            <BaseTitleInputRow
                                fieldTitle={t('placeholder-email')}
                                fieldPlaceholder={t('placeholder-email')}
                                placeholderTextColor={'#0A4C5E40'}
                                value={email}
                                setValue={setEmail}
                                keyboardType={undefined}
                                label={undefined}
                            />
                            <BaseTitleInputRow
                                fieldTitle={t('placeholder-password')}
                                fieldPlaceholder={t('placeholder-password')}
                                placeholderTextColor={'#0A4C5E40'}
                                value={password}
                                setValue={setPassword}
                                secureTextEntry={true}
                                keyboardType={undefined}
                                label={undefined}
                            />
                        </View>
                        <View
                            style={{
                                alignItems: 'flex-end',
                                paddingTop: 24,
                            }}>
                            <DTextButton
                                textStyle={styles.forgotButton}
                                onPress={onForgotPasswordTap}
                                text={t('forgot-password') + '?'}
                            />
                        </View>
                        <View style={{paddingTop: 24}}>
                            <DUpdatedButton
                                baseStyle={ButtonStyle.Primary}
                                onPress={onSignInTap}
                                text={capitalize(t('login'))}
                            />
                        </View>
                        {showAlternative && (
                            <View style={{paddingTop: 24}}>
                                <View style={{}}>
                                    <Text style={styles.separatorText}>
                                        {t('or')}
                                    </Text>
                                </View>
                                <View style={{gap: 16}}>
                                    {socialButton(AuthType.Google)}
                                    {/* {socialButton(AuthType.Facebook)} */}
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            paddingTop: 20,
                            paddingBottom: 24,
                        }}>
                        <Text style={styles.bottomText}>
                            {t('dont-have-acc')}
                        </Text>
                        <DTextButton
                            onPress={onRegisterTap}
                            textStyle={styles.bottomActionText}
                            text={t('register')}
                        />
                    </View>
                </View>
            )}
            <LanguageModal
                visible={languageVisible}
                setVisible={setLanguageVisible}
                languages={languages}
                language={language}
                setLanguage={setLanguage}
                saveButtonTap={saveLanguageTap}
            />
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
        ...fonts.h2,
        color: colors.header.text.main,
        lineHeight: 52,
        textAlign: 'center',
    },

    bottomText: {color: colors.bottomText, ...fonts.textSizeSL},
    bottomActionText: {
        color: colors.textButton,
        ...fonts.textSizeSL,
    },

    forgotButton: {
        ...fonts.textSizeSL,
        color: colors.textButton,
    },
});
