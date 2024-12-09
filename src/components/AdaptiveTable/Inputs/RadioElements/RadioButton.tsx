import React, {useCallback, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {IRadioItemProps} from './RadioContainer';

type IRadioProps = IRadioItemProps;

export default function Radio(props: IRadioProps) {
    const {name, option, checked, onChange, className} = props;
    const {t} = useTranslation();

    const labelText = useMemo(
        () => (option?.label ? t(option?.label) : ''),
        [option?.label, t],
    );

    const handleCheck = useCallback(() => {
        onChange(option, !checked);
    }, [checked, onChange, option]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleCheck} style={styles.radioButton}>
                <View
                    style={[
                        styles.radioCircle,
                        checked && styles.radioCircleChecked,
                    ]}>
                    {checked && <View style={styles.radioInnerCircle} />}
                </View>
            </TouchableOpacity>
            {option?.label && (
                <Text style={[styles.label, className]}>{labelText}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // React Native does not support gap, so use padding/margin for spacing
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCircleChecked: {
        backgroundColor: '#000',
    },
    radioInnerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        color: '#000',
    },
});

// import React, { useCallback, useMemo } from 'react';
// import { IRadioItemProps } from './RadioContainer';
// import {useTranslation} from 'react-i18next';

// type IRadioProps = IRadioItemProps

// export default function Radio(props: IRadioProps){
//     const { name, option, checked, onChange, className } = props;
//     const { t } = useTranslation();

//     const labelText = useMemo(() => option?.label? t(option?.label) : '', [option?.label, t]);

//     const handleCheck = useCallback(() => {
//         onChange(option, !checked);
//     }, [checked, onChange, option]);

//     return(
//         <div className='flex gap-x-1'>
//             <div className="flex items-center">
//                 <input type='radio' name={name} defaultChecked={checked} onChange={handleCheck}/>

//             </div>
//             { option?.label && (
//                 <label htmlFor="comments" className={className}>
//                     { labelText }
//                 </label>
//             )}
//         </div>
//     );
// }
