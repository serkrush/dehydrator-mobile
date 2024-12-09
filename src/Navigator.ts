import {
    NavigationContainerRefWithCurrent,
    NavigationState,
    PartialState,
    createNavigationContainerRef,
} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';
import BaseContext from './BaseContext';

export default class Navigator extends BaseContext {
    private _ref: NavigationContainerRefWithCurrent<any>;
    constructor(opts: any) {
        super(opts);
        this._ref = createNavigationContainerRef();
        this._ref.addListener('state', this.onRouteChange);
    }

    public get ref(): any {
        return this._ref;
    }

    private onRouteChange = () => {
        const {
            Identity,
            redux: {dispatch, state},
        } = this.di;

        // const {identity} = state();
        // if (identity?.user?.userId) {
        //     dispatch(Identity.actions.updateIdentity());
        // }
    };

    public navigate = (name: string, params?: object) => {
        if (this._ref.isReady()) {
            this._ref.navigate(name, params);
        }
    };

    public pop = () => {
        if (this._ref.isReady()) {
            this._ref.dispatch(StackActions.pop());
        }
    };

    public push = (name: string, params?: object) => {
        if (this._ref.isReady()) {
            this._ref.dispatch(StackActions.push(name, params));
        }
    };

    public replace = (name: string, params?: object) => {
        if (this._ref.isReady()) {
            this._ref.dispatch(StackActions.replace(name, params));
        }
    };

    public currentRouteName = () => {
        return this._ref.getCurrentRoute()?.name;
    };

    public reset = (state: PartialState<NavigationState> | NavigationState) => {
        this._ref.reset(state);
    };
}
