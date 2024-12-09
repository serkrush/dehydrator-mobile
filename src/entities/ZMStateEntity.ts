import {BaseEntity, HTTP_METHOD} from './BaseEntity';
import reducer from '../decorators/reducer';
import {ENTITY, Flag, STATUS_UPDATE_TIME} from '../constants';
import socket from 'src/decorators/socket';
import * as actionTypes from '../store/actions';
import {ICycleState} from 'src/store/types/MachineTypes';
import alias from 'src/decorators/alias';
import {SocketResponse} from 'src/socket/types';
import action from 'src/decorators/action';
import {call} from 'redux-saga/effects';

@alias('ZMStateEntity')
@reducer(ENTITY.ZMState)
@socket()
export default class ZMStateEntity extends BaseEntity<ZMStateEntity> {
    constructor(opts: any) {
        super(opts);
        this.initSchema(
            ENTITY.ZMState,
            {},
            {
                idAttribute: data => {
                    //console.log('idAttribute', data);
                    return `${data.machineId}_${data.zoneNumber}`;
                },
            },
        );
        this.completeStatusUpdate = this.completeStatusUpdate.bind(this);
        this.updateStatusUpdateInfo = this.updateStatusUpdateInfo.bind(this);
    }

    completeStatusUpdate() {
        const {redux} = this.di;
        const isCompleted = redux.state.box[Flag.StatusUpdateCompleted];

        if (!isCompleted) {
            redux.dispatch(
                actionTypes.setBox(
                    Flag.LastStatusUpdateTime,
                    new Date().getTime(),
                ),
            );

            redux.dispatch(
                actionTypes.setBox(Flag.StatusUpdateCompleted, true),
            );
        }
    }

    updateStatusUpdateInfo(pendingCount, setCompleteTimeout = true) {
        const {redux} = this.di;
        redux.dispatch(
            actionTypes.setBox(Flag.CountPendingStatusUpdate, pendingCount),
        );
        redux.dispatch(actionTypes.setBox(Flag.StatusUpdateReceived, 0));
        redux.dispatch(actionTypes.setBox(Flag.StatusUpdateCompleted, false));

        if (setCompleteTimeout) {
            const timer = setTimeout(() => {
                this.completeStatusUpdate();
                clearTimeout(timer);
            }, STATUS_UPDATE_TIME);
        }
    }

    protected onSocketEvent(response: any, code?: string, rawData?: any): void {
        const {redux} = this.di;
        switch (code) {
            case 'CONFIRM_STATUS':
                const updateReceived =
                    redux.state.box[Flag.StatusUpdateReceived] ?? 0;
                const updatePending =
                    redux.state.box[Flag.CountPendingStatusUpdate] ?? 0;
                redux.dispatch(
                    actionTypes.setBox(
                        Flag.StatusUpdateReceived,
                        updateReceived + 1,
                    ),
                );

                if (updateReceived + 1 >= updatePending) {
                    this.completeStatusUpdate();
                }
                break;
            case 'STATUS_UPDATE_COMPLETED':
                this.completeStatusUpdate();
                break;
        }
    }

    @action()
    public *updateAllMachinesStatuses() {
        const {redux} = this.di;
        redux.dispatch(actionTypes.setBox(Flag.StatusUpdateCompleted, false));
        redux.dispatch(
            actionTypes.setBox(
                Flag.LastStatusUpdateRequestTime,
                new Date().getTime(),
            ),
        );
        const machines = yield call(
            this.xRead,
            '/machines',
            {},
            HTTP_METHOD.POST,
        );

        const ids = Object.values(redux.state[ENTITY.MACHINE]).map(
            value => value.guid,
        );
        const {socket} = this.di;
        socket.start();
        const sessionKey = yield call(socket.getId);
        console.log('updateMachinesStatuses send', 'deviceIds', ids);
        const resData = yield call(this.xSave, '/machines/statuses', {
            deviceIds: ids,
            sessionKey,
        });
        console.log('updateMachinesStatuses resData', resData);
        if (resData.success) {
            this.updateStatusUpdateInfo(ids.length);
        } else {
            redux.dispatch(
                actionTypes.setBox(Flag.StatusUpdateCompleted, true),
            );
        }
    }

    @action()
    public *updateMachinesStatuses({deviceIds}) {
        const {socket} = this.di;
        const {redux} = this.di;
        redux.dispatch(actionTypes.setBox(Flag.StatusUpdateCompleted, false));
        socket.start();
        const sessionKey = yield call(socket.getId);
        console.log('updateMachinesStatuses send', 'deviceIds', deviceIds);
        const resData = yield call(this.xSave, '/machines/statuses', {
            deviceIds,
            sessionKey,
        });
        console.log('updateMachinesStatuses resData', resData);
        if (resData.success) {
            this.updateStatusUpdateInfo(deviceIds.length);
        } else {
            redux.dispatch(
                actionTypes.setBox(Flag.StatusUpdateCompleted, true),
            );
        }
    }
}
