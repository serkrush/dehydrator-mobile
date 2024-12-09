/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import AdaptiveContainer from 'src/components/AdaptiveTable/Container';
import DImageButton from 'src/components/buttons/DImageButton';
import Layout from 'src/components/layouts/Layout';
import RecipeItem from 'src/components/recipes/RecipeItem';
import {AppState, FilterType, IFieldList, InputIcon} from 'src/constants';
import {FavoriteType} from 'src/entities/EntityTypes';
import {useActions} from 'src/hooks/useEntity';
import {fonts} from 'src/theme';
import colors from 'src/theme/colors';
import palette from 'src/theme/colors/palette';
import {images} from 'src/theme/images';
import EditSvg from '../../../assets/svg/EditSvg';
import HeartSvg from '../../../assets/svg/HeartSvg';
import StarSvg from '../../../assets/svg/StarSvg';

const machinesScreenColors = {
    backgroundColor: colors.mainBackground,
    sectionText: colors.header.text.main,
    groupText: colors.header.text.main,
};

export default function MyRecipesScreen() {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const onBackPress = () => {
        navigator.navigate('Main');
    };

    // const [modalVisible, setModalVisible] = useState(false);

    const {getRecipesUser} = useActions('RecipeEntity');
    const {getCategoriesUser} = useActions('CategoryEntity');
    useEffect(() => {
        getCategoriesUser();
    }, []);

    const navigation = useNavigation();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getRecipesUser({
                filter: {},
                force: true,
                page: 1,
                pageName: 'my-recipes',
                perPage: 10,
            });
        });

        return unsubscribe;
    }, [navigation]);

    const categories = useSelector((state: AppState) => state.categories);
    const identity = useSelector((state: AppState) => state.auth.identity);
    const itemsCategories = useMemo(() => {
        return (
            (categories &&
                Object.values(categories).filter(
                    category => category.user_id !== null,
                )) ||
            []
        );
    }, [categories]);
    const categoriesOptions = useMemo(() => {
        return itemsCategories
            .filter(item => item.user_id !== null)
            .map(item => ({
                label: item.category_name,
                value: item.id,
            }));
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
                options: categoriesOptions,
                group: 'g2',
                styleFilterContainer: {
                    flex: 1,
                    justifyContent: 'center',
                    width: '100%',
                    alignItems: 'flex-start',
                },
                styleFilterItem: {
                    width: '100%',
                },
            },
        },
        machine_id: {
            type: FilterType.Button,
            label: '',
            filter: {
                group: 'g2',
                iconSvg: (
                    <EditSvg stroke={palette.blueDark} width={20} height={20} />
                ),
                styleFilterContainer: {
                    justifyContent: 'center',
                },
                styleFilterItem: {
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                },
                customFilterEvent: () => navigator.navigate('CategoriesScreen'),
            },
        },
        favorite_type: {
            type: FilterType.Switch,
            label: 'favourite-recipes',
            labelIcon: (
                <HeartSvg fill={palette.orange} width={16} height={14} />
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

    const onAddRecipePress = () => {
        // setModalVisible(true);
        navigator.navigate('AddRecipeScreen');
    };
    const recipeFavorites = useSelector((state: AppState) => {
        return state.recipeFavorites;
    });
    return (
        <Layout
            onBackPress={onBackPress}
            titleText={t('my recipes')}
            buttonBlock={
                <DImageButton
                    source={images.add}
                    width={24}
                    height={24}
                    tintColor={colors.imageButton.primary.content}
                    additionalStyle={{
                        backgroundColor: colors.imageButton.primary.background,
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                    }}
                    onPress={onAddRecipePress}
                />
            }>
            {/* <BaseModal visible={modalVisible} setVisible={setModalVisible}>
                <CategoriesAddRecipeModal setVisible={setModalVisible} />
            </BaseModal> */}
            <AdaptiveContainer
                fields={fields}
                pagerName="my-recipes"
                perPage={10}
                noDataText={'no-recipes'}
                onLoadMore={data => {
                    const updatedData = {
                        ...data,
                        filter: {
                            ...data.filter,
                            favorite_type:
                                data?.filter?.favorite_type === true
                                    ? FavoriteType.Starred
                                    : data?.filter?.favorite_type,
                            // user_id: identity?.userId,
                        },
                    };
                    getRecipesUser(updatedData);
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
                            screenNavigate={'MyRecipesDetailsScreen'}
                            icon={
                                <StarSvg
                                    stroke={palette.orange}
                                    fill={
                                        isFavorite
                                            ? palette.orange
                                            : 'transparent'
                                    }
                                    width={22}
                                    height={21}
                                />
                            }
                        />
                    );
                }}
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
