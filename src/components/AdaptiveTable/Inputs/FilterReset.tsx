import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {FaUndo} from 'src/components/FaIcons/icons';
import {useTranslation} from 'react-i18next';

interface IInputProps {
    name: string;
    onChange?: (name: string, emptyFilter: any) => void;
}

export default function FilterReset(props: IInputProps) {
    const {name, onChange} = props;
    const {t} = useTranslation(['common']);

    const handleChange = useCallback(() => {
        onChange(name, {});
    }, [name, onChange]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleChange}>
                <Text style={styles.text}>{t('reset-filters')}</Text>
                <FaUndo />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#007bff', // Adjust color as needed
        borderRadius: 4,
        elevation: 2, // For Android shadow
    },
    text: {
        color: '#fff',
        fontSize: 14,
        marginRight: 8,
    },
});

// // import './_inputs.scss';
// import React, { useCallback } from 'react';
// import { FaUndo } from 'src/components/FaIcons/icons';
// import {useTranslation} from 'react-i18next';

// interface IInputProps {
//     name: string;
//     onChange?: (name: string, emptyFilter: any) => void;
// }

// export default function FilterReset(props: IInputProps){
//     const { name, onChange } = props;
//     const { t } = useTranslation(['common']);

//     const handleChange = useCallback((e: any) => {
//         onChange(name, {});
//     }, [name, onChange]);

//     return(
//         <div>
//             <button className='btn btn-sm btn-primary' onClick={handleChange}>
//                 <p className='mr-3 whitespace-nowrap'> { t('reset-filters') } </p>
//                 <FaUndo />
//             </button>
//         </div>
//     );
// }
