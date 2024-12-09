import React from 'react';
import {StyleProp, Text, TextStyle, View} from 'react-native';
import baseStyles from 'src/styles';
import DTextInput from '../DTextInput';

export default function FieldRow({
    fieldTitle,
    fieldPlaceholder,
    value,
    setValue,
    secureTextEntry = false,
    textStyle = {} as StyleProp<TextStyle>,
}) {
    return (
        <View style={{gap: 8}}>
            <Text style={[baseStyles.baseText, textStyle]}>{fieldTitle}</Text>
            <DTextInput
                placeholder={fieldPlaceholder}
                text={value}
                onChangeText={text => {
                    setValue(text);
                }}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}
