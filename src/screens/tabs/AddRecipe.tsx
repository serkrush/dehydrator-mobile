import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import AddImage from 'src/components/AddImage';
import {colors} from 'src/theme';
import {images} from 'src/theme/images';
import {useTranslation} from 'react-i18next';
import ContainerContext from 'src/ContainerContext';
import {useFormik} from 'formik';
import {
    IFormRecipeEntity,
    IFormStageEntity,
    IIngredientEntity,
    IngredientActionType,
    IRecipeEntity,
    IStageEntity,
    MachineType,
    RecipeProcessType,
    RecipeStageType,
} from 'src/entities/EntityTypes';
import Input from 'src/Form/Input';
import Multiselect from 'src/Form/Multiselect';
import Layout from 'src/components/layouts/Layout';
import {useNavigation} from '@react-navigation/native';
import ButtonForm from 'src/Form/ButtonForm';
import palette from 'src/theme/colors/palette';
import {useActions} from 'src/hooks/useEntity';
import {useSelector} from 'react-redux';
import {AppState, ENTITY, Flag, Scale} from 'src/constants';
import DSvgButton from 'src/components/buttons/DSvgButton';
import TrashSvg from '../../../assets/svg/TrashSvg';
import BaseTitleDropdown from 'src/components/BaseTitleDropdown';
import StageList from 'src/components/recipes/StageList';
import ConfirmationDialog from 'src/components/modals/ConfirmationDialog';
import {useIdentity} from 'src/hooks/useIdentity';
import {temperatureConvert} from 'src/utils/scaleConvert';
import EditSvg from '../../../assets/svg/EditSvg';

const mainScreenColors = {
    card: colors.card.base,
};

export default function AddRecipeScreen({route}) {
    const {t} = useTranslation();
    const [stageActive, setStageActive] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleRecipe, setModalVisibleRecipe] = useState(false);
    const {saveRecipe, deleteRecipe} = useActions('RecipeEntity');
    const {getCategories} = useActions('CategoryEntity');
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const config = di.resolve('config');
    const navigation = useNavigation();
    const identity = useIdentity();
    const onBackPress = () => {
        if (formik.dirty) {
            setModalVisible(true);
        } else {
            navigation.goBack();
        }
    };

    const mapStageEntityToFormStageEntity = (stage: IStageEntity) => {
        const duration = stage.duration ?? 0;
        const hours = Math.floor(duration / 60);
        const minutes = duration - hours * 60;
        const scale = identity?.scale;

        const temperature = Math.floor(
            scale == Scale.Imperial
                ? temperatureConvert(stage.initTemperature)
                : stage.initTemperature,
        );
        return {
            ...stage,
            duration,
            hours,
            minutes,
            viewInitTemperature: temperature,
        };
    };

    const initialRecipeValues = route?.params?.recipe
        ? {
              ...route?.params?.recipe,
              ...{
                  stages: route?.params?.recipe?.stages.map((stage, index) => {
                      return mapStageEntityToFormStageEntity(stage);
                  }),
              },
          }
        : {
              recipe_name: '',
              recipe_process: RecipeProcessType.Recipe,
              categories: [],
              recipe_ingredients: [],
              machine_type: MachineType.Dehydrator,
              type_session: RecipeStageType.Time,
              stages: [
                  {
                      initTemperature: 0,
                      weight: 0,
                      fanPerformance1Label: 'normal',
                      fanPerformance2Label: 'normal',
                      duration: 0,
                      hours: 0,
                      minutes: 0,
                      viewInitTemperature: 0,
                  },
              ],
          };
    const formik = useFormik({
        initialValues: initialRecipeValues,
        validate: (values: IFormRecipeEntity) => {
            const errors: Partial<IFormRecipeEntity> = {};
            if (!values.recipe_name) {
                errors.recipe_name = t('required');
            }
            if (!values.machine_type) {
                errors.machine_type = t('required');
            }

            if (
                values.recipe_ingredients &&
                values.recipe_ingredients.length > 0
            ) {
                const ingredientsErrors: any[] = values.recipe_ingredients.map(
                    (ingredient, index) => {
                        const ingredientErrors: Partial<IIngredientEntity> = {};
                        if (!ingredient.description) {
                            ingredientErrors.description = t('required');
                        }
                        return ingredientErrors;
                    },
                );
                const hasIngredientErrors = ingredientsErrors.some(
                    ingredientErrors =>
                        Object.keys(ingredientErrors).length > 0,
                );
                if (hasIngredientErrors) {
                    errors.recipe_ingredients = ingredientsErrors;
                }
            }

            if (values.stages && values.stages.length > 0) {
                const stagesErrors: any[] = values.stages.map(
                    (stage: IStageEntity, index) => {
                        const stageErrors = {} as any;
                        if (!stage.fanPerformance1Label) {
                            stageErrors.fanPerformance1Label = t('required');
                        }
                        if (!stage.fanPerformance2Label) {
                            stageErrors.fanPerformance2Label = t('required');
                        }
                        if (!stage.initTemperature) {
                            stageErrors.initTemperature = t('required');
                        }

                        if (
                            values.type_session === RecipeStageType.Weight &&
                            values.stages.length === index + 1 &&
                            !stage.weight
                        ) {
                            stageErrors.weight = t('required');
                        }
                        if (
                            (values.type_session === RecipeStageType.Time ||
                                (values.type_session ===
                                    RecipeStageType.Weight &&
                                    values.stages.length < index + 1)) &&
                            !stage.duration
                        ) {
                            stageErrors.duration = t('required');
                        }

                        return stageErrors;
                    },
                );
                const hasstageErrors = stagesErrors.some(
                    stageErrors => Object.keys(stageErrors).length > 0,
                );
                if (hasstageErrors) {
                    errors.stages = stagesErrors;
                }
            }
            if (!values.categories || values?.categories?.length === 0) {
                errors.categories = [t('required')];
            }
            return errors;
        },
        onSubmit: (values, {setFieldValue}) => {
            const actualValues = values;
            actualValues.stages = values.stages.map(stage => {
                return {
                    ...stage,
                    fanPerformance1: undefined,
                    fanPerformance2: undefined,
                    hours: undefined,
                    minutes: undefined,
                    viewInitTemperature: undefined,
                };
            });
            saveRecipe(actualValues);
            // setFieldValue('media_resources_buffer', []);
        },
    });
    useEffect(() => {
        if (route?.params?.recipe) {
            const currentRecipe = {
                ...formik.values,
            };
            const newRecipe = {
                ...route.params.recipe,
            };
            if (JSON.stringify(currentRecipe) !== JSON.stringify(newRecipe)) {
                const initialRecipeValues = {
                    ...route?.params?.recipe,
                    ...{
                        stages: route?.params?.recipe?.stages.map(
                            (stage, index) => {
                                return mapStageEntityToFormStageEntity(stage);
                            },
                        ),
                    },
                };
                formik.setValues(initialRecipeValues);
            }
        }
    }, [route?.params?.recipe]);
    useEffect(() => {
        getCategories();
    }, []);
    const categories = useSelector((state: AppState) => state.categories);
    const currentMachineId = useSelector((state: AppState) => {
        return state.box ? state.box[Flag.CurrentUpdatedMachineId] : undefined;
    });
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
    const handleAddStage = () => {
        if (formik?.values?.stages && Array.isArray(formik.values.stages)) {
            if (formik.values.stages.length >= 5) {
                Alert.alert(
                    'formik.values.stages.length >= maxSrages !!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
                );
                return;
            }
            formik.setFieldValue('stages', [
                ...formik.values.stages,
                {
                    fanPerformance1Label: 'normal',
                    fanPerformance2Label: 'normal',
                    duration: 0,
                    initTemperature: 0,
                    weight: 0,
                    hours: 0,
                    minutes: 0,
                    viewInitTemperature: 0,
                },
            ]);
            setStageActive(stageActive + 1);
        } else {
            formik.setFieldValue('stages', [
                {
                    fanPerformance1Label: 'normal',
                    fanPerformance2Label: 'normal',
                    duration: 0,
                    initTemperature: 0,
                    weight: 0,
                },
            ]);
        }
    };

    const handleRemoveInput = (index, inputName) => {
        if (formik.values.stages.length === 1) {
            formik.setFieldValue('stages', [
                {
                    fanPerformance1Label: 'normal',
                    fanPerformance2Label: 'normal',
                    duration: 0,
                    weight: 0,
                    initTemperature: 0,
                },
            ]);
        } else {
            formik.setFieldValue(
                inputName,
                formik.values[inputName].filter((_, i) => i !== index),
            );
        }
        setStageActive(index === 0 ? 0 : stageActive - 1);
    };

    const machines = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE];
    });
    const machine = useMemo(() => {
        return machines[currentMachineId];
    }, [currentMachineId, machines]);
    const weightFeatureEnabled = useMemo(() => {
        if (config.forceEnableWeightFeature) {
            return true;
        } else {
            return machine?.weightScaleFeature ?? false;
        }
    }, []);
    return (
        <Layout
            onBackPress={onBackPress}
            titleText={
                formik.values.id ? t('edit-recipe') : t('create-new-recipe')
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
                        onPress={() => setModalVisibleRecipe(true)}
                    />
                )
            }>
            <ConfirmationDialog
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={t('unsaved-changes')}
                noButton={t('cancel')}
                yesButton={t('exit-without-saving')}
                onOkAction={() => {
                    navigation.goBack();
                }}
            />
            <ConfirmationDialog
                modalVisible={modalVisibleRecipe}
                setModalVisible={setModalVisibleRecipe}
                title={t('delete-recipe')}
                noButton={t('cancel')}
                yesButton={t('yes')}
                onOkAction={() => {
                    deleteRecipe({id: formik.values.id});
                }}
            />
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}>
                    <AddImage
                        handleSelectImage={data => {
                            formik.setFieldValue(`media_resources_buffer`, [
                                data,
                            ]);
                        }}
                        id={formik.values.id}
                        value={
                            formik.values.media_resources &&
                            formik.values.media_resources?.length > 0 &&
                            formik.values.media_resources[0]
                        }
                    />
                    <View
                        style={{
                            backgroundColor: mainScreenColors.card.background,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: palette.blueLight,
                            paddingHorizontal: 16,
                            paddingVertical: 20,
                            marginTop: 16,

                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.25,
                            shadowRadius: 1,
                            elevation: 2,
                        }}>
                        <Input
                            name="recipe_name"
                            value={formik.values.recipe_name}
                            onChange={formik.handleChange('recipe_name')}
                            required={true}
                            error={formik.errors.recipe_name as string}
                            label={t('recipe-name')}
                        />
                        <View
                            style={{
                                marginTop: 24,
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                            }}>
                            <View style={{flex: 1}}>
                                <Multiselect
                                    options={categoriesOptions}
                                    name="categories"
                                    label={t('category-name')}
                                    onChange={(name, selectedData) => {
                                        formik.setFieldValue(
                                            name,
                                            selectedData,
                                        );
                                    }}
                                    required={true}
                                    error={formik.errors.categories}
                                    values={formik.values.categories}
                                />
                            </View>

                            <View style={{marginLeft: 2}}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: palette.white,
                                        width: 44,
                                        height: 44,
                                        borderRadius: 8,
                                        borderColor: palette.blueLight,
                                        borderWidth: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() =>
                                        navigator.navigate(
                                            'AddCategoriesScreen',
                                            {
                                                formikRecipeValues:
                                                    formik.values,
                                            },
                                        )
                                    }
                                    activeOpacity={0.7}>
                                    <EditSvg
                                        stroke={palette.blueDark}
                                        width={20}
                                        height={20}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            backgroundColor: mainScreenColors.card.background,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: palette.blueLight,
                            paddingHorizontal: 16,
                            paddingVertical: 20,
                            marginTop: 16,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.25,
                            shadowRadius: 1,
                            elevation: 2,
                        }}>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 16,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                            onPress={() =>
                                navigator.navigate('MethodScreen', {
                                    recipe: formik.values,
                                })
                            }>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: colors.checkboxText,
                                }}>
                                {t('method')}(
                                {formik.values.recipe_ingredients?.filter(
                                    ingredient =>
                                        ingredient.action ===
                                        IngredientActionType.Method,
                                )?.length ?? 0}
                                )
                            </Text>
                            <Image
                                source={images.add}
                                tintColor={palette.orange}
                                style={{
                                    width: 16,
                                    height: 16,
                                    resizeMode: 'contain',
                                }}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                backgroundColor: palette.blueLight,
                                width: '100%',
                                height: 1,
                                marginVertical: 10,
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                paddingVertical: 16,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                            onPress={() =>
                                navigator.navigate('IngredientScreen', {
                                    recipe: formik.values,
                                })
                            }>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: colors.checkboxText,
                                }}>
                                {t('ingredients')}(
                                {formik.values.recipe_ingredients?.filter(
                                    ingredient =>
                                        ingredient.action ===
                                        IngredientActionType.Ingredient,
                                )?.length ?? 0}
                                )
                            </Text>
                            <Image
                                source={images.add}
                                tintColor={palette.orange}
                                style={{
                                    width: 16,
                                    height: 16,
                                    resizeMode: 'contain',
                                }}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                backgroundColor: palette.blueLight,
                                width: '100%',
                                height: 1,
                                marginVertical: 10,
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                paddingVertical: 16,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                            onPress={() =>
                                navigator.navigate('DescriptionScreen', {
                                    recipe: formik.values,
                                })
                            }>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: colors.checkboxText,
                                }}>
                                {t('description')}(
                                {formik.values.description ? 1 : 0})
                            </Text>

                            <Image
                                source={images.cardEdit}
                                tintColor={palette.blueBlack}
                                style={{
                                    width: 16,
                                    height: 16,
                                    resizeMode: 'contain',
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    {weightFeatureEnabled && (
                        <View style={{marginTop: 32}}>
                            <BaseTitleDropdown
                                data={[
                                    {
                                        label: t(RecipeStageType.Weight),
                                        value: RecipeStageType.Weight,
                                    },
                                    {
                                        label: t(RecipeStageType.Time),
                                        value: RecipeStageType.Time,
                                    },
                                ]}
                                title={`${t('run-session-by')}`}
                                placeholder={t('run-session-by')}
                                value={formik.values.type_session}
                                setValue={data => {
                                    formik.setFieldValue('type_session', data);
                                }}
                            />
                        </View>
                    )}
                    <StageList
                        data={formik?.values?.stages}
                        stageActive={stageActive}
                        setStageActive={setStageActive}
                        handleRemove={handleRemoveInput}
                        handleAdd={handleAddStage}
                        setFieldValue={formik.setFieldValue}
                        typeSession={formik.values.type_session}
                        errors={formik?.errors?.stages}
                    />
                </ScrollView>
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

    containerStage: {
        backgroundColor: palette.lightGray,
        padding: 10,
        paddingTop: 8,
        borderRadius: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: palette.blueDark,
        marginBottom: 10,
    },
    stageControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stageButton: {
        minWidth: 36,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: palette.blueDark,
        borderRadius: 8,
        marginRight: 5,
    },
    activeStageButton: {
        backgroundColor: palette.blueDark,
    },
    stageButtonText: {
        fontSize: 19,
        fontWeight: '500',
        color: palette.blueDark,
    },
    activeStageButtonText: {
        color: '#f5f0dc',
    },
    addRemoveButtons: {
        flexDirection: 'row',
        paddingLeft: 10,
    },
    circleButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    circleButtonText: {
        fontSize: 24,
        color: '#ff6b35',
    },
    formContainer: {
        marginTop: 10,
    },
    marginTop: {
        marginTop: 24,
    },
});
