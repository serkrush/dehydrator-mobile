import React, {useState} from 'react';
import {Text, View, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import Textarea from 'src/Form/Textares';

export default function AddIngredientModal({visible, setVisible}) {
    const {t} = useTranslation();

    const [imageUriModal, setImageUriModal] = useState(null);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            // onRequestClose={() => {
            //     console.log('onRequestClose');
            // }}
        >
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#303030d0',
                }}
                onPress={() => setVisible(false)}
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
                    <Textarea />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({});
