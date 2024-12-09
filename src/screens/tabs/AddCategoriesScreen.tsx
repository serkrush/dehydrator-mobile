import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    ScrollView,
    FlatList,
    Alert,
} from 'react-native';
import AddImage from 'src/components/AddImage';
import {colors} from 'src/theme';
import {useTranslation} from 'react-i18next';
import ContainerContext from 'src/ContainerContext';
import {useFormik} from 'formik';
import {ICategoryEntity, RecipeProcessType} from 'src/entities/EntityTypes';
import Input from 'src/Form/Input';
import Layout from 'src/components/layouts/Layout';
import {useNavigation} from '@react-navigation/native';
import ButtonForm from 'src/Form/ButtonForm';
import palette from 'src/theme/colors/palette';
import {useActions} from 'src/hooks/useEntity';
import {useSelector} from 'react-redux';
import {AppState} from 'src/constants';
import DSvgButton from 'src/components/buttons/DSvgButton';
import TrashSvg from '../../../assets/svg/TrashSvg';
import ConfirmationDialog from 'src/components/modals/ConfirmationDialog';
import ImageStore from 'src/components/ImageStore';
import StarSvg from '../../../assets/svg/StarSvg';
import {DButtonSubmitting} from 'src/components/buttons/DButtonSubmitting';
import {ButtonStyle} from 'src/components/buttons/DUpdatedButton';
import * as actionTypes from '../../store/actions';

const mainScreenColors = {
    card: colors.card.base,
};

export default function AddCategoriesScreen({route}) {
    const {t} = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleCategory, setModalVisibleCategory] = useState(false);
    const {saveCategoryUser, deleteCategoriesUser} =
        useActions('CategoryEntity');
    const di = useContext(ContainerContext);
    const navigation = useNavigation();

    const onBackPress = () => {
        navigation.goBack();
    };

    const initialCategoryValues = route?.params?.category || {
        category_name: '',
        recipe_process: RecipeProcessType.Recipe,
    };

    const formik = useFormik({
        initialValues: initialCategoryValues,
        validate: (values: ICategoryEntity) => {
            const errors: Partial<ICategoryEntity> = {};
            if (!values.category_name) {
                errors.category_name = t('required');
            }

            return errors;
        },
        onSubmit: values => {
            saveCategoryUser({
                ...values,
                formikRecipeValues: route.params?.formikRecipeValues,
            });
        },
    });

    const recipes = useSelector((state: AppState) => state.recipes);
    const itemsRecipes = useMemo(() => {
        return (
            (formik?.values?.id &&
                recipes &&
                Object.values(recipes).filter(recipe =>
                    recipe.categories?.includes(formik.values.id),
                )) ||
            []
        );
    }, [recipes]);

    const recipeFavorites = useSelector(
        (state: AppState) => state.recipeFavorites,
    );
    const itemsRecipeFavorites = useMemo(() => {
        return (recipeFavorites && Object.values(recipeFavorites)) || [];
    }, [recipeFavorites]);

    useEffect(() => {
        if (route?.params?.category) {
            formik.setValues(route.params.category);
        }
    }, [route?.params?.recipe]);

    return (
        <Layout
            onBackPress={onBackPress}
            titleText={
                formik.values.id ? t('edit-category') : t('create-new-category')
            }
            buttonBlock={
                formik.values.id && (
                    <DSvgButton
                        svg={
                            <TrashSvg
                                stroke={colors.imageButton.destructive.content}
                                width={20}
                                height={22}
                            />
                        }
                        additionalStyle={{
                            backgroundColor:
                                colors.imageButton.destructive.background,
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            borderColor: colors.imageButton.destructive.border,
                            borderWidth: 1,
                        }}
                        onPress={() => {
                            if (itemsRecipes?.length > 0) {
                                Alert.alert(
                                    t('default-error-title'),
                                    t('error-category-has-recipe'),
                                );
                            } else {
                                setModalVisibleCategory(true);
                            }
                        }}
                    />
                )
            }>
            <ConfirmationDialog
                modalVisible={modalVisibleCategory}
                setModalVisible={setModalVisibleCategory}
                title={t('delete-category')}
                noButton={t('cancel')}
                yesButton={t('yes')}
                onOkAction={() => {
                    deleteCategoriesUser(formik.values);
                }}
            />
            <ConfirmationDialog
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={'test'}
                noButton={'noButton'}
                yesButton={'yesButton'}
                onOkAction={() => console.log('ok')}
            />
            <ScrollView>
                <View style={styles.container}>
                    <View
                        style={{
                            backgroundColor: mainScreenColors.card.background,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: palette.blueLight,
                            paddingHorizontal: 16,
                            paddingVertical: 20,

                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.25,
                            shadowRadius: 1,
                            elevation: 2,
                        }}>
                        <AddImage
                            handleSelectImage={data => {
                                formik.setFieldValue(
                                    `media_resource_buffer`,
                                    data,
                                );
                            }}
                            id={formik.values.id}
                            folder={'categories'}
                            value={formik.values.media_resource}
                        />
                        <View style={{marginTop: 24}}>
                            <Input
                                name="category_name"
                                value={formik.values.category_name}
                                onChange={formik.handleChange('category_name')}
                                required={true}
                                error={formik.errors.category_name as string}
                                label={t('category-name')}
                            />
                        </View>
                        <FlatList
                            data={itemsRecipes}
                            style={{paddingLeft: 5, marginTop: 24}}
                            renderItem={({item: recipe}) => {
                                const isFavorite = itemsRecipeFavorites.some(
                                    favorite =>
                                        favorite.recipe_id === recipe.id,
                                );
                                return (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}>
                                        <View
                                            style={{width: '19%', height: 48}}>
                                            <ImageStore
                                                folder={`recipes/${recipe?.id}`}
                                                name={
                                                    recipe.media_resources
                                                        ? recipe
                                                              .media_resources[0]
                                                        : null
                                                }
                                            />
                                        </View>

                                        <Text style={{flex: 1, marginLeft: 10}}>
                                            {recipe?.recipe_name}
                                        </Text>

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
                                        <DSvgButton
                                            svg={
                                                <TrashSvg
                                                    stroke={
                                                        colors.imageButton
                                                            .destructive.content
                                                    }
                                                    width={20}
                                                    height={22}
                                                />
                                            }
                                            additionalStyle={{marginLeft: 10}}
                                            onPress={() =>
                                                setModalVisible(true)
                                            }
                                        />
                                    </View>
                                );
                            }}
                            ItemSeparatorComponent={() => (
                                <View
                                    style={{
                                        backgroundColor: palette.blueLight,
                                        width: '100%',
                                        height: 1,
                                        marginVertical: 10,
                                    }}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                    <View style={{paddingTop: 15, marginBottom: 20}}>
                        <ButtonForm
                            text={formik.values.id ? t('edit') : t('create')}
                            actionButton={formik.handleSubmit}
                        />
                        <ButtonForm
                            text={t('cancel')}
                            style={{
                                backgroundColor: palette.white,
                                borderWidth: 1,
                                borderColor: palette.blueLight,
                                marginTop: 12,
                            }}
                            styleText={{color: palette.blueDark}}
                            actionButton={onBackPress}
                        />
                    </View>
                </View>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        width: '100%',
    },
    scrollView: {
        flex: 1,
    },
});
