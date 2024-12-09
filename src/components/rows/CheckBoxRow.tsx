import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CheckBox from '../CheckBox';
import {colors, fonts} from 'src/theme';

export default function CheckBoxRow({
    fieldTitle,
    isChecked,
    onChange,
    textStyle = {},
    readOnly = false,
}) {
    return (
        <View
            style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
                opacity: readOnly ? 0.5 : 1,
            }}>
            <CheckBox
                isChecked={isChecked}
                onChange={onChange}
                readOnly={readOnly}
            />
            <Text style={{...styles.text, ...textStyle}}>{fieldTitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        ...fonts.textSizeM,
        color: colors.checkboxText,
    },
});
