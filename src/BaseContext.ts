import {IContextContainer} from './container';

export default class BaseContext {
    protected di: IContextContainer;

    constructor(opts: IContextContainer) {
        this.di = opts;
    }
}
