import {useIsFocused} from '@react-navigation/native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Alert,
    AppState,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    Camera,
    CameraRuntimeError,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera';
import {isIos, getWindowHeight, getWindowWidth} from 'src/utils/helper';

import {RNHoleView} from 'react-native-hole-view';
import DImageButton from 'src/components/buttons/DImageButton';
import {images} from 'src/theme/images';
import ContainerContext from 'src/ContainerContext';
import DTextButton from 'src/components/buttons/DTextButton';
import Header from 'src/components/Headers/UpdatedHeader';
import DUpdatedImageButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedImageButton';
import {useTranslation} from 'react-i18next';
import {colors, fonts} from 'src/theme';

export interface ICameraScannerProps {
    setIsCameraShown: (value: boolean) => void;
    onReadCode: (value: string) => void;
    isCameraInitialized: boolean;
    setIsCameraInitialized: (value: boolean) => void;

    startOffset: boolean;
    setStartOffset: (value: boolean) => void;

    closeOffset: boolean;
    setCloseOffset: (value: boolean) => void;
}

export const QRScanner = ({
    setIsCameraShown,
    onReadCode,
    isCameraInitialized,
    setIsCameraInitialized,

    startOffset: startOffsetEnded,
    setStartOffset,

    closeOffset: closeOffsetStarted,
    setCloseOffset,
}: ICameraScannerProps) => {
    const di = useContext(ContainerContext);
    const isDev = di.resolve('config')?.dev ?? false;

    const {t} = useTranslation();

    const mockScanedData = di.resolve('config')?.mock?.machineUID ?? 'machine';
    // const mockScanedData = JSON.stringify({
    //     uid: di.resolve('config')?.mock?.machineUID ?? 'machine',
    //     machine: {
    //         model: '28CUD',
    //         machineType: 'dehydrator',
    //         brand: 'BenchFoods',
    //     },
    // });

    const device = useCameraDevice('back');
    const camera = useRef<Camera>(null);

    const setCodeScannedFunc = (code: string | undefined) => {
        console.log('CODE SCANNED');
        if (code) {
            onReadCode(code);
        }
    };

    if (device == null) {
        Alert.alert(t('Error!'), t('Camera could not be started'));
    }

    const onError = (error: CameraRuntimeError) => {
        Alert.alert(t('Error!'), t(error.message));
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: codes => {
            console.log('--- onCodeScanned = ', codes);
            if (codes.length > 0) {
                if (codes[0].value && startOffsetEnded && !closeOffsetStarted) {
                    setCloseOffset(true);
                    const timeout = setTimeout(() => {
                        setCodeScannedFunc(codes[0]?.value);
                        clearTimeout(timeout);
                    }, 750);
                }
            }
            return;
        },
    });

    const [isActive, setIsActive] = useState(isIos);
    const [flash, setFlash] = useState<'on' | 'off'>(isIos ? 'off' : 'on');
    const isFocused = useIsFocused();

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        timeout = setTimeout(() => {
            setStartOffset(true);
            clearTimeout(timeout);
        }, 1500);
    }, []);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (isCameraInitialized) {
            timeout = setTimeout(() => {
                setIsActive(true);
                setFlash('off');
            }, 0);
        }
        setIsActive(false);
        return () => {
            clearTimeout(timeout);
        };
    }, [isCameraInitialized]);

    const onInitialized = () => {
        setIsCameraInitialized(true);
    };

    if (isFocused && device) {
        return (
            <View style={styles.safeArea}>
                <View
                    style={[
                        styles.cameraControls,
                        {backgroundColor: undefined},
                    ]}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                        }}>
                        <DUpdatedImageButton
                            baseStyle={ButtonStyle.Alternative}
                            source={images.arrows.left}
                            imageHeight={24}
                            imageWidth={24}
                            containerStyle={{height: 40, width: 40}}
                            onPress={() => {
                                let closeTimeout: NodeJS.Timeout;
                                setCloseOffset(true);
                                closeTimeout = setTimeout(() => {
                                    setIsCameraShown(false);
                                    clearTimeout(closeTimeout);
                                }, 750);
                            }}
                        />
                        <Text
                            style={{
                                ...fonts.h2,
                                color: 'white',
                                lineHeight: undefined,
                            }}>
                            {t('scan')}
                        </Text>
                    </View>
                    {isDev && (
                        <DTextButton
                            text={'mock'}
                            onPress={() => {
                                console.log('mock', mockScanedData);
                                setCodeScannedFunc(mockScanedData);
                            }}
                        />
                    )}
                </View>
                <Camera
                    onInitialized={onInitialized}
                    onError={onError}
                    photo={false}
                    style={styles.fullScreenCamera}
                    device={device}
                    codeScanner={codeScanner}
                    isActive={
                        !closeOffsetStarted &&
                        startOffsetEnded &&
                        isActive &&
                        isFocused &&
                        AppState.currentState === 'active' &&
                        isCameraInitialized
                    }
                />
                <RNHoleView
                    holes={[
                        {
                            x: getWindowWidth * 0.1,
                            y: getWindowHeight * 0.28,
                            width: getWindowWidth * 0.8,
                            height: getWindowHeight * 0.4,
                            borderRadius: 10,
                        },
                    ]}
                    style={[styles.rnholeView, styles.fullScreenCamera]}
                />
            </View>
        );
    } else {
        return <View />;
    }
};

export const styles = StyleSheet.create({
    safeArea: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    camera: {
        width: '100%',
        height: 200,
    },
    fullScreenCamera: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
        zIndex: 100,
    },
    rnholeView: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    cameraControls: {
        height: '10%',
        top: 15,
        position: 'absolute',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        zIndex: 1000,
    },
});
