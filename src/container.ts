import entities, {IEntityContainer} from './entities';
import ReduxStore from './store';
import coreConfig from '../config';
import * as awilix from 'awilix';
import Navigator from './Navigator';
import './i18n';
import i18next from 'i18next';
import SocketClient from './socket/SocketClient';
import {BaseEntity} from './entities/BaseEntity';
import Connector from './entities/Connector';
import zoneInfos from './utils/zoneInfos';
import JobHandler from './JobHandler';
import Pusher from './pusher/Pusher';
import GuardBuilder from '../acl/GuardBuilder';

export interface IContextContainer extends IEntityContainer {
    config: any;
    redux: ReduxStore;
    navigator: Navigator;
    t: Function;
    socket: SocketClient;
    connector: Connector;
    zoneInfos: Function;
    job: JobHandler;
    pusher: Pusher;
    guard: GuardBuilder;
}
const container: awilix.AwilixContainer<IContextContainer> =
    awilix.createContainer({
        injectionMode: awilix.InjectionMode.PROXY,
    });

const t = (ctx: IContextContainer) => i18next.t;

async function registerContainer() {
    console.log("registerContainer ===")
    const sockets = Reflect.getMetadata('sockets', BaseEntity) ?? [];
    sockets.forEach((element: {entityName: any}) => {
        const obj = container.resolve<BaseEntity>(element.entityName);
        obj.addSocketListener();
    });

    const connector = container.resolve('connector');
    const socket = container.resolve('socket');

    socket.addListener('connector', connector.socketMiddleware);

    const job: JobHandler = container.resolve('job');
    job.start();

    // const pusher: Pusher = container.resolve('pusher')
    // console.log("registerContainer pusher", pusher)
    // pusher.start()
    console.log("registerContainer === --- ===")
}

container.register({
    ...entities,
    config: awilix.asValue(coreConfig),
    redux: awilix.asClass(ReduxStore).singleton(),
    navigator: awilix.asClass(Navigator).singleton(),
    t: awilix.asFunction(t).singleton(),
    socket: awilix.asClass(SocketClient).singleton(),
    connector: awilix.asClass(Connector).singleton(),
    zoneInfos: awilix.asFunction(zoneInfos).singleton(),
    job: awilix.asClass(JobHandler).singleton(),
    pusher: awilix.asClass(Pusher).singleton(),
    guard: awilix.asClass(GuardBuilder).singleton(),
});

registerContainer().catch(e => {
    console.error('can not register container', e);
});

export default container;
