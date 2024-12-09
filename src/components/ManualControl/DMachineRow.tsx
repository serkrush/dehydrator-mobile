import React, {useContext, useEffect, useMemo} from 'react';
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
import ZoneStateView from './ZoneStateView';
import {IMachineModel, Zone} from 'src/entities/models/MachineModel';
import {useTranslation} from 'react-i18next';
import {updateDateString} from 'src/utils/updateDateString';
import {useSelector} from 'react-redux';
import {AppState, ENTITY, Flag, Scale, scaledValueMap} from 'src/constants';
import {colors, families, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {normalize} from 'src/theme/fonts';
import LastUpdateLabel from './LastUpdateLabel';
import DImageButton from '../buttons/DImageButton';
import {capitalize} from 'src/utils/capitalize';
import {useIdentity} from 'src/hooks/useIdentity';
import {areaConvert} from 'src/utils/scaleConvert';
import ContainerContext from 'src/ContainerContext';
import ImageStore from '../ImageStore';
import {useActions} from 'src/hooks/useEntity';

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
    zoneInfos,
    showButton,
    onPress,
    disabled = false,
}: {
    machine: IMachine;
    modelInfo: IMachineModel;
    zoneInfos: ZoneInfo[];
    showButton?: boolean;
    disabled?: boolean;
    onPress: (id: string) => void;
}) {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const config = di.resolve('config');
    const guidLength = config?.publicMachineIdLength ?? 8;
    const globalLastUpdateTime = useSelector((state: AppState) => {
        return state.box[Flag.LastStatusUpdateTime];
    });
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

    const zoneCount = (machine.zones ?? modelInfo?.zones)?.length ?? 1;
    const identity = useIdentity();
    let scale = identity?.scale;
    let areaStringValue =
        scale != undefined
            ? scaledValueMap.distance[scale] ?? modelInfo?.meta?.distance
            : modelInfo?.meta?.distance;
    const areaString = areaStringValue
        ? `${t('tray-sq')} ${areaStringValue}`
        : '';
    let areaValue = modelInfo?.totalTrayArea ?? 0;
    areaValue =
        scale == Scale.Imperial ? areaConvert(areaValue, true) : areaValue;

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={() => {
                onPress(machine.id ?? '');
            }}
            style={styles.container}>
            <View>
                <View style={{flexDirection: 'row', gap: 8}}>
                    <View style={styles.imageContainer}>
                        <ImageStore
                            folder={`models/${machine.modelId}`}
                            name={image}
                        />
                    </View>
                    <View style={{flex: 1, gap: 8}}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <View style={[styles.statusesContainer, {flex: 1}]}>
                                {zoneInfos.map((value, index) => {
                                    const mode = value.props.currentProps?.mode;
                                    const lastUpdateTime =
                                        value.props.transferTimestamp ??
                                        value.props.currentProps?.timestamp ??
                                        globalLastUpdateTime;

                                    return (
                                        <View
                                            style={styles.statusesSubcontainer}
                                            key={index}>
                                            <ZoneStateView
                                                key={index}
                                                state={value.state}
                                                itemMode={mode}
                                                showCircle={false}
                                            />
                                            {lastUpdateTime != undefined && (
                                                <View
                                                    style={
                                                        styles.lastUpdateContainer
                                                    }>
                                                    <LastUpdateLabel
                                                        lastUpdateTime={
                                                            lastUpdateTime
                                                        }
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                            {showButton != undefined && showButton && (
                                <View style={{}}>
                                    <DImageButton
                                        source={images.moreVertical}
                                        width={24}
                                        height={24}
                                        imageHeight={20}
                                        imageWidth={20}
                                        tintColor={machinesRowColors.moreButton}
                                        onPress={() => {
                                            onPress(machine.id ?? '');
                                        }}
                                    />
                                </View>
                            )}
                        </View>
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
            {modelInfo && (
                <View style={styles.propertiesContainer}>
                    <View style={styles.propertiesSubcontainer}>
                        <Image
                            source={images.dehydrators.properties.zone}
                            style={styles.propertiesImage}
                        />
                        <Text style={styles.descriptionText}>
                            {`${zoneCount} ${
                                zoneCount > 1
                                    ? capitalize(t('zone_count_many'))
                                    : capitalize(t('zone_count_one'))
                            }`}{' '}
                        </Text>
                    </View>
                    <View style={styles.propertiesSeparator} />

                    <View style={styles.propertiesSubcontainer}>
                        <Image
                            source={images.dehydrators.properties.tray}
                            style={styles.propertiesImage}
                        />
                        <Text style={styles.descriptionText}>
                            {`${modelInfo?.totalTrays} ${capitalize(
                                t('tray_count'),
                            )}`}
                        </Text>
                    </View>
                    <View style={styles.propertiesSeparator} />
                    <View style={styles.propertiesSubcontainer}>
                        <Image
                            source={images.dehydrators.properties.area}
                            style={styles.propertiesImage}
                        />
                        <Text style={styles.descriptionText}>
                            {`${areaValue.toFixed(2)}`} {`${areaString}`}
                        </Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
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
        width: 90,
        height: 90,
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
