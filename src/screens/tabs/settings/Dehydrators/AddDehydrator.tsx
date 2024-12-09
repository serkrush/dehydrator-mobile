import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {RESULTS} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import DFlagSpinner from 'src/components/DFlagSpinner';
import DSpinner from 'src/components/DSpinner';
import Header from 'src/components/Headers/UpdatedHeader';
import ImageStore from 'src/components/ImageStore';
import {DButtonSubmitting} from 'src/components/buttons/DButtonSubmitting';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import BaseCardModal from 'src/components/modals/BaseCardModal';
import AlertView from 'src/components/views/AlertView';
import Card from 'src/components/views/Card';
import {AppState, ENTITY, Flag, ServerErrorCode} from 'src/constants';
import {IMachineNetwork} from 'src/entities/models/IMachineNetwork';
import {useAcl} from 'src/hooks/useAcl';
import useEntity, {useActions} from 'src/hooks/useEntity';
import {colors, families, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {images} from 'src/theme/images';
import {capitalize} from 'src/utils/capitalize';
import {goToSettings, isIos} from 'src/utils/helper';
import {EPermissionTypes, usePermissions} from 'src/utils/usePermissions';
import {GRANT} from '../../../../../acl/types';
import * as actionTypes from '../../../../store/actions';
import {QRScanner} from './QRScanner';
import QRScannerComponent from 'src/components/QRScannerComponent';

interface MachineScanData {
    uid: string;
    machine: {
        model: string;
        machineType: string;
        brand: string;
    };
}

const viewColors = {
    text: {
        description: '#1A1A1A',
        descriptionSpan: palette.orange,
    },
};

export default function AddDehydrator() {
    const dispatch = useDispatch();
    const [cameraShown, setCameraShown] = useState(false);

    const [selectedUid, setSelectedUid] = useState(
        undefined as string | undefined,
    );

    const {t} = useTranslation();

    const {allow} = useAcl();

    const notShowDesc = t('dehydrator-not-show');
    const notShowingUpSpan = t('not-showing-up-span');
    const descParts = notShowDesc.split(notShowingUpSpan);

    const {scan} = useEntity('MachineNetwork');
    const {getModelsInfo} = useActions('MachineModelEntity');

    const network = useSelector((state: AppState) => {
        return state[ENTITY.MachineNetwork];
    });

    const models = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE_MODEL];
    });

    //console.log('machine network', network);

    useEffect(() => {
        dispatch(actionTypes.clearBox(Flag.ConfirmPairRequested));
        getModelsInfo();
    }, []);

    // function handleBackButtonClick() {
    //     if (cameraShown) {
    //         setCameraShown(false);
    //     }
    //     return false;
    // }

    // useEffect(() => {
    //     BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         handleBackButtonClick,
    //     );
    //     return () => {
    //         BackHandler.removeEventListener(
    //             'hardwareBackPress',
    //             handleBackButtonClick,
    //         );
    //     };
    // }, []);

    const {askPermissions} = usePermissions(EPermissionTypes.CAMERA);
    const takePermissions = async () => {
        askPermissions()
            .then(response => {
                //permission given for camera
                if (
                    response.type === RESULTS.LIMITED ||
                    response.type === RESULTS.GRANTED
                ) {
                    setCameraShown(true);
                }
            })
            .catch(error => {
                //permission is denied/blocked or camera feature not supported
                if ('isError' in error && error.isError) {
                    Alert.alert(
                        t(error.errorMessage) ||
                            t(
                                'Something went wrong while taking camera permission',
                            ),
                    );
                }
                if ('type' in error) {
                    if (error.type === RESULTS.UNAVAILABLE) {
                        Alert.alert(
                            t('This feature is not supported on this device'),
                        );
                    } else if (
                        error.type === RESULTS.BLOCKED ||
                        error.type === RESULTS.DENIED
                    ) {
                        Alert.alert(
                            t('Permission Denied'),
                            t(
                                'Please give permission from settings to continue using camera.',
                            ),
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () =>
                                        console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                {
                                    text: 'Go To Settings',
                                    onPress: () => goToSettings(),
                                },
                            ],
                        );
                    }
                }
            });
    };

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');

    const {pairConnected} = useActions('MachineEntity');

    const [visible, setVisible] = useState(false);

    const identity = useSelector((state: AppState) => {
        return state?.auth?.identity;
    });

    const users = useSelector((state: AppState) => {
        return state.users;
    });
    const currentUser = useMemo(() => {
        if (identity.userId) {
            return users[identity.userId];
        } else {
            return undefined;
        }
    }, [users, identity]);

    const onPairPress = () => {
        pairConnected({data: {uid: selectedUid}});
    };

    const onDehNotShowPress = () => {
        setVisible(true);
    };

    const isUidString = value => {
        const uuidString =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const res = uuidString.test(value);
        console.log(value, 'isUidString', res);
        return res;
    };

    const onScanQR = scannedData => {
        setVisible(false);
        console.log('onScanQR SCANNED DATA', scannedData);
        pairConnected({data: {uid: scannedData}});
    };

    const renderItem = ({item, key}: {item: IMachineNetwork; key}) => {
        const model = item.model
            ? models[item.model] ?? models[item.model.toLowerCase()]
            : undefined;
        let image = '';
        if (model && model.mediaResources) {
            image = model.mediaResources;
        }
        return (
            <TouchableOpacity
                key={key}
                onPress={() => {
                    setSelectedUid(item.uid);
                }}>
                <Card selected={item.uid == selectedUid}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                        }}>
                        <View style={styles.imageContainer}>
                            <ImageStore
                                folder={`models/${model.model.toLowerCase()}`}
                                style={{
                                    backgroundColor: palette.gray,
                                    height: 40,
                                    width: 40,
                                    borderRadius: 8,
                                }}
                                name={image}
                            />
                        </View>
                        <View>
                            <Text style={{...fonts.h3, color: palette.orange}}>
                                {item.model}
                                {' ('}
                                {item.uid.slice(
                                    -1 *
                                        di.resolve('config')
                                            .publicMachineIdLength,
                                )}
                                {')'}
                            </Text>
                            <Text
                                style={{
                                    ...fonts.textSizeSL,
                                    color: colors.card.text.mainContent,
                                }}>
                                {model != undefined && model?.totalTrays}
                                {model != undefined &&
                                    ` ${capitalize(t('tray_count'))}`}
                                {` ${capitalize(t(item.mode))}`}
                            </Text>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <BaseScreenLayout
            containerStyle={{
                backgroundColor: colors.mainBackground,
                paddingHorizontal: 0,
            }}>
            <View style={{paddingTop: 4, flex: 1, paddingHorizontal: 20}}>
                <Header title={t('add-a-dehydrator')} showBackButton={true} />
                <DUpdatedButton
                    baseStyle={ButtonStyle.Primary}
                    containerStyle={{borderWidth: 0, marginTop: 8}}
                    onPress={onDehNotShowPress}
                    text={t('pair-qr')}
                />
                <Card style={{marginTop: 8, gap: 12}}>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 12,
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                        }}>
                        <Image
                            source={images.infoOutlined}
                            style={{
                                height: 24,
                                width: 24,
                                tintColor: colors.card.text.mainContent,
                            }}
                        />

                        <Text
                            style={{
                                ...fonts.textSizeML,
                                color: colors.card.text.mainContent,
                                flex: 1,
                                lineHeight: undefined,
                            }}>
                            {t('add-dehydrator-lan')}
                        </Text>
                    </View>
                    <DButtonSubmitting
                        baseStyle={ButtonStyle.Alternative}
                        containerStyle={{borderWidth: 0}}
                        text={t('scan-lan')}
                        onPress={() => {
                            if (
                                allow(GRANT.WRITE) ||
                                (allow(GRANT.READ) &&
                                    currentUser != undefined &&
                                    (currentUser?.parentsId == undefined ||
                                        currentUser?.parentsId.length == 0))
                            ) {
                                scan();
                            } else {
                                Alert.alert(
                                    t(ServerErrorCode.NotAccessedAction),
                                );
                            }
                        }}
                        changeDisabledOpacity={true}
                        entityName={'MachineNetwork'}
                        actionType={actionTypes.GET}
                    />
                </Card>
                {false && (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'blue',
                        }}>
                        <ActivityIndicator
                            size={'large'}
                            color={colors.spinner}
                        />
                    </View>
                )}

                <ScrollView
                    contentContainerStyle={{gap: 12, paddingVertical: 16}}>
                    {Object.values(network).map(value => {
                        return renderItem({item: value, key: value.uid});
                    })}
                </ScrollView>
                <View
                    style={{
                        paddingVertical: 16,
                        gap: 20,
                    }}>
                    <DUpdatedButton
                        baseStyle={ButtonStyle.Alternative}
                        containerStyle={{borderWidth: 0}}
                        onPress={onPairPress}
                        text={t('pair')}
                        disabled={selectedUid == undefined}
                    />
                </View>
            </View>
            <QRScannerComponent
                cameraShown={cameraShown}
                setCameraShown={setCameraShown}
                handleReadCode={onScanQR}
            />
            <DSpinner checkEntities={['MachineEntity', 'UserEntity']} />
            <DFlagSpinner checkFlags={Flag.ConfirmPairRequested} />
            {visible && (
                <BaseCardModal
                    imageView={<AlertView />}
                    title={t('dehydrator-not-show')}
                    description={t('dehydrator-not-show-message')}
                    actionRows={[
                        {
                            text: t('scan-qr'),
                            baseStyle: ButtonStyle.Primary,
                            onPress: () => {
                                setVisible(false);
                                if (
                                    allow(GRANT.WRITE) ||
                                    (allow(GRANT.READ) &&
                                        currentUser != undefined &&
                                        (currentUser?.parentsId == undefined ||
                                            currentUser?.parentsId.length == 0))
                                ) {
                                    takePermissions();
                                } else {
                                    Alert.alert(
                                        t(ServerErrorCode.NotAccessedAction),
                                    );
                                }
                            },
                        },
                        {
                            text: t('cancel'),
                            baseStyle: ButtonStyle.Outlined,
                            onPress: () => {
                                setVisible(false);
                            },
                        },
                    ]}
                />
            )}
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    noShowDescription: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 22,
        color: viewColors.text.description,
    },

    noShowDescriptionSpan: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 22,
        color: viewColors.text.descriptionSpan,
        textDecorationLine: 'underline',
    },
    imageContainer: {
        width: 40,
        height: 40,
    },
});
