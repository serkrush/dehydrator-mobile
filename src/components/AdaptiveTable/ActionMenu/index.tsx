import React, {useState, useMemo, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import {IMenu, IMenuData} from 'acl/types';
import {useAcl} from 'src/hooks/useAcl';

interface IActionMenuProps {
    data: any;
    menu?: IMenu;
}

export default function ActionMenu(props: IActionMenuProps) {
    const {data, menu} = props;
    const {t} = useTranslation();
    const {allow} = useAcl();

    const ACTION_MENU_ID = useMemo(() => `ActionMenu_${data.id}`, [data]);

    const [isOpen, setIsOpen] = useState(false);

    const handleAction = (actionMenuItem: IMenuData) => {
        console.log('submenuItem', actionMenuItem);
    };

    const RenderMenuItems = useMemo(() => {
        return (
            menu &&
            Object.keys(menu)
                .filter((key: string) => {
                    const i: IMenuData = menu[key];
                    const isAllowed = allow(i.grant, key);
                    return !isAllowed;
                })
                .map((key: string, i: number) => {
                    const menuItem: IMenuData = menu[key];
                    menuItem['index'] = i;
                    return (
                        <TouchableOpacity
                            key={key}
                            onPress={() => handleAction(menuItem)}
                            style={styles.menuItem}>
                            <Text style={styles.menuItemText}>
                                {menuItem.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })
        );
    }, [allow, menu]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
                <Icon name="cog" size={24} color="#aaa" />
            </TouchableOpacity>

            {isOpen && (
                <Modal
                    transparent={true}
                    visible={isOpen}
                    animationType="fade"
                    onRequestClose={() => setIsOpen(false)}>
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={() => setIsOpen(false)}>
                        <View style={styles.menuContainer}>
                            <Text style={styles.menuTitle}>{`${t(
                                'choose-action',
                            )}:`}</Text>
                            <View>{RenderMenuItems}</View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    iconButton: {
        padding: 10,
        backgroundColor: 'gray',
        borderRadius: 5,
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        position: 'absolute',
        top: 50,
        right: 10,
    },
    menuTitle: {
        fontSize: 14,
        color: '#555',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    menuItem: {
        paddingVertical: 10,
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

// import React, { useState, useMemo, useCallback, useEffect, MouseEvent } from 'react';
// import get from "lodash/get";
// import { useTranslation } from 'react-i18next';
// // import { clickOutSideTheBlock } from 'src/utils/random';
// import { ActionMenuItem } from './ActionMenuItem';
// import { FaCog } from 'src/components/FaIcons/icons';
// // import { IMenu, IMenuData } from '@/acl/types';
// import { clickOutSideTheBlock } from 'src/main/util';
// import { IMenu, IMenuData } from 'acl/types';
// import { useAcl } from 'src/hooks/useAcl';

// interface IActionMenuProps {
//     data: any;
//     menu?: IMenu;
// }
// export default function ActionMenu(props: IActionMenuProps){
//     const { data, menu } = props;
//     const { t } = useTranslation();
//     const { allow } = useAcl();

//     const ACTION_MENU_ID = useMemo(() => `ActionMenu_${get(data, 'id')}`, [data]);

//     const [isOpen, setIsOpen] = useState(false);

//     const handleAction = (actionMenuItem: IMenuData) => {

//         console.log('submenuItem', actionMenuItem);
//     };

//     const RenderMenuItems = useMemo(() => {
//         return menu && Object.keys(menu)
//             .filter((key: string) => {
//                 const i: IMenuData = menu[key];
//                 const isAllowed = allow(i.grant, key);
//                 /* FOR TEST TEMPORARY RETURN NOT ALLOWED */
//                 return !isAllowed;
//             })
//             .map((key: string, i: number) => {
//                 const menuItem: IMenuData = menu[key];
//                 menuItem['index'] = i;
//                 return <ActionMenuItem menuItem={menuItem} handleAction={handleAction} key={key} />;
//             });
//     }, [allow, menu]);

//     const windowClickActionMenu = useCallback((event: any) => {
//         (isOpen && !clickOutSideTheBlock(event, ACTION_MENU_ID)) && setIsOpen(false);
//     }, [ACTION_MENU_ID, isOpen]);

//     useEffect(() => {
//         window.addEventListener('click', windowClickActionMenu);

//         return () => {
//             window.removeEventListener('click', windowClickActionMenu);
//         };
//     }, [windowClickActionMenu]);

//     const menuClickHandler = useCallback((e: MouseEvent) => {
//         setIsOpen(!isOpen);
//     }, [isOpen]);

//     return (
//         <div id={ACTION_MENU_ID} className='relative'>

//             <button className='table-icon text-gray-200 hover:bg-gray-400'
//                 type='button' onClick={menuClickHandler}>

//                 <FaCog className='text-lg'/>
//             </button>

//             {isOpen && (
//                 <div className='mt-7 absolute top-0 right-0 rounded-lg overflow-hidden bg-white shadow-2xl z-10'>
//                     <div className='py-2'>
//                         <div className='py-1 px-2 w-full'>
//                             <p className='text-xs text-gray-200 font-semibold whitespace-nowrap'>
//                                 { `${t('choose-action')}:` }
//                             </p>
//                         </div>

//                         <div className='w-full'>
//                             <ul>
//                                 {RenderMenuItems}
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
