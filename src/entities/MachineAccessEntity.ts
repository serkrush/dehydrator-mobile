import {BaseEntity, HTTP_METHOD} from './BaseEntity';
import reducer from '../decorators/reducer';
import {ENTITY, Flag} from '../constants';
import action from '../../src/decorators/action';
import * as actionTypes from '../store/actions';
import {call, put} from 'redux-saga/effects';
import {Alert} from 'react-native';
import alias from 'src/decorators/alias';

@alias('MachineAccessEntity')
@reducer(ENTITY.ACCESS)
export default class MachineAccessEntity extends BaseEntity<MachineAccessEntity> {
    constructor(opts: any) {
        super(opts);
        this.initSchema(ENTITY.ACCESS, {}, {});
    }

    @action()
    public *sharePermissions({data}) {
        const {t} = this.di;
        const resData = yield call(this.xSave, '/machines/access/share', {
            data,
        });
        if (resData.success) {
            Alert.alert(t('permission-shared-success'));
        } else {
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *getAccessForUser({userId}) {
        const {t} = this.di;
        const resData = yield call(
            this.xRead,
            `/users/${userId}/access`,
            {},
            HTTP_METHOD.POST,
        );
        if (resData.success) {
        } else {
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *getAccess({data}) {
        const {t} = this.di;
        const resData = yield call(
            this.xRead,
            '/users/access',
            {},
            HTTP_METHOD.POST,
        );
        if (resData.success) {
        } else {
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *deleteMachineAccess({userId, machineId, checkFlag}) {
        if (machineId == undefined) {
            Alert.alert('invalid-data');
            return;
        }
        yield put(actionTypes.setBox(checkFlag, Flag.ACTION_START));
        const resData = yield call(
            this.xRead,
            `/users/${userId}/access/delete`,
            {machineId},
            HTTP_METHOD.POST,
        );
        if (resData.success) {
            const {t, Identity} = this.di;
            yield call(Identity.updateIdentity, {force: true});
            Alert.alert(t('success-delete-machine'));
            yield put(
                actionTypes.action(actionTypes.DELETE, {
                    payload: {
                        data: {
                            entities: {
                                [ENTITY.MACHINE]: {
                                    [machineId]: {id: machineId},
                                },
                            },
                        },
                    },
                }),
            );
            yield put(actionTypes.setBox(checkFlag, Flag.ACTION_SUCCESS));
        } else {
            yield put(actionTypes.setBox(checkFlag, Flag.ACTION_FAILURE));
            this.handleUnsuccessResponse(resData?.response);
        }
    }
}
