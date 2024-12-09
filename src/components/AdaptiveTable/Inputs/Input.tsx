import React, {useCallback, useMemo, useEffect, useState, useRef} from 'react';
import {View, TextInput, StyleSheet, Keyboard, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {InputIcon} from 'src/constants';
import {isNumber} from 'src/utils/helper';
import Icon from 'react-native-vector-icons/FontAwesome';
import palette from 'src/theme/colors/palette';

interface IInputProps {
    className?: string;
    name: string;
    value?: string;
    focus?: boolean;
    icon?: InputIcon;
    placeholder: string;
    onlyNumber?: boolean;
    onChange?: (name: string, value: string) => void;
}

export default function Input(props: IInputProps) {
    const {placeholder, focus, name, value, icon, onChange, onlyNumber} = props;
    const {t} = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const textInputRef = useRef<TextInput>(null);

    useEffect(() => {
        const initValue = typeof value === 'string' ? value.toString() : value;
        setInputValue(initValue);
        if (focus && textInputRef.current) {
            textInputRef.current.focus();
        }
    }, [focus, value]);

    const handleChange = useCallback(
        (newInputValue: string) => {
            if (onlyNumber && !isNumber(newInputValue)) {
                return;
            }
            setInputValue(newInputValue);
            if (onChange) {
                onChange(name, newInputValue);
            }
        },
        [name, onChange, onlyNumber],
    );

    const handleBlur = () => {
        if (inputValue !== value) {
            if (onChange) {
                onChange(name, inputValue);
            }
        }
    };

    const handleKeyUp = (e: any) => {
        if (e.nativeEvent.key === 'Enter' && onChange) {
            onChange(name, inputValue);
            Keyboard.dismiss();
        }
    };

    const placeholderValue = useMemo(
        () => (placeholder ? t(placeholder) : ''),
        [placeholder, t],
    );

    const getIcon = useMemo(() => {
        switch (icon) {
            case InputIcon.SEARCH:
                return <Icon name="search" size={20} />;
            case InputIcon.EMAIL:
                return <Icon name="envelope" size={20} />;
            case InputIcon.SPINNER:
                return <Icon name="spinner" size={20} style={styles.spinner} />;
            case InputIcon.EDIT:
                return <Icon name="pencil" size={20} />;
            default:
                return null;
        }
    }, [icon]);

    return (
        <View style={styles.container}>
            {getIcon && <View style={styles.iconContainer}>{getIcon}</View>}
            <TextInput
                ref={textInputRef}
                style={styles.input}
                onChangeText={handleChange}
                onBlur={handleBlur}
                onKeyPress={handleKeyUp}
                placeholder={placeholderValue}
                value={inputValue}
                keyboardType={onlyNumber ? 'numeric' : 'default'}
                returnKeyType="done"
                onEndEditing={e => {
                    if (e?.nativeEvent?.text?.trim) {
                        handleChange(e?.nativeEvent?.text?.trim());
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: palette.blueLight,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        height: 44
    },
    iconContainer: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        // padding: 8,
        fontSize: 16,
    },
    spinner: {
        animation: 'spin 1s linear infinite',
    },
});
