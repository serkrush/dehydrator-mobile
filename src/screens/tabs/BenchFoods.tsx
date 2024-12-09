/* eslint-disable react/no-unstable-nested-components */
import React, {useContext, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import AdaptiveContainer from 'src/components/AdaptiveTable/Container';
import Layout from 'src/components/layouts/Layout';
import RecipeItem from 'src/components/recipes/RecipeItem';
import {AppState, FilterType, IFieldList, InputIcon} from 'src/constants';
import ContainerContext from 'src/ContainerContext';
import {FavoriteType} from 'src/entities/EntityTypes';
import {useActions} from 'src/hooks/useEntity';
import {fonts} from 'src/theme';
import colors from 'src/theme/colors';
import palette from 'src/theme/colors/palette';
import BookmarkSvg from '../../../assets/svg/BookmarkSvg';

const machinesScreenColors = {
    backgroundColor: colors.mainBackground,
    sectionText: colors.header.text.main,
    groupText: colors.header.text.main,
};

export default function BenchFoodsScreen() {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const onBackPress = () => {
        navigator.navigate('Main');
    };

    const {getBenchFoods} = useActions('RecipeEntity');
    const {getCategories} = useActions('CategoryEntity');
    useEffect(() => {
        getCategories();
    }, []);

    const categories = useSelector((state: AppState) => state.categories);
    const itemsCategories = useMemo(() => {
        return (
            (categories &&
                Object.values(categories).filter(
                    category => category.machine_id === null,
                )) ||
            []
        );
    }, [categories]);
    const categoriesLevels = useMemo(() => {
        if (!itemsCategories || itemsCategories?.length === 0) {
            return [];
        }
        const getChildCategories = (parentId: string) => {
            return itemsCategories.filter(c => c.parent_id === parentId);
        };

        const catLvl1 = itemsCategories.filter(c => !c.parent_id);

        const catLvl1And2And3 = catLvl1
            .map(c1 => {
                const catLvl2 = getChildCategories(c1.id);
                const catLvl2And3 = catLvl2
                    .map(c2 => {
                        const catLvl3 = getChildCategories(c2.id);
                        if (catLvl3.length > 0) {
                            return {
                                title: `${c1.category_name} / ${c2.category_name}`,
                                data: catLvl3.map(c => ({
                                    label: c.category_name,
                                    value: c.id,
                                })),
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);
                return catLvl2And3;
            })
            .flat();

        return catLvl1And2And3;
    }, [itemsCategories]);

    const fields: IFieldList = {
        recipe_name: {
            label: '',
            type: FilterType.Text,
            filter: {
                showLabel: true,
                icon: InputIcon.SEARCH,
                group: 'g1',
                className: 'text-gray-900 ',
                styleFilterContainer: {
                    flexDirection: 'row',
                },
            },
        },
        categories: {
            label: 'categories',
            type: FilterType.Multiselect,
            filter: {
                showLabel: true,
                options: categoriesLevels,
                group: 'g2',
                styleFilterContainer: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '100%',
                },
                styleFilterItem: {
                    width: '100%',
                },
            },
        },
        favorite_type: {
            type: FilterType.Switch,
            label: 'bookmarked',
            labelIcon: (
                <BookmarkSvg
                    stroke={palette.orange}
                    fill={palette.orange}
                    width={12}
                    height={15}
                />
            ),
            filter: {
                showLabel: true,
                styleFilterContainer: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                },
                group: 'g3',
            },
        },
    };
    const recipeFavorites = useSelector((state: AppState) => {
        return state.recipeFavorites;
    });
    return (
        <Layout
            onBackPress={onBackPress}
            titleText={t('bf cookbook').toUpperCase()}
            cleanSocketSubscriptions={false}>
            <AdaptiveContainer
                fields={fields}
                pagerName="benchfoods"
                perPage={10}
                onLoadMore={data => {
                    const updatedData = {
                        ...data,
                        filter: {
                            ...data.filter,
                            favorite_type:
                                data?.filter?.favorite_type === true
                                    ? FavoriteType.Bookmarked
                                    : data?.filter?.favorite_type,
                        },
                    };
                    getBenchFoods(updatedData);
                }}
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            backgroundColor: '#CBD4DB',
                            width: '100%',
                            height: 1,
                        }}
                    />
                )}
                filterContainerStyle={{
                    borderRadius: 12,
                    backgroundColor: 'white',
                    paddingHorizontal: 16,
                    paddingVertical: 20,

                    shadowColor: 'rgba(16, 24, 40, 1)',
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                }}
                bodyContainerStyle={{
                    borderRadius: 12,
                    backgroundColor: 'white',
                    marginBottom: 16,
                    paddingHorizontal: 16,

                    shadowColor: 'rgba(16, 24, 40, 1)',
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                }}
                item={(data: any, index: number) => {
                    const isFavorite = data?.id
                        ? !!recipeFavorites[data?.id]
                        : false;
                    return (
                        <RecipeItem
                            recipe={data}
                            icon={
                                <BookmarkSvg
                                    stroke={palette.orange}
                                    fill={
                                        isFavorite
                                            ? palette.orange
                                            : 'transparent'
                                    }
                                    width={12}
                                    height={15}
                                />
                            }
                        />
                    );
                }}
                noDataText={'no-cookbooks'}
                checkEntities={[
                    'RecipeEntity',
                    'CategoryEntity',
                    'RecipeFavoritesEntity',
                ]}
            />
        </Layout>
        //     </View>
        // </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    sectionText: {
        ...fonts.h2,
        color: machinesScreenColors.sectionText,
    },
});
