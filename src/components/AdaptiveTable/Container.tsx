import get from 'lodash/get';
import has from 'lodash/has';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';
import {IFieldList, IPagerParams} from 'src/constants';
import {BaseEntity} from 'src/entities/BaseEntity';
import palette from 'src/theme/colors/palette';
import DSpinner from '../DSpinner';
import {CheckType} from '../SpinnerBase';
import FilterBar from './FilterBar';

const FILTER_TIMEOUT = 500;

interface IAdaptiveContainer {
    fields?: IFieldList;
    pagerName: string;
    perPage?: number;
    onLoadMore: (loadParams: IPagerParams) => void;
    item: (data: any, index: number) => JSX.Element;
    onFilterChanged?: (field: string, value: string) => void;
    filterContainerStyle?: ViewStyle;
    bodyContainerStyle?: ViewStyle;
    ItemSeparatorComponent?: () => JSX.Element;
    numColumns?: number;
    noDataText?: string;
    checkEntities?: CheckType | CheckType[];
}

function AdaptiveContainer(props: IAdaptiveContainer) {
    const {
        perPage = 9999,
        pagerName,
        fields,
        item,
        onLoadMore,
        onFilterChanged,
        filterContainerStyle,
        bodyContainerStyle,
        ItemSeparatorComponent,
        numColumns = 1,
        noDataText = 'no-entries-yet',
        checkEntities,
    } = props;
    const {t} = useTranslation();
    const pager = useSelector((state: any) => state.pagination[pagerName]);
    const currPage = pager ? get(pager, 'currentPage') : null;
    const count = pager ? get(pager, 'count') : null;

    const bufItems = useMemo(() => {
        if (bufItems == null || (pager && !get(pager, 'fetching'))) {
            return BaseEntity.getPagerItemsNew(pagerName);
        }
        return null;
    }, [pager, pagerName]);

    useEffect(() => {
        if (pagerName) {
            const pFilter = has(pager, 'filter') ? get(pager, 'filter') : {};
            const pSort = has(pager, 'sort') ? get(pager, 'sort') : {};
            Object.keys(fields).forEach(field => {
                const fieldValue = fields[field];
                if (
                    has(fieldValue, 'filter') &&
                    has(fieldValue, 'initialValue') &&
                    !has(pFilter, field)
                ) {
                    pFilter[field] = fieldValue.initialValue;
                }
            });
            onLoadMore({
                page: 1,
                pageName: pagerName,
                perPage: perPage,
                filter: pFilter,
                sort: pSort,
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

    const pageCount =
        count % (perPage ?? 1) === 0
            ? Math.trunc(count / (perPage ?? 1))
            : Math.trunc(count / (perPage ?? 1)) + 1;
    const nextActive = currPage < pageCount;

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
                        ?.filter(f => fields[f]?.filter)
                        .map(f => delete pFilter[f]);
                } else {
                    if (value) {
                        pFilter[name] = value;
                    } else {
                        delete pFilter[name];
                    }
                }
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
        [fields, onLoadMore, pager, pagerName, perPage],
    );

    return (
        <View style={styles.container}>
            <>
                {checkEntities && <DSpinner checkEntities={checkEntities} />}
                <View
                    onLayout={event => {
                        const {height} = event.nativeEvent.layout;
                    }}>
                    <FilterBar
                        pager={pager}
                        fields={fields}
                        onFilterChanged={
                            onFilterChanged
                                ? handleOldFilterEvent
                                : handleFilterEvent
                        }
                        style={filterContainerStyle}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        marginTop: 16,
                    }}>
                    {bufItems?.length > 0 ? (
                        <>
                            <FlatList
                                style={bodyContainerStyle}
                                data={bufItems}
                                renderItem={({item: data, index}) =>
                                    item && item(data, index)
                                }
                                numColumns={numColumns}
                                columnWrapperStyle={
                                    numColumns === 1 ? undefined : {gap: 7}
                                }
                                ItemSeparatorComponent={() =>
                                    ItemSeparatorComponent && (
                                        <View
                                            style={{
                                                backgroundColor: '#CBD4DB',
                                                width: '100%',
                                                height: 1,
                                            }}
                                        />
                                    )
                                }
                                keyExtractor={(item, index) => index.toString()}
                                onEndReachedThreshold={0.1}
                                onEndReached={() => {
                                    if (nextActive) {
                                        handleLoadMore(currPage + 1, 'next');
                                    }
                                }}
                            />
                        </>
                    ) : (
                        <Text style={styles.noEntriesText}>
                            {t(noDataText)}
                        </Text>
                    )}
                </View>
            </>
        </View>
    );
}

export default AdaptiveContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    noEntriesContainer: {
        width: '100%',
        marginTop: 16,
    },
    noEntriesText: {
        fontSize: 16,
        fontWeight: '400',
        color: palette.midGray,
    },
});
