import {SET_REQUEST_STATUS} from '../actions';

const initialFlagger = {};

function requestStatusReducer(state = initialFlagger, action: any) {
    const {type} = action;
    //console.log('requestStatusReducer call', action.type, action.entityName);
    if (type === SET_REQUEST_STATUS) {
        return {
            ...state,
            [action.entityName]: {
                status: action.status,
                data: {...action.data},
                actionType: action.actionType,
            },
        };
    }
    return state;
}

export default requestStatusReducer;
