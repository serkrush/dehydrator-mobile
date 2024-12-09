import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, ScrollView, Text, View} from 'react-native';
import RNFS from 'react-native-fs';
import {useDispatch, useSelector} from 'react-redux';
import Header, {ViewType} from 'src/components/Headers/UpdatedHeader';
import {colors, fonts} from 'src/theme';

import DocumentPicker from 'react-native-document-picker';
import {RESULTS} from 'react-native-permissions';
import ContainerContext from 'src/ContainerContext';
import DFlagSpinner from 'src/components/DFlagSpinner';
import DSpinner from 'src/components/DSpinner';
import QRScannerComponent from 'src/components/QRScannerComponent';
import DUpdatedButton from 'src/components/buttons/DUpdatedButton';
import {ButtonStyle} from 'src/components/buttons/DUpdatedImageButton';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import BaseCardModal from 'src/components/modals/BaseCardModaWithConfirmationField';
import BaseModal from 'src/components/modals/BaseModal';
import OwnerEditDehydratorModal from 'src/components/modals/OwnerEditDehydratorModal';
import BaseTitleInputRow from 'src/components/rows/BaseTitleInputRow';
import ExclamationView from 'src/components/views/ExclamationView';
import {AppState, DEFAULT_CURRENCY_SYMBOL, ENTITY, Flag} from 'src/constants';
import {useAcl} from 'src/hooks/useAcl';
import {useActions} from 'src/hooks/useEntity';
import {useIdentity} from 'src/hooks/useIdentity';
import * as actionTypes from 'src/store/actions';
import {images} from 'src/theme/images';
import {capitalize} from 'src/utils/capitalize';
import {goToSettings} from 'src/utils/helper';
import {EPermissionTypes, usePermissions} from 'src/utils/usePermissions';
import {GRANT} from '../../../../../acl/types';

export default function EditDehydrator({route}) {
    const floatString = /^([0-9]*[.])?[0-9]+$/;
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const identity = useIdentity();
    const {allow} = useAcl();

    const machineId = route?.params?.machineId;

    const deleteConfirmationString = t('delete-confirmation-string');

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const config = di.resolve('config');
    const guidLength = config?.publicMachineIdLength ?? 8;

    const [data, setData] = useState(undefined as undefined | any);
    const [uri, setUri] = useState(undefined as undefined | string);

    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteString, setDeleteString] = useState('');

    const {resetConnected} = useActions('MachineEntity');

    const [cameraShown, setCameraShown] = useState(false);

    const isUidString = value => {
        const uuidString =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const res = uuidString.test(value);
        console.log(value, 'isUidString', res);
        return res;
    };

    const handleReadCode = (value: string) => {
        if (isUidString(value)) {
            console.log('onScanQR SCANNED DATA', value);
            if (machine?.guid == value) {
                resetConnected({
                    machineGuid: value,
                    checkFlag: Flag.MachineDeleteProcess,
                });
            } else {
                Alert.alert(t('guid not match'));
            }
        } else {
            Alert.alert(t('invalid data'));
        }
    };

    const {updateMachine} = useActions('MachineEntity');
    const {deleteMachineAccess} = useActions('MachineAccessEntity');

    const box = useSelector((state: AppState) => {
        return state.box;
    });

    const users = useSelector((state: AppState) => {
        return state[ENTITY.USER];
    });

    const currentMachineId = useMemo(() => {
        return machineId ?? box[Flag.CurrentUpdatedMachineId];
    }, [box]);

    const process = useMemo(() => {
        return box[Flag.MachineDeleteProcess];
    }, [box]);

    const machines = useSelector((state: AppState) => {
        return state?.machines;
    });

    const currentUser = useMemo(() => {
        return identity != undefined && identity.userId != undefined
            ? users[identity?.userId]
            : undefined;
    }, [users, identity]);

    const currentCurrency = useMemo(() => {
        return (
            currentUser?.currencySymbol ??
            (box != undefined && box[Flag.AppSettings] != undefined
                ? box[Flag.AppSettings].currencySymbol
                : undefined)
        );
    }, [currentUser, box]);

    const machine = useMemo(() => {
        return machines[currentMachineId];
    }, [machines, currentMachineId]);

    const [machineName, setMachineName] = useState(machine?.machineName ?? '');
    const [costString, setCostString] = useState(`${machine?.costPerKwh ?? 0}`);
    const [filename, setFilename] = useState(
        machine?.proofOfPurchaseFile as string | undefined,
    );

    useEffect(() => {
        dispatch(actionTypes.clearBox(Flag.ConfirmResetRequested));
    }, []);

    useEffect(() => {
        if (process === Flag.ACTION_SUCCESS) {
            afterDelete();
            dispatch(actionTypes.clearBox(Flag.MachineDeleteProcess));
        }
    }, [process]);

    const afterDelete = () => {
        console.log('after delete');
        navigator.pop();
    };

    const onDeletePress = () => {
        setDeleteModalVisible(true);
    };

    const onDeleteConfirmPress = () => {
        if (deleteString == deleteConfirmationString) {
            setDeleteString('');
            deleteMachineAccess({
                userId: identity.userId,
                machineId: machine.id,
                checkFlag: Flag.MachineDeleteProcess,
            });
            setDeleteModalVisible(false);
        } else {
            setDeleteString('');
            Alert.alert(t('invalid-delete-string'));
        }
    };

    const onCancelPress = () => {
        navigator.pop();
    };

    const onUploadPress = async () => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: ['application/pdf', 'image/*'],
            });
            console.log(
                result.uri,
                result.type, // mime type
                result.name,
                result.size,
            );

            if (result && result.uri) {
                setUri(result.uri);
                const fileContents = await RNFS.readFile(result.uri, 'base64');
                console.log('uploaded data', fileContents);
                if (fileContents) {
                    setFilename(result.name ?? undefined);
                    setData(fileContents ?? '');
                }
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
            } else {
                throw err;
            }
        }
    };

    const onSavePress = () => {
        const test = floatString.test(costString);
        if (!test) {
            Alert.alert(t('invalid-values'));
            return;
        }

        const parsed = parseFloat(costString);
        updateMachine({
            data: {
                machineData: {
                    ...machine,
                    machineName: machineName.trim(),
                    costPerKwh: parsed,
                    updatedAt: Date.now(),
                },
                proofName: filename,
                proofUri: uri,
                proofData: data,
            },
        });
    };

    const sectionSeparator = title => {
        return (
            <View
                style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.header.border,
                }}>
                <Text
                    style={{
                        ...fonts.textSizeL28,
                        color: colors.header.text.main,
                    }}>
                    {title}
                </Text>
            </View>
        );
    };

    let rightButtons = [];
    if (allow(GRANT.EXECUTE)) {
        rightButtons.push({
            type: ViewType.ImageButton,
            value: {
                source: images.moreVertical,
                imageWidth: 24,
                imageHeight: 24,
                tintColor: colors.imageButton.outlined.content,
                onPress: () => {
                    setModalVisible(true);
                },
                baseStyle: ButtonStyle.Outlined,
                containerStyle: [{width: 40, height: 40}],
            },
        });
    } else if (allow(GRANT.READ)) {
        rightButtons.push({
            type: ViewType.ImageButton,
            value: {
                source: images.delete,
                imageWidth: 24,
                imageHeight: 24,
                tintColor: colors.imageButton.destructive.content,
                onPress: onDeletePress,
                baseStyle: ButtonStyle.Destructive,
                containerStyle: [{width: 40, height: 40}],
            },
        });
    }

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
                                    text: t('cancel'),
                                    onPress: () =>
                                        console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                {
                                    text: t('Go To Settings'),
                                    onPress: () => goToSettings(),
                                },
                            ],
                        );
                    }
                }
            });
    };

    return (
        <>
            <BaseScreenLayout style={{backgroundColor: colors.mainBackground}}>
                <View style={{paddingTop: 4, flex: 1}}>
                    <Header
                        showBackButton={true}
                        title={t('edit-machine')}
                        rightButtons={rightButtons}
                    />
                    <ScrollView>
                        <View style={{marginTop: 16, gap: 8}}>
                            <BaseTitleInputRow
                                fieldTitle={t('placeholder-name')}
                                fieldPlaceholder={t('placeholder-name')}
                                value={machineName}
                                setValue={setMachineName}
                                keyboardType={undefined}
                                label={undefined}
                                placeholderTextColor={undefined}
                            />
                            {machine?.guid && (
                                <BaseTitleInputRow
                                    fieldTitle={t('guid')}
                                    fieldPlaceholder={t('guid')}
                                    value={machine.guid.substring(
                                        machine.guid.length - guidLength,
                                    )}
                                    setValue={() => {}}
                                    keyboardType={undefined}
                                    label={undefined}
                                    placeholderTextColor={undefined}
                                    readOnly={true}
                                    additionalInputContainerStyle={{
                                        backgroundColor: colors.mainBackground,
                                    }}
                                />
                            )}
                        </View>
                        <View style={{marginTop: 16}}>
                            {sectionSeparator(t('upload-proof'))}
                        </View>
                        <View style={{marginTop: 16}}>
                            <BaseTitleInputRow
                                fieldTitle={t('file')}
                                fieldPlaceholder={''}
                                value={filename}
                                setValue={setFilename}
                                readOnly={true}
                                keyboardType={undefined}
                                label={undefined}
                                placeholderTextColor={undefined}
                            />
                        </View>
                        <DUpdatedButton
                            baseStyle={ButtonStyle.Outlined}
                            source={images.arrows.upFromLine}
                            imageWidth={20}
                            imageHeight={20}
                            text={t('upload')}
                            onPress={onUploadPress}
                            reverse={true}
                            containerStyle={{borderWidth: 1, marginTop: 16}}
                        />
                        <View style={{marginTop: 16}}>
                            <BaseTitleInputRow
                                valueChecker={value => {
                                    return floatString.test(value);
                                }}
                                errorStyle={{
                                    borderWidth: 1,
                                    borderColor: 'red',
                                    borderRadius: 8,
                                }}
                                fieldTitle={t('costPer')}
                                fieldPlaceholder={''}
                                value={costString}
                                setValue={setCostString}
                                keyboardType={'number-pad'}
                                label={currentCurrency}
                                placeholderTextColor={undefined}
                            />
                        </View>
                    </ScrollView>
                    <View style={{gap: 8, paddingVertical: 16}}>
                        <DUpdatedButton
                            baseStyle={ButtonStyle.Primary}
                            text={t('save')}
                            onPress={onSavePress}
                        />
                        <DUpdatedButton
                            baseStyle={ButtonStyle.Outlined}
                            text={t('cancel')}
                            onPress={onCancelPress}
                        />
                    </View>

                    <DSpinner
                        checkEntities={[
                            'UserEntity',
                            'MachineAccessEntity',
                            'MachineEntity',
                            'Identity',
                        ]}
                    />
                    <DFlagSpinner checkFlags={Flag.ConfirmResetRequested} />

                    {deleteModalVisible && (
                        <BaseCardModal
                            imageView={<ExclamationView />}
                            title={t('delete-dehydrator-title')}
                            description={t('delete-dehydrator-message')}
                            fieldValue={deleteString}
                            fieldSetValue={setDeleteString}
                            fieldTitle={capitalize(t('confirmation'))}
                            actionRows={[
                                {
                                    text: t('delete'),
                                    baseStyle: ButtonStyle.Destructive,
                                    onPress: onDeleteConfirmPress,
                                },
                                {
                                    text: t('cancel'),
                                    baseStyle: ButtonStyle.Outlined,
                                    onPress: () => {
                                        setDeleteString('');
                                        setDeleteModalVisible(false);
                                    },
                                },
                            ]}
                        />
                    )}
                    <BaseModal
                        visible={modalVisible}
                        setVisible={setModalVisible}>
                        <OwnerEditDehydratorModal
                            setVisible={setModalVisible}
                            resetToFactory={() => {
                                takePermissions();
                            }}
                            changeOwner={() => {}}
                        />
                    </BaseModal>
                </View>
            </BaseScreenLayout>
            <QRScannerComponent
                cameraShown={cameraShown}
                setCameraShown={setCameraShown}
                handleReadCode={handleReadCode}
            />
        </>
    );
}
