import React, {useState} from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import palette from 'src/theme/colors/palette';
import EyeSvg from '../../assets/svg/EyeSvg';
import ClosedEyeSvg from '../../assets/svg/ClosedEyeSvg';

interface InputProps {
    name: string;
    type?: string;
    placeholder?: string;
    onChange?: (event: any) => void;
    value?: string | number;
    required?: boolean;
    error?: string | null;
    label?: string | null;
    readOnly?: boolean;
    hidden?: boolean;
    min?: number | null;
    max?: number | null;
    customClassName?: object;
    styleContainer?: object;
    step?: number;
    tooltipText?: string;
    isSecure?: boolean;
    valueUnit?: string;
}

export default function Input({
    name,
    type = 'text',
    value = '',
    placeholder = '',
    onChange = () => {},
    required = false,
    error = null,
    label = null,
    readOnly = false,
    hidden = false,
    min = null,
    max = null,
    customClassName = {},
    styleContainer = {},
    step = 1,
    tooltipText = '',
    isSecure = false,
    valueUnit,
}: InputProps) {
    const [secure, setSecure] = useState(isSecure);

    if (hidden) {
        return null;
    }
    return (
        <View style={[styles.container, styleContainer]}>
            {label && <Text style={styles.labelText}>{label}</Text>}
            <View style={styles.inputWrapper}>
                <TextInput
                    name={name}
                    style={[
                        styles.input,
                        error && styles.errorInput,
                        readOnly && styles.readOnlyInput,
                        customClassName,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={'#0A4C5E40'}
                    //value={value}
                    value={
                        value === null || String(value) === '0'
                            ? ''
                            : String(value)
                    }
                    onChangeText={(v)=>{
                        if (max && Number(v) > max) {
                            return onChange(max)
                        }
                        if (min && Number(v) < min) {
                            return onChange(min)
                        }
                        return onChange(v)}}
                    editable={!readOnly}
                    keyboardType={type === 'number' ? 'numeric' : 'default'}
                    min={min}
                    max={max}
                    step={step}
                    secureTextEntry={secure}
                    onEndEditing={e => {
                        if (e?.nativeEvent?.text?.trim) {
                            onChange(e?.nativeEvent?.text?.trim());
                        }
                    }}
                />
                {valueUnit && <Text style={styles.valueUnit}>{valueUnit}</Text>}
                {isSecure && (
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
                {error && (
                    <Text style={styles.errorText} id={`${name}-error`}>
                        {error}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputWrapper: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        paddingHorizontal: 14,
        height: 44,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
        borderColor: '#ccc',
        color: palette.blueBlack,
        paddingRight: 50,
    },
    errorInput: {
        borderColor: '#f00',
    },
    errorText: {
        position: 'absolute',
        bottom: -15,
        left: 5,
        fontSize: 12,
        color: '#f00',
    },
    labelText: {
        fontSize: 14,
        marginBottom: 2,
        fontWeight: '500',
        color: palette.blueDark,
    },
    readOnlyInput: {
        color: palette.blueBlack,
    },
    eyeButton: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{translateY: -10}],
    },
    valueUnit: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{translateY: -12}],
        zIndex: 100,
        backgroundColor: '#fff',
        paddingHorizontal: 5,
    },
});
