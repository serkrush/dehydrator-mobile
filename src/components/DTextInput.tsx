import ClosedEyeSvg from '../../assets/svg/ClosedEyeSvg';
import EyeSvg from '../../assets/svg/EyeSvg';
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    KeyboardTypeOptions,
    StyleProp,
    ViewStyle,
    TextStyle,
    Text,
    ColorValue,
    TouchableOpacity,
} from 'react-native';
import palette from 'src/theme/colors/palette';

export default function DTextInput({
    placeholder,
    text,
    onChangeText,
    secureTextEntry = false,
    keyboardType = undefined as KeyboardTypeOptions | undefined,
    containerStyle = {} as StyleProp<ViewStyle>,
    textStyle = {} as StyleProp<TextStyle>,
    label = undefined as string | undefined,
    image = undefined as any | undefined,
    leftImage = undefined as any | undefined,
    placeholderTextColor = undefined as ColorValue | undefined,
    readOnly = false,
}) {
    const [secure, setSecure] = useState(secureTextEntry);
    return (
        <View
            style={[
                styles.container,
                {flexDirection: 'row'},
                {flex: 1, overflow: 'hidden'},
                containerStyle,
            ]}>
            {leftImage != undefined && <View style={{}}>{leftImage}</View>}
            <View
                style={[
                    {flex: 1},
                    {flexDirection: 'row', alignItems: 'center'},
                ]}>
                <TextInput
                    keyboardType={keyboardType}
                    style={[styles.input, {flex: 1}, textStyle]}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    value={text}
                    secureTextEntry={secure}
                    onChangeText={onChangeText}
                    autoCapitalize="none"
                    readOnly={readOnly}
                    onEndEditing={e => {
                        if (e?.nativeEvent?.text?.trim) {
                            onChangeText(e?.nativeEvent?.text?.trim());
                        }
                    }}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setSecure(!secure)}>
                        {secure ? (
                            <EyeSvg
                                stroke={palette.blueDark}
                                width={20}
                                height={20}
                            />
                        ) : (
                            <ClosedEyeSvg
                                stroke={palette.blueDark}
                                width={20}
                                height={20}
                            />
                        )}
                    </TouchableOpacity>
                )}
                {label != undefined && (
                    <Text style={[styles.input, textStyle]}>{label}</Text>
                )}
            </View>
            {image != undefined && <View style={{}}>{image}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f5f6f2',
        alignItems: 'center',
    },

    input: {
        color: 'black',
        paddingHorizontal: 8,
        fontSize: 14,
    },
    eyeButton: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{translateY: -10}],
    },
});
