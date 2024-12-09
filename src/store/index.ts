console.log('-------src/store/index.ts');
import {AnyAction, applyMiddleware, compose, Dispatch} from 'redux';
import {all} from 'redux-saga/effects';
import createSagaMiddleware, {Task} from 'redux-saga';
import {configureStore, EnhancedStore} from '@reduxjs/toolkit';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import {PersistConfig, Persistor} from 'redux-persist/es/types';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import {PersistPartial} from 'redux-persist/es/persistReducer';

import BaseContext from '../BaseContext';

import {BaseEntity} from '../entities/BaseEntity';
import rootReducer from './reducers';
import {AppState, ENTITY} from '../constants';

const persistConfig: PersistConfig<AppState> = {
    key: 'root',
    storage: FilesystemStorage,
    stateReconciler: hardSet,
    whitelist: [ENTITY.IDENTITY, ENTITY.USER, 'flagger', 'box', ENTITY.NOTIFICATION],
};

export default class ReduxStore extends BaseContext {
    private _persistor: Persistor;
    private _store: EnhancedStore<any, AnyAction>;

    public get store(): EnhancedStore<any, AnyAction> {
        return this._store;
    }

    public get state(): AppState {
        return this._store.getState();
    }

    public get persistor(): Persistor {
        return this._persistor;
    }

    public dispatch = (args: any): Dispatch => {
        return this._store.dispatch(args);
    };

    public rootSaga = function* () {
        const sagas = BaseEntity.sagas();
        yield all(sagas ?? []);
    };

    constructor(opts: any) {
        super(opts);

        const isDebug =
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true';
        if (!isDebug) {
            const {store, persistor} = this.configureProdStore();
            this._store = store;
            this._persistor = persistor;
        } else {
            const {store, persistor} = this.configureDevStore();
            this._store = store;
            this._persistor = persistor;
        }
        console.log('Store(): REDUX was created', isDebug);
    }
    private configureProdStore(initialState?: AppState & PersistPartial) {
        const sagaMiddleware = createSagaMiddleware();

        const store: EnhancedStore<any, AnyAction> = configureStore({
            reducer: persistReducer(persistConfig, rootReducer),
            preloadedState: initialState,
            middleware: getDefaultMiddleware =>
                getDefaultMiddleware().concat(sagaMiddleware),
        });
        const persistor: Persistor = persistStore(store);
        sagaMiddleware.run(this.rootSaga);
        return {store, persistor};
    }

    private configureDevStore(initialState?: any) {
        const sagaMiddleware = createSagaMiddleware();
        const store: EnhancedStore<any, AnyAction> = configureStore({
            reducer: persistReducer(persistConfig, rootReducer),
            preloadedState: initialState,
            middleware: getDefaultMiddleware =>
                getDefaultMiddleware({
                    serializableCheck: {
                        ignoredActions: [
                            FLUSH,
                            REHYDRATE,
                            PAUSE,
                            PERSIST,
                            PURGE,
                            REGISTER,
                        ],
                    },
                    immutableCheck: {
                        warnAfter: 128, // Increase the threshold from the default 32ms
                    },
                }).concat(sagaMiddleware),
            devTools: true,
        });
        const persistor: Persistor = persistStore(store);
        sagaMiddleware.run(this.rootSaga);
        return {store, persistor};
    }
}
