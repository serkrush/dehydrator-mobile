import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MAX_STAGES_COUNT} from 'src/constants';
import {IZoneParams} from 'src/store/types/MachineTypes';
import {images} from 'src/theme/images';
import {ButtonStyle} from '../buttons/DUpdatedButton';
import DUpdatedImageButton from '../buttons/DUpdatedImageButton';
import {colors, families, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';

const stagesColors = {
    indexButton: {
        regular: {
            border: palette.blueDark,
            background: 'white',
            text: palette.blueDark,
        },
        selected: {
            border: palette.blueDark,
            background: palette.blueDark,
            text: 'white',
        },
    },
    addButton: {
        content: palette.orange,
    },

    container: {
        background: colors.card.subcontainer.background,
    },

    title: colors.card.text.mainContent,
};

export default function StagesCardHeader({
    stages,
    currentStage,
    setCurrentStage,
    showAddButtons = false,
    onStageDeletePress,
    onStageAddPress,
    disabled = false,
}: {
    stages: IZoneParams[];
    currentStage: number;
    setCurrentStage: (number) => void;
    showAddButtons?: boolean;
    onStageDeletePress?: (number) => void;
    onStageAddPress?: () => void;
    disabled?: boolean;
}) {
    const {t} = useTranslation();

    return (
        <View style={styles.stagesContainer}>
            <Text style={styles.stagesTitle}>{t('stages')}</Text>
            <View
                style={{
                    flexDirection: 'row',
                    gap: 10,
                    justifyContent: 'space-between',
                    flex: 1,
                }}>
                <View style={{gap: 4, flexDirection: 'row'}}>
                    {stages.map((item, i) => {
                        const indexButtonStyle =
                            i == currentStage
                                ? stagesColors.indexButton.selected
                                : stagesColors.indexButton.regular;
                        return (
                            <TouchableOpacity
                                key={i}
                                disabled={disabled}
                                style={[
                                    styles.stagesIndex,
                                    {
                                        borderColor: indexButtonStyle.border,
                                        backgroundColor:
                                            indexButtonStyle.background,
                                    },
                                ]}
                                onPress={() => {
                                    setCurrentStage(i);
                                }}>
                                <Text
                                    style={[
                                        styles.indexButtonText,
                                        {
                                            color: indexButtonStyle.text,
                                        },
                                    ]}>
                                    {i + 1}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {showAddButtons && (
                    <View style={{flexDirection: 'row', gap: 8}}>
                        <DUpdatedImageButton
                            disabled={stages.length <= 1}
                            baseStyle={ButtonStyle.Outlined}
                            tintColor={stagesColors.addButton.content}
                            containerStyle={styles.stagesAddButtonContainer}
                            source={images.reduce}
                            onPress={() => {
                                if (onStageDeletePress)
                                    onStageDeletePress(currentStage + 1);
                            }}
                        />
                        <DUpdatedImageButton
                            disabled={stages.length >= MAX_STAGES_COUNT}
                            baseStyle={ButtonStyle.Outlined}
                            tintColor={stagesColors.addButton.content}
                            containerStyle={styles.stagesAddButtonContainer}
                            source={images.add}
                            onPress={() => {
                                if (onStageAddPress) onStageAddPress();
                            }}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    indexButtonText: {
        fontFamily: families.inter,
        fontWeight: '500',

        textAlign: 'center',
    },

    stagesAddButtonContainer: {
        height: 36,
        width: 36,
        borderRadius: 100,
    },

    stagesContainer: {
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 10,
        gap: 6,
        borderRadius: 8,
        backgroundColor: stagesColors.container.background,
    },

    stagesTitle: {
        ...fonts.textSizeS20,
        color: stagesColors.title,
    },

    stagesIndex: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 8,
        height: 36,
        width: 36,
        overflow: 'hidden',
    },
});
