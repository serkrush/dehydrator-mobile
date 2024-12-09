import React, {useEffect, useState} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import storage from '@react-native-firebase/storage';
import noimage from '../../assets/img/no-image.png';

interface ImageStoreProps {
    name?: string | null;
    folder?: string;
    style?: object;
}

export default function ImageStore({
    folder,
    name,
    style = {},
}: ImageStoreProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                if (name) {
                    const imageRef = storage().ref(
                        folder ? `${folder}/${name}` : name,
                    );
                    const url = await imageRef.getDownloadURL();
                    setImageUrl(url);
                }
            } catch (error) {
                console.error('Error fetching image URL: ', error);
                setImageUrl(null);
            }
        };

        fetchImageUrl();
    }, [folder, name]);

    return (
        <View style={{...styles.container, ...style}}>
            <Image
                source={imageUrl ? {uri: imageUrl} : noimage}
                style={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
