import React, {useMemo, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {IMenuData} from 'acl/types';

interface IMenuItemProps {
    className?: string;
    menuItem: IMenuData;
    handleAction: (item: IMenuData) => void;
}

export function ActionMenuItem(props: IMenuItemProps) {
    const {menuItem, handleAction} = props;
    const {t} = useTranslation(['common']);

    const actionMenuItemClickHandler = useCallback(() => {
        handleAction(menuItem);
    }, [handleAction, menuItem]);

    const icon = useMemo(() => menuItem.icon, [menuItem.icon]);
    const label = useMemo(() => menuItem.label, [menuItem.label]);

    const onActionMenuItemBlur = useCallback(() => {
        // React Native does not use focus events like web. You might handle focus lost differently.
        // Example: dispatch an action or update state if needed
    }, [menuItem]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={actionMenuItemClickHandler}
                onBlur={onActionMenuItemBlur} // Note: onBlur might not work as expected in React Native
                style={styles.button}>
                {icon && <View style={styles.iconContainer}>{icon()}</View>}
                <Text style={styles.label}>{label}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff', // Adjust color as needed
        borderRadius: 4,
        elevation: 2, // For Android shadow
    },
    iconContainer: {
        marginRight: 8,
    },
    label: {
        fontSize: 14,
        color: '#333', // Adjust color as needed
    },
});

// import { IMenuData } from 'acl/types';
// import React, { useMemo, useCallback, MouseEvent, FocusEvent } from 'react';
// import { useTranslation } from 'react-i18next';

// interface IMenuItemProps {
//     className?: string;
//     menuItem: IMenuData;

//     handleAction: (item: IMenuData) => void;
// }

// export function ActionMenuItem(props: IMenuItemProps){
//     const { menuItem, handleAction } = props;
//     const { t } = useTranslation(['common']);

//     const actionMenuItemClickHandler = useCallback((e: MouseEvent<HTMLButtonElement>) => {
//         e.preventDefault();
//         handleAction(menuItem);
//     }, [handleAction, menuItem]);

//     const icon = useMemo(() => menuItem.icon, [menuItem.icon]);
//     const label = useMemo(() => menuItem.label, [menuItem.label]);

//     const onActionMenuItemBlur = useCallback((e: FocusEvent<HTMLButtonElement>) => {
//         e.preventDefault();
//         e['focusLosted'] = menuItem['index'];
//     }, [menuItem]);

//     return(
//         <li >
//             <button onBlur={onActionMenuItemBlur} onClick={actionMenuItemClickHandler}
//                 className='action-menu-item space-x-2'>

//                 {icon && (
//                     <div className='text-xs text-gray-100'>
//                         { icon() }
//                     </div>
//                 )}

//                 <p className='text-xs font-normal text-gray-900'>
//                     { label }
//                 </p>
//             </button>
//         </li>
//     );
// }
