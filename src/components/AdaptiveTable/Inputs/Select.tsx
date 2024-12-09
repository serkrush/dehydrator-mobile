import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
// import {Picker} from '@react-native-picker/picker';
import {IOptions} from 'src/constants';

interface ISelectProps {
    name: string;
    className?: string; // Not used in React Native
    value?: string;
    items: IOptions[];
    onChange: (name: string, value: string) => void;
}

export default function Select(props: ISelectProps) {
    const {value, items, name, onChange} = props;
    const [selectedOption, setSelected] = useState(value);

    const handleChange = useCallback(
        (value: string) => {
            setSelected(value);
            onChange(name, value);
        },
        [name, onChange],
    );

    return (
        <View style={styles.container}>
            {/* {Array.isArray(items) && items.length > 0 ? (
                <Picker
                    selectedValue={selectedOption}
                    onValueChange={handleChange}
                    style={styles.picker}>
                    {items.map(item => (
                        <Picker.Item
                            key={'adaptive-table-select-option-' + item.value}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </Picker>
            ) : null} */}
            <Text>Select</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    picker: {
        height: 50,
        width: '100%',
    },
});

// // import './_inputs.scss';
// import React, { useState, useCallback } from 'react';
// import { IOptions } from 'src/constants';

// interface ISelectProps {
//     name: string;
//     className?: string;
//     value?: string;
//     items: IOptions[];
//     onChange: (name: string, value: string) => void;
// }
// export default function Select(props: ISelectProps){
//     const { value, items, name, onChange, className } = props;
//     const [selectedOption, setSelected] = useState(value);

//     const handleChange = useCallback((e) => {
//         setSelected(e.target.value);
//         onChange(e.target.name, e.target.value);
//     },[name, onChange]);

//     return(
//         <div className='w-full'>
//             {
//                 Array.isArray(items) && items.length > 0 ? (
//                     <select
//                         id={name}
//                         name={name}
//                         value={selectedOption}
//                         onChange={handleChange}
//                         className={className}>

//                         {items.map(item => {
//                             return (
//                                 <option key={'adaptive-table-select-option-' + item.value} value={item.value}>
//                                     {item.label}
//                                 </option>
//                             );
//                         })}

//                     </select>) : null
//             }

//         </div>
//     );
// }
