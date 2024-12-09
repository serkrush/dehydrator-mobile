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

export default function TitleInputRow({
    fieldTitle,
    fieldPlaceholder,
    value,
    setValue,
    secureTextEntry = false,
    keyboardType = undefined as KeyboardTypeOptions | undefined,
    titleStyle = {} as StyleProp<TextStyle>,
    containerStyle = {} as StyleProp<ViewStyle>,
    inputTextStyle = {} as StyleProp<TextStyle>,
    inputContainerStyle = {} as StyleProp<ViewStyle>,
    label = undefined as string | undefined,
    placeholderTextColor = undefined as ColorValue | undefined,
    readOnly = false,
    valueChecker = undefined as undefined | ((value: string) => boolean),
    errorStyle = {borderWidth: 1, borderColor: 'red'} as StyleProp<ViewStyle>,
    image =  undefined as any | undefined,
    leftImage =  undefined as any | undefined,
}) {
    //console.log('fieldTitle-------', fieldTitle, titleStyle);
    return (
        <View style={[{gap: 8, alignItems: 'center'}, containerStyle]}>
            <Text style={[titleStyle]}>{fieldTitle}</Text>
            <DTextInput
                placeholder={fieldPlaceholder}
                placeholderTextColor={placeholderTextColor}
                text={value}
                onChangeText={text => {
                    setValue(text);
                }}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                containerStyle={[
                    inputContainerStyle,
                    valueChecker != undefined && !valueChecker(value)
                        ? errorStyle
                        : {},
                ]}
                textStyle={inputTextStyle}
                label={label}
                readOnly={readOnly}
                image={image}
                leftImage={leftImage}
            />
        </View>
    );
}
