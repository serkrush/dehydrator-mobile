import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import DSvgButton from 'src/components/buttons/DSvgButton';
import Layout from 'src/components/layouts/Layout';
import RecipeDetails from 'src/components/recipes/RecipeDetails';
import {AppState} from 'src/constants';
import {FavoriteType} from 'src/entities/EntityTypes';
import {useActions} from 'src/hooks/useEntity';
import colors from 'src/theme/colors';
import palette from 'src/theme/colors/palette';
import EditSvg from '../../../assets/svg/EditSvg';
import StarSvg from '../../../assets/svg/StarSvg';
import FaShareSvg from '../../../assets/svg/ShareSvg';
import BaseModal from 'src/components/modals/BaseModal';
import ShareRecipeModal from 'src/components/modals/ShareRecipeModal';

export default function MyRecipesDetailsScreen({route}) {
    const di = useContext(ContainerContext);
    const navigation = useNavigation();
    const navigator = di.resolve('navigator');
    const {id} = route.params?.recipe;
    const {getRecipeUserById} = useActions('RecipeEntity');
    const {getCategories} = useActions('CategoryEntity');
    const {getRelatedUsers} = useActions('UserEntity');
    const {saveRecipeFavorites, deleteRecipeFavorites} = useActions(
        'RecipeFavoritesEntity',
    );

    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        if (id) {
            getRecipeUserById({id: id as string});
        }
        getCategories();
    }, [id]);
    const onBackPress = () => {
        navigation.goBack();
    };
    const identity = useSelector((state: AppState) => state.auth.identity);
    const recipe = useSelector((state: AppState) => {
        return id ? state.recipes[id] : undefined;
    });

    const isFavorite = useSelector((state: AppState) => {
        return recipe?.id ? !!state.recipeFavorites[recipe?.id] : false;
    });

    const handleSaveRecipeFavorites = () => {
        saveRecipeFavorites({
            id: recipe.id,
            user_id: identity.userId,
            recipe_id: id,
            favorite_type: FavoriteType.Starred,
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

    useEffect(() => {
        getRelatedUsers({data: {force: true}});
    }, []);

    const allUsers = useSelector((state: AppState) => {
        return state.users;
    });

    const relatedUsers = useMemo(() => {
        return Object.values(allUsers).filter(
            value =>
                value.parentsId != undefined &&
                value.parentsId?.findIndex(id => id == identity.userId) != -1,
        );
    }, [allUsers, identity]);

    const categories = useSelector((state: AppState) => state.categories);
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
    const onAddRecipePress = () => {
        navigator.navigate('AddRecipeScreen', {recipe: recipe});
    };
    const onShareRecipePress = () => {
        setModalVisible(true);
    };

    const handleClose = () => {
        setModalVisible(false);
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
                <View style={{flexDirection: 'row'}}>
                    <DSvgButton
                        svg={
                            <FaShareSvg
                                fill={palette.blueDark}
                                width={20}
                                height={20}
                            />
                        }
                        additionalStyle={{
                            backgroundColor: palette.white,
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            borderColor: palette.blueLight,
                            borderWidth: 1,
                        }}
                        onPress={onShareRecipePress}
                    />
                    <DSvgButton
                        svg={
                            <EditSvg
                                stroke={palette.blueDark}
                                width={20}
                                height={20}
                            />
                        }
                        additionalStyle={{
                            backgroundColor: palette.white,
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            borderColor: palette.blueLight,
                            borderWidth: 1,
                            marginLeft: 8,
                        }}
                        onPress={onAddRecipePress}
                    />
                    <DSvgButton
                        svg={
                            <StarSvg
                                stroke={palette.orange}
                                fill={
                                    isFavorite ? palette.orange : 'transparent'
                                }
                                width={22}
                                height={21}
                            />
                        }
                        additionalStyle={{
                            backgroundColor:
                                colors.imageButton.orange.background,
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            borderColor: palette.orangeLight,
                            borderWidth: 1,
                            marginLeft: 8,
                        }}
                        onPress={changeFavorite}
                    />
                </View>
            }>
            <BaseModal
                visible={modalVisible}
                setVisible={setModalVisible}
                handleClose={handleClose}>
                <ShareRecipeModal relatedUsers={relatedUsers} recipe={recipe} />
            </BaseModal>
            <RecipeDetails
                recipe={recipe}
                categoriesLevels={categoriesOptions}
            />
        </Layout>
    );
}
const styles = StyleSheet.create({});
