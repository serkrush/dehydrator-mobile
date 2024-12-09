import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import DText from '../DText';
import {toHHMM} from 'src/utils/toHHMM';
import BitSet from 'bitset';
import StageView from './StageView';
import {
    IMachine,
    ZoneAvailableState,
    ZoneInfo,
} from 'src/entities/models/Machine';
import StagesCardHeader from './StagesCardHeader';
import {colors} from 'src/theme';
import Card from '../views/Card';
import {useAcl} from 'src/hooks/useAcl';
import {GRANT} from '../../../acl/types';
import StageList from '../recipes/StageList';

const viewColors = {
    parameters: colors.card.base,
};

export default function CurrentZoneView({
    machine,
    currentItem,
    activeParams,
    setActiveParams,
    showDetailedInfo = false,
    currentStage,
    setCurrentStage,
    onStageAddPress,
    onStageDeletePress,
    sessionRunnedBy,
    t,
    setFieldValue,
    errors,
}: {
    machine?: IMachine;
    currentItem: ZoneInfo;
    activeParams;
    setActiveParams;
    currentStage;
    setCurrentStage;
    showDetailedInfo?: boolean;
    onStageAddPress?;
    onStageDeletePress?;
    sessionRunnedBy;
    t;
    setFieldValue;
    errors;
}) {
    const acl = useAcl();

    const isUserAllow = useMemo(() => {
        return acl.allow(GRANT.USER, `machine_${machine.id}`);
    }, [machine]);

    // const stageIndex = useMemo(() => {
    //     return currentItem.props.currentProps
    //         ? currentItem.props.currentProps.stage - 1
    //         : -1;
    // }, [currentItem]);

    // bit 0 - food drying cycle is active 1/0
    // bit 1 - food drying cycle is paused 1/0
    // bit 2 - cooling cycle is active 1/0
    // bit 3 - sanitization cycle is active 1/0
    const cycleIsActive = useMemo(() => {
        return currentItem != undefined &&
            currentItem.props.currentProps != undefined
            ? new BitSet(currentItem.props.currentProps.mode).get(0) != 0
            : false;
    }, [currentItem]);

    const cycleIsPaused = useMemo(() => {
        return currentItem != undefined &&
            currentItem.props.currentProps != undefined
            ? new BitSet(currentItem.props.currentProps.mode).get(1) != 0
            : false;
    }, [currentItem]);

    const cycleIsCooling = useMemo(() => {
        return currentItem != undefined &&
            currentItem.props.currentProps != undefined
            ? new BitSet(currentItem.props.currentProps.mode).get(2) != 0
            : false;
    }, [currentItem]);

    const cycleIsSanitization = useMemo(() => {
        return currentItem != undefined &&
            currentItem.props.currentProps != undefined
            ? new BitSet(currentItem.props.currentProps.mode).get(3) != 0
            : false;
    }, [currentItem]);

    const cycleIsScheduled = currentItem.state == ZoneAvailableState.Scheduled;

    // const items =
    //     cycleIsPaused || cycleIsScheduled
    //         ? activeParams ?? currentItem.props.params
    //         : currentItem.props.params;

    // const item =
    //     cycleIsPaused || cycleIsScheduled
    //         ? activeParams[currentStage] ??
    //           currentItem.props.params[currentStage]
    //         : currentItem.props.params[currentStage];

    const readOnly =
        !isUserAllow || (cycleIsScheduled ? false : !cycleIsPaused);

    return (
        <ScrollView>
            <StageList
                data={activeParams}
                stageActive={currentStage}
                setStageActive={setCurrentStage}
                handleRemove={onStageDeletePress}
                handleAdd={onStageAddPress}
                setFieldValue={setFieldValue}
                typeSession={sessionRunnedBy}
                errors={errors}
                readOnly={readOnly}
            />
            {/* <Card style={{gap: 24}}>
                <StagesCardHeader
                    stages={
                        cycleIsPaused || cycleIsScheduled
                            ? activeParams ?? currentItem.props.params
                            : currentItem.props.params
                    }
                    currentStage={currentStage}
                    setCurrentStage={setCurrentStage}
                    showAddButtons={isUserAllow && cycleIsScheduled}
                    onStageAddPress={onStageAddPress}
                    onStageDeletePress={onStageDeletePress}
                    disabled={readOnly}
                />
                {item != undefined && (
                    <StageView
                        machine={machine}
                        stageState={activeParams[currentStage]}
                        key={currentStage}
                        item={item}
                        number={currentStage + 1}
                        readOnly={
                            !isUserAllow ||
                            (cycleIsScheduled
                                ? false
                                : !cycleIsPaused || currentStage < stageIndex)
                        }
                        runnedBy={sessionRunnedBy}
                        isLastStage={currentStage >= items.length - 1}
                    />
                )}
            </Card> */}
            {showDetailedInfo && (
                <View>
                    {currentItem!.props.currentProps?.state &&
                        Object.keys(currentItem!.props.currentProps?.state).map(
                            (key, index) => {
                                return (
                                    <View
                                        key={`state-${index}`}
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}>
                                        <DText
                                            key={key}
                                            text={key}
                                            textStyle={{color: 'black'}}
                                        />
                                        <DText
                                            key={`${key}-value`}
                                            text={
                                                currentItem!.props.currentProps
                                                    ?.state[key]
                                            }
                                            textStyle={{color: 'black'}}
                                        />
                                    </View>
                                );
                            },
                        )}
                    {currentItem &&
                        currentItem.props.currentProps &&
                        Object.keys(currentItem.props.currentProps).map(
                            (key, index) => {
                                if (key == 'state' || key == 'params') {
                                    return <View />;
                                }
                                return (
                                    <View
                                        key={`state-${index}`}
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}>
                                        <DText
                                            key={key}
                                            text={key}
                                            textStyle={{color: 'black'}}
                                        />
                                        <DText
                                            key={`${key}-value`}
                                            text={
                                                currentItem.props.currentProps![
                                                    key
                                                ]
                                            }
                                            textStyle={{color: 'black'}}
                                        />
                                    </View>
                                );
                            },
                        )}

                    {currentItem?.props.currentProps != undefined && (
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <DText
                                    key={'duration'}
                                    text={'duration'}
                                    textStyle={{color: 'black'}}
                                />
                                <DText
                                    key={'duration-value'}
                                    text={toHHMM(
                                        currentItem!.props.currentProps
                                            .duration,
                                    )}
                                    textStyle={{color: 'black'}}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <DText
                                    key={'status'}
                                    text={'status'}
                                    textStyle={{color: 'black'}}
                                />
                                <DText
                                    key={'status-value'}
                                    text={new BitSet(
                                        currentItem!.props.currentProps.mode,
                                    ).get(0)}
                                    //text={currentItem!.status}
                                    textStyle={{color: 'black'}}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <DText
                                    key={'stage'}
                                    text={'stage'}
                                    textStyle={{color: 'black'}}
                                />
                                <DText
                                    key={'stage-value'}
                                    text={currentItem.props.currentProps.stage}
                                    //text={currentItem!.status}
                                    textStyle={{color: 'black'}}
                                />
                            </View>
                        </View>
                    )}
                    {!cycleIsScheduled && (
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <DText
                                    textStyle={{color: 'black'}}
                                    text={t('is-active') + ': '}
                                />
                                <DText
                                    textStyle={{color: 'black'}}
                                    text={`${cycleIsActive}`}
                                />
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <DText
                                    textStyle={{color: 'black'}}
                                    text={t('is-paused') + ': '}
                                />
                                <DText
                                    textStyle={{color: 'black'}}
                                    text={`${cycleIsPaused}`}
                                />
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <DText
                                    textStyle={{color: 'black'}}
                                    text={t('is-cooling') + ': '}
                                />
                                <DText
                                    textStyle={{color: 'black'}}
                                    text={`${cycleIsCooling}`}
                                />
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <DText
                                    textStyle={{color: 'black'}}
                                    text={t('is-sanitization') + ': '}
                                />
                                <DText
                                    textStyle={{color: 'black'}}
                                    text={`${cycleIsSanitization}`}
                                />
                            </View>
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
