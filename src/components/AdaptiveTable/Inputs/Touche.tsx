import React, {useCallback, useMemo, useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Switch} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface IToucheProps {
    className?: string; // Not used in React Native
    name?: string;
    option: {
        label: string;
        value: string;
    };
    onChange: (id: string | undefined, checked: boolean) => void;
    icon?: React.ReactNode;
    iconChecked?: React.ReactNode;
}

export default function Touche(props: IToucheProps) {
    const {name, option, onChange, icon, iconChecked} = props;
    const {t} = useTranslation();
    const [selectedOptions, setSelected] = useState(false);

    const labelText = useMemo(
        () => (option?.label ? t(option?.label) : ''),
        [option?.label, t],
    );

    const handleCheck = useCallback(() => {
        const checked = !selectedOptions;
        setSelected(checked);
        if (checked) {
            onChange(name, checked);
        } else {
            onChange(name, checked);
        }
    }, [selectedOptions, onChange, name]);

    const isIcon = !!(icon && iconChecked);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{labelText}1111111</Text>
            <Switch
                value={selectedOptions}
                onValueChange={handleCheck}
                trackColor={{false: '#767577', true: '#f4ae3d'}} // Example colors
                thumbColor={selectedOptions ? '#f4ae3d' : '#f4f3f4'}
            />
            {/* <TouchableOpacity
                onPress={handleCheck}
                style={styles.iconContainer}>
                {isIcon ? (
                    selectedOptions ? (
                        iconChecked
                    ) : (
                        icon
                    )
                ) : (
                    <Icon
                        name={
                            selectedOptions
                                ? 'check-box'
                                : 'check-box-outline-blank'
                        }
                        size={24}
                        color="black"
                    />
                )}
            </TouchableOpacity>
            {option?.label && (
                <TouchableOpacity onPress={handleCheck}>
                    <Text style={styles.label}>{labelText}</Text>
                </TouchableOpacity>
            )} */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    iconContainer: {
        marginRight: 8,
    },
    label: {
        fontSize: 16,
        color: 'black',
    },
});

// import React, { ReactNode, useCallback, useMemo, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { IOptions } from 'src/constants';

// export interface IToucheProps {
//     className?: string;
//     name?: string;
//     // checked: boolean;
//     option: IOptions;
//     onChange: (id: string, checked: boolean) => void;
//     icon?: ReactNode;
//     iconChecked?: ReactNode;
// }

// export default function Touche(props: IToucheProps) {
//     const { name, /*checked,*/ option, onChange, className, icon, iconChecked } = props;
//     const { t } = useTranslation();

//     const labelText = useMemo(() => (option?.label ? t(option?.label) : ''), [option?.label, t]);
//     const [selectedOptions, setSelected] = useState(false);

//     const handleCheck = useCallback(() => {
//         const value = option?.value ? option.value.toString() : '';
//         setSelected(!selectedOptions)
//         if (!selectedOptions) {
//             onChange(name, value);
//         } else {
//             onChange(name, undefined);
//         }
//         // onChange(value, !checked);
//     }, [selectedOptions, onChange, option]);

//     const isIcon = !!(icon && iconChecked);

//     return (
//         <div className='flex gap-x-1 items-center'>
//             {!isIcon && (
//                 <div className='flex items-center'>
//                     <input type='checkbox' name={name} defaultChecked={selectedOptions} onChange={handleCheck} />
//                 </div>
//             )}
//             {isIcon && (
//                 <div onClick={handleCheck} className="cursor-pointer">
//                     {selectedOptions ? iconChecked : icon}
//                 </div>
//             )}
//             <div className="leading-6">
//                 {option?.label && (
//                     <label htmlFor="comments" className={className} onClick={handleCheck}>
//                         {labelText}
//                     </label>
//                 )}
//             </div>
//         </div>
//     );
// }
