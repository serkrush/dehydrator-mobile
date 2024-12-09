import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import BaseLoginScreenLayout from 'src/components/layouts/BaseLoginScreenLayout';
import HeaderLogo from 'src/components/Headers/HeaderLogo';
import DTextInput from 'src/components/DTextInput';
import DButton from 'src/components/buttons/DButton';
import {colors, families, fonts} from 'src/theme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BackArrowHeader from 'src/components/Headers/BackArrowHeader';
import {useActions} from 'src/hooks/useEntity';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import TitleInputRow from 'src/components/rows/TitleInputRow';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import BaseTitleInputRow from 'src/components/rows/BaseTitleInputRow';
import DImageButton from 'src/components/buttons/DImageButton';
import {images} from 'src/theme/images';
import baseStyles from 'src/styles';
import ContainerContext from 'src/ContainerContext';
import DSpinner from 'src/components/DSpinner';

export default function ForgotPassword() {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');

    const [email, setEmail] = useState('');

    const {sendResetPasswordEmail} = useActions('Identity');

    const sendEmailTap = () => {
        if (email == '') {
            Alert.alert(t('default-error-title'), t('empty-fields'));
        } else {
            sendResetPasswordEmail({
                data: {
                    email,
                },
            });
        }
    };

    const onBackPress = () => {
        navigator.pop();
    };

    return (
        <BaseScreenLayout
            cleanSocketSubscriptions={false}
            containerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                backgroundColor: colors.mainBackground,
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                }}>
                <DImageButton
                    source={images.arrows.left}
                    width={24}
                    height={24}
                    tintColor={colors.imageButton.outlined.content}
                    additionalStyle={baseStyles.backButton}
                    onPress={onBackPress}
                />
                <Text style={[styles.title]}>{t('forgot-password')}</Text>
            </View>
            <View style={{flex: 1, paddingTop: 36}}>
                <View>
                    <KeyboardAwareScrollView>
                        <BaseTitleInputRow
                            fieldTitle={t('placeholder-email')}
                            fieldPlaceholder={t('placeholder-email')}
                            value={email}
                            setValue={setEmail}
                            keyboardType={undefined}
                            label={undefined}
                            placeholderTextColor={'#0A4C5E40'}
                        />

                        <View style={{paddingTop: 28}}>
                            <DUpdatedButton
                                baseStyle={ButtonStyle.Primary}
                                onPress={sendEmailTap}
                                text={t('send-email')}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
            <DSpinner checkEntities={'Identity'} />
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    title: {
        // color: 'white',
        // fontSize: 25,
        // fontFamily: families.oswald,
        // fontWeight: '500',
        // textAlign: 'center',
        ...fonts.h1,
        color: colors.header.text.main,
        alignItems: 'baseline',
        justifyContent: 'flex-end',
        lineHeight: undefined,
    },
});
