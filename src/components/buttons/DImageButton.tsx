import React from 'react';
import {StyleSheet, TouchableOpacity, Image, ColorValue} from 'react-native';

export default function DImageButton({
    source,
    width,
    height,
    tintColor,
    onPress = () => {},
    disabled = false,
    additionalStyle = {},
    imageWidth = undefined as number | undefined,
    imageHeight = undefined as number | undefined,
}) {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                styles.container,
                {width: width, height: height},
                additionalStyle,
            ]}
            onPress={onPress}>
            <Image
                source={source}
                tintColor={tintColor}
                style={{
                    width: imageWidth ?? width,
                    height: imageHeight ?? height,
                    tintColor: tintColor,
                    resizeMode: 'contain',
                }}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
