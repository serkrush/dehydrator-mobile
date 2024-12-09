import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BaseModal from './BaseModal';
import palette from 'src/theme/colors/palette';
import ButtonForm from 'src/Form/ButtonForm';

interface DialogProps {
    onOkAction: () => void;
    title: string;
    noButton?: string;
    yesButton?: string;
    modalVisible: any;
    setModalVisible: any;
}

function ConfirmationDialog({
    onOkAction,
    title,
    noButton = '',
    yesButton = '',
    modalVisible,
    setModalVisible,
}: DialogProps) {
    // const [modalVisible, setModalVisible] = useState(false);
    // const data = useSelector((state: AppState) => state.box[flagerKey]);
    const {t} = useTranslation();
    // const dispatch = useDispatch();
    // const [visible, setVisible] = React.useState(false);

    const handleClose = () => {
        // dispatch(setBox(flagerKey, null));
        setModalVisible(false);
    };

    const ConfirmationDialogOk = () => {
        onOkAction();
        handleClose();
    };

    return (
        <BaseModal visible={modalVisible} setVisible={setModalVisible}>
            {/* <View style={styles.overlay}> */}

            <View style={styles.modalContainer}>
                <Text style={styles.title}>{title}</Text>
                <ButtonForm
                    text={yesButton}
                    actionButton={ConfirmationDialogOk}
                    style={{
                        marginTop: 23,
                        width: '100%',
                    }}
                />
                <ButtonForm
                    text={noButton}
                    style={{
                        backgroundColor: palette.white,
                        borderWidth: 1,
                        borderColor: palette.blueLight,
                        marginTop: 12,
                        width: '100%',
                    }}
                    styleText={{color: palette.blueDark}}
                    actionButton={handleClose}
                />
                {/*    <Text style={styles.message}>{title}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.noButton}>
                            <Text style={styles.buttonText}>
                                {noButton === '' ? t('no') : noButton}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDelete}
                            style={styles.yesButton}>
                            <Text style={styles.buttonText}>
                                {yesButton === '' ? t('yes') : yesButton}
                            </Text>
                        </TouchableOpacity>
                    </View> */}
            </View>
            {/* </View> */}
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        // width: '80%',
        // backgroundColor: palette.white,
        // borderRadius: 80,
        // alignItems: 'center',
        // elevation: 5, // for Android shadow
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    message: {
        fontSize: 18,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    noButton: {
        flex: 1,
        backgroundColor: '#cccccc',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginRight: 10,
    },
    yesButton: {
        flex: 1,
        backgroundColor: '#ff6347',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginLeft: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ConfirmationDialog;
