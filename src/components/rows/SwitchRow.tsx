import React from 'react';
import {Text, View, Switch, StyleSheet, Image} from 'react-native';
import baseStyles from 'src/styles';

interface SwitchRowProps {
    fieldTitle: string;
    isChecked: boolean;
    onChange: (value: boolean) => void;
    icon?: string;
}

export default function SwitchRow({
    fieldTitle,
    isChecked,
    onChange,
    icon,
}: SwitchRowProps) {
    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                {icon && <Image source={icon} />}
                <Text style={[baseStyles.baseText, styles.text]}>
                    {fieldTitle}
                </Text>
            </View>
            <Switch
                value={isChecked}
                onValueChange={onChange}
                trackColor={{false: '#767577', true: '#f4ae3d'}} // Example colors
                thumbColor={isChecked ? '#f4ae3d' : '#f4f3f4'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        marginRight: 8,
    },
});
