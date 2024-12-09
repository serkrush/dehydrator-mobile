import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    StyleProp,
    TextStyle,
    ViewStyle,
    View,
} from 'react-native';
import {families, fonts} from 'src/theme';

export default function DTextButton({
    text,
    onPress = () => {},
    textStyle = {} as StyleProp<TextStyle>,
    containerStyle = {} as StyleProp<ViewStyle>,
}) {
    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity onPress={onPress}>
                <Text style={[styles.text, textStyle]}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        color: 'white',
        fontSize: 16,
        fontFamily: families.oswald,
    },
});
