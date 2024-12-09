import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface IPaginatorProps {
    count: number;
    perPage: number;
    currPage: number;
    onLoadMore: (page: number) => void;
}

const Paginator = ({count, perPage, currPage, onLoadMore}: IPaginatorProps) => {
    const countPages = Math.ceil(count / perPage) || 0;

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= countPages) {
            onLoadMore(page);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.pagination}>
                <TouchableOpacity
                    onPress={() => handlePageChange(1)}
                    disabled={currPage === 1}
                    style={styles.pageButton}>
                    <Text style={styles.pageButtonText}>{'<<'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handlePageChange(currPage - 1)}
                    disabled={currPage === 1}
                    style={styles.pageButton}>
                    <Text style={styles.pageButtonText}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.pageText}>
                    {`${currPage} / ${countPages}`}
                </Text>
                <TouchableOpacity
                    onPress={() => handlePageChange(currPage + 1)}
                    disabled={currPage === countPages}
                    style={styles.pageButton}>
                    <Text style={styles.pageButtonText}>{'>'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handlePageChange(countPages)}
                    disabled={currPage === countPages}
                    style={styles.pageButton}>
                    <Text style={styles.pageButtonText}>{'>>'}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.infoText}>
                Showing {Math.min(perPage * (currPage - 1) + 1, count)} -{' '}
                {Math.min(perPage * currPage, count)} of {count}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    pageButton: {
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ddd',
    },
    pageButtonText: {
        fontSize: 18,
    },
    pageText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#555',
    },
});

export default Paginator;

// import React from 'react';
// import Pagination from 'react-js-pagination';
// // import {useTranslation} from 'react-i18next';
// import {
//     FaAngleDoubleLeft,
//     FaAngleDoubleRight,
//     FaAngleLeft,
//     FaAngleRight,
// } from 'src/components/FaIcons/icons';

// interface IPaginatorProps {
//     count: number;
//     perPage: number;
//     currPage: number;

//     hoverable?: boolean;
//     getUrlPage: (i: number) => string;
//     onLoadMore: (page: any) => any;
// }

// export default function Paginator(props: IPaginatorProps) {
//     const { count, perPage, currPage, hoverable, getUrlPage, onLoadMore } =
//         props;
//     // const { t } = useTranslation();

//     const countPages = Math.ceil(count / perPage) || 0;
//     const offset = perPage * (currPage - 1) || 1;
//     const maxOnPage = currPage * perPage;
//     const limit = maxOnPage > count ? count : maxOnPage;

//     return (
//         <div className='flex flex-col md:flex-row items-center md:justify-between pagination space-y-2'>
//             {/* @ts-ignore */}
//             <Pagination
//                 // @ts-ignore
//                 firstPageText={<FaAngleDoubleLeft />}
//                 // @ts-ignore
//                 lastPageText={<FaAngleDoubleRight />}
//                 // @ts-ignore
//                 prevPageText={<FaAngleLeft />}
//                 // @ts-ignore
//                 nextPageText={<FaAngleRight />}
//                 activePage={currPage}
//                 itemsCountPerPage={perPage}
//                 totalItemsCount={count}
//                 getPageUrl={getUrlPage}
//                 onChange={onLoadMore}
//                 innerClass='pageNav'
//                 itemClass={'pageItem'}
//                 activeClass='pageItemActive'
//                 disabledClass='pageItemDisabled'
//                 itemClassFirst='pageItemNav'
//                 itemClassPrev='pageItemNav'
//                 itemClassNext='pageItemNav'
//                 itemClassLast='pageItemNav'
//             />

//             <p className='text-sm font-normal'>
//                 {/* {t('showing-of', { offset, limit, count })} */}
//             </p>
//         </div>
//     );
// }
