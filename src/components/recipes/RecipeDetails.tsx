import React, {useContext, useMemo, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';
import {
    IngredientActionType,
    IRecipeEntity,
    RecipeStageType,
} from 'src/entities/EntityTypes';
import {colors} from 'src/theme';
import palette from 'src/theme/colors/palette';
import ImageStore from '../ImageStore';
import Input from 'src/Form/Input';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {AppState, Flag} from 'src/constants';
import Accordion from '../Accordion';
import Stages from './Stages';
import ButtonForm from 'src/Form/ButtonForm';
import BaseModal from '../modals/BaseModal';
import StartModal from '../modals/StartModal';
import ContainerContext from 'src/ContainerContext';
import CategoriesList from './CategoriesList';

interface RecipeDetailsProps {
    recipe?: IRecipeEntity;
    categoriesLevels: any[];
}

const mainScreenColors = {
    card: colors.card.base,
};

const ListContent = ({data, renderItem, keyExtractor, title}) => {
    return (
        <Accordion
            title={title}
            isWork={data?.length > 0}
            content={
                <View style={styles.accordionContent}>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        ItemSeparatorComponent={() => (
                            <View style={styles.separator} />
                        )}
                    />
                </View>
            }
        />
    );
};

export default function RecipeDetails({
    recipe,
    categoriesLevels,
}: RecipeDetailsProps) {
    const {t} = useTranslation();
    const di = useContext(ContainerContext);
    const config = di.resolve('config');
    const [modalVisible, setModalVisible] = useState(false);
    const currentMachineId = useSelector(
        (state: AppState) => state.box[Flag.CurrentUpdatedMachineId],
    );
    const machines = useSelector((state: AppState) => state.machines);
    const machine = machines[currentMachineId];

    const {methods, ingredients} = useMemo(() => {
        const methods = recipe?.recipe_ingredients.filter(
            ingredient => ingredient.action === IngredientActionType.Method,
        );
        const ingredients = recipe?.recipe_ingredients.filter(
            ingredient => ingredient.action === IngredientActionType.Ingredient,
        );
        return {methods, ingredients};
    }, [recipe?.recipe_ingredients]);

    const handleClose = () => {
        setModalVisible(false);
    };
    const weightFeatureEnabled = useMemo(() => {
        if (config.forceEnableWeightFeature) {
            return true;
        } else {
            return machine?.weightScaleFeature ?? false;
        }
    }, []);

    const {cat, subcat} = categoriesLevels.reduce(
        (acc, categoryLevel) => {
            if (categoryLevel.data && Array.isArray(categoryLevel.data)) {
                const matchedOptions = categoryLevel.data.filter(option =>
                    recipe?.categories.includes(option.value),
                );

                if (matchedOptions.length > 0) {
                    acc.cat.push(categoryLevel.title);
                    matchedOptions.forEach(option => {
                        acc.subcat.push(option.label);
                    });
                }
            } else if (recipe?.categories.includes(categoryLevel.value)) {
                acc.cat.push(categoryLevel.label);
            }

            return acc;
        },
        {cat: [], subcat: []},
    );

    return (
        <View style={styles.container}>
            <BaseModal
                visible={modalVisible}
                setVisible={setModalVisible}
                handleClose={handleClose}>
                <StartModal
                    setVisible={setModalVisible}
                    zones={machine?.zones}
                    currentMachineId={currentMachineId}
                    recipe={recipe}
                />
            </BaseModal>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.imageContainer}>
                    <ImageStore
                        folder={`recipes/${recipe?.id}`}
                        name={recipe?.media_resources?.[0]}
                    />
                </View>
                <View style={styles.cardContainer}>
                    <Input
                        name="recipe_name"
                        value={recipe?.recipe_name}
                        label={t('recipe-name')}
                        readOnly={true}
                    />
                    {cat && cat.length > 0 && (
                        <CategoriesList
                            categories={cat}
                            title={t('category')}
                        />
                    )}

                    {subcat && subcat.length > 0 && (
                        <CategoriesList
                            categories={subcat}
                            title={t('sub-category')}
                        />
                    )}
                </View>

                <View style={styles.cardContainer}>
                    <ListContent
                        data={methods}
                        renderItem={({item: m}) => (
                            <View style={styles.itemContainer}>
                                {m.media_resource && (
                                    <View style={styles.imageContainerMini}>
                                        <ImageStore
                                            folder={`recipes/${recipe?.id}`}
                                            name={m.media_resource}
                                        />
                                    </View>
                                )}
                                <Text style={styles.description}>
                                    {m.description}
                                </Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => `method-${index}`}
                        title={`${t('method')} (${methods?.length ?? 0})`}
                    />

                    <ListContent
                        data={ingredients}
                        renderItem={({item: i}) => (
                            <View style={styles.itemContainer}>
                                <Text style={styles.description}>
                                    {i.description}
                                </Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => `ingredient-${index}`}
                        title={`${t('ingredients')} (${
                            ingredients?.length ?? 0
                        })`}
                    />

                    <Accordion
                        title={`${t('description')} (${
                            recipe?.description ? 1 : 0
                        })`}
                        isWork={recipe?.description ? true : false}
                        content={
                            <View style={styles.accordionContent}>
                                <Text style={styles.recipeDescription}>
                                    {recipe?.description}
                                </Text>
                            </View>
                        }
                    />
                </View>

                {recipe?.stages && <Stages stages={recipe?.stages} />}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <ButtonForm
                    text={t('start')}
                    actionButton={() => {
                        if (currentMachineId === undefined) {
                            Alert.alert(t('dehydrator-not-selected'));
                        } else {
                            if (
                                recipe?.type_session ===
                                    RecipeStageType.Weight &&
                                !weightFeatureEnabled
                            ) {
                                Alert.alert(t('not-have-scale'));
                            } else {
                                setModalVisible(true);
                            }
                        }
                    }}
                />
            </View>
        </View>
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
        paddingBottom: 10,
    },
    imageContainer: {
        width: '100%',
        height: 173,
    },
    imageContainerMini: {
        width: 55,
        height: 48,
    },
    cardContainer: {
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
    },
    accordionContent: {
        backgroundColor: palette.lightGray,
        padding: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    separator: {
        backgroundColor: '#CBD4DB',
        width: '100%',
        height: 1,
        marginVertical: 10,
    },
    description: {
        flex: 1,
        fontSize: 14,
        color: palette.blueBlack,
        flexWrap: 'wrap',
        width: '100%',
    },
    recipeDescription: {
        fontSize: 14,
        color: palette.blueBlack,
    },
    buttonContainer: {
        paddingTop: 15,
        marginBottom: 20,
    },
});
