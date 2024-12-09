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
import TitleInputRow from './TitleInputRow';

interface BaseTitleInputRowProps {
    fieldTitle: string;
    fieldPlaceholder?: string;
    value: string;
    setValue?: (value: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    label?: string;
    placeholderTextColor?: ColorValue;
    readOnly?: boolean;
    valueChecker?: (value: string) => boolean;
    errorStyle?: StyleProp<ViewStyle>;
}

export default function BaseTitleInputRow({
    fieldTitle,
    fieldPlaceholder = '',
    value,
    setValue,
    secureTextEntry = false,
    keyboardType,
    label,
    placeholderTextColor,
    readOnly = false,
    valueChecker = undefined as undefined | ((value: string) => boolean),
    errorStyle = {borderWidth: 1, borderColor: 'red'} as StyleProp<ViewStyle>,

    image = undefined as any | undefined,
    leftImage = undefined as any | undefined,

    additionalInputContainerStyle = {} as StyleProp<ViewStyle>,
    additionalInputTextStyle = {} as StyleProp<TextStyle>,
}) {
    return (
        <TitleInputRow
            fieldTitle={fieldTitle}
            fieldPlaceholder={fieldPlaceholder}
            value={value}
            setValue={setValue}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            label={label}
            placeholderTextColor={placeholderTextColor}
            readOnly={readOnly}
            valueChecker={valueChecker}
            errorStyle={errorStyle}
            containerStyle={[
                {
                    height: 'auto',
                    alignItems: 'flex-start',
                },
            ]}
            inputContainerStyle={[
                baseStyles.inputContainer,
                {
                    width: '100%',
                    borderWidth: 1,
                },
                additionalInputContainerStyle,
            ]}
            titleStyle={[
                baseStyles.inputTitleText,
                {height: 'auto'},
                additionalInputTextStyle,
            ]}
            inputTextStyle={[baseStyles.inputValueText]}
            image={image}
            leftImage={leftImage}
        />
    );
}
