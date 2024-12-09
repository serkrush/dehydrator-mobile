import React, {useState, useContext, useMemo} from 'react';
import {useFormik} from 'formik';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Layout from 'src/components/layouts/Layout';
import BaseModal from 'src/components/modals/BaseModal';
import Textarea from 'src/Form/Textares';
import ContainerContext from 'src/ContainerContext';
import {
    IIngredientEntity,
    IngredientActionType,
    IRecipeEntity,
} from 'src/entities/EntityTypes';
import {colors} from 'src/theme';
import palette from 'src/theme/colors/palette';
import ButtonForm from 'src/Form/ButtonForm';
import AddImage from 'src/components/AddImage';
import DSvgButton from 'src/components/buttons/DSvgButton';
import EditSvg from '../../../assets/svg/EditSvg';
import TrashSvg from '../../../assets/svg/TrashSvg';
import ImageStore from 'src/components/ImageStore';
import PlusSvg from '../../../assets/svg/PlusSvg';

interface MethodScreenProps {
    route: any;
}

export default function MethodScreen({route}: MethodScreenProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [newIngredient, setNewIngredient] = useState(0);
    const [oldValue, setOldValue] = useState(null);
    const {t} = useTranslation();

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const onBackPress = () => {
        navigator.navigate('AddRecipeScreen', {
            recipe: formik.values,
        });
    };

    const formik = useFormik({
        initialValues: route.params?.recipe,
        validate: (values: IRecipeEntity) => {
            const errors: Partial<IRecipeEntity> = {};
            if (
                values.recipe_ingredients &&
                values.recipe_ingredients.length > 0
            ) {
                const ingridientsErrors: any[] = values.recipe_ingredients.map(
                    (ingridient, index) => {
                        const ingridientErrors: Partial<IIngredientEntity> = {};
                        if (!ingridient.description?.trim()) {
                            ingridientErrors.description = t('required');
                        }
                        return ingridientErrors;
                    },
                );
                const hasIngridientErrors = ingridientsErrors.some(
                    ingridientErrors =>
                        Object.keys(ingridientErrors).length > 0,
                );
                if (hasIngridientErrors) {
                    errors.recipe_ingredients = ingridientsErrors;
                }
            }
            return errors;
        },
        onSubmit: values => {
            setModalVisible(false);
        },
    });
    

    const ingredientsTypes = useMemo(() => {
        return formik?.values?.recipe_ingredients?.length > 0
            ? formik?.values?.recipe_ingredients
                  .map((recipe, index) => ({
                      ...recipe,
                      index,
                  }))
                  .filter(
                      recipe => recipe.action === IngredientActionType.Method,
                  )
            : [];
    }, [formik?.values?.recipe_ingredients]);

    const closeModal = () => {
        setModalVisible(false);
        if (oldValue === null) {
            formik.setFieldValue(
                `recipe_ingredients`,
                formik.values['recipe_ingredients'].filter(
                    (_, i) => i !== newIngredient,
                ),
            );
        } else {
            formik.setFieldValue(
                `recipe_ingredients[${newIngredient}]`,
                oldValue,
            );
        }
    };

    const handleEdit = index => {
        console.log('index', index)
        setModalVisible(true);
        setNewIngredient(index);
        setOldValue(formik.values.recipe_ingredients[index]);
        formik.setFieldValue(
            `recipe_ingredients[${index}].media_resource_buffer`,
            formik.values.recipe_ingredients[index].media_resource_buffer,
        );
    };

    const handleDelete = index => {
        formik.setFieldValue(
            'recipe_ingredients',
            formik.values.recipe_ingredients.filter((_, i) => i !== index),
        );
    };

    const IngredientItem = React.memo(
        ({ingredient, onEdit, onDelete}) => {
            return (
                <View style={styles.containerFlatListRow}>
                    <View style={styles.imageContainer}>
                        {ingredient.media_resource_buffer ? (
                            <Image
                                source={{
                                    uri: `data:image/jpeg;base64,${ingredient.media_resource_buffer}`,
                                }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        ) : (
                            <ImageStore
                                folder={`recipes/${formik.values.id}`}
                                name={ingredient.media_resource ?? null}
                            />
                        )}
                    </View>
                    <Text style={styles.descriptionText}>
                        {ingredient.description}
                    </Text>
                    <DSvgButton
                        svg={
                            <EditSvg
                                stroke={palette.blueDark}
                                width={20}
                                height={20}
                            />
                        }
                        onPress={() => onEdit(ingredient.index)}
                    />
                    <DSvgButton
                        svg={
                            <TrashSvg
                                stroke={'#F24E41'}
                                width={20}
                                height={20}
                            />
                        }
                        additionalStyle={styles.additionalStyleTrashSvg}
                        onPress={() => onDelete(ingredient.index)}
                    />
                </View>
            );
        },
    );

    return (
        <Layout
            onBackPress={onBackPress}
            titleText={t('methods-list')}
            buttonBlock={
                <DSvgButton
                    svg={
                        <PlusSvg
                            stroke={palette.white}
                            width={14}
                            height={14}
                        />
                    }
                    additionalStyle={styles.additionalStylePlusSvg}
                    onPress={() => {
                        setModalVisible(true);
                        setNewIngredient(
                            formik?.values?.recipe_ingredients?.length,
                        );
                        setOldValue(null);
                        formik.setFieldValue(
                            `recipe_ingredients[${formik?.values?.recipe_ingredients?.length}].action`,
                            IngredientActionType.Method,
                        );
                    }}
                />
            }>
            <BaseModal
                visible={modalVisible}
                setVisible={setModalVisible}
                handleClose={closeModal}>
                <AddImage
                    handleSelectImage={image => {
                        formik.setFieldValue(
                            `recipe_ingredients[${newIngredient}].media_resource`,
                            null,
                        );
                        formik.setFieldValue(
                            `recipe_ingredients[${newIngredient}].media_resource_buffer`,
                            image,
                        );
                    }}
                    id={formik.values.id}
                    bufer={
                        formik?.values?.recipe_ingredients?.[newIngredient]
                            ?.media_resource_buffer
                    }
                    value={
                        formik?.values?.recipe_ingredients?.[newIngredient]
                            ?.media_resource
                    }
                />
                <Textarea
                    name={`recipe_ingredients[${newIngredient}].description`}
                    value={
                        formik?.values?.recipe_ingredients?.[newIngredient]
                            ?.description || ''
                    }
                    onChange={formik.handleChange(
                        `recipe_ingredients[${newIngredient}].description`,
                    )}
                    required={true}
                    error={
                        formik.errors.recipe_ingredients?.[newIngredient]
                            ?.description
                    }
                    label={t('description')}
                    rows={5}
                />
                <ButtonForm
                    text={t('add')}
                    actionButton={formik.handleSubmit}
                    style={styles.marginTop23}
                />
                <ButtonForm
                    text={t('cancel')}
                    style={styles.cancelForm}
                    styleText={{color: palette.blueDark}}
                    actionButton={closeModal}
                />
            </BaseModal>

            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}>
                    {ingredientsTypes?.length > 0 ? (
                        <View style={styles.containerFlatList}>
                            <FlatList
                                data={ingredientsTypes}
                                renderItem={({item, index}) => (
                                    <IngredientItem
                                        ingredient={item}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                )}
                                ItemSeparatorComponent={() => (
                                    <View style={styles.line} />
                                )}
                                keyExtractor={(item, index) => index.toString()+formik.values.id}
                            />
                        </View>
                    ) : (
                        <Text style={styles.fontSize16}>
                            {t('you-havent-added-methods')}
                        </Text>
                    )}
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <ButtonForm
                        text={t('save')}
                        actionButton={() => {
                            setModalVisible(false);
                            navigator.navigate('AddRecipeScreen', {
                                recipe: formik.values,
                            });
                        }}
                    />
                </View>
            </View>
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
    scrollViewContent: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    additionalStylePlusSvg: {
        backgroundColor: colors.imageButton.primary.background,
        width: 40,
        height: 40,
        borderRadius: 100,
    },
    additionalStyleTrashSvg: {
        marginLeft: 10,
    },
    marginTop23: {
        marginTop: 23,
    },
    cancelForm: {
        backgroundColor: palette.white,
        borderWidth: 1,
        borderColor: palette.blueLight,
        marginTop: 12,
    },
    containerFlatList: {
        backgroundColor: palette.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: palette.blueLight,
        padding: 10,
    },
    containerFlatListRow: {
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    descriptionText: {
        flex: 1,
        marginLeft: 10,
    },
    line: {
        backgroundColor: palette.blueLight,
        width: '100%',
        height: 1,
        marginVertical: 10,
    },
    buttonContainer: {
        paddingTop: 15,
        marginBottom: 20,
    },
    imageContainer: {
        width: '19%',
        height: 48,
    },
    fontSize16: {
        fontSize: 16,
    },
});
