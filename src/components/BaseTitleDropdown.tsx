import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import baseStyles from 'src/styles';
import TitleDropdown from './TitleDropdown';

export default function BaseTitleDropdown({
    data,
    title = '',
    placeholder,
    value,
    setValue,
    dropdownContainerStyle = {} as StyleProp<ViewStyle>,
    labelField = 'label',
    valueField = 'value',
    disable = false,
    showLeftIcon = false,
    imagesPath = undefined as undefined | string[],
    imagesPrefix = '',
}) {
    return (
        <TitleDropdown
            data={data}
            title={title}
            placeholder={placeholder}
            value={value}
            setValue={setValue}
            dropdownContainerStyle={dropdownContainerStyle}
            labelField={labelField}
            valueField={valueField}
            disable={disable}
            containerStyle={[baseStyles.inputContainer, {padding: 8}]}
            titleTextStyle={baseStyles.inputTitleText}
            valueTextStyle={baseStyles.inputValueText}
            imagesPath={imagesPath}
            imagesPrefix={imagesPrefix}
            showLeftIcon={showLeftIcon}
        />
    );
}
