import {
    DEFAULT_LANGUAGE_CODE,
    DEFAULT_SCALE,
    DEFAULT_TIMEZONE,
    Flag,
} from 'src/constants';
import {DELETE_BOX, SET_BOX} from '../actions';

const initialBox = {
    [Flag.IsFirstStart]: true,
    [Flag.AppSettings]: {
        language: DEFAULT_LANGUAGE_CODE,
        timezone: DEFAULT_TIMEZONE,
        scale: DEFAULT_SCALE,
    },
};

function box(state = initialBox, action: any) {
    const {type} = action;
    //console.log("box call", action.type)
    if (type === SET_BOX) {
        return {
            ...state,
            [action.key]: action.value,
        };
    }
    if (type === DELETE_BOX) {
        return {
            [Flag.IsFirstStart]: state[Flag.IsFirstStart],
            [Flag.AppSettings]: state[Flag.AppSettings],
        };
    }
    return state;
}

export default box;
