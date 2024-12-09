import {BaseEntity, HTTP_METHOD} from './BaseEntity';
import reducer from '../decorators/reducer';
import {
    ENTITY,
    Flag,
    MachinePairRequestResult,
    MachineResetRequestResult,
    RequestStatus,
    SocketAction,
} from '../constants';
import action from '../../src/decorators/action';
import * as actionTypes from '../store/actions';
import {call, delay, fork, put, take} from 'redux-saga/effects';
import {Alert} from 'react-native';
import {ProcessAction} from 'src/socket/SocketClient';
import {AdvancedSettings, IMachine} from './models/Machine';
import {SocketPayload} from 'src/socket/types';
import socket from 'src/decorators/socket';
import alias from 'src/decorators/alias';
import {enumFromStringValue} from 'src/utils/enumFromStringValue';
import push from 'src/decorators/push';
import type {PushCRUDData, PushNotificationData} from 'src/pusher/types';

@alias('MachineEntity')
@reducer(ENTITY.MACHINE)
@socket()
export default class MachineEntity extends BaseEntity<MachineEntity> {
    constructor(opts: any) {
        super(opts);
        this.initSchema(ENTITY.MACHINE, {}, {});
    }

    protected onSocketEvent(response: any, code?: string, rawData?: any): void {
        // console.log(
        //     'ONSOCKETEVENT',
        //     'response',
        //     response,
        //     'code',
        //     code,
        //     'raw',
        //     rawData,
        // );
        const {redux, t, MachineAccessEntity} = this.di;
        switch (code) {
            case actionTypes.CONFIRM_RESET:
                if (response.result) {
                    redux.dispatch(
                        actionTypes.action(actionTypes.CONFIRM_RESET, {
                            id: response.result,
                        }),
                    );
                } else {
                    if (rawData?.data?.machineId) {
                        redux.dispatch(
                            actionTypes.action(actionTypes.CONFIRM_RESET, {
                                id: rawData.data.machineId,
                            }),
                        );
                    } else {
                        let allOk = false;
                        const guid = rawData?.data?.machineGuid;
                        if (guid != undefined) {
                            const machines = Object.values(
                                redux.state.machines,
                            );

                            const machine = machines.find(value => {
                                return value.guid == guid;
                            });

                            if (machine != undefined) {
                                redux.dispatch(
                                    actionTypes.action(
                                        actionTypes.CONFIRM_RESET,
                                        {
                                            id: machine.id,
                                        },
                                    ),
                                );
                                allOk = true;
                            }
                        }
                        if (!allOk) {
                            redux.dispatch(
                                actionTypes.action(actionTypes.CONFIRM_RESET, {
                                    error: t('wrong-pair-data'),
                                }),
                            );
                        }
                    }
                }
                break;
            case actionTypes.CONFIRM_PAIR:
                if (response.result) {
                    redux.dispatch(
                        actionTypes.action(actionTypes.CONFIRM_PAIR, {
                            id: response.result,
                        }),
                    );
                } else {
                    if (rawData?.data?.machine) {
                        redux.dispatch(
                            this.normalizedAction(
                                rawData.data.machine,
                                actionTypes.ADD,
                            ),
                        );
                    }
                    if (rawData?.data?.access) {
                        redux.dispatch(
                            MachineAccessEntity.normalizedAction(
                                rawData?.data?.access,
                            ),
                        );
                    }
                    if (rawData?.data?.rules) {
                        redux.dispatch(
                            actionTypes.action(actionTypes.UPDATE_RULES, {
                                payload: {
                                    data: rawData.data.rules,
                                },
                            }),
                        );
                    }
                    if (rawData?.data?.machine?.id) {
                        redux.dispatch(
                            actionTypes.action(actionTypes.CONFIRM_PAIR, {
                                id: rawData.data.machine.id,
                            }),
                        );
                    } else {
                        redux.dispatch(
                            actionTypes.action(actionTypes.CONFIRM_PAIR, {
                                error: t('wrong-pair-data'),
                            }),
                        );
                    }
                }
                break;
        }
    }

    @action()
    public *pairConnected({data}) {
        const {t, navigator, redux, socket, config} = this.di;
        yield call(socket.start, config?.pairSocketLiveTimeout ?? 60000);
        const connectionId = yield call(socket.getId);
        const resData = yield call(this.xSave, '/machines/pair', {
            machineData: data,
            connectionId,
        });
        console.log('pairConnected resData', resData);
        if (resData.success) {
            const result = resData.response.data.result;
            const requestResult =
                enumFromStringValue(MachinePairRequestResult, result) ??
                MachinePairRequestResult.Requested;

            switch (requestResult) {
                case MachinePairRequestResult.NotOwner:
                    Alert.alert(t('not-owner'));
                    break;
                case MachinePairRequestResult.Existed:
                    const machineData = resData.response.data.machineData;
                    if (machineData) {
                        redux.dispatch(
                            actionTypes.setBox(
                                Flag.CurrentUpdatedMachineId,
                                machineData.id,
                            ),
                        );
                        console.log('navigate to EditDehydrator');
                        console.log('=== navigator', navigator);
                        console.log(
                            '=== navigator',
                            navigator,
                            'navigate',
                            navigator.navigate,
                        );
                        navigator.navigate('EditDehydrator');
                    }
                    break;
                case MachinePairRequestResult.Requested:
                    //Alert.alert(t('machine-pair-request-success'));
                    let timeout: NodeJS.Timeout | undefined;
                    yield fork(() => {
                        timeout = setTimeout(() => {
                            redux.dispatch(
                                actionTypes.action(actionTypes.CONFIRM_PAIR, {
                                    error: t('pair-timeout'),
                                }),
                            );
                        }, config?.pairTimeout ?? 20000);
                    });
                    console.log('BEFORE TAKE');
                    redux.dispatch(
                        actionTypes.setBox(Flag.ConfirmPairRequested, true),
                    );

                    const data = yield take(actionTypes.CONFIRM_PAIR);
                    console.log('AFTER TAKE', data);
                    redux.dispatch(
                        actionTypes.setBox(Flag.ConfirmPairRequested, false),
                    );
                    clearTimeout(timeout);
                    if (data.error) {
                        Alert.alert(t('error'), t(data.error));
                    } else {
                        const {UserEntity} = this.di;
                        const userInfo = yield call(
                            UserEntity.getUserDetailed,
                            {
                                uid: redux.state.auth.identity.userId,
                                flag: Flag.UserInfosReceived,
                                force: true,
                            },
                        );
                        redux.dispatch(
                            actionTypes.setBox(
                                Flag.CurrentUpdatedMachineId,
                                data.id,
                            ),
                        );
                        console.log('navigate to EditDehydrator');
                        console.log('=== navigator', navigator);
                        console.log(
                            '=== navigator',
                            navigator,
                            'navigate',
                            navigator.navigate,
                        );
                        navigator.navigate('EditDehydrator');
                    }

                    break;
            }
        } else {
            yield call(
                redux.dispatch,
                actionTypes.clearBox(Flag.CurrentUpdatedMachineId),
            );
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *resetConnected({machineGuid, checkFlag}) {
        const {t, navigator, redux, socket, config} = this.di;
        yield put(actionTypes.setBox(checkFlag, Flag.ACTION_START));
        yield call(socket.start, config?.resetSocketLiveTimeout ?? 60000);
        const connectionId = yield call(socket.getId);
        const resData = yield call(this.xSave, '/machines/reset', {
            machineGuid,
            connectionId,
        });
        console.log('resetConnected resData', resData);
        if (resData.success) {
            const result = resData.response.data.result;
            const requestResult =
                enumFromStringValue(MachineResetRequestResult, result) ??
                MachineResetRequestResult.Requested;

            switch (requestResult) {
                case MachineResetRequestResult.NotOwner:
                    yield put(
                        actionTypes.setBox(checkFlag, Flag.ACTION_FAILURE),
                    );
                    Alert.alert(t('not-owner'));
                    break;
                case MachineResetRequestResult.NotExist:
                    yield put(
                        actionTypes.setBox(checkFlag, Flag.ACTION_FAILURE),
                    );
                    Alert.alert(t('machine-not-exist'));
                    break;
                case MachineResetRequestResult.Requested:
                    let timeout: NodeJS.Timeout | undefined;
                    yield fork(() => {
                        timeout = setTimeout(() => {
                            redux.dispatch(
                                actionTypes.action(actionTypes.CONFIRM_RESET, {
                                    error: t('pair-timeout'),
                                }),
                            );
                        }, config?.resetTimeout ?? 20000);
                    });
                    console.log('BEFORE TAKE');
                    redux.dispatch(
                        actionTypes.setBox(Flag.ConfirmResetRequested, true),
                    );

                    const data = yield take(actionTypes.CONFIRM_RESET);
                    console.log('AFTER TAKE', data);
                    redux.dispatch(
                        actionTypes.setBox(Flag.ConfirmResetRequested, false),
                    );
                    clearTimeout(timeout);
                    if (data.error) {
                        yield put(
                            actionTypes.setBox(checkFlag, Flag.ACTION_FAILURE),
                        );
                        Alert.alert(t('error'), t(data.error));
                    } else {
                        redux.dispatch(
                            actionTypes.action(actionTypes.DELETE, {
                                payload: {
                                    data: {
                                        entities: {
                                            [ENTITY.MACHINE]: {
                                                [data.id]: {id: data.id},
                                            },
                                        },
                                    },
                                },
                            }),
                        );
                        yield put(
                            actionTypes.setBox(checkFlag, Flag.ACTION_SUCCESS),
                        );
                    }

                    break;
            }
        } else {
            yield put(actionTypes.setBox(checkFlag, Flag.ACTION_FAILURE));
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *pair({data}: {data: IMachine}) {
        const {t, navigator, redux, socket} = this.di;
        socket.start();
        const connectionId = yield call(socket.getId);
        const resData = yield call(this.xSave, '/machines/pair', {
            machineData: data,
            connectionId,
        });
        if (resData.success) {
            yield call(
                redux.dispatch,
                actionTypes.setBox(
                    Flag.CurrentUpdatedMachineId,
                    resData.response.data.id,
                ),
            );
            // yield call(Flagger.setFlagger, {
            //   key: Flag.CurrentUpdatedMachineId,
            //   value: resData.response.data.id,
            // });
            Alert.alert(t('machine-paired-success'));
            //navigator.navigate('EditDehydrator');
        } else {
            yield call(
                redux.dispatch,
                actionTypes.clearBox(Flag.CurrentUpdatedMachineId),
            );
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *getMachinesForUser({}) {
        //const {Flagger} = this.di;
        const resData = yield call(
            this.xRead,
            '/machines',
            {},
            HTTP_METHOD.POST,
        );
        if (resData.success) {
            // yield call(
            //     redux.dispatch,
            //     actionTypes.setBox(
            //         Flag.CurrentUpdatedMachineId,
            //         resData.response.data.id,
            //     ),
            // );
            // yield call(Flagger.setFlagger, {
            //   key: Flag.DehydratorsReceived,
            //   value: true,
            // });
        } else {
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    // @action()
    // public *subscribeOnAccessebleMachines({}) {
    //     console.log('subscribe');
    //     const resData = yield call(this.xSave, `/machines`);

    //     const {redux, socket} = this.di;
    //     //const ids = Object.keys(redux.state[ENTITY.MACHINE]);
    //     const ids = Object.values(redux.state[ENTITY.MACHINE]).map(
    //         value => value.guid,
    //     );

    //     const sessionKey = yield call(socket.getId);
    //     const resSocketData = yield call(this.xSave, `/machines/subscribe`, {
    //         deviceIds: ids,
    //         sessionKey,
    //     });
    // }

    @action()
    public *resubscribeOnAllAccessebleMachines({}) {
        console.log('subscribe');
        const resData = yield call(
            this.xRead,
            '/machines',
            {},
            HTTP_METHOD.POST,
        );

        const {redux, socket} = this.di;
        //const ids = Object.keys(redux.state[ENTITY.MACHINE]);
        const ids = Object.values(redux.state[ENTITY.MACHINE]).map(
            value => value.guid,
        );

        const sessionKey = yield call(socket.getId);
        const resSocketData = yield call(this.xSave, '/machines/resubscribe', {
            deviceIds: ids,
            sessionKey,
        });
    }

    @action()
    public *getMachinesForGroup({groupId}) {
        //const {Flagger} = this.di;
        const {redux, t} = this.di;
        const resData = yield call(
            this.xRead,
            `/machines/groups/${groupId}/machines`,
            {},
            HTTP_METHOD.POST,
        );
        if (resData.success) {
            yield call(
                redux.dispatch,
                actionTypes.setBox(Flag.GroupDehydratorsReceived, true),
            );
            // yield call(Flagger.setFlagger, {
            //   key: Flag.GroupDehydratorsReceived,
            //   value: true,
            // });
        } else {
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *getAccessedMachinesForUser({userId}) {
        //const {t, Flagger} = this.di;
        const {t} = this.di;
        const resData = yield call(
            this.xRead,
            `/users/${userId}/access/machines`,
            {},
            HTTP_METHOD.POST,
        );
        if (resData.success) {
        } else {
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    // @action()
    // public *subscribeOnDevicesUpdate({deviceIds}) {
    //     const {socket} = this.di;
    //     yield call(socket.start);

    //     const sessionKey = yield call(socket.getId);
    //     const resData = yield call(this.xSave, `/machines/subscribe`, {
    //         deviceIds,
    //         sessionKey,
    //     });
    // }

    @action()
    public *resubscribeOnDevicesUpdate({deviceIds}) {
        const {socket, redux} = this.di;
        yield call(socket.start);

        if (deviceIds == undefined || deviceIds.length == 0) {
            if (redux.state.box) {
                const boxDeviceIds =
                    redux.state.box[Flag.LastResubscribeDevicesIds];
                if (boxDeviceIds != undefined && boxDeviceIds.length == 0) {
                    console.log('subscription already cleared');
                    return;
                }
            }
        }

        redux.dispatch(
            actionTypes.setBox(Flag.LastResubscribeDevicesIds, deviceIds),
        );
        const sessionKey = yield call(socket.getId);
        console.log('resubscribeOnDevicesUpdate', deviceIds);
        const resData = yield call(this.xSave, '/machines/resubscribe', {
            deviceIds,
            sessionKey,
        });
    }

    @action()
    public *unsubscribeFromDevicesUpdate() {
        const {socket} = this.di;
        const sessionKey = yield call(socket.getId);
        const resData = yield call(this.xSave, '/machines/unsubscribe-all', {
            sessionKey,
        });
        yield call(socket.stop);
    }

    // @action()
    // public *sendAction({deviceId, payload}) {
    //   const {socket} = this.di;
    //   yield call(socket.start);
    //   yield call(socket.send, SocketAction.ClientToDevice, {
    //     channel: deviceId,
    //     payload,
    //   });
    // }

    @action()
    public *sendProcessAction({
        deviceId,
        payload,
    }: {
        deviceId: string;
        payload: ProcessAction;
    }) {
        const {socket} = this.di;

        yield call(socket.start);
        const uid = yield call(socket.getId);
        const socketPayload: SocketPayload = {
            uid,
            data: {
                deviceId,
                payload,
            },
            code: 'PROCESS_ACTION',
        };
        yield call(socket.send, SocketAction.ClientToDevice, socketPayload);
    }

    @action()
    public *sendProcessZonesAction({
        deviceId,
        payload,
        zones,
    }: {
        deviceId: string;
        payload: ProcessAction;
        zones: number[];
    }) {
        if (zones?.length > 0) {
            const {socket, MachineEntity} = this.di;

            yield call(socket.start);
            const uid = yield call(socket.getId);
            for (let i = 0; i < zones.length; i++) {
                const zone = zones[i];
                const socketPayload: SocketPayload = {
                    uid,
                    data: {
                        deviceId,
                        payload: {...payload, zoneNumber: zone},
                    },
                    code: 'PROCESS_ACTION',
                };
                yield call(
                    socket.send,
                    SocketAction.ClientToDevice,
                    socketPayload,
                );
                yield delay(1000);
            }
        }
    }

    @action()
    public *sendResetPasswordEmail({data}) {
        const {Firebase, t} = this.di;
        try {
            const res = yield call(Firebase.sendResetPasswordEmail, data.email);
            if (res?.error) {
                console.log('logout res error', res);
                Alert.alert(t(res.titleCode), t(res.messageCode));
            } else {
                console.log('success send');
                Alert.alert(t('success'), t('reset-password-alert'));
            }
        } catch (error) {
            console.log('login error', error);
        }
    }

    @action()
    public *getProofs({machineId}) {
        const {Firebase, t, redux} = this.di;

        redux.dispatch(actionTypes.setBox(Flag.ProofFilename, undefined));
        redux.dispatch(actionTypes.setBox(Flag.GetProofs, true));

        const res = yield call(Firebase.getProofs, {
            machineId,
        });
        console.log('getProofs res', res);

        if (res && res.length > 0) {
            redux.dispatch(actionTypes.setBox(Flag.ProofFilename, res[0]));
        }
        redux.dispatch(actionTypes.setBox(Flag.GetProofs, false));
    }

    @action()
    public *updateMachine({
        data,
    }: {
        data: {
            machineData: IMachine;
            proofUri?: string | undefined;
            proofName?: string | undefined;
            proofData?: string | undefined;
        };
    }) {
        const {Firebase, t, redux} = this.di;

        if (data.proofData != undefined) {
            yield put(
                actionTypes.setRequestStatus({
                    entityName: this.constructor.name,
                    status: RequestStatus.LOADING,
                    data,
                    actionType: actionTypes.ADD,
                }),
            );
            console.log('data for proof', data);
            redux.dispatch(actionTypes.setBox(Flag.ProofUploading, true));
            const proofName = data.machineData.proofOfPurchaseFile;
            let needDelete =
                proofName != undefined && data.proofName != proofName;
            const proofUploadRes = yield call(Firebase.sendToStorage, {
                path: [
                    'machines',
                    data.machineData.id,
                    'proof',
                    data.proofName,
                ],
                localPath: undefined,
                base64String: data.proofData,
            });
            if (needDelete) {
                yield call(Firebase.deleteProof, {
                    machineId: data.machineData.id,
                    filename: proofName,
                });
            }

            redux.dispatch(actionTypes.setBox(Flag.ProofUploading, false));
            if (proofUploadRes.state == 'success') {
                console.log('proofUploadRes', proofUploadRes);
                console.log('update machine data', data);

                const proofOfPurchaseFile =
                    proofUploadRes?.metadata?.name ??
                    data.machineData.proofOfPurchaseFile;
                const resData = yield call(
                    this.xSave,
                    `/machines/${data.machineData.id}/update`,
                    {
                        data: {...data.machineData, proofOfPurchaseFile},
                    },
                );
            } else if (proofUploadRes.error) {
                Alert.alert(
                    t(proofUploadRes.titleCode),
                    t(proofUploadRes.messageCode),
                );
                yield put(
                    actionTypes.setRequestStatus({
                        entityName: this.constructor.name,
                        status: RequestStatus.ERROR,
                        data,
                        actionType: actionTypes.ADD,
                    }),
                );
            }
        } else {
            console.log('update machine data', data);

            const resData = yield call(
                this.xSave,
                `/machines/${data.machineData.id}/update`,
                {
                    data: {...data.machineData},
                },
            );
        }
    }

    @action()
    public *updateSettings({
        machineId,
        settings,
    }: {
        machineId: string;
        settings: AdvancedSettings;
    }) {
        const resData = yield call(
            this.xSave,
            `/machines/${machineId}/settings/update`,
            {
                settings,
            },
        );
    }

    @action()
    public *deleteMachine({
        machine,
        checkFlag,
    }: {
        machine: IMachine;
        checkFlag;
    }) {
        const {t, Firebase} = this.di;
        yield put(actionTypes.setBox(checkFlag, Flag.ACTION_START));

        const resData = yield call(
            this.xDelete,
            `/machines/${machine.id}/delete`,
        );
        if (machine.proofOfPurchaseFile) {
            yield call(Firebase.deleteProof, {
                machineId: machine.id,
                filename: machine.proofOfPurchaseFile,
            });
        }

        if (resData.success) {
            Alert.alert(t('success-delete-machine'));
            yield put(actionTypes.setBox(checkFlag, Flag.ACTION_SUCCESS));
        } else {
            yield put(actionTypes.setBox(checkFlag, Flag.ACTION_FAILURE));
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *getMachineUpdates({ids}: {ids: string[]}) {
        const resData = yield call(
            this.xSave,
            `/machines`,
            {ids},
            HTTP_METHOD.POST,
            true,
            true,
        );
    }

    pushUpdate(data: PushCRUDData) {
        console.log('MACHINE_ENTITY push update action', data);
        const {redux} = this.di;
        redux.dispatch(this.actions['getMachineUpdates']({ids: data.ids}));
    }
}
