import React, {useMemo, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Checkbox from './Inputs/CheckElements/CheckBox';
import {useTranslation} from 'react-i18next';
import SortBy, {GetNextSort, GetSortIcon, ISortOptions} from './SortBy';
import {FilterType, Sort} from 'src/constants';
import {isFunction} from 'src/main/util';

export interface IHeadItemProps {
    pagerName?: string;
    field: string;
    fieldType?: FilterType;
    label?: string;
    headClassName?: string;
    sorted?: boolean;
    sort?: Sort;
    sortBy?: Array<ISortOptions>;
    onSortChanged?: (field: string, sort: Sort) => void;
    onSelectAllRowClick?: () => void;
    isTouchedAll?: boolean;
}

export interface IHeadItemState {
    reactIcon: any;
}

export default function HeadItem(props: IHeadItemProps) {
    const {
        field,
        label,
        pagerName,
        fieldType,
        isTouchedAll,
        sorted,
        sort,
        sortBy,
        onSortChanged,
        onSelectAllRowClick,
    } = props;
    const {t} = useTranslation();

    const handleChange = useCallback(() => {
        if (isFunction(onSelectAllRowClick)) {
            onSelectAllRowClick();
        }
    }, [onSelectAllRowClick]);

    const changeSort = useCallback(
        (field: string, sort: Sort) => {
            if (isFunction(onSortChanged)) {
                onSortChanged(field, GetNextSort(sort));
            }
        },
        [onSortChanged],
    );

    const handleSortClick = useCallback(() => {
        if (sorted) {
            changeSort(field, sort);
        }
    }, [changeSort, field, sort, sorted]);

    const activeSort =
        sorted && sort !== Sort.none ? styles.activeSort : styles.inactiveSort;
    const sortIcon = useMemo(() => GetSortIcon(sort, styles.sortIcon), [sort]);
    const isTouched = fieldType === FilterType.Touche && onSelectAllRowClick;

    const SortByOptions = useMemo(() => {
        if (sortBy) {
            return (
                <SortBy
                    idSortBy={pagerName}
                    changeSort={changeSort}
                    options={sortBy}
                />
            );
        }
    }, [changeSort, pagerName, sortBy]);

    return (
        <View style={styles.container}>
            {isTouched && (
                <Checkbox checked={isTouchedAll} onChange={handleChange} />
            )}
            {label && <Text style={styles.label}>{t(label)}</Text>}
            {sorted && (
                <TouchableOpacity
                    onPress={handleSortClick}
                    style={styles.sortContainer}>
                    {sortIcon}
                </TouchableOpacity>
            )}
            <View style={activeSort}>{SortByOptions}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
    },
    sortContainer: {
        paddingLeft: 10,
        cursor: 'pointer',
    },
    sortIcon: {
        transform: [{scale: 1.25}],
    },
    activeSort: {
        color: 'gray',
    },
    inactiveSort: {
        color: 'lightgray',
    },
});

// import React, { useMemo, useCallback } from 'react';
// import Checkbox from './Inputs/CheckElements/CheckBox';
// // import { Sort, FilterType } from 'src/pagination/IPagerParams';
// import {useTranslation} from 'react-i18next';
// // import { isFunction } from 'src/utils/random';
// import SortBy, { GetNextSort, GetSortIcon, ISortOptions } from './SortBy';
// import { FilterType, Sort } from 'src/constants';
// import { isFunction } from 'src/main/util';

// export interface IHeadItemProps {
//     pagerName?: string;
//     field: string;
//     fieldType?: FilterType;
//     label?: string;
//     headClassName?: string;
//     sorted?: boolean;
//     sort?: Sort;
//     sortBy?: Array<ISortOptions>;
//     onSortChanged?: (field: string, sort: Sort) => void;
//     onSelectAllRowClick?: () => void;
//     isTouchedAll?: boolean;
// }

// export interface IHeadItemState {
//     reactIcon: any;
// }
// export default function HeadItem(props: IHeadItemProps) {
//     const { field, label, pagerName,  headClassName, fieldType, isTouchedAll,
//         sorted, sort, sortBy, onSortChanged, onSelectAllRowClick } = props;
//     const { t } = useTranslation();

//     const handleChange = useCallback(() => {
//         if (isFunction(onSelectAllRowClick)) {
//             onSelectAllRowClick();
//         }
//     }, [onSelectAllRowClick]);

//     const changeSort = useCallback((field: string, sort: Sort) => {
//         if (isFunction(onSortChanged)) {
//             onSortChanged(field, GetNextSort(sort));
//         }
//     }, [onSortChanged]);

//     const handleSortClick = useCallback(() => {
//         if (sorted) { changeSort(field, sort); }
//     }, [changeSort, field, sort, sorted]);

//     const activeSort = sorted && sort !== Sort.none? 'text-gray-600' : 'text-gray-400';
//     const sortedStyle = sorted? 'cursor-pointer' : '';
//     const sortIcon = useMemo(() => GetSortIcon(sort, 'transform hover:scale-125'), [sort]);
//     const isTouched = fieldType === FilterType.Touche && onSelectAllRowClick;

//     const SortByOptions = useMemo(() => {
//         if (sortBy) {
//             return (
//                 <SortBy idSortBy={pagerName}
//                     changeSort={changeSort}
//                     options={sortBy} />
//             );
//         }
//     }, [changeSort, pagerName, sortBy]);

//     return (
//         <th className={`${headClassName? headClassName : ''}`}>
//             <div className={`flex flex-row justify-start items-center`}>
//                 { isTouched && <Checkbox checked={isTouchedAll} onChange={ handleChange }/> }
//                 { label && <p className='whitespace-nowrap'> { t(label) } </p> }
//                 { sorted && <div onClick={handleSortClick} className={`pl-2 ${sortedStyle}`}> { sortIcon } </div> }
//                 <div className={`${activeSort}`}>
//                     { SortByOptions }
//                 </div>
//             </div>
//         </th>
//     );
// }
