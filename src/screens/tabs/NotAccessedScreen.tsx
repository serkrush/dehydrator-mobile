import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Header from 'src/components/Headers/UpdatedHeader';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import {colors} from 'src/theme';

export default function NotAccessedScreen() {
    const {t} = useTranslation();
    return (
        <BaseScreenLayout style={{backgroundColor: colors.mainBackground}}>
            <View style={{paddingTop: 4, flex: 1}}>
                <Header title={t('not-accessed-screen')} showBackButton={true} />
            </View>
        </BaseScreenLayout>
    );
}
