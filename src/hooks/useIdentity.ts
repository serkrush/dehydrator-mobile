import {IIdentity} from 'acl/types';
import {useSelector} from 'react-redux';
import {AppState} from 'src/constants';

export const useIdentity = (): IIdentity => {
    return useSelector((state: AppState) => {
        return state.auth.identity;
    });
};
