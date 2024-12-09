import {call, put} from 'redux-saga/effects';
import {BaseEntity, HTTP_METHOD} from './BaseEntity';
import * as actionTypes from '../../src/store/actions';
import action from '../../src/decorators/action';
import {ENTITY, Flag, AuthType} from '../../src/constants';
import {Alert} from 'react-native';
import i18next from 'i18next';
import userDefaults from 'react-native-user-defaults';
import {schema} from 'normalizr';
import {IIdentity} from 'acl/types';
import alias from 'src/decorators/alias';
import {GUEST_IDENTITY} from 'src/store/reducers/identityReducer';

@alias('Identity')
export default class Identity extends BaseEntity<Identity> {
    constructor(opts: any) {
        super(opts);
        const users = new schema.Entity(
            ENTITY.USER,
            {},
            {idAttribute: 'userId'},
        );
        this.initSchema(ENTITY.IDENTITY, {userData: users}, {});

        this.navigateToTabs = this.navigateToTabs.bind(this);
        this.updateIdentity = this.updateIdentity.bind(this);
    }

    navigateToTabs() {
        const {navigator} = this.di;
        navigator.reset({
            index: 0,
            routes: [{name: 'Tabs'}],
        });
    }

    @action()
    public *updateIdentity({force}: {force: boolean}) {
        const resData = yield call(
            this.xRead,
            '/auth/update-identity/expanded',
            {},
            HTTP_METHOD.POST,
            force ?? false,
        );

        if (resData.success) {
            yield put(
                actionTypes.action(actionTypes.UPDATE_IDENTITY, {
                    payload: {
                        data: resData.response.data,
                    },
                }),
            );
        } else {
            this.handleUnsuccessResponse(resData?.response);
        }
    }

    @action()
    public *login({data}) {
        const {Firebase, t} = this.di;

        try {
            const res = yield call(Firebase.login, data.email, data.password);
            if (res?.error) {
                Alert.alert(t(res.titleCode), t(res.messageCode));
            } else {
                const token = yield call(Firebase.getFCMToken);
                //console.log('fcmtoken', token);
                yield put(
                    actionTypes.action(actionTypes.DELETE_ALL, {
                        payload: {
                            data: {
                                entities: {
                                    users: {},
                                },
                            },
                        },
                    }),
                );
                const resData = yield call(
                    this.xRead,
                    '/login',
                    {idToken: res, fcmToken: token},
                    HTTP_METHOD.POST,
                    true,
                );

                if (resData.success) {
                    yield put(
                        actionTypes.action(actionTypes.UPDATE_IDENTITY, {
                            payload: {
                                data: resData.response.data,
                            },
                        }),
                    );
                    this.navigateToTabs();
                } else {
                    this.handleUnsuccessResponse(resData?.response);
                    console.log('login unsucces', resData);
                }
            }
        } catch (error) {
            console.log('login error', error);
        }
    }

    @action()
    public *tryAutologin({}) {
        const {Firebase, t} = this.di;

        try {
            const res = yield call(Firebase.tryAutoLogin);
            if (res?.error) {
                Alert.alert(t(res.titleCode), t(res.messageCode));
            } else if (res == null || res == undefined) {
            } else {
                const token = yield call(Firebase.getFCMToken);
                //console.log('fcmtoken', token);
                yield put(
                    actionTypes.action(actionTypes.DELETE_ALL, {
                        payload: {
                            data: {
                                entities: {
                                    users: {},
                                },
                            },
                        },
                    }),
                );
                const resData = yield call(
                    this.xRead,
                    '/login',
                    {idToken: res, fcmToken: token},
                    HTTP_METHOD.POST,
                    true,
                );
                console.log('resData==', resData);
                if (resData.success) {
                    yield put(
                        actionTypes.action(actionTypes.UPDATE_IDENTITY, {
                            payload: {
                                data: resData.response.data,
                            },
                        }),
                    );
                    this.navigateToTabs();
                } else {
                    //this.handleUnsuccessResponse(resData?.response);
                    console.log('autologin unsucces');
                }
            }
        } catch (error) {
            console.log('login error', error);
        }
    }

    @action()
    public *register({data}) {
        const {Firebase, t} = this.di;

        try {
            if (data.language) {
                yield call(this.setLanguageCode, {value: data.language});
            }
            const res = yield call(Firebase.signIn, data.email, data.password);
            if (res.error) {
                Alert.alert(t(res.titleCode), t(res.messageCode));
            } else if (res.user) {
                const uid = res.user.uid;
                delete data.password;
                const token = yield call(Firebase.getFCMToken);
                const result = {
                    uid,
                    ...data,
                    authType: AuthType.Default,
                    fcmToken: token
                };
                const resData = yield call(this.xSave, '/register', result);

                if (resData.success) {
                    yield put(
                        actionTypes.action(actionTypes.UPDATE_IDENTITY, {
                            payload: {
                                data: resData.response.data,
                            },
                        }),
                    );
                    this.navigateToTabs();
                } else {
                    this.handleUnsuccessResponse(resData?.response);
                    console.log('register unsucces');
                }
            }
        } catch (error) {
            console.log('login error', error);
        }
    }

    @action()
    public *loginWithSocial({data, social}) {
        const {Firebase, t} = this.di;
        const {language, timezone, scale, currencySymbol} = data;
        try {
            let res;
            if (social === AuthType.Google) {
                res = yield call(Firebase.loginWithGoogle);
            } else if (social === AuthType.Facebook) {
                // res = yield call(Firebase.loginWithFacebook);
            }
            const token = yield call(Firebase.getFCMToken);
            console.log('RES', res);
            if (res?.error) {
                Alert.alert(t(res.titleCode), t(res.messageCode));
            } else {
                if (res?.additionalUserInfo?.isNewUser) {
                    const uid = res.user.uid;
                    const splittedDisplayName: string[] =
                        res.user.displayName.split(' ');
                    const result = {
                        uid,
                        email: res.user.email,
                        firstName:
                            splittedDisplayName.length > 0
                                ? splittedDisplayName[0]
                                : 'First Name',
                        lastName:
                            splittedDisplayName.length > 0
                                ? splittedDisplayName[1]
                                : 'Last Name',
                        language,
                        timezone,
                        scale,
                        currencySymbol,
                        authType: social,
                        fcmToken: token
                    };
                    const resData = yield call(this.xSave, '/register', result);

                    if (resData.success) {
                        yield put(
                            actionTypes.action(actionTypes.UPDATE_IDENTITY, {
                                payload: {
                                    data: resData.response.data,
                                },
                            }),
                        );
                        this.navigateToTabs();
                    } else {
                        this.handleUnsuccessResponse(resData?.response);
                        console.log('register unsucces');
                    }
                } else if (res?.idToken) {
                    yield put(
                        actionTypes.action(actionTypes.DELETE_ALL, {
                            payload: {
                                data: {
                                    entities: {
                                        users: {},
                                    },
                                },
                            },
                        }),
                    );
                    const resData = yield call(
                        this.xRead,
                        '/login',
                        {idToken: res.idToken, fcmToken: token},
                        HTTP_METHOD.POST,
                        true,
                    );
                    console.log('resData==', resData);
                    if (resData.success) {
                        yield put(
                            actionTypes.action(actionTypes.UPDATE_IDENTITY, {
                                payload: {
                                    data: resData.response.data,
                                },
                            }),
                        );
                        this.navigateToTabs();
                    } else {
                        //this.handleUnsuccessResponse(resData?.response);
                        console.log('autologin unsucces');
                    }
                }
            }
        } catch (error) {
            console.log('login error', error);
        }
    }

    @action()
    public *logout() {
        console.log('logout');
        const {Firebase, t} = this.di;
        try {
            const token = yield call(Firebase.getFCMToken);
            const removeRes = yield call(this.xDelete, '/users/fcm/remove', {
                tokens: [token],
            });

            const res = yield call(Firebase.logout);
            if (res?.error) {
                Alert.alert(t(res.titleCode), t(res.messageCode));
            } else {
                const {navigator} = this.di;
                yield put(
                    actionTypes.action(actionTypes.UPDATE_IDENTITY, {
                        payload: {
                            data: {
                                identity: GUEST_IDENTITY,
                            },
                        },
                    }),
                );
                let entities = {};
                Object.values(ENTITY).forEach(entity => {
                    entities[entity] = {};
                });

                yield put(
                    actionTypes.action(actionTypes.DELETE_ALL, {
                        payload: {
                            data: {
                                entities,
                            },
                        },
                    }),
                );
                yield put(actionTypes.deleteBox());
                navigator.reset({
                    index: 0,
                    routes: [{name: 'Welcome'}],
                });
            }
        } catch (error) {
            console.log('login error', error);
        }
    }

    @action()
    public *setLanguageCode({value}) {
        yield put(actionTypes.setBox(Flag.LanguageCode, value));
        userDefaults
            .set(Flag.LanguageCode, value)
            .then(data => console.log('userDefaults set', data));
        i18next.changeLanguage(value);
    }

    @action()
    public *sendResetPasswordEmail({data}) {
        const {Firebase, t} = this.di;
        try {
            const res = yield call(this.xSave, '/users/email', {
                email: data.email,
            });
            const isEmailExist = res?.response?.data?.isEmailExist;
            const authType = res?.response?.data?.authType;
            if (isEmailExist) {
                if (authType === AuthType.Default) {
                    const res = yield call(
                        Firebase.sendResetPasswordEmail,
                        data.email,
                    );
                    if (res?.error) {
                        console.log('logout res error', res);
                        Alert.alert(t(res.titleCode), t(res.messageCode));
                    } else {
                        console.log('success send', res);
                        Alert.alert(t('success'), t('reset-password-alert'));
                    }
                } else {
                    Alert.alert(
                        t('fail'),
                        t('social-using-for-login') +
                            ' ' +
                            t(authType) +
                            ' ' +
                            t('account'),
                    );
                }
            } else {
                Alert.alert(t('fail'), t('email-not-exist'));
            }
        } catch (error) {
            console.log('login error', error);
        }
    }

    @action()
    public *updatePassword({
        identity,
        currentPassword,
        newPassword,
    }: {
        identity: IIdentity;
        currentPassword: string;
        newPassword: string;
    }) {
        const {t, Firebase} = this.di;
        try {
            const res = yield call(
                Firebase.login,
                identity.userEmail,
                currentPassword,
            );
            if (res?.error) {
                Alert.alert(t(res.titleCode), t(res.messageCode));
            } else {
                const resData = yield call(
                    this.xSave,
                    `/users/${identity.userId}/update/password`,
                    {
                        data: newPassword,
                    },
                );
                if (resData.success) {
                    yield put(
                        actionTypes.action(
                            actionTypes.UPDATE_IDENTITY_USERDATA,
                            {
                                payload: {
                                    data: resData.response.data,
                                },
                            },
                        ),
                    );
                    Alert.alert(t('password-updated-success'));
                } else {
                    this.handleUnsuccessResponse(resData?.response);
                }
            }
        } catch (error) {
            console.log('login error', error);
        }
    }
}
