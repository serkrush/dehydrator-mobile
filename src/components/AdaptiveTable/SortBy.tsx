import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FaBars, FaSort, FaSortDown, FaSortUp} from '../FaIcons/icons';
import {IOptions, Sort} from 'src/constants';

export interface ISortOptions extends IOptions {
    sort: Sort;
}

interface ISortByProps {
    idSortBy: string;
    options: Array<ISortOptions>;
    changeSort: (field: string, sort: Sort) => void;
}

function SortBy(props: ISortByProps) {
    const {options, idSortBy, changeSort} = props;
    const {t} = useTranslation(['common']);

    const [isOpen, setIsOpen] = useState(false);

    const ACTION_MENU_ID = useMemo(() => `SortBy_${idSortBy}`, [idSortBy]);

    const switchIsOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    const onSortItemClick = useCallback(
        (option: ISortOptions) => {
            changeSort(option.value.toString(), option.sort);
            setIsOpen(false);
        },
        [changeSort],
    );

    const SortByOptions = useMemo(
        () => (
            <FlatList
                data={options}
                keyExtractor={(item, index) => `SortBy_${index}`}
                renderItem={({item}) => {
                    const {label, sort} = item;
                    const activeSort =
                        sort !== Sort.none
                            ? styles.activeSort
                            : styles.inactiveSort;

                    return (
                        <TouchableOpacity onPress={() => onSortItemClick(item)}>
                            <View style={styles.optionItem}>
                                <Text style={activeSort}>{label}</Text>
                                {GetSortIcon(sort)}
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        ),
        [options, onSortItemClick],
    );

    return (
        <>
            {options?.length > 0 && (
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={switchIsOpen}
                        style={styles.iconButton}>
                        <FaBars
                            style={
                                isOpen ? styles.iconActive : styles.iconInactive
                            }
                        />
                    </TouchableOpacity>

                    {isOpen && (
                        <View style={styles.dropdown}>
                            <Text style={styles.dropdownLabel}>
                                {t('common:sort-by')}
                            </Text>
                            {SortByOptions}
                        </View>
                    )}
                </View>
            )}
        </>
    );
}

export const GetNextSort = (sort: Sort): Sort => {
    switch (sort) {
        case Sort.none:
            return Sort.ASC;
        case Sort.ASC:
            return Sort.DESC;
        default:
            return Sort.none;
    }
};

export const GetSortIcon = (sort: Sort): JSX.Element => {
    switch (sort) {
        case Sort.none:
            return <FaSort />;
        case Sort.ASC:
            return <FaSortUp />;
        default:
            return <FaSortDown />;
    }
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        position: 'relative',
    },
    iconButton: {
        paddingLeft: 10,
        paddingTop: 5,
    },
    iconActive: {
        color: '#FCD34D',
    },
    iconInactive: {
        color: '#9CA3AF',
    },
    dropdown: {
        marginTop: 10,
        position: 'absolute',
        top: 30,
        right: 0,
        zIndex: 25,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    dropdownLabel: {
        marginBottom: 5,
        color: '#4B5563',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    activeSort: {
        color: '#FBBF24',
    },
    inactiveSort: {
        color: '#D1D5DB',
    },
});

export default SortBy;

// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import {useTranslation} from 'react-i18next';

// import { FaBars, FaSort, FaSortDown, FaSortUp } from '../FaIcons/icons';
// import { clickOutSideTheBlock } from 'src/main/util';
// import { IOptions, Sort } from 'src/constants';

// export interface ISortOptions extends IOptions {
//     sort: Sort;
// }

// interface ISortByProps {
//     idSortBy: string;
//     options: Array<ISortOptions>;
//     changeSort: (field: string, sort: Sort) => void;
// }

// function SortBy(props: ISortByProps) {
//     const { options, idSortBy, changeSort } = props;
//     const { t } = useTranslation(['common']);

//     const [isOpen, setIsOpen] = useState(false);

//     const ACTION_MENU_ID = useMemo(() => `SortBy_${idSortBy}`, [idSortBy]);
//     const windowClickSortBy = useCallback((event) => {
//         (isOpen && !clickOutSideTheBlock(event, ACTION_MENU_ID)) && setIsOpen(false);
//     }, [ACTION_MENU_ID, isOpen]);

//     useEffect(() => {
//         window.addEventListener('click', windowClickSortBy);
//         return () => { window.removeEventListener('click', windowClickSortBy); };
//     }, [windowClickSortBy]);

//     const switchIsOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);

//     const onSortItemClick = useCallback((option: ISortOptions) => {
//         changeSort(option.value.toString(), option.sort);
//     }, [changeSort]);

//     const SortByOptions = options?.map((option, i) => {
//         const { label, sort } = option;

//         const activeSort = sort !== Sort.none? 'text-yellow-600' : 'text-gray-200';

//         return (
//             <li key={`SortBy_${i}`} onClick={() => onSortItemClick(option)}
//                 className={`${activeSort} whitespace-nowrap
//                 flex flex-row justify-between items-center
//                 hover:text-gray-800 cursor-pointer`}>

//                 { label }
//                 { GetSortIcon(sort, 'mb-0.5 ml-3') }
//             </li>
//         );
//     });

//     const showSortByOptions = useMemo(() => SortByOptions?.length > 0, [SortByOptions?.length]);

//     return (
//         <> { showSortByOptions && (
//             <div className='flex flex-col relative'>
//                 <div className='pl-2 cursor-pointer' onClick={switchIsOpen}>
//                     <FaBars className={`transform scale-105 hover:scale-120 ${isOpen? 'text-yellow-500' : 'text-gray-400'} `}/>
//                 </div>

//                 {isOpen && (
//                     <div id={ACTION_MENU_ID} className='mt-4 absolute top-0 right-0 z-25'>
//                         <div className='p-3 bg-white text-gray-200 rounded-md shadow-xl'>
//                             <p className='mb-1 text-gray-600 whitespace-nowrap'>
//                                 { t('common:sort-by') }
//                             </p>

//                             <ul className='flex flex-col space-y-1 list-none'>
//                                 {SortByOptions}
//                             </ul>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         )}</>
//     );
// }

// export const GetNextSort = (sort: Sort): Sort => {
//     switch (sort) {
//     case Sort.none: return Sort.ASC;
//     case Sort.ASC:  return Sort.DESC;
//     default:        return Sort.none;
//     }
// };

// export const GetSortIcon = (sort: Sort, className = ''): JSX.Element => {
//     switch (sort) {
//     case Sort.none:
//         return <FaSort className={className}/>;
//     case Sort.ASC:
//         return <FaSortUp className={className}/>;
//     default:
//         return <FaSortDown className={className}/>;
//     }
// };

// export default SortBy;
