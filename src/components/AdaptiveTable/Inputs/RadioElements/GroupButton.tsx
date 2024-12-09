import React, {useCallback, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {IRadioItemProps} from './RadioContainer';

type IGroupButtonProps = IRadioItemProps & {
    isVerticalDirection?: boolean;
    activeClassName?: any;
    className?: any;
};

export default function GroupButton(props: IGroupButtonProps) {
    const {
        name,
        option,
        checked,
        isVerticalDirection,
        onChange,
        className,
        activeClassName,
    } = props;

    const handleCheck = useCallback(() => {
        onChange(option, !checked);
    }, [checked, onChange, option]);

    const activeStyle = checked ? activeClassName : className;
    const directionStyle = isVerticalDirection
        ? styles.verticalDirection
        : styles.horizontalDirection;

    return (
        <TouchableOpacity
            onPress={handleCheck}
            style={[styles.container, directionStyle, activeStyle]}>
            <View style={styles.hiddenInput}>
                {/* We don't need a hidden input in React Native */}
            </View>
            <Text style={styles.text}>{option.label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    verticalDirection: {
        alignItems: 'flex-start',
        borderRadius: 4,
    },
    horizontalDirection: {
        borderRadius: 4,
    },
    hiddenInput: {
        width: 0,
        height: 0,
        opacity: 0,
    },
    text: {
        width: '100%',
    },
});

// import React, { useMemo, useCallback } from 'react';
// import { IRadioItemProps } from './RadioContainer';

// type IGroupButtonProps = IRadioItemProps

// export default function GroupButton(props: IGroupButtonProps){
//     const { name, option, checked, isVerticalDirection, onChange, className, activeClassName } = props;

//     const handleCheck = useCallback(() => {
//         onChange(option, !checked);
//     }, [checked, onChange, option]);

//     const activeStyle = checked? activeClassName : className;
//     const directionStyle = isVerticalDirection
//         ? ' text-left first:rounded-t-md last:rounded-b-md'
//         : 'first:rounded-l-md last:rounded-r-md';

//     return(
//         <div onClick={handleCheck} className={`flex justify-center items-center px-2 ${activeStyle} cursor-pointer ${directionStyle}`}>
//             <div className='collapse w-0'>
//                 <input name={name} value={option.value} defaultChecked={checked} type='radio' hidden />
//             </div>

//             <p className='w-full'>
//                 { option.label}
//             </p>
//         </div>
//     );
// }
