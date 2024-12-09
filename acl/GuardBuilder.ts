import {Alert} from 'react-native';
import BaseContext from 'src/BaseContext';
import {IContextContainer} from 'src/container';
import {AuthState} from 'src/store/types/stateTypes';
import Guard from './Guard';
import {roles as baseRoles, rules as baseRules} from './config.acl';
import {GRANT, ROLE} from './types';

export default class GuardBuilder extends BaseContext {
    private guard;
    private authState: AuthState;
    constructor(opts: IContextContainer) {
        super(opts);
        this.rebuild();
        this.rebuild = this.rebuild.bind(this);
        this.allow = this.allow.bind(this);
        this.isItMe = this.isItMe.bind(this);
        this.checkCurrentRoute = this.checkCurrentRoute.bind(this);
    }

    public rebuild() {
        this.authState = this.di.redux.store.getState()?.auth;
        this.guard = new Guard(
            {...baseRoles, ...this.authState.roles},
            {...baseRules, ...this.authState.rules},
        );
        if (this.authState.identity) {
            this.guard.build(this.authState.identity);
        }
    }

    public allow(grant: GRANT, res: string = null, role: ROLE = null) {
        if (this.authState !== this.di.redux.store.getState()?.auth) {
            this.rebuild();
        }
        const r = res ?? this.di.navigator.currentRouteName();
        return this.guard.allow(grant, r, null, role);
    }

    public isItMe(userId: string) {
        return this.identity.userId === userId;
    }

    public get identity() {
        return this.authState.identity;
    }

    public checkCurrentRoute() {
        const currentRouteName = this.di.navigator.currentRouteName();
        if (!this.guard.allow(GRANT.READ, currentRouteName)) {
            console.log('error resource', currentRouteName);
            Alert.alert('error resource');
            this.di.navigator.pop();
            this.di.navigator.push('NotAccessedScreen');
        }
    }
}
