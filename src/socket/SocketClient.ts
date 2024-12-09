import {Socket, io} from 'socket.io-client';
import {ConnectionType, Flag, SocketAction} from 'src/constants';
import BaseContext from 'src/BaseContext';
import {IContextContainer} from 'src/container';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CycleAction, IZoneParams} from 'src/store/types/MachineTypes';
import {SocketPayload, SocketResponse} from './types';
import {subSeconds} from 'date-fns';
import * as actionTypes from 'src/store/actions';
import {AdvancedSettings} from 'src/entities/models/Machine';

export interface ProcessAction {
    action: CycleAction;
    zoneNumber?: number;

    //start/update
    stages?: IZoneParams[];
    settings?: AdvancedSettings;
}

export default class SocketClient extends BaseContext {
    private socket: Socket | null = null;
    private rooms: any = {};
    private _connecting = false;

    // private currentSubscriptionsMap: {
    //     [key: string]: string[];
    // } = {};

    // private key: string | null = null;

    constructor(opts: IContextContainer) {
        super(opts);
        this.onSocketData = this.onSocketData.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);

        this.onSocketDisconnect = this.onSocketDisconnect.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);
        this.onSocketError = this.onSocketError.bind(this);

        this.onConnect = this.onConnect.bind(this);
    }

    // public setSubscriptionsForRoute(routName: string, subscriptions: string[]) {
    //     //console.log('setSubscriptionsForRoute', routName, subscriptions);
    //     this.currentSubscriptionsMap[routName] = subscriptions;
    // }

    get active(): boolean {
        if (this.socket != null && this.socket != undefined) {
            // console.log(
            //     'socketactive',
            //     this.socket.active,
            //     this.socket.connected,
            // );
            return this.socket.active && this.socket.connected;
        } else {
            return false;
        }
    }

    get connecting(): boolean {
        //console.log('socketconnecting', this._connecting);
        return this._connecting;
    }

    async getId(): Promise<string> {
        let sessionKey = await AsyncStorage.getItem('@session_key');
        if (sessionKey === null) {
            sessionKey = uuid.v4() as string;
            await AsyncStorage.setItem('@session_key', sessionKey);
        }
        return sessionKey;
    }

    public async start(liveTimeout: number | undefined = undefined) {
        const {config, redux} = this.di;
        if (!(config && config.socket && config.socket.active)) {
            console.log('can not start socket. socket inactive');
            return;
        }
        const liveDate =
            liveTimeout != undefined ? Date.now() + liveTimeout : undefined;
        if (!this.socket) {
            console.log('socket object not exist. create new');
            this.stop();
            this._connecting = true;

            let sessionKey = await this.getId();
            if (sessionKey === undefined || sessionKey == null) {
                console.log('can not start socket:', 'no session key');
                return;
            }

            const url =
                config.socket.host +
                (config.socket.port ? ':' + config.socket.port : '');

            console.log(
                'Try to connect to socket server:',
                config.socket,
                'sessionKey = ',
                sessionKey,
            );

            this.socket = io(url, {
                query: {
                    sessionKey,
                    type: ConnectionType.Client,
                    liveDate,
                },
            });
            this.socket.on('connect', this.onConnect);
            this.socket.on('data', this.onSocketData);
            this.socket.on('connect_error', this.onSocketError);
            this.socket.on('disconnect', this.onSocketDisconnect);
            redux.dispatch(
                actionTypes.setBox(
                    Flag.LastSocketUpdateTime,
                    new Date().getTime(),
                ),
            );
        } else {
            if (!this.active) {
                console.log('socket object exist, but inactive. reconnect');
                this._connecting = true;
                this.socket.connect();
                redux.dispatch(
                    actionTypes.setBox(
                        Flag.LastSocketUpdateTime,
                        new Date().getTime(),
                    ),
                );
            }
            if (liveDate != undefined) {
                const socketPayload: SocketPayload = {
                    data: {
                        liveDate,
                    },
                };
                this.send(SocketAction.SetLiveDate, socketPayload);
            }
        }
    }

    /**
     * addListener
     */
    public addListener(roomName: string, callback: (data: any) => any) {
        console.log('ADD LISTENER', roomName);
        if (!(roomName in this.rooms)) {
            this.rooms[roomName] = callback;
        }
    }

    public stop(clearSocket = false) {
        const {redux} = this.di;
        if (this.socket) {
            this.socket.disconnect();
            this._connecting = false;

            if (clearSocket) {
                this.socket = null;
            }
        }
        redux.dispatch(
            actionTypes.setBox(Flag.LastSocketUpdateTime, new Date().getTime()),
        );
    }

    public check() {
        let result = false;
        console.log('Socket check');
        if (
            this.socket == null ||
            this.socket == undefined ||
            !this.socket.active
        ) {
            console.log('Socket inactive');
            this.stop();
            result = true;
        }
        this.start();
        return result;
    }

    public cleanRooms() {
        this.rooms = {};
    }

    public onSocketError(data: any) {
        console.log('Socket Error', data);
        this._connecting = false;
        //console.log('ONERRROR AFTER');
        //console.log(' this._connecting ', this.connecting);
    }

    public onSocketDisconnect(data: any) {
        console.log('Socket disconnect', data);
        this._connecting = false;
        this.stop();
    }

    public async acceptRequest(hash: string) {
        const key = await this.getId();
        this.socket?.emit('accept', {hash, key});
    }

    private onSocketData(socketResponse: SocketResponse) {
        // console.log(
        //     'ONSOCKETDATA',
        //     socketResponse,
        //     Object.keys(this.rooms ?? {}),
        // );
        if (socketResponse.entity && socketResponse.entity in this.rooms) {
            this.rooms[socketResponse.entity](socketResponse);
        }
        if (socketResponse.hash) {
            this.acceptRequest(socketResponse.hash);
        }
    }

    private onConnect = () => {
        this.getId().then(id => {
            console.log('Socket connected, key=', id, 'id = ', this.socket?.id);
            this._connecting = false;
            const {redux, MachineEntity} = this.di;
            console.log('socket.connected b', this.socket?.connected);

            this.resubscribeOnCurrentMachine();
            console.log('socket.connected a', this.socket?.connected);
            // const timeout = setTimeout(() => {
            //     this.resubscribeCurrent();
            //     console.log('socket.connected a', this.socket?.connected);
            //     clearTimeout(timeout);
            // }, 3000);
            // resubscribeOnDevicesUpdate({deviceIds: this.currentSubscriptions});
        });

        // AsyncStorage.getItem('@session_key').then(key => {
        //     console.log('Socket connected, key=', key, 'id = ', this.socket.id);
        // });
    };

    public resubscribeOnCurrentMachine() {
        const {
            redux: {state},
        } = this.di;
        const id = state.box[Flag.CurrentUpdatedMachineId];
        const machine = id != undefined ? state.machines[id] : undefined;
        if (machine != undefined && machine?.guid != undefined) {
            this.resubscribe([machine.guid]);
        } else {
            console.log('no current machine');
        }
    }

    resubscribe(subscriptions: string[]) {
        const {redux, MachineEntity} = this.di;
        redux.dispatch(
            MachineEntity.actions.resubscribeOnDevicesUpdate({
                deviceIds: subscriptions,
            }),
        );
    }

    public send = async (channel: string, payload: SocketPayload) => {
        const id = await this.getId();
        if (this.socket) {
            this.socket.emit(channel, {payload, key: id});
        } else {
            console.log(
                `Can not send channel: ${channel} payload: ${payload}. socket innactive`,
            );
        }
    };
}
