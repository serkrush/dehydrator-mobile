import BitSet from 'bitset';
import {ColorValue} from 'react-native';
import {
    ZoneAdditionalStatus,
    ZoneAvailableState,
} from 'src/entities/models/Machine';
import { statusNumberToStatus } from './statusNumberToStatus';

const textForState = (
    t,
    state: ZoneAvailableState,
): string => {
    return t(state);
};

const textForStatus = (
    t,
    cycleMode: number,
): string => {
    return t(statusNumberToStatus(cycleMode))
};

const colorForAdditionalStatus = (
    status: ZoneAdditionalStatus,
): ColorValue | undefined => {
    switch (status) {
        case ZoneAdditionalStatus.None:
            return undefined;
        case ZoneAdditionalStatus.Cooling:
            return '#2196F3';
        case ZoneAdditionalStatus.Paused:
            return '#FFEB3B';
        case ZoneAdditionalStatus.Cleaning:
            return '#C0CA33';
    }
};

const backgroundColorForAdditionalStatus = (
    status: ZoneAdditionalStatus,
): ColorValue | undefined => {
    switch (status) {
        case ZoneAdditionalStatus.None:
            return undefined;
        case ZoneAdditionalStatus.Cooling:
            return '#2196F31A';
        case ZoneAdditionalStatus.Paused:
            return '#FFEB3B1A';
        case ZoneAdditionalStatus.Cleaning:
            return '#C0CA331A';
    }
};

const colorForState = (
    state: ZoneAvailableState,
    cycleMode?: number,
): ColorValue => {
    const cycleIsActive =
        cycleMode != undefined ? new BitSet(cycleMode).get(0) != 0 : false;
    const cycleIsPaused =
        cycleMode != undefined ? new BitSet(cycleMode).get(1) != 0 : false;
    const cycleIsCooling =
        cycleMode != undefined ? new BitSet(cycleMode).get(2) != 0 : false;
    const cycleIsSanitization =
        cycleMode != undefined ? new BitSet(cycleMode).get(3) != 0 : false;

    let additionalStatus = ZoneAdditionalStatus.None;
    if (cycleIsPaused) {
        additionalStatus = ZoneAdditionalStatus.Paused;
    } else if (cycleIsCooling) {
        additionalStatus = ZoneAdditionalStatus.Cooling;
    } else if (cycleIsSanitization) {
        additionalStatus = ZoneAdditionalStatus.Cleaning;
    }

    switch (state) {
        case ZoneAvailableState.Available:
            return colorForAdditionalStatus(additionalStatus) ?? '#9747FF';
        case ZoneAvailableState.InProgress:
            return colorForAdditionalStatus(additionalStatus) ?? '#28B446';
        case ZoneAvailableState.Scheduled:
            return '#FBBB00';
        case ZoneAvailableState.Offline:
            return '#ADADAD';
        case ZoneAvailableState.Error:
            return '#F14336';
    }
};

const backgroundColorForState = (
    state: ZoneAvailableState,
    cycleMode?: number,
): ColorValue => {
    const cycleIsActive =
        cycleMode != undefined ? new BitSet(cycleMode).get(0) != 0 : false;
    const cycleIsPaused =
        cycleMode != undefined ? new BitSet(cycleMode).get(1) != 0 : false;
    const cycleIsCooling =
        cycleMode != undefined ? new BitSet(cycleMode).get(2) != 0 : false;
    const cycleIsSanitization =
        cycleMode != undefined ? new BitSet(cycleMode).get(3) != 0 : false;

    let additionalStatus = ZoneAdditionalStatus.None;
    if (cycleIsPaused) {
        additionalStatus = ZoneAdditionalStatus.Paused;
    } else if (cycleIsCooling) {
        additionalStatus = ZoneAdditionalStatus.Cooling;
    } else if (cycleIsSanitization) {
        additionalStatus = ZoneAdditionalStatus.Cleaning;
    }

    switch (state) {
        case ZoneAvailableState.Available:
            return (
                backgroundColorForAdditionalStatus(additionalStatus) ??
                '#9747FF1A'
            );
        case ZoneAvailableState.InProgress:
            return (
                backgroundColorForAdditionalStatus(additionalStatus) ??
                '#28B4461A'
            );
        case ZoneAvailableState.Scheduled:
            return '#FBBB001A';
        case ZoneAvailableState.Offline:
            return '#ADADAD1A';
        case ZoneAvailableState.Error:
            return '#F143361A';
    }
};

export {colorForState, backgroundColorForState, textForState};
