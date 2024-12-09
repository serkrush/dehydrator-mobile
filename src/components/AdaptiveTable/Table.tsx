import React, {useMemo, useCallback, useEffect, useRef} from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {withRequestResult} from './withRequest';
import Row from './Row';
import FilterBar from './FilterBar';
import HeadItem from './HeadItem';
import {pageSelectItem, pageSetFilter} from 'src/store/actions';
import BaseEntity from 'src/entities/BaseEntity';
import {
    IFieldList,
    PaginationType,
    Sort,
    Actions,
    IPagerParams,
    FilterType,
} from 'src/constants';
// import { isFunction } from 'src/main/util';
import {IMenu} from 'acl/types';
import {isFunction} from 'src/utils/helper';

const FILTER_TIMEOUT = 500;

interface IAdaptiveTable {
    fields: IFieldList;
    pagerName: string;
    onLoadMore: (loadParams: IPagerParams) => void;
    perPage: number;

    // optional parameters
    className?: string;
    rowClassName?: string;
    bodyClassName?: string;
    actions?: Actions[];
    noHeader?: boolean;
    isShadow?: boolean;
    isOverflow?: boolean;
    typeOfPagination?: PaginationType;
    colors?: string[];
    actionClassName?: string;
    actionMenu?: IMenu;
    getUrlPage?: (i: number) => string;
    onSelectRow?: (selectedItems: any[]) => void;
    onFilterChanged?: (field: string, value: string) => void;
    pageSetFilter?: (pageName: string, filter: object, sort: object) => void;

    drawSubRow?: (data: any) => JSX.Element;
    onActionClick?: (
        action: Actions,
        data: any,
        pagerParams: IPagerParams,
    ) => void;
    actionIsDisabled?: (action: Actions, data: any) => boolean;

    onTdClick?: (field: string, data: any) => void;
    onRowClick?: (data: any) => void;

    onItemChange?: (id: string, value: any, field: string) => void;
}

let bufItems: any[] = null;

function AdaptiveTable(props: IAdaptiveTable) {
    const {
        actions,
        isShadow,
        isOverflow,
        noHeader,
        perPage,
        pagerName,
        typeOfPagination,
        colors,
        actionMenu,
        onRowClick,
        onTdClick,
        onSelectRow,
        onItemChange,
        onActionClick,
        getUrlPage,
        onLoadMore,
        onFilterChanged,
        actionIsDisabled,
        drawSubRow,
    } = props;

    const {t} = useTranslation();
    const pager = useSelector((state: any) => state.pagination[pagerName]);
    const dispatch = useDispatch();

    const paginationType = typeOfPagination || PaginationType.SHORT;
    const currPage = pager ? get(pager, 'currentPage') : null;
    const withSelectRow = isFunction(onSelectRow);
    const count = pager ? get(pager, 'count') : null;

    if (bufItems == null || (pager && !get(pager, 'fetching'))) {
        bufItems = BaseEntity.getPagerItems(pagerName);
    }

    const fields = useMemo(() => {
        let fields = props.fields;
        if (withSelectRow) {
            fields = {
                ['toucher']: {
                    type: FilterType.Touche,
                    column: {editable: true},
                },
                ...fields,
            };
        }
        return fields;
    }, [props.fields, withSelectRow]);

    useEffect(() => {
        if (pagerName) {
            const pFilter = has(pager, 'filter') ? get(pager, 'filter') : {};
            const pSort = has(pager, 'sort') ? get(pager, 'sort') : {};

            Object.keys(fields).forEach((field: any) => {
                const fieldValue = fields[field];
                const isFilter = has(fieldValue, 'filter');
                const isHaveInitValue = has(fieldValue, 'initialValue');

                if (isFilter && isHaveInitValue && !has(pFilter, field)) {
                    pFilter[field] = fieldValue.initialValue;
                }
            });
            dispatch(pageSetFilter(pagerName, pFilter, pSort));
            onLoadMore({
                page: 1,
                pageName: pagerName,
                perPage,
            });
        }
    }, []);

    const handleLoadMore = useCallback(
        (pageNumber: any, direction: string) => {
            if (pager && !get(pager, 'fetching')) {
                const pFilter = has(pager, 'filter')
                    ? get(pager, 'filter')
                    : {};
                const pSort = has(pager, 'sort') ? get(pager, 'sort') : {};

                const ids = pager.pages[pager.currentPage].ids;
                let lastDocumentId =
                    pager.pages[pager.currentPage].prevLastDocumentId;
                if (direction === 'next') {
                    lastDocumentId =
                        ids.length > 0 ? ids[ids.length - 1] : undefined;
                }
                onLoadMore({
                    page: pageNumber,
                    pageName: pagerName,
                    filter: pFilter,
                    sort: pSort,
                    perPage,
                    lastDocumentId,
                } as IPagerParams);
            }
        },
        [onLoadMore, pager, pagerName, perPage],
    );

    const timerID: any = useRef(null);
    const handleOldFilterEvent = useCallback(
        (name: string, value: any) => {
            if (timerID.current !== null) {
                clearTimeout(timerID.current);
                timerID.current = null;
            }
            timerID.current = setTimeout(() => {
                onFilterChanged(name, value);
            }, FILTER_TIMEOUT);
        },
        [onFilterChanged],
    );

    const handleFilterEvent = useCallback(
        (name: string, value: any) => {
            if (timerID.current !== null) {
                clearTimeout(timerID.current);
                timerID.current = null;
            }

            const pFilter = has(pager, 'filter')
                ? {...get(pager, 'filter')}
                : {};
            const pSort = has(pager, 'sort') ? {...get(pager, 'sort')} : {};

            if (pagerName) {
                if (name === 'filterReset') {
                    Object.keys(pFilter)
                        .filter(f => fields[f]?.filter)
                        .forEach(f => delete pFilter[f]);
                } else {
                    if (value) {
                        pFilter[name] = value;
                    } else {
                        delete pFilter[name];
                    }
                }
                dispatch(pageSetFilter(pagerName, {...pFilter}, {...pSort}));
            }

            timerID.current = setTimeout(() => {
                onLoadMore({
                    page: 1,
                    pageName: pagerName,
                    filter: pFilter,
                    sort: pSort,
                    perPage: perPage,
                    force: true,
                } as IPagerParams);
            }, FILTER_TIMEOUT);
        },
        [dispatch, fields, onLoadMore, pager, pagerName, perPage],
    );

    const handleSortEvent = useCallback(
        (field: string, sort: Sort) => {
            const pFilter = has(pager, 'filter') ? get(pager, 'filter') : {};
            const pSort = {field, sort};
            dispatch(pageSetFilter(props.pagerName, pFilter, pSort));
            if (timerID.current !== null) {
                clearTimeout(timerID.current);
                timerID.current = null;
            }
            timerID.current = setTimeout(() => {
                onLoadMore({
                    page: 1,
                    pageName: pagerName,
                    filter: pFilter,
                    sort: pSort,
                    perPage: perPage,
                    force: true,
                } as IPagerParams);
            }, FILTER_TIMEOUT);
        },
        [dispatch, onLoadMore, pager, pagerName, perPage, props.pagerName],
    );

    const isShadowStyle = isShadow ? styles.shadow : {};
    const isOverflowStyle = isOverflow ? styles.overflow : styles.overflowAuto;
    const isTouchedAll = useMemo(() => {
        const pageIDS = get(pager, ['pages', get(pager, 'currentPage'), 'ids']);
        const touched = get(pager, 'touched');
        return pageIDS?.every(id => touched?.includes(id)) || false;
    }, [pager]);

    const renderRow = useCallback(
        ({item}: {item: any}) => (
            <Row
                key={item.id}
                data={item}
                actions={actions}
                pagerName={pagerName}
                onRowClick={onRowClick}
                onTdClick={onTdClick}
                drawSubRow={drawSubRow}
                onActionClick={onActionClick}
                actionIsDisabled={actionIsDisabled}
                onItemChange={onItemChange}
            />
        ),
        [
            actions,
            pagerName,
            onRowClick,
            onTdClick,
            drawSubRow,
            onActionClick,
            actionIsDisabled,
            onItemChange,
        ],
    );

    if (pager && pager.fetching) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={[styles.wrapper, isShadowStyle]}>
            {!noHeader && (
                <View style={[styles.header, isOverflowStyle]}>
                    <FlatList
                        data={Object.keys(fields)}
                        renderItem={({item}) => (
                            <HeadItem field={item} onSort={handleSortEvent} />
                        )}
                        keyExtractor={item => item}
                    />
                    <FilterBar
                        fields={fields}
                        onFilterChanged={handleFilterEvent}
                    />
                </View>
            )}
            <FlatList
                data={bufItems}
                renderItem={renderRow}
                keyExtractor={item => item.id.toString()}
                onEndReached={() => handleLoadMore(currPage + 1, 'next')}
                onEndReachedThreshold={0.5}
            />
            {paginationType === PaginationType.LONG && count && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        onPress={() => handleLoadMore(currPage + 1, 'next')}>
                        <Text>{t('Load More')}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        margin: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    shadow: {
        elevation: 3,
    },
    overflow: {
        overflow: 'hidden',
    },
    overflowAuto: {
        overflow: 'auto',
    },
    footer: {
        padding: 10,
        alignItems: 'center',
    },
});

export default withRequestResult(AdaptiveTable);

// import React, { useMemo, useCallback, useEffect, useRef } from 'react';
// import has from 'lodash/has';
// import get from 'lodash/get';
// import union from 'lodash/union';

// import { useSelector, useDispatch } from 'react-redux';
// import Paginator from './Paginator';
// import Row from './Row';
// import LightPaginator from './Paginator/LightPaginator';
// import FilterBar from './FilterBar';
// import HeadItem from './HeadItem';
// import { withRequestResult } from './withRequest';
// import { useTranslation } from 'react-i18next';
// import { ISortOptions } from './SortBy';
// import LeftRight from './Paginator/LeftRight';
// import { pageSelectItem, pageSetFilter } from 'src/store/actions';
// import BaseEntity from 'src/entities/BaseEntity';
// import {
//     IFieldList,
//     PaginationType,
//     Sort,
//     Actions,
//     IPagerParams,
//     FilterType,
// } from 'src/constants';
// import { isFunction } from 'src/main/util';
// import { IMenu } from 'acl/types';

// const FILTER_TIMEOUT = 500;

// interface IAdaptiveTable {
//     fields: IFieldList;
//     pagerName: string;
//     onLoadMore: (loadParams: IPagerParams) => void;
//     perPage: number;

//     // optional parameters
//     className?: string;
//     rowClassName?: string;
//     bodyClassName?: string;
//     actions?: Actions[];
//     noHeader?: boolean;
//     isShadow?: boolean;
//     isOverflow?: boolean;
//     typeOfPagination?: PaginationType;
//     colors?: string[];
//     actionClassName?: string;
//     actionMenu?: IMenu;
//     getUrlPage?: (i: number) => string;
//     onSelectRow?: (selectedItems: any[]) => void;
//     onFilterChanged?: (field: string, value: string) => void;
//     pageSetFilter?: (pageName: string, filter: object, sort: object) => void;

//     drawSubRow?: (data: any) => JSX.Element;
//     onActionClick?: (
//         action: Actions,
//         data: any,
//         pagerParams: IPagerParams,
//     ) => void;
//     actionIsDisabled?: (action: Actions, data: any) => boolean;

//     onTdClick?: (field: string, data: any) => void;
//     onRowClick?: (data: any) => void;

//     onItemChange?: (id: string, value: any, field: string) => void;
// }

// let bufItems: any[] = null;
// function AdaptiveTable(props: IAdaptiveTable) {
//     const {
//         actions,
//         isShadow,
//         isOverflow,
//         noHeader,
//         perPage,
//         pagerName,
//         typeOfPagination,
//         colors,
//         className,
//         rowClassName,
//         bodyClassName,
//         actionClassName,
//         actionMenu,
//         onRowClick,
//         onTdClick,
//         onSelectRow,
//         onItemChange,
//         onActionClick,
//         getUrlPage,
//         onLoadMore,
//         onFilterChanged,
//         actionIsDisabled,
//         drawSubRow,
//     } = props;

//     const { t } = useTranslation();
//     const pager = useSelector((state: any) => state.pagination[pagerName]);
//     const dispatch = useDispatch();

//     const paginationType = typeOfPagination || PaginationType.SHORT;
//     const currPage = pager ? get(pager, 'currentPage') : null;
//     const withSelectRow = isFunction(onSelectRow);
//     const count = pager ? get(pager, 'count') : null;

//     if (bufItems == null || (pager && !get(pager, 'fetching'))) {
//         bufItems = BaseEntity.getPagerItems(pagerName);
//     }

//     const fields = useMemo(() => {
//         let fields = props.fields;
//         if (withSelectRow) {
//             fields = Object.assign(
//                 {
//                     ['toucher']: {
//                         type: FilterType.Touche,
//                         column: { editable: true },
//                     },
//                 },
//                 fields,
//             );
//         }
//         return fields;
//     }, [props.fields, withSelectRow]);

//     useEffect(() => {
//         if (pagerName) {
//             const pFilter = has(pager, 'filter') ? get(pager, 'filter') : {};
//             const pSort = has(pager, 'sort') ? get(pager, 'sort') : {};

//             Object.keys(fields).map((field: any) => {
//                 const fieldValue = fields[field];
//                 const isFilter = has(fieldValue, 'filter');
//                 const isHaveInitValue = has(fieldValue, 'initialValue');

//                 if (isFilter && isHaveInitValue && !has(pFilter, field)) {
//                     pFilter[field] = fieldValue.initialValue;
//                 }
//             });
//             dispatch(pageSetFilter(pagerName, pFilter, pSort));
//             onLoadMore({
//                 page: 1,
//                 pageName: pagerName,
//                 perPage,
//                 force: true,
//             });
//         }
//     }, []);

//     const handleLoadMore = useCallback(
//         (pageNumber: any, direction: string) => {
//             if (pager && !get(pager, 'fetching')) {
//                 const pFilter = has(pager, 'filter')
//                     ? get(pager, 'filter')
//                     : {};
//                 const pSort = has(pager, 'sort') ? get(pager, 'sort') : {};

//                 const ids = pager.pages[pager.currentPage].ids;
//                 let lastDocumentId =
//                     pager.pages[pager.currentPage].prevLastDocumentId;
//                 if (direction === 'next') {
//                     lastDocumentId =
//                         ids.length > 0 ? ids[ids.length - 1] : undefined;
//                 }
//                 onLoadMore({
//                     page: pageNumber,
//                     pageName: pagerName,
//                     filter: pFilter,
//                     sort: pSort,
//                     perPage,
//                     lastDocumentId,
//                 } as IPagerParams);
//             }
//         },
//         [onLoadMore, pager, pagerName, perPage],
//     );

//     const timerID: any = useRef(null);
//     const handleOldFilterEvent = useCallback(
//         (name: string, value: any) => {
//             if (timerID.current !== null) {
//                 clearTimeout(timerID.current);
//                 timerID.current = null;
//             }
//             timerID.current = setTimeout(() => {
//                 onFilterChanged(name, value);
//             }, FILTER_TIMEOUT);
//         },
//         [onFilterChanged],
//     );

//     const handleFilterEvent = useCallback(
//         (name: string, value: any) => {
//             if (timerID.current !== null) {
//                 clearTimeout(timerID.current);
//                 timerID.current = null;
//             }

//             const pFilter = has(pager, 'filter')
//                 ? { ...get(pager, 'filter') }
//                 : {};
//             const pSort = has(pager, 'sort') ? { ...get(pager, 'sort') } : {};

//             if (pagerName) {
//                 if (name === 'filterReset') {
//                     Object.keys(pFilter)
//                         ?.filter((f) => fields[f]?.filter)
//                         .map((f) => delete pFilter[f]);
//                 } else {
//                     if (value) {
//                         pFilter[name] = value;
//                     } else {
//                         delete pFilter[name];
//                     }
//                 }
//                 dispatch(
//                     pageSetFilter(pagerName, { ...pFilter }, { ...pSort }),
//                 );
//             }

//             timerID.current = setTimeout(() => {
//                 onLoadMore({
//                     page: 1,
//                     pageName: pagerName,
//                     filter: pFilter,
//                     sort: pSort,
//                     perPage: perPage,
//                     force: true,
//                 } as IPagerParams);
//             }, FILTER_TIMEOUT);
//         },
//         [dispatch, fields, onLoadMore, pager, pagerName, perPage],
//     );

//     const handleSortEvent = useCallback(
//         (field: string, sort: Sort) => {
//             const pFilter = has(pager, 'filter') ? get(pager, 'filter') : {};
//             const pSort = { field, sort };
//             dispatch(pageSetFilter(props.pagerName, pFilter, pSort));
//             if (timerID.current !== null) {
//                 clearTimeout(timerID.current);
//                 timerID.current = null;
//             }
//             timerID.current = setTimeout(() => {
//                 onLoadMore({
//                     page: 1,
//                     pageName: pagerName,
//                     filter: pFilter,
//                     sort: pSort,
//                     perPage: perPage,
//                     force: true,
//                 } as IPagerParams);
//             }, FILTER_TIMEOUT);
//         },
//         [dispatch, onLoadMore, pager, pagerName, perPage, props.pagerName],
//     );

//     const isShadowStyle = isShadow ? 'shadow-xl rounded-lg' : '';
//     const isOverflowStyle = isOverflow
//         ? 'overflow-auto md:overflow-visible'
//         : 'overflow-auto';
//     const isTouchedAll = useMemo(() => {
//         const pageIDS = get(pager, ['pages', get(pager, 'currentPage'), 'ids']);
//         const touched = get(pager, 'touched');
//         return pageIDS?.every((id) => touched?.contains(id));
//     }, [pager]);

//     const handleOnItemChange = useCallback(
//         (id: string, value: any, field: string) => {
//             if ('function' === typeof onItemChange) {
//                 onItemChange(id, value, field);
//             }
//         },
//         [onItemChange],
//     );

//     const onSelectRowHandler = useCallback(
//         (selectedIds: string[] | string, needAdd: boolean) => {
//             const touchedList: any[] = get(pager, 'touched');
//             let selected = [];

//             if (Array.isArray(selectedIds)) {
//                 if (needAdd) {
//                     selected = union(selectedIds, touchedList);
//                 } else {
//                     selected = touchedList?.filter(
//                         (touch) => !selectedIds.includes(touch),
//                     );
//                 }
//             } else {
//                 const index = touchedList.indexOf(selectedIds);
//                 selected =
//                     index !== -1
//                         ? touchedList.splice(index, 1)
//                         : touchedList.concat(selectedIds);
//             }
//             dispatch(pageSelectItem(get(pager, 'pageName'), selected));

//             if (withSelectRow) {
//                 onSelectRow(
//                     bufItems?.filter((item) =>
//                         selected.includes(item.get('id')),
//                     ),
//                 );
//             }
//         },
//         [dispatch, onSelectRow, pager, withSelectRow],
//     );

//     const onSelectOneRow = useMemo(() => {
//         return withSelectRow
//             ? (id: string) => onSelectRowHandler(id, isTouchedAll)
//             : null;
//     }, [isTouchedAll, onSelectRowHandler, withSelectRow]);

//     const onSelectAllRows = useCallback(() => {
//         onSelectRowHandler(
//             get(pager, ['pages', get(pager, 'currentPage'), 'ids']),
//             !isTouchedAll,
//         );
//     }, [isTouchedAll, onSelectRowHandler, pager]);

//     const pagination = useMemo(() => {
//         switch (paginationType) {
//             case PaginationType.LIGHT:
//                 return (
//                     <LightPaginator
//                         count={count}
//                         perPage={perPage}
//                         currPage={currPage}
//                         getUrlPage={getUrlPage}
//                         onLoadMore={handleLoadMore}
//                     />
//                 );
//             case PaginationType.MEDIUM:
//                 return (
//                     <Paginator
//                         count={count}
//                         perPage={perPage}
//                         currPage={currPage}
//                         getUrlPage={getUrlPage}
//                         onLoadMore={handleLoadMore}
//                     />
//                 );
//             default:
//                 return (
//                     <LeftRight
//                         count={count}
//                         perPage={perPage}
//                         page={currPage}
//                         onLoadMore={handleLoadMore}
//                     />
//                 );
//                 break;
//         }
//     }, [count, currPage, getUrlPage, handleLoadMore, perPage, paginationType]);

//     const sort = useMemo(() => {
//         // only paginators have sort and filter properties in redux
//         const pagerSort = pager && get(pager, 'sort');
//         if (pagerSort) {
//             return {
//                 field: get(pagerSort, 'field'),
//                 sort: get(pagerSort, 'sort'),
//             };
//         } else {
//             return { field: '', sort: Sort.none };
//         }
//     }, [pager]);

//     const tableRows = useMemo(() => {
//         if (bufItems && bufItems.length) {
//             return bufItems.map((item: any, i: number) => {
//                 return (
//                     item && (
//                         <Row
//                             key={`AdaptiveTable_Row_${i}`}
//                             data={item}
//                             pager={pager}
//                             columns={fields}
//                             actions={actions}
//                             rowClassName={rowClassName}
//                             actionClassName={actionClassName}
//                             actionMenu={actionMenu}
//                             onSelectOneRow={onSelectOneRow}
//                             drawSubRow={drawSubRow}
//                             subRowBackground={colors ? colors[i] : false}
//                             onActionClick={onActionClick}
//                             actionIsDisabled={actionIsDisabled}
//                             onRowClick={onRowClick}
//                             onTdClick={onTdClick}
//                             onItemChange={handleOnItemChange}
//                         />
//                     )
//                 );
//             });
//         } else {
//             return (
//                 <tr>
//                     <td
//                         colSpan={
//                             fields &&
//                             Object.keys(fields).filter(
//                                 (k) => 'column' in fields[k],
//                             ).length
//                         }
//                     >
//                         <p className="whitespace-nowrap text-gray-500 text-center w-full text-lg">
//                             {t('no-entries-yet')}
//                         </p>
//                     </td>
//                 </tr>
//             );
//         }
//     }, [
//         actionClassName,
//         actionMenu,
//         actions,
//         fields,
//         drawSubRow,
//         handleOnItemChange,
//         onActionClick,
//         actionIsDisabled,
//         onRowClick,
//         onSelectOneRow,
//         onTdClick,
//         pager,
//         t,
//     ]);

//     const SortByOptions: Array<ISortOptions> = useMemo(() => {
//         return Object.keys(fields)
//             .filter((f) => fields[f]?.sorted && !fields[f].column)
//             .map((f) =>
//                 Object({
//                     label: fields[f]?.label,
//                     value: f,
//                     sort: getFieldSort(sort, f),
//                 }),
//             );
//     }, [fields, sort]);

//     const tableBlock = (
//         <div
//             className={` ${isShadowStyle} ${isOverflowStyle} ${className ? className : ''}`}
//         >
//             <table className={`w-full`}>
//                 {!noHeader && (
//                     <thead>
//                         <tr>
//                             {drawSubRow && isFunction(drawSubRow) && <td />}
//                             {fields &&
//                                 Object.keys(fields)
//                                     .filter((field) => fields[field].column)
//                                     .map((f, i) => {
//                                         return (
//                                             // @ts-ignore
//                                             <HeadItem
//                                                 key={`AdaptiveTable_Item_Head_${i}`}
//                                                 headClassName={
//                                                     fields[f].column
//                                                         .itemClassName
//                                                 }
//                                                 label={fields[f].label}
//                                                 field={f}
//                                                 fieldType={fields[f].type}
//                                                 sorted={fields[f]?.sorted}
//                                                 sort={getFieldSort(sort, f)}
//                                                 isTouchedAll={isTouchedAll}
//                                                 onSortChanged={handleSortEvent}
//                                                 onSelectAllRowClick={
//                                                     onSelectAllRows
//                                                 }
//                                             />
//                                         );
//                                     })}
//                             {actions?.length > 0 && (
//                                 // @ts-ignore
//                                 <HeadItem
//                                     key="AdaptiveTable_Item_Head_Action"
//                                     pagerName={pagerName.toUpperCase()}
//                                     headClassName="flex flex-row justify-end"
//                                     sortBy={SortByOptions}
//                                     onSortChanged={handleSortEvent}
//                                     field=""
//                                 />
//                             )}
//                         </tr>
//                     </thead>
//                 )}
//                 <tbody className={`${bodyClassName}`}>{tableRows}</tbody>
//             </table>
//         </div>
//     );

//     const WrappedBlock = withRequestResult(() => tableBlock, { pager });

//     return (
//         <div className="flex flex-col">
//             <FilterBar
//                 pager={pager}
//                 fields={fields}
//                 onFilterChanged={
//                     onFilterChanged ? handleOldFilterEvent : handleFilterEvent
//                 }
//             />
//             {pager && count > 1 && <div className="">{pagination}</div>}

//             <WrappedBlock />

//             {pager && count > 1 && <div className="">{pagination}</div>}
//         </div>
//     );
// }

// const getFieldSort = (sort, f) => {
//     return sort.field === f ? sort.sort : Sort.none;
// };

// export default AdaptiveTable;
