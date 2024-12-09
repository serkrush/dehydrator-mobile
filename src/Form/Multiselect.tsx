import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import palette from 'src/theme/colors/palette';
import DropdownSelect from 'react-native-input-select';

interface MultiselectProps {
    name: string;
    options: any[];
    onChange?: (name: string, value: any[] | string) => void;
    label?: string | null;
    hidden?: boolean;
    tooltipText?: string;
    multiselect?: boolean;
    search?: boolean;
    values?: string[] | string;
    styleContainer?: object;
    error?: string | string[] | null;
    readonly?: boolean;
}

export default function Multiselect({
    name,
    options,
    onChange = () => {},
    label = null,
    hidden = false,
    tooltipText = '',
    multiselect = true,
    search = true,
    values = [],
    styleContainer = {},
    error = null,
    readonly = false,
}: MultiselectProps) {
    // const [selectedItems, setSelectedItems] = useState<any[]>(
    //     Array.isArray(values) ? values : [values],
    // );
    const [menu, setMenu] = useState<string[] | string>(values);
    useEffect(() => {
        setMenu(values);
    }, [values]);

    if (hidden) return null;

    const handleValueChange = (itemValue: any) => {
        const updatedItems = multiselect ? [...itemValue] : [itemValue];
        // setSelectedItems(updatedItems);
        setMenu(itemValue);
        onChange(name, updatedItems);
    };

    return (
        <View style={[styles.container, styleContainer]}>
            <View style={styles.inputContainer}>
                <DropdownSelect
                    label={label || ''}
                    options={options}
                    selectedValue={menu}
                    onValueChange={handleValueChange}
                    isMultiple={multiselect}
                    isSearchable={search}
                    primaryColor={palette.orange}
                    labelStyle={styles.labelStyle}
                    multipleSelectedItemStyle={styles.multipleSelectedItemStyle}
                    dropdownContainerStyle={styles.dropdownContainerStyle}
                    dropdownStyle={{
                        ...styles.dropdownStyle,
                        borderColor: error ? '#f00' : palette.blueLight,
                    }}
                    dropdownIconStyle={styles.dropdownIconStyle}
                    searchControls={{
                        textInputStyle: styles.searchControls,
                    }}
                    disabled={readonly}
                />
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
    inputContainer: {
        position: 'relative',
    },
    labelStyle: {
        color: palette.blueDark,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    multipleSelectedItemStyle: {
        backgroundColor: palette.orange,
        fontSize: 16,
        color: palette.white,
        fontWeight: '500',
        marginTop: 0,
    },
    dropdownContainerStyle: {
        marginBottom: 0,
    },
    dropdownStyle: {
        backgroundColor: palette.white,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 1,
        minHeight: 44,
    },
    dropdownIconStyle: {
        top: 18,
        right: 19,
    },
    searchControls: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        minHeight: 44,
        height: 44,
        borderRadius: 8,
        borderColor: palette.blueLight,
        fontSize: 16,
    },
    errorText: {
        position: 'absolute',
        bottom: -15,
        left: 5,
        fontSize: 12,
        color: '#f00',
    },
});
