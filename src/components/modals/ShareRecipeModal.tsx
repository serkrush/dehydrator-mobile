import React, {useMemo} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import palette from 'src/theme/colors/palette';

import {IRecipeEntity, IUserEntity} from 'src/entities/EntityTypes';
import Card from '../views/Card';
import {colors, fonts} from 'src/theme';
import {useSelector} from 'react-redux';
import {AppState, Flag} from 'src/constants';
import {useActions} from 'src/hooks/useEntity';
import {useTranslation} from 'react-i18next';

export default function ShareRecipeModal({
    relatedUsers,
    recipe,
}: {
    relatedUsers: any[];
    recipe?: IRecipeEntity;
}) {
    const {t} = useTranslation();
    const box = useSelector((state: AppState) => {
        return state.box;
    });
    const users = useSelector((state: AppState) => {
        return state.users;
    });
    const currentUser = useMemo(() => {
        let res = undefined as IUserEntity | undefined;
        if (box[Flag.CurrentUpdatedUserId]) {
            res = users[box[Flag.CurrentUpdatedUserId]];
        }

        return res;
    }, [users, box]);

    const updatedUserRow = (key, name, email, onPress, isLast) => {
        return (
            <View
                key={key}
                style={[
                    isLast
                        ? {borderBottomWidth: 0}
                        : {
                              borderBottomWidth: 1,
                              borderBottomColor: palette.blueLight,
                          },
                ]}>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.card.base.background,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        paddingVertical: 16,
                    }}
                    activeOpacity={0.4}
                    onPress={onPress}>
                    <View
                        style={[
                            {
                                gap: 5,
                            },
                        ]}>
                        <Text
                            style={{
                                ...fonts.textSizeM,
                                color: palette.orange,
                                flex: 1,
                            }}>
                            {name}
                        </Text>
                        <Text
                            style={{
                                ...fonts.textSizeM,
                                color: colors.card.text.additionalContent,
                            }}>
                            {email}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const {shareRecipe} = useActions('RecipeEntity');

    return (
        <>
            <Text
                style={{
                    color: palette.blueBlack,
                    fontWeight: '600',
                    fontSize: 18,
                    lineHeight: 28,
                }}>
                {t('send-recipe')}
            </Text>
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 20,
                }}>
                {relatedUsers != undefined && relatedUsers.length > 0 && (
                    <Card style={{marginTop: 20, borderWidth: 0}}>
                        {relatedUsers.map((user, index) => {
                            return updatedUserRow(
                                user.uid,
                                user.firstName + ' ' + user.lastName,
                                user.email,
                                () => {
                                    const {
                                        categories,
                                        user_id,
                                        favoriteByUsers,
                                        favoriteByMachines,
                                        ...restRecipe
                                    } = recipe;
                                    shareRecipe({
                                        receiverFirstName: user.firstName,
                                        receiverLastName: user.lastName,
                                        receiverEmail: user.email,
                                        accessData: [
                                            {
                                                ...restRecipe
                                            },
                                        ],
                                    });
                                },
                                index >= relatedUsers.length - 1,
                            );
                        })}
                    </Card>
                )}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({});
