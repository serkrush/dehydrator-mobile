import {useContext, useMemo} from 'react';
import ContainerContext from 'src/ContainerContext';
import {GRANT, IIdentity, ROLE} from '../../acl/types';

interface IUseAclResult {
    allow: (grant?: GRANT, res?: string, role?: ROLE) => boolean;
    isItMe: (userId: string, slug?: string) => boolean;
    identity: IIdentity;
}

export const useAcl = (): IUseAclResult => {
    const container = useContext(ContainerContext);
    const guard = container.resolve('guard');
    guard.checkCurrentRoute();

    const acl = useMemo(() => {
        return {
            allow: guard.allow,
            isItMe: guard.isItMe,
            identity: guard.identity,
        };
    }, [guard.allow, guard.isItMe, guard.identity]);

    return acl;
};
