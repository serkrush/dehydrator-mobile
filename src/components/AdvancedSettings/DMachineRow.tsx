import React, {useContext, useMemo} from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    IMachine,
    ZoneAvailability,
    ZoneInfo,
} from 'src/entities/models/Machine';
import {images} from 'src/theme/images';
import ZoneStateView from '../ManualControl/ZoneStateView';
import {IMachineModel, Zone} from 'src/entities/models/MachineModel';
import {useTranslation} from 'react-i18next';
import {updateDateString} from 'src/utils/updateDateString';
import {useSelector} from 'react-redux';
import {AppState, ENTITY, Flag, Scale, scaledValueMap} from 'src/constants';
import {colors, families, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {normalize} from 'src/theme/fonts';
import LastUpdateLabel from '../ManualControl/LastUpdateLabel';
import DImageButton from '../buttons/DImageButton';
import {capitalize} from 'src/utils/capitalize';
import {useIdentity} from 'src/hooks/useIdentity';
import {areaConvert} from 'src/utils/scaleConvert';
import ContainerContext from 'src/ContainerContext';
import ImageStore from '../ImageStore';

const machinesRowColors = {
    constainer: colors.card.base,
    propertiesContainer: colors.card.subcontainer,
    text: {
        title: colors.card.text.h3,
        desription: colors.card.text.mainContent,
        propertiesDescription: colors.card.text.mainContent,
        guid: colors.card.text.additionalContent,
    },

    moreButton: '#98A2B3',
};

export default function DMachineRow({
    machine,
    modelInfo,
}: {
    machine: IMachine;
    modelInfo: IMachineModel;
}) {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const config = di.resolve('config');
    const guidLength = config?.publicMachineIdLength ?? 8;
    const models = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE_MODEL];
    });
    const image = useMemo(() => {
        const currentModel = models[machine.modelId];
        if (currentModel && currentModel.mediaResources) {
            return currentModel.mediaResources;
        }
        return '';
    }, [models]);
    return (
        <View style={styles.container}>
            <View>
                <View style={{flexDirection: 'row', gap: 8}}>
                    <View style={styles.imageContainer}>
                        <ImageStore
                            folder={`models/${machine.modelId}`}
                            style={styles.imageContainer}
                            name={image}
                        />
                    </View>
                    <View style={{flex: 1, gap: 8}}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}></View>
                        <View>
                            <Text style={styles.modelText}>
                                {modelInfo?.model}{' '}
                                {machine.guid && (
                                    <Text style={styles.guidText}>
                                        (
                                        {machine.guid.substring(
                                            machine.guid.length - guidLength,
                                        )}
                                        )
                                    </Text>
                                )}
                            </Text>
                            <Text style={styles.nameText}>
                                {machine.machineName}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: machinesRowColors.constainer.background,
        borderRadius: 12,
        overflow: 'hidden',
        padding: 16,
        borderWidth: 1,
        borderColor: machinesRowColors.constainer.border,
        gap: 8,
    },

    propertiesContainer: {
        backgroundColor: machinesRowColors.propertiesContainer.background,
        borderRadius: 8,
        paddingVertical: 20,
        flexDirection: 'row',
    },

    propertiesSubcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 4,
    },

    imageContainer: {
        width: 60,
        height: 60,
    },

    propertiesImage: {height: 16, width: 16},
    propertiesSeparator: {
        backgroundColor: machinesRowColors.propertiesContainer.separator,
        width: 1,
    },
    modelText: {
        ...fonts.h3,
        color: machinesRowColors.text.title,
    },

    guidText: {
        ...fonts.h4,
        color: machinesRowColors.text.guid,
    },

    nameText: {
        ...fonts.textSizeSL,
        color: machinesRowColors.text.desription,
    },

    descriptionText: {
        ...fonts.textSizeXS,
        color: machinesRowColors.text.propertiesDescription,
    },

    lastUpdateContainer: {alignItems: 'center'},

    baseInfoContainer: {
        flex: 1,
    },

    statusesContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 4,
    },
    statusesSubcontainer: {
        gap: 2,
    },
});
