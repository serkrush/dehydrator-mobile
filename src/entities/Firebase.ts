/* eslint-disable indent */
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import alias from 'src/decorators/alias';
import {firebaseErrors} from 'src/firebaseErrors';
import messaging from '@react-native-firebase/messaging';
import {BaseEntity} from './BaseEntity';

GoogleSignin.configure({
    webClientId:
        '1098470485769-52bqb43uk9m5peknvprgpek337vb7l84.apps.googleusercontent.com',
});

@alias('Firebase')
export default class Firebase extends BaseEntity<Firebase> {
    constructor(opts: any) {
        super(opts);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.signIn = this.signIn.bind(this);
        this.handleError = this.handleError.bind(this);
        this.tryAutoLogin = this.tryAutoLogin.bind(this);
        this.sendResetPasswordEmail = this.sendResetPasswordEmail.bind(this);
        this.getFCMToken = this.getFCMToken.bind(this);
    }

    public async tryAutoLogin() {
        try {
            if (auth().currentUser != null) {
                return await auth()
                    .currentUser?.getIdToken()
                    .catch(error => {
                        console.log('error: ', error);
                        return this.handleError(error);
                    });
            } else {
                return null;
            }
        } catch (error) {
            console.log('error: ', error);
            return this.handleError(error);
        }
    }

    public async login(email, password) {
        try {
            let response = await auth()
                .signInWithEmailAndPassword(email, password)
                .catch(error => {
                    console.log('error: ', error);
                    return this.handleError(error);
                });
            if ((response as any).user) {
                return await (response as any).user
                    .getIdToken()
                    .catch(error => {
                        console.log('error: ', error);
                        return this.handleError(error);
                    });
            } else {
                return response;
            }
        } catch (error) {
            console.log('error: ', error);
            return this.handleError(error);
        }
    }

    public async signIn(email, password) {
        const response = await auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(error => {
                console.log('error: ', error);
                return this.handleError(error);
            });

        return response;
    }

    public async getFCMToken() {
        try {
            await messaging().registerDeviceForRemoteMessages();
            const fcmToken = await messaging().getToken();
            return fcmToken;
        } catch (error) {
            console.log('error: ', error);
            return this.handleError(error);
        }
    }

    public async loginWithGoogle() {
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            const userInfo = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(
                userInfo?.idToken,
            );
            const res = await auth().signInWithCredential(googleCredential);
            if ((res as any).user) {
                const idToken = await (res as any).user
                    .getIdToken()
                    .catch(error => {
                        console.log('error: ', error);
                        return this.handleError(error);
                    });
                return {...res, idToken: idToken};
            } else {
                return res;
            }
        } catch (error) {
            console.error('Google login error:', error);
            return this.handleError(error);
        }
    }
    // public async loginWithFacebook() {
    //     try {
    //         const result = await LoginManager.logInWithPermissions([
    //             'public_profile',
    //             'email',
    //         ]);

    //         if (result.isCancelled) {
    //             throw new Error('User cancelled the login process');
    //         }

    //         const data = await AccessToken.getCurrentAccessToken();

    //         if (!data) {
    //             throw new Error('Something went wrong obtaining access token');
    //         }

    //         const facebookCredential = auth.FacebookAuthProvider.credential(
    //             data.accessToken,
    //         );

    //         const res = await auth().signInWithCredential(facebookCredential);

    //         if ((res as any).user) {
    //             const idToken = await (res as any).user
    //                 .getIdToken()
    //                 .catch(error => {
    //                     console.log('error: ', error);
    //                     return this.handleError(error);
    //                 });
    //             return {...res, idToken: idToken};
    //         } else {
    //             return res;
    //         }
    //     } catch (error) {
    //         console.error('Facebook login error:', error);
    //         return this.handleError(error);
    //     }
    // }

    public async logout() {
        try {
            let response = await auth()
                .signOut()
                .catch(error => {
                    console.log('error: ', error);
                    return this.handleError(error);
                });
            GoogleSignin.signOut();
            return response;
        } catch (error) {
            console.log('error: ', error);
            return this.handleError(error);
        }
    }

    public async sendResetPasswordEmail(email) {
        try {
            let response = await auth()
                .sendPasswordResetEmail(email)
                .catch(error => {
                    console.log('error: ', error);
                    return this.handleError(error);
                });
            return response;
        } catch (error) {
            console.log('error: ', error);
            return this.handleError(error);
        }
    }

    public handleError(error) {
        let titleCode = '';
        let messageCode = '';
        switch (error.code) {
            case firebaseErrors.AUTH_INVALID_EMAIL:
            case firebaseErrors.AUTH_WRONG_PASSWORD:
            case firebaseErrors.AUTH_WEEK_PASSWORD:
            case firebaseErrors.AUTH_USER_DISABLED:
            case firebaseErrors.AUTH_USER_NOT_FOUND:
            case firebaseErrors.AUTH_OPERATION_NOT_ALLOWED:
            case firebaseErrors.AUTH_EMAIL_ALREADY_IN_USE:
            case firebaseErrors.AUTH_INVALID_CREDENTIAL:
                titleCode = error.code + '-title';
                messageCode = error.code + '-message';
                break;
            default:
                titleCode = 'default-error-title';
                messageCode = 'default-error-message';
                break;
        }
        return {
            error: error,
            titleCode: titleCode,
            messageCode: messageCode,
        };
    }

    public async sendToStorage(data) {
        const {path, base64String, localPath} = data;
        // console.log('data', data);
        let storagePath = '';
        if (Array.isArray(path)) {
            if (path.length > 0) {
                for (let i = 0; i < path.length - 1; i++) {
                    const element = path[i];
                    storagePath = storagePath + element + '/';
                }
                storagePath = storagePath + path[path.length - 1];
            }
        } else {
            storagePath = path;
        }

        const storageRef = storage().ref(storagePath);

        if (localPath != undefined) {
            const res = await storageRef
                .putFile(localPath)
                .then(res => {
                    console.log('res', res);
                    return res;
                })
                .catch(error => {
                    return this.handleError(error);
                });
            return res;
        } else if (base64String != undefined) {
            const res = await storageRef
                .putString(base64String, 'base64')
                .then(res => {
                    return res;
                })
                .catch(error => {
                    return this.handleError(error);
                });
            return res;
        } else {
            return {
                error: Error('invalid parameters'),
                titleCode: 'default-error-title',
                messageCode: 'invalid-parameters',
            };
        }
    }

    public async deleteFolder(folderPath: string) {
        try {
            const folderRef = storage().ref(folderPath);

            const folderSnapshot = await folderRef.listAll();

            const deletePromises = folderSnapshot.items.map(fileRef =>
                fileRef.delete(),
            );

            await Promise.all(deletePromises);
        } catch (error) {
            console.error(`Error deleting folder ${folderPath}:`, error);
            return this.handleError(error);
        }
    }

    public async getProofs({machineId}) {
        const storageRef = storage().ref(`/machines/${machineId}/proof`);
        const res = await storageRef.listAll();

        const names = res.items.map(value => {
            return value.name;
        });

        return names;
    }

    public async deleteProof({machineId, filename}) {
        const storageRef = storage().ref(
            `/machines/${machineId}/proof/${filename}`,
        );
        await storageRef.delete();
    }
}
