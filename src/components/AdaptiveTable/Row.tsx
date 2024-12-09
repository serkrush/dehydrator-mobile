import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import get from 'lodash/get';
import has from 'lodash/has';
import ActionItem from './ActionItem';
import RowItem from './RowItem';
import ActionMenu from './ActionMenu';
import {FaCaretRight, FaCaretDown} from 'react-native-vector-icons/FontAwesome';
import {IMenu} from 'acl/types';
import {IFieldList, Actions, IPagerParams} from 'src/constants';
import {isFunction} from 'src/utils/helper';

const MAX_COLUMNS_COUNT = 500;
const MAX_ROWS_COUNT = 10;

interface IRowProps {
    data: any;
    actionClassName?: string;
    rowClassName?: string;
    columns: IFieldList;
    actions?: Actions[];
    actionMenu?: IMenu;
    pager?: Map<string, any>;
    subRowBackground?: string | boolean;

    drawSubRow?: (data: any) => JSX.Element;
    onActionClick?: (
        action: Actions,
        data: any,
        pagerParams: IPagerParams,
    ) => void;
    actionIsDisabled?: (action: Actions, data: any) => boolean;

    onRowClick?: (data: any) => void;
    onTdClick?: (field: string, data: any) => void;
    onSelectOneRow?: (id: string) => void;
    onItemChange?: (id: string, value: any, field: string) => void;
}

export default function Row(props: IRowProps) {
    const {
        data,
        columns,
        actions,
        pager,
        actionClassName,
        rowClassName,
        actionMenu,
        subRowBackground,
        onItemChange,
        onRowClick,
        onActionClick,
        onTdClick,
        drawSubRow,
        onSelectOneRow,
        actionIsDisabled: isActionActivePredicate,
    } = props;

    const handleActionClick = useCallback(
        (action: Actions, data: any) => {
            if (isFunction(onActionClick)) {
                const pagerParams: IPagerParams = {
                    pageName: has(pager, 'pageName')
                        ? get(pager, 'pageName')
                        : '',
                    sort: has(pager, 'sort') ? get(pager, 'sort') : {},
                    filter: has(pager, 'filter') ? get(pager, 'filter') : {},
                    page: has(pager, 'currentPage')
                        ? get(pager, 'currentPage')
                        : 1,
                    perPage: has(pager, 'perPage')
                        ? get(pager, 'perPage')
                        : MAX_ROWS_COUNT,
                };
                onActionClick(action, data, pagerParams);
            }
        },
        [onActionClick, pager],
    );

    const className = onRowClick ? rowClassName : '';

    const _actionClassName = useMemo(
        () => actionClassName || styles.actionClassName,
        [actionClassName],
    );

    const isSubRowEnabled = isFunction(drawSubRow);
    const subRowContent = isSubRowEnabled && drawSubRow(data);

    const columnsElement = useMemo(() => {
        return (
            columns &&
            Object.keys(columns)
                .filter(field => columns[field].column)
                .map((f, i) => (
                    <RowItem
                        key={`AdaptiveTable_Item_Row_${i}`}
                        data={data}
                        field={f}
                        columns={columns}
                        onTdClick={onTdClick}
                        pager={pager}
                        onSelectOneRow={onSelectOneRow}
                        onItemChange={onItemChange}
                    />
                ))
        );
    }, [columns, data, onItemChange, onSelectOneRow, onTdClick, pager]);

    const [subRowOpen, setSubRowOpen] = useState<boolean>(false);

    const toggleSubRow = useCallback(() => {
        setSubRowOpen(!subRowOpen);
    }, [subRowOpen]);

    const subRowArrow = useMemo(() => {
        if (subRowContent) {
            return (
                <TouchableOpacity
                    onPress={toggleSubRow}
                    style={styles.subRowArrow}>
                    {subRowOpen ? (
                        <FaCaretDown color={subRowBackground as string} />
                    ) : (
                        <FaCaretRight />
                    )}
                </TouchableOpacity>
            );
        } else {
            return <View />;
        }
    }, [toggleSubRow, subRowOpen, subRowContent]);

    const actionsElement = useMemo(() => {
        if (actions) {
            return (
                <View style={_actionClassName}>
                    {actions.map((a, i) => (
                        <ActionItem
                            key={`AdaptiveTable_Row_Action_${i}`}
                            data={data}
                            action={a}
                            actionIsDisabled={isActionActivePredicate}
                            onActionClick={handleActionClick}
                        />
                    ))}

                    {actionMenu && <ActionMenu menu={actionMenu} data={data} />}
                </View>
            );
        }
    }, [
        actions,
        _actionClassName,
        actionMenu,
        data,
        isActionActivePredicate,
        handleActionClick,
    ]);

    const handleRowClick = useCallback(() => {
        if (isFunction(onRowClick)) {
            onRowClick(data);
        }
    }, [data, onRowClick]);

    const rowStyle = useMemo(
        () => (subRowOpen ? styles.openRow : {}),
        [subRowOpen],
    );

    const rowBackgroundStyle = useMemo(() => {
        return subRowOpen && subRowBackground
            ? {backgroundColor: subRowBackground as string}
            : {};
    }, [subRowOpen]);

    return (
        <>
            <TouchableOpacity
                onPress={handleRowClick}
                style={[styles.rowContainer, rowBackgroundStyle, rowStyle]}>
                {isSubRowEnabled && subRowArrow}
                <View>{columnsElement}</View>
                <View>{actionsElement}</View>
            </TouchableOpacity>

            {subRowContent && subRowOpen && (
                <View style={[styles.subRowContent, rowBackgroundStyle]}>
                    {subRowContent}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    openRow: {
        backgroundColor: '#f0f0f0',
    },
    subRowArrow: {
        padding: 5,
    },
    actionClassName: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    subRowContent: {
        padding: 10,
    },
});

// import React, {MouseEvent, useCallback, useMemo, useState} from 'react';
// import get from 'lodash/get';
// import has from 'lodash/has';
// import ActionItem from './ActionItem';
// import RowItem from './RowItem';
// import ActionMenu from './ActionMenu';
// import {FaCaretRight, FaCaretDown} from '../FaIcons/icons';
// import { isFunction } from 'src/main/util';
// import { IMenu } from 'acl/types';
// import { IFieldList, Actions, IPagerParams } from 'src/constants';

// const MAX_COLUMNS_COUNT = 500;
// const MAX_ROWS_COUNT = 10;

// interface IRowProps {
//     data: any;
//     actionClassName?: string;
//     rowClassName?: string;
//     columns: IFieldList;
//     actions?: Actions[];
//     actionMenu?: IMenu;
//     pager?: Map<string, any>;
//     subRowBackground?: string | boolean;

//     drawSubRow?: (data: any) => JSX.Element;
//     onActionClick?: (
//         action: Actions,
//         data: any,
//         pagerParams: IPagerParams,
//     ) => void;
//     actionIsDisabled?: (action: Actions, data: any) => boolean;

//     onRowClick?: (data: any) => void;
//     onTdClick?: (field: string, data: any) => void;
//     onSelectOneRow?: (id: string) => void;
//     onItemChange?: (id: string, value: any, field: string) => void;
// }
// export default function Row(props: IRowProps) {
//     const {
//         data,
//         columns,
//         actions,
//         pager,
//         actionClassName,
//         rowClassName,
//         actionMenu,
//         subRowBackground,
//         onItemChange,
//         onRowClick,
//         onActionClick,
//         onTdClick,
//         drawSubRow,
//         onSelectOneRow,
//         actionIsDisabled: isActionActivePredicate,
//     } = props;

//     const handleActionClick = useCallback(
//         (action: Actions, data: any) => {
//             if (isFunction(onActionClick)) {
//                 const pagerParams: IPagerParams = {
//                     pageName: has(pager, 'pageName')
//                         ? get(pager, 'pageName')
//                         : '',
//                     sort: has(pager, 'sort') ? get(pager, 'sort') : {},
//                     filter: has(pager, 'filter') ? get(pager, 'filter') : {},
//                     page: has(pager, 'currentPage')
//                         ? get(pager, 'currentPage')
//                         : 1,
//                     perPage: has(pager, 'perPage')
//                         ? get(pager, 'perPage')
//                         : MAX_ROWS_COUNT,
//                 };

//                 onActionClick(action, data, pagerParams);
//             }
//         },
//         [onActionClick, pager],
//     );

//     const className = onRowClick ? rowClassName : '';

//     const _actionClassName = useMemo(
//         () =>
//             actionClassName
//                 ? actionClassName
//                 : 'flex flex-row justify-end items-center space-x-2 table-icons-row',
//         [actionClassName],
//     );

//     const isSubRowEnabled = isFunction(drawSubRow);
//     const subRowContent = isSubRowEnabled && drawSubRow(data);

//     const columnsElement = useMemo(() => {
//         return (
//             columns &&
//             Object.keys(columns)
//                 .filter(field => columns[field].column)
//                 .map((f, i) => (
//                     <RowItem
//                         key={`AdaptiveTable_Item_Row_${i}`}
//                         data={data}
//                         field={f}
//                         columns={columns}
//                         onTdClick={onTdClick}
//                         pager={pager}
//                         onSelectOneRow={onSelectOneRow}
//                         onItemChange={onItemChange}
//                     />
//                 ))
//         );
//     }, [columns, data, onItemChange, onSelectOneRow, onTdClick, pager]);

//     const [subRowOpen, setSubRowOpen] = useState<boolean>(false);

//     const closeOpenSubRow = useCallback(
//         (e: MouseEvent) => {
//             e.stopPropagation();
//             setSubRowOpen(!subRowOpen);
//         },
//         [subRowOpen],
//     );

//     const subRowArrow = useMemo(() => {
//         if (subRowContent) {
//             return (
//                 <td
//                     className="sub-row-arrow-container"
//                     onClick={closeOpenSubRow}>
//                     <div className="sub-row-arrow">
//                         {subRowOpen ? (
//                             <FaCaretDown style={{color: subRowBackground}} />
//                         ) : (
//                             <FaCaretRight />
//                         )}
//                     </div>
//                 </td>
//             );
//         } else {
//             return (
//                 <td>
//                     <div></div>
//                 </td>
//             );
//         }
//     }, [closeOpenSubRow, subRowOpen, subRowContent]);

//     const actionsElement = useMemo(() => {
//         if (actions !== null) {
//             return (
//                 <td key="AdaptiveTable_Item_Row_Action" className="h-full">
//                     <div className={_actionClassName}>
//                         {actions?.map((a, i) => (
//                             <ActionItem
//                                 key={'AdaptiveTable_Row_Action_' + i}
//                                 data={data}
//                                 action={a}
//                                 actionIsDisabled={isActionActivePredicate}
//                                 onActionClick={handleActionClick}
//                             />
//                         ))}

//                         {actionMenu && (
//                             <ActionMenu menu={actionMenu} data={data} />
//                         )}
//                     </div>
//                 </td>
//             );
//         }
//     }, [
//         actions,
//         _actionClassName,
//         actionMenu,
//         data,
//         isActionActivePredicate,
//         handleActionClick,
//     ]);

//     const handleRowClick = useCallback(
//         (e: MouseEvent) => {
//             if (isFunction(onRowClick)) {
//                 onRowClick(data);
//             }
//         },
//         [data, onRowClick],
//     );

//     const nowOpen = useMemo(
//         () => (subRowOpen ? 'border-b bg-blueLight-100' : ''),
//         [subRowOpen],
//     );
//     const nowOpenStyle = useMemo(() => {
//         return subRowOpen && subRowBackground
//             ? {
//                 backgroundColor: subRowBackground + '11',
//                 borderLeft: `5px solid ${subRowBackground}`,
//             }
//             : {};
//     }, [subRowOpen]);

//     return (
//         <>
//             <tr
//                 onClick={handleRowClick}
//                 style={nowOpenStyle}
//                 className={`${className} ${nowOpen}`}>
//                 {isSubRowEnabled && subRowArrow}
//                 {columnsElement}
//                 {actionsElement}
//             </tr>

//             {subRowContent && subRowOpen && (
//                 <tr className={`${className}`}>
//                     <td colSpan={MAX_COLUMNS_COUNT} style={nowOpenStyle}>
//                         {subRowContent}
//                     </td>
//                 </tr>
//             )}
//         </>
//     );
// }
