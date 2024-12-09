import BitSet from 'bitset';
import {ColorValue} from 'react-native';
import {
    ZoneAdditionalStatus,
    ZoneAvailableState,
} from 'src/entities/models/Machine';
import {colors} from 'src/theme';

export interface CardColors {
    content: ColorValue;
    border: ColorValue;
    background: ColorValue;
}

const colorsForState = (state: ZoneAvailableState): CardColors => {
    return colors.zoneState.main[state];
};

const colorsForAdditionalStatus = (
    status: ZoneAdditionalStatus,
): CardColors => {
    return colors.zoneState.additional[status];
};

export {colorsForState, colorsForAdditionalStatus};
