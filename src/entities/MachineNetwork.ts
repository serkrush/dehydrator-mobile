import dgram from 'react-native-udp';
import {BaseEntity} from './BaseEntity';
import reducer from '../decorators/reducer';
import alias from 'src/decorators/alias';
import {ENTITY, RequestStatus} from 'src/constants';
import * as container from 'src/container';
import * as actionTypes from '../../src/store/actions';

@alias('MachineNetwork')
@reducer(ENTITY.MachineNetwork)
export default class MachineNetwork extends BaseEntity<MachineNetwork> {
    private socket: dgram.Socket;

    constructor(opts: container.IContextContainer) {
        super(opts);
        this.initSchema(ENTITY.MachineNetwork, {}, {idAttribute: 'uid'});

        this.handleMessage = this.handleMessage.bind(this);
        this.scan = this.scan.bind(this);

        this.socket = dgram.createSocket('udp4');
        this.socket.bind(opts.config.broadcastPort);
        this.socket.on('message', this.handleMessage);
    }

    public handleMessage(message) {
        try {
            const data = JSON.parse(message);
            const dispatch = this.di.redux.dispatch;
            dispatch(this.di.MachineNetwork.normalizedAction(data));
        } catch (error) {
            console.log('json parse', error);
        }
    }

    /**
     * scan
     */
    public scan() {
        const {redux, config} = this.di;
        redux.dispatch(
            actionTypes.action(actionTypes.DELETE_ALL, {
                payload: {
                    data: {
                        entities: {
                            [ENTITY.MachineNetwork]: {},
                        },
                    },
                },
            }),
        );
        redux.dispatch(
            actionTypes.setRequestStatus({
                entityName: this.constructor.name,
                status: RequestStatus.LOADING,
                data: {},
                actionType: actionTypes.GET,
            }),
        );
        const timeout = setTimeout(() => {
            redux.dispatch(
                actionTypes.setRequestStatus({
                    entityName: this.constructor.name,
                    status: RequestStatus.SUCCESS,
                    data: {},
                    actionType: actionTypes.GET,
                }),
            );
            clearTimeout(timeout);
        }, config?.scanTime ?? 20000);
        this.socket.send(
            'Broadcast message!',
            undefined,
            undefined,
            this.di.config.broadcastPort,
            '255.255.255.255',
            function () {
                console.log('Broadcast request sent.');
            },
        );
    }
}
