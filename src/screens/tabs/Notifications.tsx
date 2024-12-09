import React, {useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import LastUpdateLabel from 'src/components/ManualControl/LastUpdateLabel';
import DTextButton from 'src/components/buttons/DTextButton';
import DUpdatedImageButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedImageButton';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import {AppState, ENTITY} from 'src/constants';
import {colors, fonts} from 'src/theme';
import {images} from 'src/theme/images';
import * as actionTypes from 'src/store/actions';
import {MachineMessage, NotificationMessage} from 'src/pusher/types';
import Card from 'src/components/views/Card';
import XMarkSvg from '../../../assets/svg/XMarkSvg';
import DSvgButton from 'src/components/buttons/DSvgButton';
import NotificationLastUpdateLabel from 'src/components/NotificationLastUpdateLabel';
import {colorsByCode, titleByCode} from 'src/utils/machineMessageCodeToTitle';
import Header, {ViewType} from 'src/components/Headers/UpdatedHeader';

const settingsScreenColors = {
    background: colors.mainBackground,
    text: {
        textButton: colors.textButton,
        card: colors.card.text,
    },
};

export default function NotificationsScreen() {
    const {t} = useTranslation();

    const container = useContext(ContainerContext);
    const redux = container.resolve('redux');
    const config = container.resolve('config');
    const guidLength = config.publicMachineIdLength ?? 8;

    const notifications = useSelector((state: AppState) => {
        return state.notifications;
    });

    const sortedNotifications = useMemo(() => {
        return Object.values(notifications).sort((a, b) => {
            return b.timestamp - a.timestamp;
        });
    }, [notifications]);

    const machines = useSelector((state: AppState) => {
        return state.machines;
    });

    const onNotificationDeletePress = (notification: NotificationMessage) => {
        redux.dispatch(
            actionTypes.action(actionTypes.DELETE, {
                payload: {
                    data: {
                        entities: {
                            [ENTITY.NOTIFICATION]: {
                                [notification.uuid]: notification,
                            },
                        },
                    },
                },
            }),
        );
    };

    const onClearAllNotifications = () => {
        redux.dispatch(
            actionTypes.action(actionTypes.DELETE_ALL, {
                payload: {
                    data: {
                        entities: {
                            [ENTITY.NOTIFICATION]: {},
                        },
                    },
                },
            }),
        );
    };

    const notificationView = (notification: NotificationMessage) => {
        const colors = {
            background: 'white',
            content: 'black',
            border: 'clear',
        };
        const message: string = t(
            notification.message,
            notification.params ?? {},
        ) as string;
        return (
            <Card
                style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: 1,
                    paddingVertical: 8,
                }}>
                <View style={{flex: 1}}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                            }}>
                            {notification.title != undefined && (
                                <Text style={styles.notificationTitle}>
                                    {t(notification.title)}
                                </Text>
                            )}
                        </View>
                        <DSvgButton
                            svg={<XMarkSvg />}
                            additionalStyle={{
                                paddingVertical: 8,
                                paddingLeft: 8,
                            }}
                            onPress={() => {
                                onNotificationDeletePress(notification);
                            }}
                        />
                    </View>
                    <Text style={[styles.notificationText, {marginTop: 8}]}>
                        {message}
                    </Text>

                    <View
                        style={{flex: 1, alignItems: 'flex-end', marginTop: 4}}>
                        <NotificationLastUpdateLabel
                            lastUpdateTime={notification.timestamp}
                        />
                    </View>
                </View>
            </Card>
        );
    };

    const machineMessageView = (notification: MachineMessage) => {
        const machine = Object.values(machines).find(value => {
            return value?.guid == notification?.machineUid;
        });

        const machineGuidString = notification?.machineUid?.substring(
            notification.machineUid.length - guidLength,
        );

        const machineNameString =
            machine?.machineName != undefined
                ? `${machine?.machineName} (${machineGuidString})`
                : machineGuidString;

        const zones = machine?.zones ?? [];

        const zone = zones.find(value => {
            return value.zoneNumber == notification.moduleNumber;
        });

        const colors = colorsByCode(notification.code);
        const message: string = t(
            notification.message,
            notification.params ?? {},
        ) as string;
        return (
            <Card
                style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: 1,
                    paddingVertical: 8,
                }}>
                <View style={{flex: 1}}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                            }}>
                            <Text style={styles.notificationTitle}>
                                {titleByCode(notification.code, t)}
                            </Text>
                            {zone != undefined && (
                                <Text style={[styles.notificationText]}>
                                    {`${t(`zones_${zone?.zone}`)} ${t('zone')}`}
                                </Text>
                            )}
                        </View>
                        <DSvgButton
                            svg={<XMarkSvg />}
                            additionalStyle={{
                                paddingVertical: 8,
                                paddingLeft: 8,
                            }}
                            onPress={() => {
                                onNotificationDeletePress(notification);
                            }}
                        />
                    </View>
                    <Text style={styles.notificationMachineName}>
                        {machineNameString}
                    </Text>

                    <Text style={[styles.notificationText, {marginTop: 8}]}>
                        {message}
                    </Text>

                    {/* <Text>{notification.code}</Text>
                        <Text>{notification.moduleNumber}</Text> */}
                    <View
                        style={{flex: 1, alignItems: 'flex-end', marginTop: 4}}>
                        <NotificationLastUpdateLabel
                            lastUpdateTime={notification.timestamp}
                        />
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <BaseScreenLayout
            style={{backgroundColor: settingsScreenColors.background}}>
            <View style={{}}>
                <View style={{marginTop: 16}}>
                    {/* <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Text style={[styles.sectionText]}>
                            {t('tab-notifications')}
                        </Text>
                    </View> */}
                    <Header
                        title={t('tab-notifications').toUpperCase()}
                        titleStyle={fonts.h1}
                        titleContainer={{paddingHorizontal: 0}}
                        rightButtons={[
                            {
                                type: ViewType.ImageButton,
                                value: {
                                    source: images.delete,
                                    imageWidth: 24,
                                    imageHeight: 24,
                                    tintColor:
                                        colors.imageButton.destructive.content,
                                    onPress: onClearAllNotifications,
                                    baseStyle: ButtonStyle.Destructive,
                                    containerStyle: [{width: 40, height: 40}],
                                    disabled: !sortedNotifications.length,
                                },
                            },
                        ]}
                    />
                </View>
            </View>
            <ScrollView
                style={{marginTop: 16}}
                contentContainerStyle={{gap: 8}}>
                {sortedNotifications.length ? (
                    sortedNotifications.map(value => {
                        if (
                            (value as MachineMessage)?.machineUid != undefined
                        ) {
                            return machineMessageView(value as MachineMessage);
                        } else {
                            return notificationView(value);
                        }
                    })
                ) : (
                    <Text
                        style={
                            (styles.notificationMachineName, {color: '#959595'})
                        }>
                        {t('no-notifications')}
                    </Text>
                )}
            </ScrollView>
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    sectionText: {
        ...fonts.h1,
        color: colors.header.text.main,
        lineHeight: undefined,
    },
    selectMachineButtonText: {
        ...fonts.textSizeS20,
        color: settingsScreenColors.text.textButton,
    },
    notificationTitle: {
        ...fonts.h2,
        color: '#000000E5',
    },
    notificationMachineName: {
        ...fonts.textSizeML,
        color: '#000000BB',
    },
    notificationText: {
        ...fonts.textSizeML,
        color: '#00000080',
    },
});
