import PushNotification from 'react-native-push-notification';
const channelSetup = channelId => {
    if (!PushNotification.channelExists(channelId)) {
        PushNotification.deleteChannel(channelId);
    }
    PushNotification.createChannel(
        {
            channelId: channelId, // required
            channelName: 'dehydrators',
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
};

export const sendLocalPushNotification = (
    notificationData,
    channelId = 'local-push',
) => {
    try {
        channelSetup(channelId);
        PushNotification.localNotification({
            channelId: channelId,
            autoCancel: true,
            bigText: notificationData.message,
            title: notificationData.title,
            message: notificationData.message,
            vibrate: true,
            vibration: 300,
            playSound: true,
            soundName: 'default',
        });
    } catch (error) {
        console.log('push error', error);
    }
};
