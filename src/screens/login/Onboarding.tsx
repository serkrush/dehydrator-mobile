import i18next from 'i18next';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, StyleSheet, View} from 'react-native';
import userDefaults from 'react-native-user-defaults';
import {useSelector} from 'react-redux';
import BaseTitleDropdown from 'src/components/BaseTitleDropdown';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import HeaderLogo from 'src/components/Headers/HeaderLogo';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import {AppState, Flag, languages, regions, scales, timezones} from 'src/constants';
import ContainerContext from 'src/ContainerContext';
import {colors, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {capitalize} from 'src/utils/capitalize';
import dataFunc from 'src/utils/dropdownDataFunc';
import * as actionTypes from '../../store/actions';

export default function Onboarding() {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');

    const redux = di.resolve('redux');
    const appLanguage = useSelector((state: AppState) => {
        console.log(state.box);
        return state.box != undefined &&
            state.box[Flag.AppSettings] != undefined
            ? state.box[Flag.AppSettings].language
            : undefined;
    });

    // const appCountry = useSelector((state: AppState) => {
    //     return state['box'] != undefined &&
    //         state['box'][Flag.AppSettings] != undefined
    //         ? state['box'][Flag.AppSettings]['country']
    //         : undefined;
    // });

    const appTimezone = useSelector((state: AppState) => {
        return state.box != undefined &&
            state.box[Flag.AppSettings] != undefined
            ? state.box[Flag.AppSettings].timezone
            : undefined;
    });

    const [region, setRegion] = useState((appTimezone ?? '')?.split('/')[0]);

    const appScale = useSelector((state: AppState) => {
        return state.box != undefined &&
            state.box[Flag.AppSettings] != undefined
            ? state.box[Flag.AppSettings].scale
            : undefined;
    });

    const [language, setLanguage] = useState(appLanguage);
    const [timezone, setTimezone] = useState(appTimezone);
    // const [country, setCountry] = useState(appCountry);
    const [scale, setScale] = useState(appScale);

    useEffect(() => {
        i18next.changeLanguage(appLanguage);
    }, [appLanguage]);

    const onNextTap = () => {
        if (
            language == undefined ||
            timezone == undefined ||
            scale == undefined
        ) {
            Alert.alert(t('not-all-selected'));
            return;
        }

        Flag;
        redux.dispatch(
            actionTypes.setBox(Flag.AppSettings, {
                language,
                timezone,
                scale,
            }),
        );

        redux.dispatch(actionTypes.setBox(Flag.IsFirstStart, false));

        redux.dispatch(actionTypes.setBox(Flag.LanguageCode, language));
        userDefaults
            .set(Flag.LanguageCode, language)
            .then(data => console.log('userDefaults set', data));
        i18next.changeLanguage(language);

        navigator.push('Welcome');
    };

    const dataTimezone: any[] = useMemo((): any[] => {
        return timezones
            .filter(item => item.includes(region))
            .map(timezone => ({
                value: timezone,
                label: ((timezone ?? '') as string).split('/').pop(),
            }));
    }, [region]);

    return (
        <BaseScreenLayout
            cleanSocketSubscriptions={false}
            containerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                backgroundColor: colors.mainBackground,
            }}>
            <HeaderLogo textColor={palette.blueDark} />
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}>
                    <View style={{gap: 16}}>
                        <BaseTitleDropdown
                            data={dataFunc(languages, 'language')}
                            title={t('select-language')}
                            placeholder={t('select-language')}
                            value={language}
                            setValue={setLanguage}
                        />
                        <View style={{gap: 8}}>
                            <BaseTitleDropdown
                                data={dataFunc(regions, '', false)}
                                title={t('select-region-and-timezone')}
                                placeholder={t('select-region')}
                                value={region}
                                setValue={setRegion}
                                showLeftIcon={true}
                            />
                            <BaseTitleDropdown
                                data={dataTimezone}
                                placeholder={t('select-timezone')}
                                value={timezone}
                                setValue={setTimezone}
                                showLeftIcon={true}
                            />
                        </View>
                        <BaseTitleDropdown
                            data={dataFunc(scales, 'scale')}
                            title={t('select-measurement-scale')}
                            placeholder={t('select-measurement-scale')}
                            value={scale}
                            setValue={setScale}
                        />
                    </View>
                </View>
                <View style={{paddingTop: 20}}>
                    <DUpdatedButton
                        baseStyle={ButtonStyle.Primary}
                        onPress={onNextTap}
                        text={capitalize(t('onboarding-next'))}
                    />
                </View>
            </View>
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
