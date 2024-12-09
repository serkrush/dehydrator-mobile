import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
} from 'src/components/FaIcons/icons'; // Ensure these icons are compatible or use an alternative for React Native

interface ILightPaginatorProps {
    currPage: number;
    perPage: number;
    count: number;
    onLoadMore: (page: number) => void;
    hoverable?: boolean;
}

export default function LightPaginator(props: ILightPaginatorProps) {
    const {currPage, perPage, count, onLoadMore, hoverable} = props;

    const pageCount = Math.ceil(count / perPage);

    const handlePrevious = () => {
        if (currPage > 1) {
            onLoadMore(currPage - 1);
        }
    };

    const handleNext = () => {
        if (currPage < pageCount) {
            onLoadMore(currPage + 1);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handlePrevious}
                disabled={currPage <= 1}
                style={[styles.button, currPage <= 1 && styles.disabled]}>
                <FaAngleDoubleLeft size={24} />
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
                {currPage} / {pageCount}
            </Text>

            <TouchableOpacity
                onPress={handleNext}
                disabled={currPage >= pageCount}
                style={[
                    styles.button,
                    currPage >= pageCount && styles.disabled,
                ]}>
                <FaAngleDoubleRight size={24} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    button: {
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'orange', // Replace with your theme color
    },
    disabled: {
        backgroundColor: 'lightgray',
    },
    pageInfo: {
        fontSize: 16,
        color: 'black', // Replace with your theme color
    },
});

// import React from 'react';
// import Pagination from 'react-js-pagination';
// import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'src/components/FaIcons/icons';

// interface ILightPaginatorProps {
//     currPage: number;
//     perPage: number;
//     count: number;
//     getUrlPage: (i: number) => string;
//     onLoadMore: (page: any) => any;
//     hoverable?: boolean;
// }
// interface ILightPaginatorProps {
//     count: number;
//     perPage: number;
//     currPage: number;

//     hoverable?: boolean;
//     getUrlPage: (i: number) => string;
//     onLoadMore: (page: any) => any;
// }

// export default function LightPaginator (props: ILightPaginatorProps) {
//     const {currPage, perPage, count, onLoadMore, getUrlPage, hoverable } = props;
//     return (<div className='flex flex-row justify-center items-center pagination space-y-2'>
//         {/* @ts-ignore */}
//         <Pagination
//             // @ts-ignore
//             firstPageText={<FaAngleDoubleLeft />}
//             // @ts-ignore
//             lastPageText={<FaAngleDoubleRight  />}
//             hideNavigation={true}
//             activePage={currPage}
//             itemsCountPerPage={perPage}
//             totalItemsCount={count}
//             getPageUrl={getUrlPage}
//             onChange={onLoadMore}

//             innerClass='pageNav'
//             itemClass={'pageItem'}

//             activeClass='pageItemActive'
//             disabledClass='pageItemDisabled'

//             itemClassFirst='pageItemNav'
//             itemClassPrev='pageItemNav'

//             itemClassNext='pageItemNav'
//             itemClassLast='pageItemNav'
//         />
//     </div>);
// }
