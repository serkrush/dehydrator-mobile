export interface SocketPayload {
    uid?: string; //senderId
    receiverId?: string;
    data: any;
    entity?: string; //handler/room name
    code?: string;
}

export interface SocketRequest {
    key: string;
    payload: SocketPayload;
}

export interface SocketResponse {
    hash?: string;
    entity?: string;
    data: any;
    code?: string;
}
