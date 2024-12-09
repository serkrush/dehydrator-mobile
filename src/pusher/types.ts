import {ADD, DELETE, UPDATE} from 'src/store/actions';

export const PUSH_ENTITY_ACTION = [UPDATE, DELETE] as const;
export interface PushCRUDData {
    entityName: string;
    actionType: (typeof PUSH_ENTITY_ACTION)[number];
    ids: string[];
}

export interface PushNotificationData {
    data?: {
        [key: string]: string | object;
    };
    notification?: {
        title?: string;
        body?: string;
    };
}

export interface NotificationMessage {
    uuid: number;
    title?: string,
    message: string,
    params?: any
    timestamp: number;
    actionType?: string
}
export interface MachineMessage extends NotificationMessage {
    moduleNumber: number;
    code: number;
    machineUid: string;
}
