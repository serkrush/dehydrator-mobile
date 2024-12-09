import React from 'react';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';
import {
    ColorValue,
    Image,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import {
    ZoneAvailableState,
    ZoneBaseInfoAvailability,
    ZoneInfo,
    ZoneProps,
} from 'src/entities/models/Machine';
import ZoneStateView from './ZoneStateView';
import DImageButton from '../buttons/DImageButton';
import {images} from 'src/theme/images';
import {ICycleState, IZMState, IZoneParams} from 'src/store/types/MachineTypes';
import {toHHMM} from 'src/utils/toHHMM';
import {colorForState} from 'src/utils/colorForState';
import {colors, families, fonts} from 'src/theme';
import {Scale, SessionRunnedBy, scaledValueMap} from 'src/constants';
import BitSet from 'bitset';
import container from 'src/container';
import {colorsForState} from 'src/utils/colorForZoneState';
import {IMachineModel} from 'src/entities/models/MachineModel';
import Card from '../views/Card';
import {useIdentity} from 'src/hooks/useIdentity';
import {temperatureConvert} from 'src/utils/scaleConvert';
import { RFValue } from "react-native-responsive-fontsize";

const zoneCardColors = {
    container: colors.card.base,
    text: colors.card.text,

    separator: colors.card.subcontainer.separator,
    propertiesContainer: colors.card.subcontainer,

    stagesView: {
        item: {
            base: {
                border: colors.card.text.mainContent,
                text: colors.card.text.mainContent,
                background: 'white',
            },
            selected: {
                border: colors.card.text.mainContent,
                text: 'white',
                background: colors.card.text.mainContent,
            },

            unactive: {
                border: colors.card.text.unactive,
                text: colors.card.text.unactive,
                background: 'white',
            },
        },
    },

    moreButton: '#98A2B3',
};

export default function ZoneCardView({
    item,

    disabled = false,
    onPress,
    showPressButton = false,
    modelInfo,
    weightFeatureEnabled = false,
}: {
    item: ZoneInfo | undefined;
    disabled?: boolean;
    onPress?;
    showPressButton?: boolean;
    modelInfo?: IMachineModel;
    weightFeatureEnabled?: boolean;
}) {
    if(item == undefined) {
        return <></>
    }
    const {t} = useTranslation();
    const identity = useIdentity();

    const isOnline = item?.state == ZoneAvailableState.InProgress;
    const isOffline = item?.state == ZoneAvailableState.Offline;
    const isScheduled = item?.state == ZoneAvailableState.Scheduled;

    let sessionRunnedBy: SessionRunnedBy = SessionRunnedBy.Time;
    const weightIndex = item?.props?.params.findIndex(value => {
        return value.weight != 0;
    });
    if (weightFeatureEnabled && weightIndex != -1) {
        sessionRunnedBy = SessionRunnedBy.Weight;
    }

    let totalRemainingTime = 0;

    item?.props?.params.forEach(value => {
        totalRemainingTime += value.duration * 60;
    });

    let stateView = <View />;

    function ActiveStateDataRow({
        title,
        data,
        titleColor,
        dataColor,
        bottomLine = true,
    }: {
        title;
        data;
        titleColor?: ColorValue;
        dataColor?: ColorValue;
        bottomLine?: boolean;
    }) {
        return (
            <View
                style={[
                    styles.activeStateContainer,
                    {
                        borderBottomWidth: bottomLine ? 1 : 0,
                    },
                ]}>
                <Text
                    style={[
                        styles.activeStateRowAdditionalContent,
                        titleColor ? {color: titleColor} : {},
                    ]}>
                    {title}
                </Text>
                <Text
                    style={[
                        styles.activeStateRowContent,
                        dataColor ? {color: dataColor} : {},
                    ]}>
                    {data}
                </Text>
            </View>
        );
    }

    const scheduledRow = (date, bottomLine = true) => {
        const textColor = colorsForState(ZoneAvailableState.Scheduled).content;
        return (
            <ActiveStateDataRow
                bottomLine={bottomLine}
                title={t('scheduled')}
                data={format(date, 'MMM dd yyyy H:mm')}
                titleColor={textColor}
                dataColor={textColor}
            />
        );
    };

    const byRecipeRow = (bottomLine = true) => {
        return (
            <ActiveStateDataRow
                bottomLine={bottomLine}
                title={t('by-recipe')}
                data={'-'}
            />
        );
    };

    const runSessionRow = (bottomLine = true, showTimeRemaining) => {
        const key = `session_run_by_${sessionRunnedBy}`;
        return (
            <ActiveStateDataRow
                bottomLine={bottomLine}
                title={t('run-session-by')}
                data={`${t(key)} ${
                    showTimeRemaining ? toHHMM(totalRemainingTime) : ''
                }`}
            />
        );
    };

    const timeRemainingRow = (bottomLine = true, showTimeRemaining) => {
        return (
            <ActiveStateDataRow
                bottomLine={bottomLine}
                title={t('time-remaining')}
                data={
                    showTimeRemaining
                        ? toHHMM(
                              totalRemainingTime -
                                  (item?.props?.currentProps?.total ?? 0),
                          )
                        : '-'
                }
            />
        );
    };

    let showTimeRemaining = true;
    switch (sessionRunnedBy) {
        case SessionRunnedBy.Time:
            showTimeRemaining = true;
            break;
        case SessionRunnedBy.Weight:
            showTimeRemaining = false;
            break;
    }

    switch (item?.state) {
        case ZoneAvailableState.Available:
            break;
        case ZoneAvailableState.Offline:
            break;
        case ZoneAvailableState.InProgress:
            stateView = (
                <View style={styles.stateView}>
                    {byRecipeRow()}
                    {runSessionRow(true, showTimeRemaining)}
                    {timeRemainingRow(false, showTimeRemaining)}
                </View>
            );
            break;
        case ZoneAvailableState.Error:
            break;
        case ZoneAvailableState.Scheduled:
            stateView = (
                <View style={styles.stateView}>
                    {scheduledRow(item?.props?.scheduledTime, false)}
                </View>
            );
            break;
    }

    let itemView = <View />;

    if (item != undefined) {
        function CellBase({
            children,
            style,
        }: {
            children;
            style?: StyleProp<ViewStyle>;
        }): React.JSX.Element {
            return <View style={[styles.baseCell, style]}>{children}</View>;
        }

        function ValueCell({
            image,
            title,
            value,
            additionalText,
            active = true,
        }: {
            image;
            title;
            value;
            additionalText?;
            active?;
        }) {
            const unactiveColorStyle = active
                ? {}
                : {color: zoneCardColors.text.unactive};
            return (
                <CellBase>
                    <View style={styles.itemView}>
                        <Text style={[styles.itemTitle, unactiveColorStyle]}>
                            {title}
                        </Text>
                        <View style={styles.itemViewValueContainer}>
                            <Image
                                source={image}
                                style={[
                                    styles.itemImage,
                                    active
                                        ? {}
                                        : {
                                              tintColor:
                                                  zoneCardColors.text.unactive,
                                          },
                                ]}
                                tintColor={
                                    active
                                        ? zoneCardColors.text.mainContent
                                        : zoneCardColors.text.unactive
                                }
                            />
                            <Text
                                style={[styles.itemValue, unactiveColorStyle]}>
                                {value}
                            </Text>
                            <Text
                                style={[styles.itemValue, unactiveColorStyle]}>
                                {additionalText}
                            </Text>
                        </View>
                    </View>
                </CellBase>
            );
        }

        const stagesView = (showZeroStage = true, active = true) => {
            const unactiveColorStyle = active
                ? {}
                : {color: zoneCardColors.text.unactive};
            const count = item.props?.amountOfStages;
            return (
                <CellBase style={[styles.baseCell]}>
                    <View style={styles.itemView}>
                        <Text style={[styles.itemTitle, unactiveColorStyle]}>
                            {t('stages')}
                        </Text>
                        <View
                            style={[
                                styles.itemViewValueContainer,
                                {gap: 2, flexWrap: 'nowrap'},
                            ]}>
                            {showZeroStage && (count <= 0 || !isOnline) && (
                                <View
                                    key={0}
                                    style={[
                                        styles.stagesItem,
                                        {
                                            backgroundColor:
                                                zoneCardColors.stagesView.item
                                                    .unactive.background,
                                            borderColor:
                                                zoneCardColors.stagesView.item
                                                    .unactive.border,
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.stagesItemText,
                                            {
                                                color: zoneCardColors.stagesView
                                                    .item.unactive.text,
                                            },
                                            unactiveColorStyle,
                                        ]}>
                                        {0}
                                    </Text>
                                </View>
                            )}
                            {isOnline &&
                                count > 0 &&
                                Array.from({
                                    length: count,
                                }).map((value, index) => {
                                    const current =
                                        index + 1 ==
                                            item.props?.currentProps?.stage ??
                                        -1;
                                    const itemColors = current
                                        ? zoneCardColors.stagesView.item
                                              .selected
                                        : zoneCardColors.stagesView.item.base;
                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                styles.stagesItem,
                                                {
                                                    backgroundColor:
                                                        itemColors.background,
                                                    borderColor:
                                                        itemColors.border,
                                                },
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.stagesItemText,
                                                    {
                                                        color: itemColors.text,
                                                    },
                                                    unactiveColorStyle,
                                                ]}>
                                                {index + 1}
                                            </Text>
                                        </View>
                                    );
                                })}
                        </View>
                    </View>
                </CellBase>
            );
        };

        let temperatureView = <View />;
        if (item?.props?.currentProps?.state?.exitTemperature != undefined) {
            let degreeString = '';
            let scale = identity?.scale;
            let degreeStringValue =
                scale != undefined
                    ? scaledValueMap.temperature[scale] ??
                      modelInfo?.meta?.temperature
                    : modelInfo?.meta?.temperature;
            if (degreeStringValue) {
                degreeString = `°${degreeStringValue}`;
            }
            let degreeValue =
                item?.props?.currentProps?.state?.exitTemperature ?? 0;
            degreeValue =
                scale == Scale.Imperial
                    ? temperatureConvert(degreeValue, true)
                    : degreeValue;
            temperatureView = (
                <ValueCell
                    title={t('temperature')}
                    value={degreeValue + degreeString}
                    image={images.state.temperature}
                />
            );
        }

        let fanView1 = <View />;
        if (item?.props?.currentProps?.state?.fanPerformance1 != undefined) {
            fanView1 = (
                <ValueCell
                    image={images.state.fan}
                    title={t('fan-speed')}
                    value={item.props?.currentProps?.state.fanPerformance1 + '%'}
                    active={isOnline}
                />
            );
        }

        // let fanView2 = <View />;
        // if (item?.props?.currentProps?.state?.fanPerformance2 != undefined) {
        //     fanView2 = (
        //         <ValueCell
        //             image={images.state.fan}
        //             title={t('fan-speed') + ' 2'}
        //             value={item.props?.currentProps?.state.fanPerformance2 + '%'}
        //             active={isOnline}
        //         />
        //     );
        // }

        let totalTimeView = <View />;
        if (item?.props?.currentProps?.total != undefined) {
            totalTimeView = (
                <ValueCell
                    image={images.state.time}
                    title={t('total-time')}
                    value={toHHMM(item?.props?.currentProps?.total, false)}
                    active={isOnline}
                />
            );
        }

        let weightView = <View />;
        if (item?.props?.currentProps?.weight != undefined) {
            let scale = identity?.scale;
            let weightString =
                scale! + undefined
                    ? scaledValueMap.weight[scale] ??
                      modelInfo?.meta?.weight ??
                      ''
                    : modelInfo?.meta?.weight ?? '';

            let weight = item?.props?.currentProps?.weight ?? 0;
            let weightValue =
                scale == Scale.Imperial
                    ? temperatureConvert(weight / 1000, true).toFixed(2)
                    : (weight / 1000).toFixed(2);

            weightView = (
                <ValueCell
                    image={images.state.weight}
                    title={t('weight')}
                    value={weightValue + weightString}
                    active={isOnline}
                />
            );
        }

        let heatingView = <View />;
        if (item?.props?.currentProps?.state?.heatingIntensity != undefined) {
            heatingView = (
                <ValueCell
                    image={images.state.heating}
                    title={t('heating')}
                    value={
                        item.props?.currentProps?.state.heatingIntensity + '%'
                    }
                    active={isOnline}
                />
            );
        }

        // let powerView = <View />;
        // if (item?.props?.currentProps?.power != undefined) {
        //     let powerString = '';
        //     if (modelInfo && modelInfo.meta && modelInfo.meta.power) {
        //         powerString = ` ${modelInfo.meta.power}`;
        //     }
        //     powerView = (
        //         <ValueCell
        //             title={t('power')}
        //             value={
        //                 item?.props?.currentProps?.power.toFixed(3) + powerString
        //             }
        //             image={images.state.power}
        //         />
        //     );
        // }

        itemView = (
            <View style={styles.itemsView}>
                {stagesView(true, item.props?.amountOfStages > 0 && isOnline)}
                {temperatureView}
                {fanView1}
                {/* {fanView2} */}
                {totalTimeView}
                {weightFeatureEnabled && weightView}
                {heatingView}
                {/* {powerView} */}
            </View>
        );
    }

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={() => {
                if (onPress) onPress(item);
            }}>
            <Card>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <View style={{alignItems: 'baseline'}}>
                            <Text style={styles.zoneText}>
                                {`${t(`zones_${item?.base?.zone}`)} ${t(
                                    'zone',
                                )}`.toUpperCase()}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 4,
                                    paddingTop: 8,
                                }}>
                                {!isOffline && (
                                    <ZoneStateView
                                        itemMode={
                                            item?.props?.currentProps?.mode
                                        }
                                        showCircle={false}
                                    />
                                )}

                                <ZoneStateView
                                    state={
                                        item?.state ??
                                        ZoneAvailableState.Offline
                                    }
                                    showCircle={false}
                                />
                            </View>
                        </View>
                    </View>
                    {item != undefined && showPressButton && (
                        <View>
                            <DImageButton
                                source={images.moreVertical}
                                width={24}
                                height={24}
                                imageHeight={20}
                                imageWidth={20}
                                tintColor={zoneCardColors.moreButton}
                                onPress={() => {
                                    if (onPress) onPress(item);
                                }}
                            />
                        </View>
                    )}
                </View>
                {stateView}
                {!isOffline && !isScheduled && itemView}
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    zoneText: {
        ...fonts.h2,
        color: zoneCardColors.text.h2,
    },

    stateView: {gap: 12, marginTop: 20},

    activeStateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: zoneCardColors.separator,
        padding: 4,
        alignItems: 'center',
    },

    activeStateRowContent: {
        ...fonts.textSizeM,
        color: zoneCardColors.text.mainContent,
        lineHeight: undefined,
    },

    activeStateRowAdditionalContent: {
        ...fonts.textSizeXS,
        color: zoneCardColors.text.additionalContent,
        lineHeight: undefined,
    },

    itemsView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        backgroundColor: zoneCardColors.propertiesContainer.background,
        borderRadius: 8,
        padding: 16,
        gap: 4,
        rowGap: 20,
        marginTop: 20,
    },

    baseCell: {
        minWidth: '26%',
        flex: 1,
    },

    itemView: {
        gap: 4,
    },

    itemTitle: {
        ...fonts.textSizeXS,
        color: zoneCardColors.text.mainContent,
    },

    itemValue: {
        ...fonts.textSizeLL,
        color: zoneCardColors.text.mainContent,

        lineHeight: 28,
    },

    itemImage: {
        height: 18,
        width: 18,
        resizeMode: 'contain',
        tintColor: zoneCardColors.text.mainContent,
    },

    itemViewValueContainer: {
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'nowrap',
        gap: 4,
        alignItems: 'flex-end',
        height: RFValue(28, 812),
    },

    stagesItem: {
        borderWidth: 1,
        borderRadius: 2,
        justifyContent: 'center',
        width: 20,
        height: 20,
        alignItems: 'center',
        flexShrink: 1,
    },

    stagesItemText: {
        fontFamily: families.inter,
        fontSize: 15,
        lineHeight: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
});
