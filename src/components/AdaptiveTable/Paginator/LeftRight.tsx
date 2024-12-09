import ArrowRightSvg from '../../../../assets/svg/ArrowRightSvg';
import ArrowLeftSvg from '../../../../assets/svg/ArrowLeftSvg';
import React, {useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import ContainerContext from 'src/ContainerContext';
import DSvgButton from 'src/components/buttons/DSvgButton';
import palette from 'src/theme/colors/palette';

export default function LeftRight({count, page, perPage, onLoadMore}) {
    const di = useContext(ContainerContext);
    const t = di.resolve('t');
    const start = (page - 1) * perPage;

    const pageCount =
        count % (perPage ?? 1) === 0
            ? Math.trunc(count / (perPage ?? 1))
            : Math.trunc(count / (perPage ?? 1)) + 1;

    const previousActive = page > 1;
    const nextActive = page < pageCount;

    const onPrevious = () => onLoadMore(page - 1, 'prev');
    const onNext = () => onLoadMore(page + 1, 'next');

    const disableStyle = {backgroundColor: 'white'};
    const activeStyle = {backgroundColor: '#FF6F00'}; // Use a suitable color
    const nextStyle = nextActive ? activeStyle : disableStyle;
    const prevStyle = previousActive ? activeStyle : disableStyle;

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <DSvgButton
                    svg={
                        <ArrowLeftSvg
                            stroke={previousActive ? palette.white : palette.orange}
                            width={6}
                            height={12}
                        />
                    }
                    additionalStyle={[styles.button, prevStyle]}
                    onPress={onPrevious}
                />
                <Text style={styles.text}>{t('page-previous')}</Text>
            </View>
            <View style={styles.pageInfo}>
                <Text style={styles.infoText}>
                    <Text style={styles.infoTextBold}>{start + 1}</Text>
                    {'-'}
                    <Text style={styles.infoTextBold}>
                        {start + perPage}
                    </Text>{' '}
                    {t('page-of')}{' '}
                    <Text style={styles.infoTextMedium}>{count}</Text>
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <Text style={styles.text}>{t('page-next')}</Text>
                <DSvgButton
                    svg={
                        <ArrowRightSvg
                            stroke={nextActive ? palette.white : palette.orange}
                            width={6}
                            height={12}
                        />
                    }
                    additionalStyle={[styles.button, nextStyle]}
                    onPress={onNext}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    text: {
        color: '#FF6F00',
        fontSize: 12,
    },
    pageInfo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 12,
        color: '#333',
    },
    infoTextBold: {
        fontWeight: 'bold',
    },
    infoTextMedium: {
        fontWeight: '500',
    },
});

// import { useContext } from 'react';
// import ContainerContext from 'src/ContainerContext';
// import { FaChevronLeft, FaChevronRight } from 'src/components/FaIcons/icons';

// export default function LeftRight({ count, page, perPage, onLoadMore }) {
//     const di = useContext(ContainerContext);
//     const t = di.resolve('t');
//     const start = (page - 1) * perPage;

//     const pageCount =
//         count % (perPage ?? 1) == 0
//             ? Math.trunc(count / (perPage ?? 1))
//             : Math.trunc(count / (perPage ?? 1)) + 1;

//     const previousActive = page > 1;
//     const nextActive = page < pageCount;

//     const onPrevious = () => onLoadMore(page - 1, 'prev');
//     const onNext = () => onLoadMore(page + 1, 'next');

//     const disableStyle = 'bg-white ';
//     const activeStyle = '';
//     const nextClassName = nextActive ? activeStyle : disableStyle;
//     const prevClassName = previousActive ? activeStyle : disableStyle;
//     return (
//         <nav
//             className="flex items-center justify-between m-2"
//             aria-label="Pagination"
//         >
//             <div className="flex flex-1 justify-between">
//                 <div className="flex items-center">
//                     <button
//                         disabled={!previousActive}
//                         onClick={onPrevious}
//                         className={
//                             'rounded-full flex justify-center items-center w-[24px] h-[24px] bg-borange-700 mr-2.5 ' +
//                             prevClassName
//                         }
//                     >
//                         <FaChevronLeft
//                             size="13px"
//                             className="text-borange-800"
//                         />
//                     </button>
//                     <p className="text-borange-800 text-xs">
//                         {t('page-previous')}
//                     </p>
//                 </div>
//                 <div className="hidden sm:block text-xs">
//                     <p className="text-sm text-gray-700">
//                         {/* {t("page-showing")}{" "} */}
//                         <span className="font-semibold">
//                             <span>{start + 1}</span>
//                             {'-'}
//                             <span>{start + perPage}</span>{' '}
//                         </span>
//                         {t('page-of')}{' '}
//                         <span className="font-medium">{count}</span>
//                     </p>
//                 </div>
//                 <div className="flex items-center">
//                     <p className="text-borange-800 text-xs">{t('page-next')}</p>
//                     <button
//                         disabled={!nextActive}
//                         onClick={onNext}
//                         className={
//                             'rounded-full flex justify-center items-center w-[24px] h-[24px] bg-borange-700 ml-2.5 ' +
//                             nextClassName
//                         }
//                     >
//                         <FaChevronRight
//                             size="13px"
//                             className="text-borange-800"
//                         />
//                     </button>
//                 </div>
//             </div>
//         </nav>
//     );
// }
