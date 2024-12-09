import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';

interface TextareaProps {
    name: string;
    placeholder?: string;
    onChange?: (text: string) => void;
    value?: string | number;
    required?: boolean;
    error?: string | null;
    label?: string | null;
    readOnly?: boolean;
    rows?: number;
    classNameContainer?: string; // Optional if you want to pass custom styles
}

export default function Textarea({
    name,
    value = '',
    placeholder = '',
    onChange = undefined,
    required = false,
    error = null,
    label = null,
    readOnly = false,
    rows = 3,
    classNameContainer = '',
}: TextareaProps) {
    return (
        <View
            style={[
                styles.container,
                classNameContainer && {classNameContainer},
            ]}>
            {label && (
                <Text style={styles.label}>
                    {/* {required && '* '} */}
                    {label}
                </Text>
            )}
            <TextInput
                placeholder={placeholder}
                value={value?.toString()}
                onChangeText={onChange}
                editable={!readOnly}
                multiline={rows > 1}
                numberOfLines={rows}
                style={[styles.textarea, readOnly && styles.readOnly]}
                onEndEditing={e => {
                    if (e?.nativeEvent?.text?.trim) {
                        onChange(e?.nativeEvent?.text?.trim());
                    }
                }}
            />
            {error && (
                <Text style={styles.error} accessibilityLabel={`${name}-error`}>
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        position: 'relative',
    },
    textarea: {
        width: '100%',
        padding: 8,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 4,
        textAlignVertical: 'top', // For multiline alignment
    },
    label: {
        marginBottom: 4,
        fontSize: 12,
        color: '#333',
    },
    error: {
        position: 'absolute',
        bottom: -15,
        left: 5,
        fontSize: 12,
        color: '#f00',
    },
    readOnly: {
        backgroundColor: '#f0f0f0',
    },
});
