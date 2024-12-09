import React from 'react';
import {useTranslation} from 'react-i18next';
import {ColorValue, Image, Text, View} from 'react-native';
import {families, fonts} from 'src/theme';
import {images} from 'src/theme/images';

export default function HeaderLogo({
    textColor = 'white',
}: {
    textColor?: ColorValue;
}) {
    const {t} = useTranslation();
    return (
        <View
            style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8
            }}>
            <Image
                style={{
                    height: 36,
                    width: 36,
                }}
                source={images.logo}
            />
            <Text
                style={{
                    fontFamily: families.oswald,
                    color: textColor,
                    letterSpacing: 5,
                    fontSize: 40,
                    fontWeight: 'bold',
                }}
                adjustsFontSizeToFit={true}
                numberOfLines={1}>
                {t('app-title')}
            </Text>
        </View>
    );
}
