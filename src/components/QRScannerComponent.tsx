import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {RESULTS} from 'react-native-permissions';
import {QRScanner} from 'src/screens/tabs/settings/Dehydrators/QRScanner';
import {goToSettings, isIos} from 'src/utils/helper';
import {EPermissionTypes, usePermissions} from 'src/utils/usePermissions';

export default function QRScannerComponent({
    cameraShown,
    setCameraShown,
    handleReadCode,
}: {
    cameraShown;
    setCameraShown;
    handleReadCode;
}) {
    const [isCameraInitialized, setIsCameraInitialized] = useState(isIos);
    const [startOffset, setStartOffset] = useState(false);
    const [closeOffset, setCloseOffset] = useState(false);

    const onReadCode = (value: string) => {
        let closeTimeout: NodeJS.Timeout;
        setCloseOffset(true);
        closeTimeout = setTimeout(() => {
            setCameraShown(false);
            handleReadCode(value);
            clearTimeout(closeTimeout);
        }, 750);
    };

    useEffect(() => {
        if (cameraShown) {
            setIsCameraInitialized(isIos);
            setStartOffset(false);
            setCloseOffset(false);
        }
    }, [cameraShown]);

    return (
        <>
            {cameraShown && (
                <QRScanner
                    setIsCameraShown={setCameraShown}
                    onReadCode={onReadCode}
                    isCameraInitialized={isCameraInitialized}
                    setIsCameraInitialized={setIsCameraInitialized}
                    startOffset={startOffset}
                    setStartOffset={setStartOffset}
                    closeOffset={closeOffset}
                    setCloseOffset={setCloseOffset}
                />
            )}
        </>
    );
}
