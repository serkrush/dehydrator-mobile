import alias from 'src/decorators/alias';
import BaseContext from 'src/BaseContext';
import {BaseEntity} from '../entities/BaseEntity';
import container from 'src/container';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {
    MachineMessage,
    NotificationMessage,
    PushCRUDData,
    PushNotificationData,
} from './types';
import messaging from '@react-native-firebase/messaging';
import {sendLocalPushNotification} from 'src/utils/notifications';
import {notificationDataByMessage} from 'src/utils/machineMessageCodeToTitle';

@alias('pusher')
export default class Pusher extends BaseContext {
    private listeners: {[eventName: string]: Function[]} = {};

    constructor(opts: any) {
        super(opts);
        this.handlePush = this.handlePush.bind(this);

        this.start = this.start.bind(this);
        this.subscribe = this.subscribe.bind(this);

        this.handlePush = this.handlePush.bind(this);
        this.handleAction = this.handleAction.bind(this);
    }

    start() {
        const objects = Reflect.getMetadata('pushes', BaseEntity);
        objects.forEach((obj: any) => {
            const {eventName} = obj;
            const classInstance = container.resolve(obj.className);
            const method = classInstance[obj.methodName].bind(classInstance);
            console.log('Pusher - listen', eventName, obj.methodName);

            if (this.listeners[eventName]) {
                this.listeners[eventName].push(method);
            } else {
                this.listeners[eventName] = [method];
            }
        });

        return this.subscribe();
    }

    public subscribe() {
        console.log('messaging().onMessage');
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log(
                'pushNotification',
                remoteMessage,
                Object.keys(remoteMessage),
            );
            this.handlePush(remoteMessage);
        });

        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log(
                'background pushNotification',
                remoteMessage,
                Object.keys(remoteMessage),
            );
            this.handlePush(remoteMessage);
        });

        return unsubscribe;
    }

    async requestUserPermission() {
        console.log('requestUserPermission');
        switch (Platform.OS) {
            case 'android':
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                );
                break;
            case 'ios':
                const authStatus = await messaging().requestPermission();
                const enabled =
                    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

                if (enabled) {
                    console.log('Authorization status:', authStatus);
                }
                break;
        }
    }

    handleAction(type: string, pushData) {
        const listeners = this.listeners[type];
        if (listeners) {
            listeners.forEach(listener => {
                console.log('call listener', listener?.name);
                listener(pushData);
            });
        }
    }

    public handlePush(pushData: PushNotificationData) {
        console.log('Pusher, handlePush, pushData', pushData);
        console.log('pushData.data', pushData.data);

        const {t} = this.di;

        const type: string = pushData?.data?.type as string;
        if (type) {
            switch (type) {
                case 'ENTITY_ACTION':
                    const payloadString = pushData?.data?.payload as string;
                    if (payloadString != undefined) {
                        const payload = JSON.parse(
                            payloadString,
                        ) as PushCRUDData;
                        if (payload != undefined) {
                            const entity: BaseEntity = container.resolve(
                                payload.entityName,
                            );

                            switch (payload.actionType) {
                                case 'UPDATE':
                                    entity.pushUpdate(payload);
                                    break;
                                case 'DELETE':
                                    entity.pushDelete(payload);
                                    break;
                            }
                            break;
                        }
                    }
                case 'NOTIFICATION': {
                    console.log(
                        'handle machine message through push',
                        pushData,
                    );
                    const payloadString = pushData?.data?.payload as string;
                    if (payloadString != undefined) {
                        let payload: NotificationMessage | undefined =
                            JSON.parse(payloadString);
                        if (
                            (payload as MachineMessage) != undefined ||
                            (payload as NotificationMessage) != undefined
                        ) {
                            const dispatch = this.di.redux.dispatch;
                            dispatch(
                                this.di.NotificationEntity.normalizedAction(
                                    payload,
                                ),
                            );
                            sendLocalPushNotification(
                                notificationDataByMessage(payload, t),
                            );

                            if (payload.actionType) {
                                this.handleAction(payload.actionType, pushData);
                            }
                        } else {
                            console.log('wrong payload');
                        }
                    } else {
                        console.log('wrong payload');
                    }
                }
            }
            this.handleAction(type, pushData);
        }

        if (pushData?.notification?.body) {
            sendLocalPushNotification({
                title: pushData.notification.title,
                message: pushData.notification.body,
            });
            // Alert.alert(
            //     `${pushData.notification.title}\n${pushData.notification.body}`,
            // );
        }
    }
}
