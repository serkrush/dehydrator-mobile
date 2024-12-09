// Checkbox.tsx

import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import palette from 'src/theme/colors/palette';
import CheckSvg from '../../assets/svg/CheckSvg';

export default function CheckBox({
    onChange,
    isChecked,
    readOnly = false
}) {
    return (
        <TouchableOpacity
            onPress={() => !readOnly && onChange(!isChecked)}
            style={styles.container}>
            <View
                style={{
                    ...styles.checkbox,
                    ...{
                        borderColor: isChecked
                            ? palette.orange
                            : palette.blueLight,
                        backgroundColor: isChecked
                            ? palette.orange
                            : palette.white,
                    },
                }}>
                <CheckSvg stroke={palette.white} width={15} height={15} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4
    },
});
