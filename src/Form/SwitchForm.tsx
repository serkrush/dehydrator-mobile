import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Switch} from 'react-native';

export interface ISwitchFilterProps {
    name?: string;
    onChange: (id: string | undefined, checked: boolean) => void;
    value: boolean;
}

export default function SwitchForm(props: ISwitchFilterProps) {
    const {name, value, onChange} = props;
    const [selectedOptions, setSelected] = useState(value);

    const handleCheck = useCallback(() => {
        const checked = !selectedOptions;
        setSelected(checked);
        onChange(name, checked);
    }, [selectedOptions, onChange, name]);

    return (
        <View>
            <Switch
                value={selectedOptions}
                onValueChange={handleCheck}
                trackColor={{false: '#767577', true: '#f4ae3d'}} // Example colors
                thumbColor={selectedOptions ? '#f4ae3d' : '#f4f3f4'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
});
