import React, {
    useState,
    useMemo,
    useCallback,
    useEffect,
    ReactNode,
} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {IOptions, FilterType} from 'src/constants';
import Checkbox from './CheckBox';

export interface IRadioItemProps {
    name: string;
    option: IOptions;
    checked?: boolean;
    onChange?: (option: IOptions, checked: boolean) => void;
}

interface ICheckContainerProps {
    type: FilterType;
    name: string;
    value: string[];
    items: IOptions[];
    className?: any; // Not used in React Native
    onChange?: (name: string, value: any) => void;
    icon?: ReactNode;
    iconChecked?: ReactNode;
}

export default function CheckContainer(props: ICheckContainerProps) {
    const {name, value, items, type, onChange, className, icon, iconChecked} =
        props;

    const [selectedOptions, setSelected] = useState<string[]>([]);

    useEffect(() => {
        const selectedOptions = value
            ? value.filter(opt => items.map(item => item.value).includes(opt))
            : [];
        setSelected(selectedOptions);
    }, [items, value]);

    const onCheckBoxChange = useCallback(
        (id: string, checked: boolean) => {
            let newOptions = [...selectedOptions];

            if (checked) {
                newOptions.push(id);
            } else {
                newOptions = newOptions.filter(item => item !== id);
            }

            setSelected(newOptions);
            onChange && onChange(name, newOptions);
        },
        [name, onChange, selectedOptions],
    );

    const containerStyle = [FilterType.VerticalCheckBox].includes(type)
        ? styles.verticalContainer
        : styles.horizontalContainer;

    return (
        <View style={containerStyle}>
            {items.map((opt: IOptions, i: number) => (
                <Checkbox
                    key={`CheckBox_${i}`}
                    name={name}
                    option={opt}
                    onChange={onCheckBoxChange}
                    checked={selectedOptions.includes(opt.value.toString())}
                    icon={icon}
                    iconChecked={iconChecked}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    verticalContainer: {
        flexDirection: 'column',
    },
    horizontalContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 8,
    },
});

// import React, { useState, useMemo, useCallback, useEffect, ReactNode } from 'react';
// // import { IOptions, FilterType } from 'src/pagination/IPagerParams';
// import Checkbox from './CheckBox';
// import { IOptions, FilterType } from 'src/constants';

// export interface IRadioItemProps {
//     name: string;
//     option: IOptions;
//     checked?: boolean;
//     onChange?: (option: IOptions, checked: boolean) => void;
// }

// interface ICheckContainerProps {
//     type: FilterType;

//     name: string;
//     value: string[];
//     items: IOptions[];
//     className?: string;
//     onChange?: (name: string, value: any) => void;
//     icon?: ReactNode;
//     iconChecked?: ReactNode;
// }

// export default function CheckContainer(props: ICheckContainerProps) {
//     const { name, value, items, type, onChange, className, icon, iconChecked } = props;

//     const [selectedOptions, setSelected] = useState([]);

//     useEffect(() => {
//         const selectedOptions =
//             value &&
//             []
//                 .concat(value)
//                 ?.filter((opt: string) =>
//                     items?.map((item) => item.value).includes(opt),
//                 );
//         const initValue = selectedOptions ? selectedOptions : [];
//         setSelected(initValue);
//     }, [items, value]);

//     const onCheckBoxChange = useCallback(
//         (id: string, checked: boolean) => {
//             let newOptions = selectedOptions.map((i) => i);

//             if (checked) {
//                 newOptions.push(id);
//             } else {
//                 newOptions = selectedOptions?.filter((item) => item !== id);
//             }

//             setSelected(newOptions);
//             onChange(name, newOptions);
//         },
//         [name, onChange, selectedOptions],
//     );

//     const containerStyle = [FilterType.VerticalCheckBox].includes(type)
//         ? ''
//         : 'flex space-x-4';
//     return (
//         <div className={`${containerStyle}`}>
//             {items &&
//                 items.map((opt: IOptions, i: number) => (
//                     <Checkbox
//                         key={`CheckBox_${i}`}
//                         className={className}
//                         name={name}
//                         option={opt}
//                         onChange={onCheckBoxChange}
//                         checked={selectedOptions.includes(opt.value.toString())}
//                         icon={icon}
//                         iconChecked={iconChecked}
//                     />
//                 ))}
//         </div>
//     );
// }
