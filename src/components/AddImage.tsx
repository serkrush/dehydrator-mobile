import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {images} from 'src/theme/images';
import AddRecipeModal from './modals/AddRecipeModal';
import BaseModal from './modals/BaseModal';
import ImageStore from './ImageStore';

const mainScreenColors = {
    card: colors.card.base,
};

interface AddImageProps {
    handleSelectImage: (data: string) => void;
    value?: string | null;
    id?: string | null;
    folder?: string | null;
    bufer?: string | null;
}

export default function AddImage({
    handleSelectImage,
    value = null,
    id,
    folder = 'recipes',
    bufer
}: AddImageProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUri, setImageUri] = useState(bufer);
    useEffect(() => {
        if (imageUri) {
            handleSelectImage(imageUri);
        }
    }, [imageUri]);
    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => setModalVisible(!modalVisible)}>
                {value ? (
                    <View style={{width: '100%', height: '100%'}}>
                        <ImageStore name={value} folder={`${folder}/${id}`} />
                    </View>
                ) : imageUri ? (
                    <Image
                        source={
                            imageUri
                                ? {
                                      uri: `data:image/jpeg;base64,${imageUri}`,
                                  }
                                : value
                        }
                        style={{width: '100%', height: '100%'}}
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image source={images.upload} />
                        <Text>Click to upload or photo</Text>
                        <Text>SVG, PNG, JPG pr GIF (max. 800x400px)</Text>
                    </View>
                )}
            </TouchableOpacity>
            <BaseModal visible={modalVisible} setVisible={setModalVisible}>
                <AddRecipeModal
                    setVisible={setModalVisible}
                    setImageUri={setImageUri}
                />
            </BaseModal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 173,
        backgroundColor: mainScreenColors.card.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: palette.blueLight,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
});
