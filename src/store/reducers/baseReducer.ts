import {ENTITY, StoreAction} from '../../constants';
import * as actionTypes from '../actions';

type StoreState = {};

const initialState: StoreState = {};

const baseReducer =
    (entityReducer: string) =>
    (state: StoreState = initialState, action: StoreAction): StoreState => {
        switch (action.type) {
            case actionTypes.GET:
            case actionTypes.ADD:
            case actionTypes.UPDATE:
                if (action.payload) {
                    const entitiesArr = action.payload.data.entities;
                    let newValues: any = {};

                    if (entitiesArr && entityReducer in entitiesArr) {
                        const newData = entitiesArr[entityReducer];
                        newValues = [
                            state[entityReducer] ?? {},
                            newData ?? {},
                        ].reduce(function (r, o) {
                            Object.keys(o).forEach(function (k) {
                                r[k] = o[k];
                            });
                            return r;
                        }, {});
                    }

                    return {
                        ...state,
                        ...newValues,
                    };
                }
                break;
            case actionTypes.DELETE:
                if (action.payload) {
                    const entitiesArr = action.payload.data.entities;
                    if (entitiesArr && entityReducer in entitiesArr) {
                        const dataForDelete = entitiesArr[entityReducer];
                        const newValues = {...state};
                        Object.keys(dataForDelete).forEach(key => {
                            if (newValues.hasOwnProperty(key)) {
                                delete newValues[key];
                            }
                        });
                        return {
                            ...newValues,
                        };
                    }
                }
                break;
            case actionTypes.DELETE_ALL:
                if (action.payload) {
                    const entitiesArr = action.payload.data.entities;
                    if (entitiesArr && entityReducer in entitiesArr) {
                        return {};
                    }
                }
                break;
        }
        return state;
    };

export default baseReducer;
