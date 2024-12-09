import {Action} from 'redux';
import {Schema, normalize, schema} from 'normalizr';
import {put, call, take, fork, select} from 'redux-saga/effects';
import BaseClientContext from '../BaseContext';
import * as actionTypes from '../store/actions';
import clientContainer, {IContextContainer} from '../container';
import {Flag, IPagerParams, RequestStatus} from 'src/constants';
import {SocketResponse} from 'src/socket/types';
import {Alert} from 'react-native';
import container from '../container';
import has from 'lodash/has';
import get from 'lodash/get';
import md5 from 'md5';
import {PushCRUDData} from 'src/pusher/types';

export enum HTTP_METHOD {
    GET,
    POST,
    PUT,
    DELETE,
}

type ActionParam<T> = T extends (arg?: infer P) => any
    ? (data?: P) => Action<any>
    : T extends (arg: infer P) => any
    ? (data: P) => Action<any>
    : () => Action<any>;

export class BaseEntity<EntityInstance = null> extends BaseClientContext {
    private _schema;
    private _entityName;

    constructor(opts: IContextContainer) {
        super(opts);
        this.actions = {} as any;

        this.xFetch = this.xFetch.bind(this);
        this.pageEntity = this.pageEntity.bind(this);
        this.actionRequest = this.actionRequest.bind(this);
        this.normalizedData = this.normalizedData.bind(this);
        this.normalizedAction = this.normalizedAction.bind(this);

        this.socketMiddleware = this.socketMiddleware.bind(this);
        this.handleSocket = this.handleSocket.bind(this);
    }

    // public actions: {[K in Exclude<keyof this, keyof BaseEntity>]?: string};
    public actions: {
        [methodName in keyof Omit<
            EntityInstance,
            keyof BaseEntity<EntityInstance> | 'actions'
        >]: ActionParam<EntityInstance[methodName]>;
    };

    protected initSchema(key: string | symbol, definition?: Schema, options?) {
        this._entityName = key;
        this._schema = new schema.Entity(key, definition, options);
    }

    public addSocketListener() {
        if (this._entityName) {
            const {socket} = this.di;
            socket.addListener(this._entityName, this.socketMiddleware);
        } else {
            console.log('can not add listener', this);
        }
    }

    protected onSocketEvent(
        response: any,
        code: string = '',
        rawData: any = {},
    ) {}

    public socketMiddleware(socketResponse: SocketResponse) {
        if (socketResponse.entity === this._entityName) {
            this.handleSocket(socketResponse);
        }
    }
    private handleSocket(socketResponse: SocketResponse) {
        const {redux} = this.di;
        redux.dispatch(
            this.normalizedAction(
                socketResponse,
                socketResponse.code &&
                    actionTypes.CRUD.indexOf(socketResponse.code) > -1
                    ? socketResponse.code
                    : actionTypes.ADD,
            ),
        );
        this.onSocketEvent(
            this.normalizedData(socketResponse?.data),
            socketResponse.code,
            socketResponse,
        );
    }

    protected xFetch(
        endpoint: string,
        method: HTTP_METHOD,
        data = {},
        token?: string,
    ) {
        const {config, redux} = this.di;
        let fullUrl = `${config.baseUrl}${config.apiString}${endpoint}`;
        const headers: any = {
            'Access-Control-Allow-Origin': '*',
        };
        const reduxToken = redux.state?.auth.identity?.token;

        if (token != undefined && token != null) {
            headers.Authorization = 'Bearer ' + token;
        } else if (reduxToken != undefined && reduxToken != null) {
            headers.Authorization = 'Bearer ' + reduxToken;
        }

        let methodString = 'GET';
        switch (method) {
            case HTTP_METHOD.GET:
                methodString = 'GET';
                break;
            case HTTP_METHOD.POST:
                methodString = 'POST';
                break;
            case HTTP_METHOD.PUT:
                methodString = 'PUT';
                break;
            case HTTP_METHOD.DELETE:
                methodString = 'DELETE';
                break;
        }

        const controller = new AbortController();
        const params: any = {
            method: methodString,
            //credentials: "same-origin",
            headers,
            signal: controller.signal,
        };

        if (method !== HTTP_METHOD.GET) {
            params.headers['content-type'] = 'application/json';
            params.body = JSON.stringify(data);
        } else {
            const opts = Object.entries(data)
                .map(([key, val]) => `${key}=${val}`)
                .join('&');
            fullUrl += opts.length > 0 ? `?${opts}` : '';
        }

        const timeoutId = setTimeout(() => {
            console.log('Request rejected due to the timeout');
            controller.abort();
        }, 60000);
        return fetch(fullUrl, params)
            .then(response => {
                clearTimeout(timeoutId);
                return response.json().then(json => {
                    return {json, response};
                });
            })
            .then(({json, response}) => {
                return Promise.resolve({
                    success: !!response.ok,
                    response: json,
                });
            })
            .catch(e => {
                controller.abort();
                console.error('request exception', fullUrl, e);
                clearTimeout(timeoutId);
                let error;

                console.log(
                    'e ==keys',
                    Object.keys(e),
                    ' == values:',
                    Object.values(e),
                );

                if (redux?.state?.box) {
                    const connected = redux?.state?.box[Flag.NET_CONNECTED];
                    if (connected != undefined && !connected) {
                        error = this.di.t('not-connected');
                        return Promise.resolve({
                            success: false,
                            response: {
                                error,
                            },
                        });
                    }
                }

                if (e?.name == 'AbortError') {
                    error = this.di.t('request-timeout');
                } else if (
                    e?.name == 'TypeError' &&
                    e?.message == 'Network request failed'
                ) {
                    error = this.di.t('Network request failed');
                } else {
                    error = this.di.t('default-error-message');
                }
                return Promise.resolve({
                    success: false,
                    response: {
                        error,
                    },
                });
            });
    }

    public xSave = (
        uri: string,
        data: any = {},
        method: HTTP_METHOD = HTTP_METHOD.POST,
        forceHashing: boolean = true,
        silent: boolean = false,
    ) => {
        return this.actionRequest(
            uri,
            method,
            actionTypes.ADD,
            data,
            forceHashing,
            silent,
        );
    };

    public xRead = (
        uri: string,
        data: any = {},
        method: HTTP_METHOD = HTTP_METHOD.GET,
        forceHashing: boolean = false,
        silent: boolean = false,
    ) => {
        return this.actionRequest(
            uri,
            method,
            actionTypes.GET,
            data,
            forceHashing,
            silent,
        );
    };

    public xDelete = (
        uri: string,
        data: any = {},
        forceHashing: boolean = true,
        silent: boolean = false,
    ) => {
        return this.actionRequest(
            uri,
            HTTP_METHOD.POST,
            actionTypes.DELETE,
            data,
            forceHashing,
            silent,
        );
    };

    /**
     *
     * @param url
     * @param HTTP_METHOD
     * @param type
     * @param data
     * @param forceHashing if TRUE, force hashing data and send a request to server to refresh eneity in redux
     * @param silent if TRUE, disable loader/owerlay screen
     * @returns
     */
    private *actionRequest(
        url,
        HTTP_METHOD,
        type,
        data: any,
        forceHashing: boolean,
        silent: boolean,
    ) {
        try {
            if (!this.isHashExist(url, data) || forceHashing) {
                if (!silent) {
                    yield put(
                        actionTypes.setRequestStatus({
                            entityName: this.constructor.name,
                            status: RequestStatus.LOADING,
                            data,
                            actionType: type,
                        }),
                    );
                }

                const {redux, t} = this.di;
                let token: string | undefined;
                if (redux?.state?.auth?.identity?.token) {
                    token = redux?.state?.auth?.identity?.token;
                }
                const sdata = yield call(
                    this.xFetch,
                    url,
                    HTTP_METHOD,
                    data,
                    token,
                );
                if (sdata.response && sdata.response.code == 'TOAST') {
                    // const { ToastEmitter } = this.di;
                    if (sdata.response.isSuccess) {
                        Alert.alert('', t(sdata.response.message));
                        //ToastEmitter.message(sdata.response.message);
                    } else {
                        Alert.alert(t('error'), t(sdata.response.message));
                        //ToastEmitter.errorMessage(sdata.response.message);
                    }
                }
                if (
                    sdata.success &&
                    sdata.response &&
                    sdata.response.code != 'ERROR'
                ) {
                    yield put(this.normalizedAction(sdata.response, type));
                    this.saveDataToHash(url, data);
                } else {
                    yield put({type: actionTypes.ERROR, error: sdata.response});
                }
                if (!silent) {
                    yield put(
                        actionTypes.setRequestStatus({
                            entityName: this.constructor.name,
                            status: RequestStatus.SUCCESS,
                            data: sdata,
                            actionType: type,
                        }),
                    );
                }
                return sdata;
            } else {
                return {};
            }
        } catch (error) {
            yield put({type: actionTypes.ERROR, error});
            if (!silent) {
                yield put(
                    actionTypes.setRequestStatus({
                        entityName: this.constructor.name,
                        status: RequestStatus.ERROR,
                        data: error as any,
                        actionType: type,
                    }),
                );
            }
            return null;
        }
    }

    public normalizedData(data) {
        let schema = Array.isArray(data) ? [this._schema] : this._schema;
        let resultData = normalize(data, schema);
        return resultData.result ? resultData : {};
    }

    public normalizedAction(response, type = actionTypes.UPDATE) {
        try {
            const data = response.hasOwnProperty('data')
                ? response.data
                : response;
            return {
                type: type,
                payload: {
                    data: this.normalizedData(data),
                    pager: response.pager,
                },
                entityReducer: this._entityName,
            };
        } catch (error) {
            return {type: actionTypes.ERROR, error};
        }
    }

    public static sagas() {
        const objects = Reflect.getMetadata('sagas', BaseEntity);
        if (objects) {
            const maped = objects.map(obj => {
                const actionName = obj.className + '_' + obj.methodName;
                const classInstance = clientContainer.resolve(obj.className);
                const method =
                    classInstance[obj.methodName].bind(classInstance);
                classInstance.actions[obj.methodName] = (data?: any) =>
                    actionTypes.action(actionName, data);
                const saga = function* () {
                    while (true) {
                        const payload = yield take(actionName);
                        const data = {...payload};
                        delete data.type;
                        // delete data.force;
                        yield call(method, data);
                    }
                };
                return fork(saga);
            });
            return maped;
        } else {
            return undefined;
        }
    }

    public *pageEntity(uri: string, params: IPagerParams) {
        const {pageName} = params;
        const pagination = yield select((state: any) => state.pagination);
        if (!('page' in params)) {
            params.page = pageName && pagination[pageName].currentPage;
        }
        // send event about starting page fetching
        // yield put(
        //     actionTypes.pageFetching(pageName, params.page, true, params.force),
        // );
        let count = 0;
        if (
            !params.force &&
            pagination[pageName] &&
            pagination[pageName].count
        ) {
            count = pagination[pageName].count;
        }
        // set filter to paginator, in case fetch from getInitProps()
        const pFilter = params.filter ? params.filter : {};
        const pSort = params.sort ? params.sort : {};
        yield put(actionTypes.pageSetFilter(pageName, pFilter, pSort));
        const pagerData = {
            ...params,
            pageName,
            count,
            entityName: this._entityName,
        };
        // params.force = params.force || !this.isHashExist(uri, pagerData);
        const forceHash = !this.isHashExist(uri, pagerData);
        // check if this page already fetched
        if (
            (pageName && !pagination[pageName]) ||
            (pageName &&
                pagination[pageName].pages &&
                !pagination[pageName].pages[params.page]) ||
            params.force ||
            forceHash
        ) {
            if (params.force) {
                yield put(actionTypes.pageClear(pageName));
            }
            yield call(
                this.xRead,
                uri,
                pagerData,
                HTTP_METHOD.POST,
                params.force || forceHash,
            );
        }
        // // send event about ending page fetching
        // yield put(actionTypes.pageFetching(pageName, params.page, false));
    }

    public static getPagerItems(pagerName: string): any[] {
        const {state} = container.resolve('redux');
        const pager = state.pagination;
        if (has(pager, pagerName)) {
            const entityName = get(pager, [pagerName, 'entityName']);
            if (has(state, entityName)) {
                const pageNumber = get(pager, [pagerName, 'currentPage']);
                if (get(pager, [pagerName, 'pages', pageNumber, 'ids'])) {
                    const items = state[entityName];
                    const ids = get(pager, [
                        pagerName,
                        'pages',
                        pageNumber,
                        'ids',
                    ]);
                    return ids.map((id: any) => {
                        if (typeof id === 'number') {
                            id = id.toString();
                        }
                        return items[id];
                    });
                }
            }
        }
        return [];
    }

    public static getPagerItemsNew(pagerName: string): any[] {
        const {state} = container.resolve('redux');
        const pagerNew = state.pagination;
        if (has(pagerNew, pagerName)) {
            const entityName = get(pagerNew, [pagerName, 'entityName']);
            if (has(state, entityName)) {
                // const pageNumber = get(pagerNew, [pagerName, 'currentPage']);
                if (get(pagerNew, [pagerName, 'pagesNew', 'ids'])) {
                    const items = state[entityName];
                    const ids = get(pagerNew, [pagerName, 'pagesNew', 'ids']);
                    return ids.map((id: any) => {
                        if (typeof id === 'number') {
                            id = id.toString();
                        }
                        return items[id];
                    });
                }
            }
        }
        return [];
    }

    public handleUnsuccessResponse(
        response: any,
        title: string | undefined = undefined,
        showDefaultTitle: boolean = false,
    ) {
        if (response?.error != undefined || response?.code == 'ERROR') {
            const {t} = this.di;
            let actualTitle =
                title ?? showDefaultTitle
                    ? t('default-error-title')
                    : undefined;
            let message = response?.error;
            if (message == undefined) {
                if (response.code == 'ERROR') {
                    message = response.message ?? 'default-error-message';
                } else {
                    message = 'default-error-message';
                }
            }
            message = t(message);

            if (actualTitle != undefined) {
                Alert.alert(actualTitle, message);
            } else {
                Alert.alert(message);
            }
        }
    }

    private createHash(url: string = '', data: any = '') {
        const dataForHashing = `${url}${JSON.stringify(data)}`;
        const hash = md5(dataForHashing).toString();
        return hash;
    }

    private isHashExist(url: string, data: any) {
        const {config} = this.di;
        const hashes = this.di.redux?.state?.hashes;
        const existedHashTime = hashes[this.createHash(url, data)];
        return existedHashTime
            ? existedHashTime + config.hashes.outOfDateHashTime > Date.now() // if hash exist, check its expiration time (expired - false, else true)
            : false;
    }

    private saveDataToHash(url: string, data: any) {
        const hash = this.createHash(url, data);
        this.di.redux.dispatch(
            actionTypes.saveToHash({hash, dateUTC: Date.now()}),
        );
    }

    pushUpdate(data: PushCRUDData) {}
    pushDelete(data: PushCRUDData) {
        const {
            redux: {dispatch},
        } = this.di;

        let deleteObject = {};

        for (let i = 0; i < data.ids.length; i++) {
            const element = data.ids[i];
            deleteObject[element] = {id: element};
        }

        dispatch(
            actionTypes.action(actionTypes.DELETE, {
                payload: {
                    data: {
                        entities: {
                            [this._entityName]: deleteObject,
                        },
                    },
                },
            }),
        );
    }
}
