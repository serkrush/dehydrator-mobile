import React, {useCallback, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {IRadioItemProps} from './RadioContainer';

type IEllipseBtnProps = IRadioItemProps;

export default function EllipseButton(props: IEllipseBtnProps) {
    const {name, option, checked, onChange} = props;

    const activeStyle = useMemo(
        () => (checked ? styles.active : styles.inactive),
        [checked],
    );

    const handleCheck = useCallback(() => {
        onChange(option, !checked);
    }, [checked, onChange, option]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleCheck}
                style={[styles.button, activeStyle]}>
                <Text style={styles.text}>{option.label}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: 8,
        marginBottom: 8,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: 'gray',
    },
    active: {
        backgroundColor: 'gray',
        borderColor: 'gray',
    },
    inactive: {
        backgroundColor: 'transparent',
        borderColor: 'gray',
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
    },
});

// import React, { useCallback, useMemo } from 'react';
// import { IRadioItemProps } from './RadioContainer';

// type IEllipseBtnProps = IRadioItemProps

// export default function EllipseButton(props: IEllipseBtnProps){
//     const { name, option, checked, onChange } = props;

//     const activeStyle = useMemo(() => checked? 'bg-gray-500 text-white' : 'bg-transparent', [checked]);

//     const handleCheck = useCallback(() => {
//         onChange(option, !checked);
//     }, [checked, onChange, option]);

//     return(
//         <div className={'mr-2 mb-2'}>
//             <input name={name} value={option.value} defaultChecked={checked}
//                 hidden={true} type='radio'/>

//             <div onClick={handleCheck}
//                 className={`${activeStyle} py-1 px-2 border border-gray-500 rounded hover:bg-gray-500 cursor-pointer hover:text-white`}>

//                 <p className='text-sm font-medium whitespace-nowrap'>
//                     {option.label}
//                 </p>
//             </div>
//         </div>
//     );
// }
