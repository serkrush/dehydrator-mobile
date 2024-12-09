import React from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useTranslation} from 'react-i18next';
import {colors} from 'src/theme';
import palette from 'src/theme/colors/palette';

export default function AddRecipeModal({setVisible, setImageUri}) {
    const {t} = useTranslation();

    const openCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
        })
            .then(image => {
                setImageUri(image.data);
                setVisible(false);
            })
            .catch(error => {
                console.log('Camera Error: ', error);
            });
    };

    const openGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
        })
            .then(image => {
                setImageUri(image.data);
                setVisible(false);
            })
            .catch(error => {
                console.log('Gallery Error: ', error);
            });
    };

    return (
        <>
            <View style={styles.container}>
                <Pressable style={styles.widthFull} onPress={openCamera}>
                    <Text style={styles.textLine}>
                        {t('open-camera')}
                    </Text>
                </Pressable>
                <View style={styles.line} />
                <Pressable style={styles.widthFull} onPress={openGallery}>
                    <Text style={styles.textLine}>
                        {t('choose-from-gallery')}
                    </Text>
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.card.base.background,
        alignItems: 'center',
    },
    line: {
        backgroundColor: palette.blueLight,
        width: '100%',
        height: 1,
        marginVertical: 10,
    },
    widthFull: {
        width: '100%',
    },
    textLine: {
        fontSize: 16,
        color: palette.blueBlack,
        fontWeight: '500',
    },
});
