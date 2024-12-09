import React from 'react';
import {
    ColorValue,
    KeyboardTypeOptions,
    StyleProp,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import baseStyles from 'src/styles';
import DTextInput from '../DTextInput';

export default function InputRow({
    fieldTitle,
    fieldPlaceholder,
    value,
    setValue,
    secureTextEntry = false,
    keyboardType = undefined as KeyboardTypeOptions | undefined,
    textStyle = {} as StyleProp<TextStyle>,
    containerStyle = {} as StyleProp<ViewStyle>,
    inputTextStyle = {} as StyleProp<TextStyle>,
    inputContainerStyle = {} as StyleProp<ViewStyle>,
    label = undefined as string | undefined,
    placeholderTextColor = undefined as ColorValue | undefined,
    readOnly = false,
    valueChecker = undefined as undefined | ((value: string) => boolean),
    errorStyle = {borderWidth: 1, borderColor: 'red'} as StyleProp<ViewStyle>,
}) {
    return (
        <View
            style={[
                {gap: 8, flexDirection: 'row', alignItems: 'center'},
                containerStyle,
                valueChecker != undefined && !valueChecker(value)
                    ? errorStyle
                    : {},
            ]}>
            <Text style={[baseStyles.baseText, textStyle]}>{fieldTitle}</Text>
            <DTextInput
                placeholder={fieldPlaceholder}
                placeholderTextColor={placeholderTextColor}
                text={value}
                onChangeText={text => {
                    setValue(text);
                }}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                containerStyle={[inputContainerStyle]}
                textStyle={inputTextStyle}
                label={label}
                readOnly={readOnly}
            />
        </View>
    );
}
