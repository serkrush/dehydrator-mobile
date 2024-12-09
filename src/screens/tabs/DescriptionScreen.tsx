import React, {useState, useContext, useMemo} from 'react';
import {useFormik} from 'formik';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Layout from 'src/components/layouts/Layout';
import Textarea from 'src/Form/Textares';
import ContainerContext from 'src/ContainerContext';
import {IngredientActionType, IRecipeEntity} from 'src/entities/EntityTypes';
import {colors} from 'src/theme';
import ButtonForm from 'src/Form/ButtonForm';

const mainScreenColors = {
    card: colors.card.base,
};

interface IngredientScreenProps {
    route: any;
}

export default function IngredientScreen({route}: IngredientScreenProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [newIngredient, setNewIngredient] = useState(0);
    const [oldValue, setOldValue] = useState('');
    const {t} = useTranslation();

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const onBackPress = () => {
        navigator.navigate('AddRecipeScreen', {
            recipe: route.params?.recipe,
        });
    };

    const formik = useFormik({
        initialValues: route.params?.recipe,
        validate: (values: IRecipeEntity) => {
            const errors: Partial<IRecipeEntity> = {};
            return errors;
        },
        onSubmit: values => {
            console.log('onSubmit values', values);
        },
    });

    return (
        <Layout onBackPress={onBackPress} titleText={t('ingredients-list')}>
            <View style={styles.container}>
                <View style={styles.scrollView}>
                    <Textarea
                        name={'description'}
                        value={formik?.values?.description || ''}
                        onChange={formik.handleChange(`description`)}
                        required={true}
                        label={t('description')}
                        rows={5}
                    />
                </View>
                <View style={{paddingTop: 15, marginBottom: 20}}>
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
    ingredientContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    ingredientDescription: {
        fontSize: 18,
        color: '#1F2937',
        fontWeight: '500',
        paddingHorizontal: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
});
