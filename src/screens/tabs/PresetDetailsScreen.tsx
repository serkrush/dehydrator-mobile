import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    Alert,
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
import {AppState, Flag, thicknesses} from 'src/constants';
import {
    FavoriteType,
    IRecipeEntity,
    RecipeStageType,
} from 'src/entities/EntityTypes';
import Layout from 'src/components/layouts/Layout';
import palette from 'src/theme/colors/palette';
import Input from 'src/Form/Input';
import Multiselect from 'src/Form/Multiselect';
import {useFormik} from 'formik';
import ButtonForm from 'src/Form/ButtonForm';
import Slider from 'react-native-slider';
import SliderForm from 'src/Form/SliderForm';
import BaseTitleDropdown from 'src/components/BaseTitleDropdown';
import SwitchForm from 'src/Form/SwitchForm';
import {fitPolynomialRegression} from 'src/utils/helper';
import Stages from 'src/components/recipes/Stages';
import DSvgButton from 'src/components/buttons/DSvgButton';
import HeartSvg from '../../../assets/svg/HeartSvg';
import BaseModal from 'src/components/modals/BaseModal';
import StartModal from 'src/components/modals/StartModal';

const machinesScreenColors = {
    backgroundColor: colors.mainBackground,
    sectionText: colors.header.text.main,
    groupText: colors.header.text.main,
};
const mainScreenColors = {
    card: colors.card.base,
};

export default function PresetDetailsScreen({route}) {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const config = di.resolve('config');
    const navigation = useNavigation();
    const navigator = di.resolve('navigator');
    const {id} = route.params?.recipe;
    const {getRecipeById} = useActions('RecipeEntity');
    const {getCategories} = useActions('CategoryEntity');
    const {saveRecipeFavorites, deleteRecipeFavorites} = useActions(
        'RecipeFavoritesEntity',
    );
    const [modalVisible, setModalVisible] = useState(false);

    const weightFeatureEnabled = useMemo(() => {
        if (config.forceEnableWeightFeature) {
            return true;
        } else {
            return machine?.weightScaleFeature ?? false;
        }
    }, []);
    const formik = useFormik({
        initialValues: route?.params?.recipe,
        validate: (values: IRecipeEntity) => {
            const errors: Partial<IRecipeEntity> = {};
            // if (!values.recipe_name) {
            //     errors.recipe_name = t('required');
            // }

            return errors;
        },
        onSubmit: (values, {setFieldValue}) => {
            if (currentMachineId === undefined) {
                Alert.alert(t('dehydrator-not-selected'));
            } else {
                if (
                    values?.type_session === RecipeStageType.Weight &&
                    !weightFeatureEnabled
                ) {
                    Alert.alert(t('not-have-scale'));
                } else {
                    setModalVisible(true);
                }
            }
            // saveRecipe(values);
            // setFieldValue('media_resources_buffer', []);
        },
    });

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

    const [sliderValue, setSliderValue] = useState(0);
    const [thicknessPresentation, setThicknessPresentation] = useState(
        recipe?.base_thickness,
    );
    const [marinatedPresentation, setMarinatedValue] = useState(false);

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

    const handleThicknessPresentationChange = (value): void => {
        setThicknessPresentation(value);
    };
    const handleMarinatedPresentationChange = (name, value) => {
        setMarinatedValue(value);
    };
    const handleAdjustmentPresentationChange = value => {
        console.log('handleAdjustmentPresentationChange', value);
        setSliderValue(value);
    };

    const adjustmentPresentationTemperature =
        sliderValue * recipe?.temperature?.adjustment;
    const marinatedPresentationTemperature = marinatedPresentation
        ? recipe?.temperature?.marinated
        : 0;
    const adjustmentPresentationTime = sliderValue * recipe?.time?.adjustment;
    const marinatedPresentationTime = marinatedPresentation
        ? recipe?.time?.marinated
        : 0;
    const calculateStages = useMemo(() => {
        const newStages = [];
        recipe?.stages?.length > 0 &&
            recipe?.stages.map((stage, index) => {
                console.log('stage.initTemperature ', stage.initTemperature);
                console.log(
                    'adjustmentPresentationTemperature',
                    adjustmentPresentationTemperature,
                );
                console.log(
                    'marinatedPresentationTemperature',
                    marinatedPresentationTemperature,
                );
                const temperature =
                    stage.initTemperature +
                    adjustmentPresentationTemperature +
                    marinatedPresentationTemperature;
                console.log('temperature', temperature);
                newStages.push({
                    fanPerformance1: stage.fanPerformance1,
                    fanPerformance2: stage.fanPerformance2,
                    // heatingIntensity: stage.intensity,
                    duration: fitPolynomialRegression(
                        stage.duration +
                            adjustmentPresentationTime +
                            marinatedPresentationTime,
                        0,
                        thicknessPresentation,
                    ),
                    initTemperature: temperature,
                });
            });
        return newStages;
    }, [recipe, sliderValue, marinatedPresentation, thicknessPresentation]);

    const changeFavorite = () => {
        isFavorite
            ? handleDeleteRecipeFavorites()
            : handleSaveRecipeFavorites();
    };
    const currentMachineId = useSelector(
        (state: AppState) => state.box[Flag.CurrentUpdatedMachineId],
    );
    const machines = useSelector((state: AppState) => state.machines);
    const machine = machines[currentMachineId];
    const handleClose = () => {
        setModalVisible(false);
    };

    return (
        <Layout
            onBackPress={onBackPress}
            titleText={formik.values.recipe_name}
            buttonBlock={
                <DSvgButton
                    svg={
                        <HeartSvg
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
            <View style={styles.container}>
                <BaseModal
                    visible={modalVisible}
                    setVisible={setModalVisible}
                    handleClose={handleClose}>
                    <StartModal
                        setVisible={setModalVisible}
                        zones={machine?.zones}
                        currentMachineId={currentMachineId}
                        recipe={{...recipe, stages: calculateStages}}
                    />
                </BaseModal>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}>
                    <ImageStore
                        folder={`recipes/${recipe?.id}`}
                        name={
                            formik.values.media_resources
                                ? formik.values.media_resources[0]
                                : null
                        }
                        style={{width: '100', height: 173}}
                    />
                    <View
                        style={{
                            backgroundColor: mainScreenColors.card.background,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: palette.blueLight,
                            padding: 10,
                            marginTop: 16,
                        }}>
                        <BaseTitleDropdown
                            data={thicknesses}
                            title={`${t('thickness')}`}
                            placeholder={t('thickness')}
                            value={thicknessPresentation}
                            setValue={handleThicknessPresentationChange}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 24,
                            }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: palette.blueDark,
                                }}>
                                {t('marinated')}
                            </Text>
                            <SwitchForm
                                onChange={handleMarinatedPresentationChange}
                                value={marinatedPresentation}
                                name={'marinated'}
                            />
                        </View>
                        <View style={{marginTop: 24}}>
                            <SliderForm
                                ticks={[-3, -2, -1, 0, 1, 2, 3]}
                                minimumValue={-3}
                                maximumValue={3}
                                step={1}
                                label={t('present-adjustment')}
                                value={sliderValue}
                                handleChange={
                                    handleAdjustmentPresentationChange
                                }
                            />
                        </View>
                    </View>

                    {calculateStages && <Stages stages={calculateStages} />}
                </ScrollView>
                <View style={{paddingTop: 15, marginBottom: 20}}>
                    <ButtonForm
                        text={t('start')}
                        actionButton={formik.handleSubmit}
                        style={{
                            marginTop: 23,
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
    sectionText: {
        ...fonts.h2,
        color: machinesScreenColors.sectionText,
    },
    track: {
        height: 2,
        backgroundColor: '#CBD4DB',
    },
    thumb: {
        width: 20,
        height: 20,
        backgroundColor: '#F7931E',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});
