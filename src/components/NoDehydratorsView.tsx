import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import DTextImageButton from './buttons/DTextImageButton';
import {colors, families, fonts} from 'src/theme';
import {images} from 'src/theme/images';
import palette from 'src/theme/colors/palette';

const viewColors = {
    text: {
        description: palette.midGray,
        descriptionSpan: palette.orange,
    },
};

export default function NoDehydratorsView({onAddAMachinePress}) {
    const {t} = useTranslation();

    const noDehydratorDesc = t('no-dehydrator-desc');
    const addMachineText = t('add-a-machine');
    const descParts = noDehydratorDesc.split(addMachineText);

    return (
        <View style={{gap: 16, paddingVertical: 16}}>
            <Text style={styles.description}>
                {descParts[0]}
                <Text style={styles.descriptionSpan}>{addMachineText}</Text>
                {descParts[1]}
            </Text>
            <DTextImageButton
                text={addMachineText}
                containerStyle={styles.primaryButtonContainer}
                textStyle={styles.primaryButtonText}
                source={images.add}
                width={24}
                height={24}
                tintColor={colors.button.primary.content}
                onPress={onAddAMachinePress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    description: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 22,
        color: viewColors.text.description,
    },

    descriptionSpan: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 22,
        color: viewColors.text.descriptionSpan,
        textDecorationLine: 'underline',
    },

    primaryButtonContainer: {
        borderRadius: 12,
        backgroundColor: colors.button.primary.background,
        height: 48,
        gap: 8,
    },

    primaryButtonText: {
        ...fonts.button,
        color: colors.button.primary.content,
        lineHeight: 24,
    },
});
