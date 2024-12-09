import React, {ReactNode, useContext} from 'react';
import {IRecipeEntity} from 'src/entities/EntityTypes';
import ImageStore from '../ImageStore';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ContainerContext from 'src/ContainerContext';
import palette from 'src/theme/colors/palette';

interface iPresetItemProps {
    recipe?: IRecipeEntity;
    icon?: ReactNode;
    screenNavigate?: string;
}

export default function PresetItem({
    recipe,
    screenNavigate = 'BenchFoodsDetailsScreen',
    icon,
}: iPresetItemProps) {
    if (!recipe) return null;
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    return (
        <TouchableOpacity
            onPress={() => {
                navigator.navigate(screenNavigate, {recipe});
            }}
            style={styles.touchable}>
            <View style={styles.imageContainer}>
                <ImageStore
                    folder={`recipes/${recipe?.id}`}
                    name={
                        recipe.media_resources
                            ? recipe.media_resources[0]
                            : null
                    }
                />
            </View>
            <View style={styles.iconContainer}>{icon}</View>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                {recipe?.recipe_name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchable: {
        flex: 1 / 3,
        backgroundColor: palette.white,
        borderColor: palette.gray,
        borderWidth: 1,
        borderRadius: 12,
        height: 125,
        padding: 8,
        paddingBottom: 16,
        marginBottom: 8,
        justifyContent: 'center',
        shadowColor: 'rgba(16, 24, 40, 1)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    imageContainer: {
        width: '100%',
        height: 72,
    },
    iconContainer: {
        position: 'absolute',
        right: 17.6,
        top: 18.5,
    },
    text: {
        color: palette.blueBlack,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 14,
    },
});
