import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ContainerContext from 'src/ContainerContext';
import {connect, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import colors from 'src/theme/colors';
import baseStyles from 'src/styles';
import {fonts} from 'src/theme';
import {useActions} from 'src/hooks/useEntity';
import {useNavigation} from '@react-navigation/native';
import ImageStore from 'src/components/ImageStore';
import {AppState} from 'src/constants';
import {FavoriteType, IngredientActionType} from 'src/entities/EntityTypes';
import Layout from 'src/components/layouts/Layout';
import palette from 'src/theme/colors/palette';
import Input from 'src/Form/Input';
import Multiselect from 'src/Form/Multiselect';
import Accordion from 'src/components/Accordion';
import Stages from 'src/components/recipes/Stages';
import DSvgButton from 'src/components/buttons/DSvgButton';
import EditSvg from '../../../assets/svg/EditSvg';
import StarSvg from '../../../assets/svg/StarSvg';
import RecipeDetails from 'src/components/recipes/RecipeDetails';
import BookmarkSvg from '../../../assets/svg/BookmarkSvg';

const machinesScreenColors = {
    backgroundColor: colors.mainBackground,
    sectionText: colors.header.text.main,
    groupText: colors.header.text.main,
};
const mainScreenColors = {
    card: colors.card.base,
};

export default function BenchFoodsDetailsScreen({route}) {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const navigation = useNavigation();
    const navigator = di.resolve('navigator');
    const {id} = route.params?.recipe;
    const {getRecipeById} = useActions('RecipeEntity');
    const {getCategories} = useActions('CategoryEntity');
    const {saveRecipeFavorites, deleteRecipeFavorites} = useActions(
        'RecipeFavoritesEntity',
    );

    useEffect(() => {
        if (id) {
            getRecipeById({id: id as string});
        }
        getCategories();
    }, [id]);
    const onBackPress = () => {
        // navigator.navigate('Main');e
        navigation.goBack();
    };
    const identity = useSelector((state: AppState) => state.auth.identity);
    const recipe = useSelector((state: AppState) => {
        return id ? state.recipes[id] : undefined;
    });

    const {methods, ingredients} = useMemo(() => {
        const methods = recipe?.recipe_ingredients.filter(
            ingredient => ingredient.action === IngredientActionType.Method,
        );
        const ingredients = recipe?.recipe_ingredients.filter(
            ingredient => ingredient.action === IngredientActionType.Ingredient,
        );
        return {methods, ingredients};
    }, [recipe?.recipe_ingredients]);

    const isFavorite = useSelector((state: AppState) => {
        return recipe?.id ? !!state.recipeFavorites[recipe?.id] : false;
    });

    const handleSaveRecipeFavorites = () => {
        saveRecipeFavorites({
            id: recipe.id,
            user_id: identity.userId,
            recipe_id: id,
            favorite_type: FavoriteType.Bookmarked,
        });
    };
    const handleDeleteRecipeFavorites = () => {
        deleteRecipeFavorites({
            id: recipe.id,
            user_id: identity.userId,
            recipe_id: id,
            favorite_type: null,
        });
    };

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

    const onAddRecipePress = () => {
        navigator.navigate('AddRecipeScreen', {recipe: recipe});
    };
    const changeFavorite = () => {
        isFavorite
            ? handleDeleteRecipeFavorites()
            : handleSaveRecipeFavorites();
    };

    return (
        <Layout
            onBackPress={onBackPress}
            titleText={recipe?.recipe_name ?? ''}
            buttonBlock={
                <DSvgButton
                    svg={
                        <BookmarkSvg
                            stroke={palette.orange}
                            fill={isFavorite ? palette.orange : 'transparent'}
                            width={22}
                            height={21}
                        />
                    }
                    additionalStyle={{
                        backgroundColor: colors.imageButton.orange.background,
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        borderColor: palette.orangeLight,
                        borderWidth: 1,
                        marginLeft: 8,
                    }}
                    onPress={changeFavorite}
                />
            }>
            <RecipeDetails
                recipe={recipe}
                categoriesLevels={categoriesLevels}
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'red',
    },

    sectionText: {
        ...fonts.h2,
        color: machinesScreenColors.sectionText,
    },

    itemContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    imageContainer: {
        width: 55,
        height: 48,
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    description: {
        flex: 1,
        fontSize: 14,
        color: palette.blueBlack,
        flexWrap: 'wrap',
        width: '100%',
    },
});
