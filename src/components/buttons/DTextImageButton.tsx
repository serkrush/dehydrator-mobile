import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    ColorValue,
    Text,
    StyleProp,
    TextStyle,
    ViewStyle,
    View,
} from 'react-native';

export default function DTextImageButton({
    source,
    width,
    height,
    tintColor,
    text,
    textStyle = {} as StyleProp<TextStyle>,
    onPress = () => {},
    containerStyle = {} as StyleProp<ViewStyle>,
    disabled = false,
    reverse = false,
}) {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                styles.container,
                containerStyle,
                {flexDirection: reverse ? 'row-reverse' : 'row'},
            ]}
            onPress={onPress}>
            <Image
                source={source}
                tintColor={tintColor}
                style={{
                    width: width,
                    height: height,
                    tintColor: tintColor,
                    resizeMode: 'contain',
                }}
            />
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
