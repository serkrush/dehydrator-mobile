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

interface IngredientScreenProps {
    route: any;
}

export default function IngredientScreen({route}: IngredientScreenProps) {
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
                      recipe => recipe.action === IngredientActionType.Ingredient,
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
            titleText={t('ingredients-list')}
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
                            IngredientActionType.Ingredient,
                        );
                    }}
                />
            }>
            <BaseModal
                visible={modalVisible}
                setVisible={setModalVisible}
                handleClose={closeModal}>
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
                            {t('you-havent-added-ingredients')}
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

// import React, {useState, useContext, useMemo} from 'react';
// import {useFormik} from 'formik';
// import {
//     FlatList,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
//     ScrollView,
// } from 'react-native';
// import {useTranslation} from 'react-i18next';
// import Layout from 'src/components/layouts/Layout';
// import BaseModal from 'src/components/modals/BaseModal';
// import Textarea from 'src/Form/Textares';
// import DImageButton from 'src/components/buttons/DImageButton';
// import ContainerContext from 'src/ContainerContext';
// import {IngredientActionType, IRecipeEntity} from 'src/entities/EntityTypes';
// import {colors} from 'src/theme';
// import {images} from 'src/theme/images';
// import palette from 'src/theme/colors/palette';
// import ButtonForm from 'src/Form/ButtonForm';
// import DSvgButton from 'src/components/buttons/DSvgButton';
// import TrashSvg from '../../../assets/svg/TrashSvg';
// import EditSvg from '../../../assets/svg/EditSvg';

// const mainScreenColors = {
//     card: colors.card.base,
// };

// interface IngredientScreenProps {
//     route: any;
// }

// export default function IngredientScreen({route}: IngredientScreenProps) {
//     const [modalVisible, setModalVisible] = useState(false);
//     const [newIngredient, setNewIngredient] = useState(0);
//     const [oldValue, setOldValue] = useState('');
//     const {t} = useTranslation();

//     const di = useContext(ContainerContext);
//     const navigator = di.resolve('navigator');
//     const onBackPress = () => {
//         navigator.navigate('AddRecipeScreen', {
//             recipe: formik.values,
//         });
//     };

//     const formik = useFormik({
//         initialValues: route.params?.recipe,
//         validate: (values: IRecipeEntity) => {
//             const errors: Partial<IRecipeEntity> = {};
//             return errors;
//         },
//         onSubmit: values => {
//             console.log('onSubmit values', values);
//         },
//     });

//     const handleClose = () => {
//         setModalVisible(false);
//         if (oldValue === '') {
//             formik.setFieldValue(
//                 `recipe_ingredients`,
//                 formik.values['recipe_ingredients'].filter(
//                     (_, i) => i !== newIngredient,
//                 ),
//             );
//         } else {
//             formik.setFieldValue(
//                 `recipe_ingredients[${newIngredient}].description`,
//                 oldValue,
//             );
//         }
//     };
//     const ingredientsTypes = useMemo(() => {
//         return formik?.values?.recipe_ingredients?.length > 0
//             ? formik?.values?.recipe_ingredients
//                   .map((recipe, index) => ({
//                       ...recipe,
//                       index,
//                   }))
//                   .filter(
//                       recipe =>
//                           recipe.action === IngredientActionType.Ingredient,
//                   )
//             : [];
//     }, [formik?.values?.recipe_ingredients]);
//     return (
//         <Layout
//             onBackPress={onBackPress}
//             titleText={t('ingredients-list')}
//             buttonBlock={
//                 <DImageButton
//                     source={images.add}
//                     width={24}
//                     height={24}
//                     tintColor={colors.imageButton.primary.content}
//                     additionalStyle={{
//                         backgroundColor: colors.imageButton.primary.background,
//                         width: 40,
//                         height: 40,
//                         borderRadius: 100,
//                     }}
//                     onPress={() => {
//                         setModalVisible(true);
//                         setNewIngredient(
//                             formik?.values?.recipe_ingredients?.length,
//                         );
//                         setOldValue('');
//                         formik.setFieldValue(
//                             `recipe_ingredients[${formik?.values?.recipe_ingredients?.length}].action`,
//                             IngredientActionType.Ingredient,
//                         );
//                     }}
//                 />
//             }>
//             <BaseModal
//                 visible={modalVisible}
//                 setVisible={setModalVisible}
//                 handleClose={handleClose}>
//                 <Textarea
//                     name={`recipe_ingredients[${newIngredient}].description`}
//                     value={
//                         formik?.values?.recipe_ingredients?.[newIngredient]
//                             ?.description || ''
//                     }
//                     onChange={formik.handleChange(
//                         `recipe_ingredients[${newIngredient}].description`,
//                     )}
//                     required={true}
//                     label={t('description')}
//                     rows={5}
//                 />
//                 <ButtonForm
//                     text={t('add')}
//                     actionButton={() => setModalVisible(false)}
//                     style={{
//                         marginTop: 23,
//                     }}
//                 />
//                 <ButtonForm
//                     text={t('cancel')}
//                     style={{
//                         backgroundColor: palette.white,
//                         borderWidth: 1,
//                         borderColor: palette.blueLight,
//                         marginTop: 12,
//                     }}
//                     styleText={{color: palette.blueDark}}
//                     actionButton={handleClose}
//                 />
//             </BaseModal>

//             <View style={styles.container}>
//                 <ScrollView
//                     style={styles.scrollView}
//                     contentContainerStyle={styles.scrollViewContent}>
//                     {ingredientsTypes?.length > 0 ? (
//                         <View
//                             style={{
//                                 backgroundColor:
//                                     mainScreenColors.card.background,
//                                 borderRadius: 8,
//                                 borderWidth: 1,
//                                 borderColor: palette.blueLight,
//                                 padding: 10,
//                             }}>
//                             <FlatList
//                                 data={ingredientsTypes}
//                                 renderItem={({item: ingredient, index}) => (
//                                     <View key={`${ingredient.action}-${index}`}>
//                                         <View style={styles.ingredientContent}>
//                                             <Text
//                                                 style={
//                                                     styles.ingredientDescription
//                                                 }>
//                                                 {ingredient.description}
//                                             </Text>
//                                             <DSvgButton
//                         svg={
//                             <EditSvg
//                                 stroke={palette.blueDark}
//                                 width={20}
//                                 height={20}
//                             />
//                         }
//                         onPress={() => onEdit(ingredient.index)}
//                     />
//                     <DSvgButton
//                         svg={
//                             <TrashSvg
//                                 stroke={'#F24E41'}
//                                 width={20}
//                                 height={20}
//                             />
//                         }
//                         additionalStyle={styles.additionalStyleTrashSvg}
//                         onPress={() => onDelete(ingredient.index)}
//                     />
//                                         </View>
//                                     </View>
//                                 )}
//                                 ItemSeparatorComponent={() => (
//                                     <View
//                                         style={{
//                                             backgroundColor: '#CBD4DB',
//                                             width: '100%',
//                                             height: 1,
//                                             marginVertical: 10,
//                                         }}
//                                     />
//                                 )}
//                                 keyExtractor={(item, index) => index.toString()}
//                             />
//                         </View>
//                     ) : (
//                         <Text style={{fontSize: 16}}>
//                             {t('you-havent-added-ingredients')}
//                         </Text>
//                     )}
//                 </ScrollView>
//                 <View style={{paddingTop: 15, marginBottom: 20}}>
//                     <ButtonForm
//                         text={t('save')}
//                         actionButton={() => {
//                             setModalVisible(false);
//                             navigator.navigate('AddRecipeScreen', {
//                                 recipe: formik.values,
//                             });
//                         }}
//                     />
//                 </View>
//             </View>
//         </Layout>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'space-between',
//         width: '100%',
//     },
//     scrollView: {
//         flex: 1,
//     },
//     scrollViewContent: {
//         paddingHorizontal: 10,
//         paddingBottom: 10,
//     },
//     ingredientContent: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 16,
//     },
//     ingredientDescription: {
//         fontSize: 18,
//         color: '#1F2937',
//         fontWeight: '500',
//         paddingHorizontal: 10,
//     },
//     buttonsContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//     },
// });
