import React, {useContext, useEffect, useMemo} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import ContainerContext from 'src/ContainerContext';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import DImageButton from 'src/components/buttons/DImageButton';
import {images} from 'src/theme/images';
import colors from 'src/theme/colors';
import {fonts} from 'src/theme';
import {useActions} from 'src/hooks/useEntity';
import {AppState} from 'src/constants';
import Layout from 'src/components/layouts/Layout';
import palette from 'src/theme/colors/palette';
import {useNavigation} from '@react-navigation/native';
import ImageStore from 'src/components/ImageStore';
import DSvgButton from 'src/components/buttons/DSvgButton';
import EditSvg from '../../../assets/svg/EditSvg';

const machinesScreenColors = {
    backgroundColor: colors.mainBackground,
    sectionText: colors.header.text.main,
    groupText: colors.header.text.main,
};

export default function CategoriesScreen() {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const onBackPress = () => {
        navigation.goBack();
    };

    const {getCategoriesUser, deleteCategoriesUser} =
        useActions('CategoryEntity');
    useEffect(() => {
        getCategoriesUser();
    }, []);
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
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const onAddCategoryPress = () => {
        navigator.navigate('AddCategoriesScreen');
    };
    console.log('categories screen');
    return (
        <Layout
            onBackPress={onBackPress}
            titleText={t('my categories')}
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
                    onPress={onAddCategoryPress}
                />
            }>
            <View
                style={{
                    padding: 10,
                    paddingLeft: 5,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.25,
                    shadowRadius: 1,
                    elevation: 2,
                }}>
                <FlatList
                    data={itemsCategories}
                    ListEmptyComponent={() => (
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '400',
                                color: palette.midGray,
                                padding: 10,
                            }}>
                            {t('no-categories')}
                        </Text>
                    )}
                    renderItem={({item: category, index}) =>
                        category && (
                            <View
                                key={category.id}
                                style={{
                                    flexDirection: 'row',
                                    padding: 10,
                                    paddingLeft: 5,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}>
                                <View style={{width: '19%', height: 48}}>
                                    <ImageStore
                                        folder={`categories/${category?.id}`}
                                        name={category.media_resource ?? null}
                                    />
                                </View>

                                <Text style={{flex: 1, marginLeft: 10}}>
                                    {category?.category_name}
                                </Text>

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
                                        marginLeft: 10,
                                    }}
                                    onPress={() =>
                                        navigator.navigate(
                                            'AddCategoriesScreen',
                                            {
                                                category,
                                            },
                                        )
                                    }
                                />
                            </View>
                        )
                    }
                    ItemSeparatorComponent={() => (
                        <View
                            style={{
                                backgroundColor: '#CBD4DB',
                                width: '100%',
                                height: 1,
                            }}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    sectionText: {
        ...fonts.h2,
        color: machinesScreenColors.sectionText,
    },
});
