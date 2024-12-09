import {BaseEntity, HTTP_METHOD} from './BaseEntity';
import reducer from '../decorators/reducer';
import {ENTITY, Flag} from '../constants';
import action from '../../src/decorators/action';
import * as actionTypes from '../store/actions';
import {call, put} from 'redux-saga/effects';
import {Alert} from 'react-native';
import alias from 'src/decorators/alias';
import {schema} from 'normalizr';
import { PushCRUDData } from 'src/pusher/types';

@alias('MachineGroupEntity')
@reducer(ENTITY.GROUP)
export default class MachineGroupEntity extends BaseEntity<MachineGroupEntity> {
    constructor(opts: any) {
        super(opts);
        const access = new schema.Entity(ENTITY.ACCESS, {}, {});
        this.initSchema(ENTITY.GROUP, {access}, {});
    }

    @action()
    public *addGroup({data}) {
        //const {t, Flagger} = this.di;
        const {t, redux, Identity} = this.di;
        const resData = yield call(this.xSave, `/machines/groups/create`, {
            data,
        });
        if (resData.success) {
            console.log('resDAta', resData);
            yield call(
                redux.dispatch,
                actionTypes.setBox(
                    Flag.CurrentUpdatedGroupId,
                    resData?.response?.data?.id,
                ),
            );
            yield call(Identity.updateIdentity, {force: true});
            Alert.alert(t('group-added-success'));
            // yield call(Flagger.setFlagger, {
            //   key: Flag.CurrentUpdatedGroupId,
            //   value: resData?.response?.data?.id,
            // });
        } else {
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *updateGroup({data}) {
        const {t} = this.di;
        const token = yield call(this.di.Firebase.getFCMToken);
        const resData = yield call(
            this.xSave,
            `/machines/groups/${data.id}/update`,
            {data, excludedFCM: [token]},
        );
        if (resData) {
            if (resData?.success) {
                const {Identity} = this.di;
                yield call(Identity.updateIdentity, {force: true});
                Alert.alert(t('group-updated-success'));
            } else {
                this.handleUnsuccessResponse(resData?.response);
            }
        } else {
            Alert.alert(t('default-error-message'));
        }
    }

    @action()
    public *deleteGroup({data, checkFlag}) {
        yield put(actionTypes.setBox(checkFlag, Flag.ACTION_START));
        const {t} = this.di;
        const resData = yield call(
            this.xDelete,
            `/machines/groups/${data.id}/delete`,
            {},
        );
        if (resData) {
            if (resData?.success) {
                Alert.alert(t('group-deleted-success'));
                yield put(actionTypes.setBox(checkFlag, Flag.ACTION_SUCCESS));
            } else {
                yield put(actionTypes.setBox(checkFlag, Flag.ACTION_FAILURE));
                this.handleUnsuccessResponse(resData?.response);
            }
        } else {
            Alert.alert(t('default-error-message'));
            yield put(actionTypes.setBox(checkFlag, Flag.ACTION_FAILURE));
        }
    }

    @action()
    public *getGroupsForUser({}) {
        //const {Flagger} = this.di;
        const {redux} = this.di;
        const resData = yield call(
            this.xRead,
            `/machines/groups`,
            {},
            HTTP_METHOD.POST,
        );
        if (resData.success) {
            yield call(
                redux.dispatch,
                actionTypes.setBox(Flag.GroupsReceived, true),
            );
            //yield call(Flagger.setFlagger, {key: Flag.GroupsReceived, value: true});
        } else {
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *getAccessedGrousForUser({userId}) {
        const {t} = this.di;
        const resData = yield call(
            this.xRead,
            `/users/${userId}/access/machines/groups`,
            {},
            HTTP_METHOD.POST,
        );
        if (resData.success) {
        } else {
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *getMachineGroupsUpdates({ids}: {ids: string[]}) {
        const resData = yield call(
            this.xSave,
            `/machines/groups`,
            {ids},
            HTTP_METHOD.POST,
            true,
            true,
        );
    }

    pushUpdate(data: PushCRUDData) {
        console.log('MACHINE_GROUP_ENTITY push update action', data);
        const {redux} = this.di;
        redux.dispatch(this.actions['getMachineGroupsUpdates']({ids: data.ids}));
    }
}
