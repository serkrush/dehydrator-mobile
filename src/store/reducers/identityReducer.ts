import { ROLE } from '../../../acl/types';
import {StoreAction} from '../../constants';
import * as actionTypes from '../actions';

export const GUEST_IDENTITY = {
    userId: ROLE.GUEST,
    role: ROLE.GUEST,
    locale: 'en-US',
    timezone: 'america/arizona',
    languageCode: 'enUS',
    countryCode: 'US',
    scale: 'metric',
};

type IdentityState = {};

const initialState = {
    identity: GUEST_IDENTITY
}

const identityReducer = (
    state = initialState as any,
    action: StoreAction,
): IdentityState => {
    switch (action.type) {
        case actionTypes.UPDATE_IDENTITY: {
            return {
                ...action.payload.data,
            };
        }
        case actionTypes.UPDATE_IDENTITY_USERDATA: {
            console.log('state', state, 'data', action.payload.data);
            return {
                ...state,
                identity: {
                    ...state.identity,
                    firstName: action.payload.data.firstName,
                    lastName: action.payload.data.lastName,
                    userEmail: action.payload.data.email,
                    languageCode: action.payload.data.languageCode,
                    countryCode: action.payload.data.countryCode,
                    scale: action.payload.data.scale,
                },
            };
        }
        case actionTypes.UPDATE_RULES: {
            return {
                ...state,
                rules: {
                    ...action.payload.data,
                },
            };
        }
    }
    return state;
};

export default identityReducer;
