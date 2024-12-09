import {useIsFocused} from '@react-navigation/native';
import React, {useContext, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import BaseTitleDropdown from 'src/components/BaseTitleDropdown';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import DSpinner from 'src/components/DSpinner';
import Header from 'src/components/Headers/UpdatedHeader';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import DropdownRow from 'src/components/rows/DropdownRow';
import {
    AppState,
    Flag,
    SettingsOption,
    currencies,
    languages,
    regions,
    scales,
    timezones,
} from 'src/constants';
import ContainerContext from 'src/ContainerContext';
import {useActions} from 'src/hooks/useEntity';
import {colors, families} from 'src/theme';
import dataFunc from 'src/utils/dropdownDataFunc';

export default function LanguageAndRegion() {
    const {t} = useTranslation();
    const isFocused = useIsFocused();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');

    const {updateIdentityData} = useActions('UserEntity');

    const box = useSelector((state: AppState) => {
        return state.box;
    });

    const users = useSelector((state: AppState) => {
        return state.users;
    });

    const identity = useSelector((state: AppState) => {
        return state.auth.identity;
    });

    const currentUser = useMemo(() => {
        return identity != undefined && identity.userId != undefined
            ? users[identity?.userId]
            : undefined;
    }, [users, identity]);

    const currentLanguage = useMemo(() => {
        return (
            currentUser?.language ??
            (box != undefined && box[Flag.AppSettings] != undefined
                ? box[Flag.AppSettings].language
                : undefined)
        );
    }, [currentUser, box]);

    const currentTimezone = useMemo(() => {
        return (
            currentUser?.timezone ??
            (box != undefined && box[Flag.AppSettings] != undefined
                ? box[Flag.AppSettings].timezone
                : undefined)
        );
    }, [currentUser, box]);

    const currentScale = useMemo(() => {
        return (
            currentUser?.scale ??
            (box != undefined && box[Flag.AppSettings] != undefined
                ? box[Flag.AppSettings].scale
                : undefined)
        );
    }, [currentUser, box]);

    const currentCurrency = useMemo(() => {
        return (
            currentUser?.currencySymbol ??
            (box != undefined && box[Flag.AppSettings] != undefined
                ? box[Flag.AppSettings].currencySymbol
                : undefined)
        );
    }, [currentUser, box]);

    const [language, setLanguage] = useState(currentLanguage);
    const [timezone, setTimezone] = useState(currentTimezone);
    const [region, setRegion] = useState(
        (currentTimezone ?? '')?.split('/')[0],
    );
    const [scale, setScale] = useState(currentScale);
    const [currency, setCurrency] = useState(currentCurrency);

    const onCancelPress = () => {
        setLanguage(currentLanguage);
        setTimezone(currentTimezone);
        setScale(currentScale);
        setCurrency(currentCurrency);
    };

    const onSavePress = () => {
        updateIdentityData({
            user: {
                ...currentUser,
                access: undefined,
                groups: undefined,
                machines: undefined,
            },
            updatedData: {language, timezone, scale, currencySymbol: currency},
        });
    };

    const row = (field, inputs, value, setValue) => {
        const data = dataFunc(inputs, field);
        return (
            <DropdownRow
                key={field}
                title={t(`current-${field}`)}
                placeholder={t(`select-${field}`).toUpperCase()}
                dropdownContainerStyle={{height: 36}}
                dropdownTextStyle={{
                    color: '#303030',
                    fontSize: 18,
                    fontFamily: families.oswald,
                }}
                data={data}
                value={value}
                setValue={setValue}
            />
        );
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
        <BaseScreenLayout style={{backgroundColor: colors.mainBackground}}>
            <View style={{flex: 1, paddingTop: 4}}>
                <Header
                    title={t(SettingsOption.LanguageAndRegion)}
                    showBackButton={true}
                />
                <View style={{justifyContent: 'space-between', flex: 1}}>
                    <View style={{gap: 16, paddingTop: 16}}>
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
                        <BaseTitleDropdown
                            data={currencies}
                            title={t('select-currency')}
                            placeholder={t('select-currency')}
                            value={currency}
                            setValue={setCurrency}
                        />
                    </View>
                    <View style={{gap: 8, paddingVertical: 16}}>
                        <DUpdatedButton
                            baseStyle={ButtonStyle.Primary}
                            text={t('save')}
                            onPress={onSavePress}
                        />
                        <DUpdatedButton
                            baseStyle={ButtonStyle.Outlined}
                            text={t('cancel')}
                            onPress={onCancelPress}
                        />
                    </View>
                </View>
            </View>
            <DSpinner checkEntities={['Identity', 'UserEntity']} />
        </BaseScreenLayout>
    );
}
