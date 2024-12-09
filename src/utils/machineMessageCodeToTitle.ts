import {MachineMessage, NotificationMessage} from 'src/pusher/types';
import {CardColors} from './colorForZoneState';

export enum MachineMessageType {
    UNKNOWN = 'unknown',
    OPERATION = 'operation',
    SERVICE = 'service',
    ERROR = 'error',
}

export const messageTypeByCode = (code: number) => {
    if (code >= 100 && code < 200) {
        return MachineMessageType.OPERATION;
    } else if (code >= 200 && code < 300) {
        return MachineMessageType.SERVICE;
    } else if (code >= 900 && code < 1000) {
        return MachineMessageType.ERROR;
    } else {
        return MachineMessageType.UNKNOWN;
    }
};

export const titleByType = (type: MachineMessageType, t) => {
    switch (type) {
        case MachineMessageType.UNKNOWN:
            return t('notification_base');
        case MachineMessageType.OPERATION:
            return t('notification_operation');
        case MachineMessageType.SERVICE:
            return t('notification_service');
        case MachineMessageType.ERROR:
            return t('notification_error');
    }
};

export const titleByCode = (machineCode, t) => {
    const type = messageTypeByCode(machineCode);
    return titleByType(type, t);
};

export const notificationDataByMessage = (
    notificationMessage: NotificationMessage,
    t,
) => {
    let message = t(
        notificationMessage.message,
        notificationMessage.params ?? {},
    );
    let title = notificationMessage.title ? t(notificationMessage.title) : '';
    if ((notificationMessage as MachineMessage)?.machineUid != undefined) {
        const machineMessage = notificationMessage as MachineMessage;
        title = titleByCode(machineMessage.code, t);
    }

    return {title, message}
};

export const colorsByType = (type: MachineMessageType): CardColors => {
    switch (type) {
        case MachineMessageType.UNKNOWN:
            return {
                background: 'white',
                content: 'black',
                border: 'clear',
            };
        case MachineMessageType.OPERATION:
            return {
                background: '#00FF0008',
                content: 'black',
                border: 'green',
            };
        case MachineMessageType.SERVICE:
            return {
                background: '#0000FF08',
                content: 'black',
                border: 'blue',
            };
        case MachineMessageType.ERROR:
            return {
                background: '#FF000008',
                content: 'black',
                border: 'red',
            };
    }
};

export const colorsByCode = machineCode => {
    const type = messageTypeByCode(machineCode);
    return colorsByType(type);
};
