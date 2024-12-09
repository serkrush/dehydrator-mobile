import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import palette from 'src/theme/colors/palette';

interface CategoriesListProps {
    categories: string[];
    title: string;
}

export default function CategoriesList({
    categories,
    title,
}: CategoriesListProps) {
    return (
        <View style={{marginTop: 24}}>
            <Text
                style={{
                    fontSize: 14,
                    marginBottom: 2,
                    fontWeight: '500',
                    color: palette.blueDark,
                }}>
                {title}
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 4,
                }}>
                {categories.map(c => (
                    <View
                        style={{
                            backgroundColor: palette.orange,
                            marginTop: 0,
                            padding: 4,
                            borderRadius: 4,
                        }}>
                        <Text
                            style={{
                                backgroundColor: palette.orange,
                                fontSize: 16,
                                color: palette.white,
                                fontWeight: '500',
                                marginTop: 0,
                            }}>
                            {c}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
