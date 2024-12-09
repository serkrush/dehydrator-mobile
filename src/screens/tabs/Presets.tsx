import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import AdaptiveContainer from 'src/components/AdaptiveTable/Container';
import Layout from 'src/components/layouts/Layout';
import PresetItem from 'src/components/recipes/PresetItem';
import {
    AppState,
    DEFAULT_CONTAINER_COLUMNS,
    DEFAULT_CONTAINER_PER_PAGE,
    FilterType,
    IFieldList,
    InputIcon,
} from 'src/constants';
import ContainerContext from 'src/ContainerContext';
import {FavoriteType} from 'src/entities/EntityTypes';
import {useActions} from 'src/hooks/useEntity';
import {fonts} from 'src/theme';
import colors from 'src/theme/colors';
import palette from 'src/theme/colors/palette';
import HeartSvg from '../../../assets/svg/HeartSvg';
const machinesScreenColors = {
    backgroundColor: colors.mainBackground,
    sectionText: colors.header.text.main,
    groupText: colors.header.text.main,
};

export default function PresetsScreen() {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const onBackPress = () => {
        navigator.navigate('Main');
    };

    const {getPresets} = useActions('RecipeEntity');
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
            label: 'favourite-presets',
            labelIcon: (
                <HeartSvg
                    fill={palette.orange}
                    stroke={palette.orange}
                    width={16}
                    height={14}
                />
            ),
            filter: {
                showLabel: true,
                group: 'g3',
                styleFilterContainer: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                },
            },
        },
    };

    const recipeFavorites = useSelector((state: AppState) => {
        return state.recipeFavorites;
    });

    const item = useCallback(
        (data: any) => {
            const isFavorite = data?.id ? !!recipeFavorites[data?.id] : false;
            return (
                <PresetItem
                    recipe={data}
                    // isFavorite={isFavorite}
                    icon={
                        <HeartSvg
                            fill={
                                isFavorite
                                    ? palette.orange
                                    : 'rgba(255, 255, 255, 0.5)'
                            }
                            stroke={isFavorite ? palette.orange : palette.white}
                            width={17}
                            height={15}
                        />
                    }
                    screenNavigate={'PresetDetailsScreen'}
                />
            );
        },
        [recipeFavorites],
    );

    const onLoadMore = useCallback(
        data => {
            const updatedData = {
                ...data,
                filter: {
                    ...data.filter,
                    favorite_type:
                        data?.filter?.favorite_type === true
                            ? FavoriteType.Bookmarked
                            : data?.filter?.favorite_type,
                    // user_id: identity?.userId,
                },
            };
            getPresets(updatedData);
        },
        [getPresets],
    );

    return (
        <Layout
            onBackPress={onBackPress}
            titleText={t('presets')}
            cleanSocketSubscriptions={false}>
            <AdaptiveContainer
                fields={fields}
                pagerName="presets"
                perPage={DEFAULT_CONTAINER_PER_PAGE}
                onLoadMore={onLoadMore}
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
                numColumns={DEFAULT_CONTAINER_COLUMNS}
                item={item}
                noDataText={'no-presets'}
                checkEntities={[
                    'RecipeEntity',
                    'CategoryEntity',
                    'RecipeFavoritesEntity',
                ]}
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
    sectionText: {
        ...fonts.h2,
        color: machinesScreenColors.sectionText,
    },
});
