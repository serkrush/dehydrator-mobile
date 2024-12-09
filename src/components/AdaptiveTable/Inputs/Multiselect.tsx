import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DropdownSelect from 'react-native-input-select';
import palette from 'src/theme/colors/palette';

interface MultiselectProps {
    name: string;
    options: any[];
    onChange: (name: string, value: any) => void;
}

export default function Multiselect({
    options,
    onChange,
    name,
}: MultiselectProps) {
    const [menu, setMenu] = useState<string[] | string>([]);

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <DropdownSelect
                    options={options}
                    selectedValue={menu}
                    onValueChange={(itemValue: any) => {
                        onChange(name, itemValue);
                        setMenu(itemValue);
                    }}
                    isMultiple={true}
                    isSearchable={true}
                    primaryColor={palette.orange}
                    labelStyle={{
                        color: palette.blueDark,
                        fontSize: 14,
                        fontWeight: '500',
                        marginBottom: 6,
                    }}
                    multipleSelectedItemStyle={{
                        backgroundColor: palette.orange,
                        fontSize: 16,
                        color: palette.white,
                        fontWeight: '500',
                        marginTop: 0,
                    }}
                    dropdownContainerStyle={{
                        marginBottom: 0,
                    }}
                    dropdownStyle={{
                        backgroundColor: palette.white,
                        borderColor: palette.blueLight,
                        borderRadius: 8,
                        paddingHorizontal: 14,
                        paddingVertical: 1, //0,
                        minHeight: 44,
                        // marginBottom: 0,
                    }}
                    dropdownIconStyle={{top: 18, right: 19}}
                    searchControls={{
                        textInputStyle: {
                            paddingHorizontal: 14,
                            paddingVertical: 10,
                            minHeight: 44,
                            height: 44,
                            borderRadius: 8,
                            borderColor: palette.blueLight,
                            fontSize: 16,
                        },
                    }}
                />
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
    labelText: {
        fontSize: 14,
        color: palette.blueDark,
    },
});
