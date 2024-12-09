/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import container from './src/container';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => async (data) => {
    console.log("ReactNativeFirebaseMessagingHeadlessTask", data)
    const pusher = container.resolve('pusher')
    pusher.handlePush(data)
})
