import React, {ReactNode, useCallback, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface ICheckboxProps {
    className?: any; // Not used in React Native
    name?: string;
    checked: boolean;
    option?: {
        label: string;
        value: string;
    };
    onChange: (id: string, checked: boolean) => void;
    icon?: ReactNode;
    iconChecked?: ReactNode;
}

export default function Checkbox(props: ICheckboxProps) {
    const {name, checked, option, onChange, className, icon, iconChecked} =
        props;
    const {t} = useTranslation();

    const labelText = useMemo(
        () => (option?.label ? t(option?.label) : ''),
        [option?.label, t],
    );

    const handleCheck = useCallback(() => {
        const value = option?.value ? option.value.toString() : '';
        onChange(value, !checked);
    }, [checked, onChange, option]);

    const isIcon = !!(icon && iconChecked);

    return (
        <View style={styles.container}>
            {!isIcon ? (
                <TouchableOpacity
                    onPress={handleCheck}
                    style={styles.checkboxContainer}>
                    <Icon
                        name={checked ? 'check-box' : 'check-box-outline-blank'}
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={handleCheck}
                    style={styles.iconContainer}>
                    {checked ? iconChecked : icon}
                </TouchableOpacity>
            )}
            {option?.label && (
                <TouchableOpacity
                    onPress={handleCheck}
                    style={styles.labelContainer}>
                    <Text style={[styles.label, className]}>{labelText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    checkboxContainer: {
        marginRight: 8,
    },
    iconContainer: {
        marginRight: 8,
    },
    labelContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        color: 'black',
    },
});

// import React, { ReactNode, useCallback, useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
// import { IOptions } from 'src/constants';

// export interface ICheckboxProps {
//     className?: string;
//     name?: string;
//     checked: boolean;
//     option?: IOptions;
//     onChange: (id: string, checked: boolean) => void;
//     icon?: ReactNode;
//     iconChecked?: ReactNode;
// }

// export default function Checkbox(props: ICheckboxProps) {
//     const { name, checked, option, onChange, className, icon, iconChecked } = props;
//     const { t } = useTranslation();

//     const labelText = useMemo(() => (option?.label ? t(option?.label) : ''), [option?.label, t]);

//     const handleCheck = useCallback(() => {
//         const value = option?.value ? option.value.toString() : '';
//         onChange(value, !checked);
//     }, [checked, onChange, option]);

//     const isIcon = !!(icon && iconChecked);

//     return (
//         <div className='flex gap-x-1 items-center'>
//             {!isIcon && (
//                 <div className='flex items-center'>
//                     <input type='checkbox' name={name} defaultChecked={checked} onChange={handleCheck} />
//                 </div>
//             )}
//             {isIcon && (
//                 <div onClick={handleCheck} className="cursor-pointer">
//                     {checked ? iconChecked : icon}
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
