import {PAGE_SET_FILTER, PAGE_FETCHING, PAGE_CLEAR} from '../actions';

const initialPagerState: any = {};

export function pagination(state = initialPagerState, action: any) {
    // get result for the paginator, disable fetching
    if (action?.payload?.data?.result && action.payload.pager) {
        const {pager} = action.payload;
        const {result} = action.payload.data;
        if (pager.pageName) {
            const {pageName} = pager;

            const pagination = state[pageName] ? state[pageName] : {};
            const pages = pagination.pages ? pagination.pages : {};
            const pagesNew = pagination.pagesNew ? pagination.pagesNew : {};
            let item = null;
            let itemsNew = [];
            if (result?.length === 0) {
                pager.page = pages.size;
            } else {
                item = {
                    ids: result,
                };

                itemsNew = result;
            }

            return {
                ...state,
                [pageName]: {
                    ...state[pageName],
                    ...pagination,
                    entityName: pager.entityName,
                    pageName,
                    currentPage: pager.page,
                    count: pager.count,
                    perPage: pager.perPage,
                    pages: {
                        ...pages,
                        [pager.page]: item,
                    },
                    pagesNew: {
                        ...pagesNew,
                        // ids: pagesNew.ids ? pagesNew.ids.push([]) : [Math.floor(Math.random() * 10).toString(), Math.floor(Math.random() * 10).toString(), Math.floor(Math.random() * 10).toString()]
                        ids: [
                            ...new Set([...(pagesNew.ids || []), ...itemsNew]),
                        ],
                    },
                },
            };
        }
    }
    // prepare item for the paginator, enable fetching
    const {type} = action;
    switch (type) {
        case PAGE_FETCHING: {
            const {pageName, page, isFetching} = action;
            const pagination = state[pageName] ? state[pageName] : {};
            let {currentPage} = pagination;

            if (pagination.pages && pagination.pages[page]) {
                // to avoid empty page before loading new page data

                currentPage = page;
            }
            const newState = {
                ...state,
                [pageName]: {
                    ...state[pageName],
                    ...pagination,
                    currentPage,
                    fetching: isFetching,
                },
            };
            return newState;
        }
        case PAGE_SET_FILTER: {
            const {pageName, filter, sort} = action;
            const pagination = state[pageName] ? state[pageName] : {};
            const newState = {
                ...state,
                [pageName]: {
                    ...state[pageName],
                    ...pagination,
                    filter: filter,
                    sort: sort,
                },
            };
            return newState;
        }

        case PAGE_CLEAR: {
            const {pageName} = action;
            const newState = {
                ...state,
                [pageName]: {
                    ...state[pageName],
                    pages: {},
                    pagesNew: {},
                },
            };
            return newState;
        }
    }

    return state;
}
