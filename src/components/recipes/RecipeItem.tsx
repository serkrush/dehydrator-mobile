import React, {ReactNode, useContext} from 'react';
import {IRecipeEntity} from 'src/entities/EntityTypes';
import ImageStore from '../ImageStore';
import {Text, TouchableOpacity, View} from 'react-native';
import ContainerContext from 'src/ContainerContext';
import palette from 'src/theme/colors/palette';

interface iRecipeItemProps {
    recipe?: IRecipeEntity;
    icon?: ReactNode;
    screenNavigate?: string;
}

export default function RecipeItem({
    recipe,
    screenNavigate = 'BenchFoodsDetailsScreen',
    icon,
}: iRecipeItemProps) {
    if (!recipe) return null;
    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    return (
        <TouchableOpacity
            onPress={() => {
                navigator.navigate(screenNavigate, {recipe});
            }}>
            <View
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
                        folder={`recipes/${recipe?.id}`}
                        name={
                            recipe.media_resources
                                ? recipe.media_resources[0]
                                : null
                        }
                    />
                </View>
                <Text style={{flex: 1, marginLeft: 10, color: palette.blueBlack}}>
                    {recipe?.recipe_name}
                </Text>

                {icon}
            </View>
        </TouchableOpacity>
    );
}
