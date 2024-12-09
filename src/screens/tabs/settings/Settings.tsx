import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import {useActions} from 'src/hooks/useEntity';
import {
    AppState,
    ENTITY,
    Flag,
    SettingsOption,
    settingsOptions,
} from 'src/constants';
import SettingsRow from 'src/components/rows/SettingsRow';
import DSpinner from 'src/components/DSpinner';
import {colors, fonts} from 'src/theme';
import {images} from 'src/theme/images';
import DTextButton from 'src/components/buttons/DTextButton';
import {capitalizeEachWord} from 'src/utils/capitalizeEachWord';
import {ButtonStyle} from 'src/components/buttons/DUpdatedImageButton';
import palette from 'src/theme/colors/palette';
import {useAcl} from 'src/hooks/useAcl';
import {GRANT, ROLE} from '../../../../acl/types';
import Header, {ViewType} from 'src/components/Headers/UpdatedHeader';

const settingsScreenColors = {
    background: colors.mainBackground,
    text: {
        textButton: colors.textButton,
        card: colors.card.text,
    },
};

export default function SettingsScreen(data) {
    const {t} = useTranslation();
    const {logout} = useActions('Identity');

    const acl = useAcl();

    const identity = useSelector((state: AppState) => {
        //console.log('state.auth.identity', state.auth);
        return state.auth.identity;
    });

    const currentMachineId = useSelector((state: AppState) => {
        return state.box ? state.box[Flag.CurrentUpdatedMachineId] : undefined;
    });

    const machines = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE];
    });

    const machine = useMemo(() => {
        return machines[currentMachineId];
    }, [currentMachineId, machines]);

    return (
        <BaseScreenLayout
            style={{backgroundColor: settingsScreenColors.background}}>
            <View style={{}}>
                <View style={{marginTop: 16}}>
                    <Header
                        title={t('tab-settings').toUpperCase()}
                        titleStyle={fonts.h1}
                        titleContainer={{paddingHorizontal: 0}}
                        rightButtons={[
                            {
                                type: ViewType.ImageButton,
                                value: {
                                    source: images.logout,
                                    imageWidth: 24,
                                    imageHeight: 24,
                                    tintColor: palette.orange,
                                    onPress: () => {
                                        logout();
                                    },
                                    baseStyle: ButtonStyle.Destructive,
                                    containerStyle: [styles.logoutButton],
                                },
                            },
                        ]}
                    />
                </View>
            </View>
            <ScrollView
                style={{marginTop: 16}}
                contentContainerStyle={{gap: 8}}>
                {settingsOptions.map(option => {
                    let disabled = false;
                    switch (option) {
                        case SettingsOption.Advanced:
                            disabled =
                                machine == undefined ||
                                identity == undefined ||
                                !acl.allow(
                                    GRANT.ADMIN,
                                    `machine_${machine.id}`,
                                );
                            break;
                        // case SettingsOption.DiagnosticData:
                        case SettingsOption.SoftwareUpdates:
                        case SettingsOption.Notifications:
                            disabled = true;
                            break;
                        case SettingsOption.UserPermissions:
                            disabled = !acl.allow(
                                GRANT.WRITE,
                                'Settings',
                                identity?.role ?? ROLE.GUEST,
                            );
                            break;
                    }
                    return (
                        <SettingsRow
                            key={option}
                            option={option}
                            disabled={disabled}
                        />
                    );
                })}
            </ScrollView>

            <DSpinner checkEntities={'Identity'} />
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    sectionText: {
        ...fonts.h1,
        color: colors.header.text.main,
        lineHeight: undefined,
    },

    selectMachineButtonText: {
        ...fonts.textSizeS20,
        color: settingsScreenColors.text.textButton,
    },

    logoutButton: {
        width: 40,
        height: 40,
        borderColor: palette.orangeLight,
        backgroundColor: palette.orangeLightest,
    },
});
