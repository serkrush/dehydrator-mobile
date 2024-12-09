import SocketClient from 'src/socket/SocketClient';
import DImageButton from './DImageButton';
import React, {useEffect, useState} from 'react';
import {images} from 'src/theme/images';
import {useActions} from 'src/hooks/useEntity';
import BackModalLayer from '../modals/BackModalLayer';
import {ActivityIndicator, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

export default function SocketCheckView({
    socket,
    socketActive,
    setSocketActive,
    socketConnecting,
    setSocketConnecting,
    deviceIds = undefined,
    needResubscribe = false,
    resubscribeOnCurrent = false,
}: {
    socket: SocketClient;
    socketActive;
    setSocketActive;
    socketConnecting;
    setSocketConnecting;
    needResubscribe?: boolean;
    resubscribeOnCurrent?: boolean;
    deviceIds?: string[] | undefined;
}) {
    const {resubscribeOnDevicesUpdate, resubscribeOnAllAccessebleMachines} =
        useActions('MachineEntity');
    const {t} = useTranslation();
    const isPressAvailable = !socketActive && !socketConnecting;

    useEffect(() => {
        const timeout = setInterval(() => {
            //console.log('socket active check');
            setSocketActive(socket.active);
            setSocketConnecting(socket.connecting);
        }, 5000);
        return () => {
            console.log('clear socket check');
            clearTimeout(timeout);
        };
    }, []);

    return (
        <>
            {(socketConnecting || isPressAvailable) && (
                <BackModalLayer>
                    {socketConnecting && (
                        <View>
                            <Text
                                style={{
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    color: 'white',
                                }}>
                                {t('socket-connecting')}
                            </Text>
                            <ActivityIndicator size={'large'} />
                        </View>
                    )}
                    {isPressAvailable && (
                        <View>
                            <Text
                                style={{
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    color: 'white',
                                }}>
                                {t('socket-press-available')}
                            </Text>
                            <View style={{alignItems: 'center'}}>
                                <DImageButton
                                    disabled={socketConnecting}
                                    source={images.refresh}
                                    width={48}
                                    height={48}
                                    tintColor={'red'}
                                    onPress={() => {
                                        console.log('deviceIds', deviceIds);
                                        socket.check();
                                        if (needResubscribe) {
                                            if (resubscribeOnCurrent) {
                                                socket.resubscribeOnCurrentMachine();
                                            } else {
                                                if (deviceIds == undefined) {
                                                    resubscribeOnAllAccessebleMachines();
                                                } else if (
                                                    deviceIds &&
                                                    deviceIds.length > 0
                                                ) {
                                                    resubscribeOnDevicesUpdate({
                                                        deviceIds,
                                                    });
                                                }
                                            }
                                        }
                                        setSocketActive(socket.active);
                                        setSocketConnecting(socket.connecting);
                                    }}
                                />
                            </View>
                        </View>
                    )}
                </BackModalLayer>
            )}
        </>
    );
}
