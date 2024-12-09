import {Action} from 'redux';
import { RequestStatusAction } from './types/storeActionsTypes';
import {IHashData} from './reducers/hashReducer';

export const ERROR = 'ERROR';
export const ADD = 'ADD';
export const UPDATE = 'UPDATE';
export const GET = 'GET';
export const DELETE = 'DELETE';
export const DELETE_ALL = 'DELETE_ALL';

export const CRUD = [ADD, UPDATE, GET, DELETE, DELETE_ALL];

export const UPDATE_IDENTITY = 'UPDATE_IDENTITY';
export const UPDATE_IDENTITY_USERDATA = 'UPDATE_IDENTITY_USERDATA';
export const UPDATE_RULES = 'UPDATE_RULES';

export const SET_BOX = 'SET_BOX';
export const DELETE_BOX = 'DELETE_BOX';

export const SET_REQUEST_STATUS = 'SET_REQUEST_STATUS';

export const SET_ZM_STATE = 'SET_ZM_STATE';
export const SET_PM_STATE = 'SET_PM_STATE';

export const CONFIRM_PAIR = 'CONFIRM_PAIR';
export const CONFIRM_RESET = 'CONFIRM_RESET';
export const PAGE_FETCHING = 'PAGE_FETCHING';
export const PAGE_SET_FILTER = 'PAGE_SET_FILTER';
export const PAGE_CLEAR = 'PAGE_CLEAR';

export const SAVE_TO_HASH = 'SAVE_TO_HASH';
export const CLEAR_OUT_OF_DATE = 'CLEAR_OUT_OF_DATE';

export function action(type: string, payload = {}): Action {
    return {type, ...payload};
}

export const setBox = (key: string, value: any) =>
    action(SET_BOX, {key, value});

export const clearBox = (key: string) => action(SET_BOX, {key, undefined});

export const deleteBox = () => action(DELETE_BOX, {});

export const setRequestStatus = (data: Omit<RequestStatusAction, "type">) =>
    action(SET_REQUEST_STATUS, data);

export function pageFetching(pageName, page, isFetching, force = false) {
    return action(PAGE_FETCHING, {pageName, page, isFetching, force});
}
export function pageSetFilter(pageName, filter, sort) {
    return action(PAGE_SET_FILTER, {pageName, filter, sort});
}
export function pageClear(pageName) {
    return action(PAGE_CLEAR, {pageName});
}
export const saveToHash = (data: IHashData) => {
    return action(SAVE_TO_HASH, data);
};

export const clearOutOfDate = (outOfDateHashTime: number) => {
    return action(CLEAR_OUT_OF_DATE, {outOfDateHashTime});
};
