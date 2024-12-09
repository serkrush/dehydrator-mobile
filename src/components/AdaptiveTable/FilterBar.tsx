import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, ViewStyle, Text} from 'react-native';
import get from 'lodash/get';
import {IFieldList} from 'src/constants';
import {isEmpty} from 'src/utils/helper';
import FilterItem from './FilterItem';

export interface IFilterBarProps {
    className?: string;
    fields: IFieldList;
    pager?: Map<string, any>;
    onFilterChanged: (field: string, value: string) => void;
    style?: ViewStyle;
}

export default function FilterBar(props: IFilterBarProps) {
    const {fields, pager, onFilterChanged, className, style} = props;
    const getFieldInitialValue = useCallback(
        (fieldname: string) => {
            const filter = get(pager, 'filter') ?? {};
            const initvalue = filter && filter[fieldname];
            return initvalue ? initvalue : '';
        },
        [pager],
    );

    const [filterItems, setFilterItems] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (isEmpty(fields)) {
            return;
        }

        setFilterItems(
            Object.entries(
                Object.keys(fields)
                    .filter(field => fields[field]?.filter)
                    .reduce(
                        (r: any, v, i, a, k = fields[v].filter.group) => (
                            (r[k] || (r[k] = [])).push(v), r
                        ),
                        {},
                    ),
            ).map(pair => {
                return (
                    <View
                        key={'AdaptiveTable_Filter_Row_' + pair[0]}
                        style={styles.filterRow}>
                        {Object.values(pair[1]).map((field, j) => {
                            return (
                                <FilterItem
                                    key={`AdaptiveTable_Filter_Field_${j}`}
                                    // className={fields[field].filter?.className}
                                    styleFilterContainer={
                                        fields[field].filter
                                            ?.styleFilterContainer
                                    }
                                    styleFilterItem={
                                        fields[field].filter?.styleFilterItem
                                    }
                                    labelClassName={
                                        fields[field].filter?.labelClassName
                                    }
                                    inputClassName={
                                        fields[field].filter?.inputClassName
                                    }
                                    activeClassName={
                                        fields[field].filter?.activeClassName
                                    }
                                    label={fields[field].label}
                                    type={fields[field].type}
                                    icon={fields[field].filter?.icon}
                                    iconSvg={fields[field].filter?.iconSvg}
                                    iconSvgChecked={
                                        fields[field].filter?.iconSvgChecked
                                    }
                                    name={field}
                                    showLabel={fields[field].filter?.showLabel}
                                    options={fields[field].filter?.options}
                                    placeholder={fields[field].placeholder}
                                    value={getFieldInitialValue(field)}
                                    onFilterChanged={onFilterChanged}
                                    labelIcon={fields[field].labelIcon}
                                    customFilterEvent={
                                        fields[field].filter?.customFilterEvent
                                    }
                                />
                            );
                        })}
                    </View>
                );
            }),
        );
    }, [fields, getFieldInitialValue, onFilterChanged]);

    const isHaveFilterItems = filterItems.length > 0;

    return (
        <>
            {isHaveFilterItems ? (
                <View style={{...styles.container, ...style}}>
                    {filterItems}
                </View>
            ) : null}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
});
