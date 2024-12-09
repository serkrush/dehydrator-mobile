import React from 'react';
import {View, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {Portal} from 'react-native-paper';

export default function BaseModal({
    children,
    visible,
    setVisible,
    handleClose = () => setVisible(false),
}) {
    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <Portal.Host>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#303030d0',
                    }}
                    onPress={handleClose}
                />

                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            width: '80%',
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 10,
                        }}>
                        {children}
                    </View>
                </View>
            </Portal.Host>
        </Modal>
    );
}

const styles = StyleSheet.create({});
