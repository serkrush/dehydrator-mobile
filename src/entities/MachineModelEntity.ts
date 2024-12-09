import {call} from 'redux-saga/effects';
import alias from 'src/decorators/alias';
import action from '../../src/decorators/action';
import {ENTITY} from '../constants';
import reducer from '../decorators/reducer';
import {BaseEntity, HTTP_METHOD} from './BaseEntity';

@alias('MachineModelEntity')
@reducer(ENTITY.MACHINE_MODEL)
export default class MachineModelEntity extends BaseEntity<MachineModelEntity> {
    constructor(opts: any) {
        super(opts);
        this.initSchema(ENTITY.MACHINE_MODEL, {}, {});
    }

    @action()
    public *getModelsInfo({}) {
        const resData = yield call(
            this.xRead,
            '/machines/models',
            {},
            HTTP_METHOD.POST,
        );
    }

    @action()
    public *getModelsById(modelId: string) {
        yield call(this.xRead, `/machines/models/${modelId}`);
    }
}
