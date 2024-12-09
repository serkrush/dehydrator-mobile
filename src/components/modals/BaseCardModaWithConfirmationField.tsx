import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DUpdatedButton, {
    ButtonProps,
    ButtonStyle,
} from '../buttons/DUpdatedButton';
import ExclamationView from '../views/ExclamationView';
import BackModalLayer from './BackModalLayer';
import {colors, fonts} from 'src/theme';
import BaseTitleInputRow from '../rows/BaseTitleInputRow';
import Card from '../views/Card';

export default function BaseCardModal({
    imageView,
    title,
    description,
    actionRows,
    fieldTitle,
    fieldValue,
    fieldSetValue,
}: {
    imageView?;
    title?: string;
    description?: string;
    actionRows?: (ButtonProps | ButtonProps[])[];
    fieldTitle;
    fieldValue;
    fieldSetValue;
}) {
    return (
        <BackModalLayer>
            <View style={styles.modalContainer}>
                <Card style={{borderWidth: 0}}>
                    <View style={{gap: 8}}>
                        {imageView}
                        {title != undefined && (
                            <Text style={styles.title}>{title}</Text>
                        )}
                        {description != undefined && (
                            <Text style={styles.description}>
                                {description}
                            </Text>
                        )}
                        <View style={{paddingTop: 8}}>
                            <BaseTitleInputRow
                                fieldTitle={fieldTitle}
                                fieldPlaceholder={fieldTitle}
                                value={fieldValue}
                                setValue={fieldSetValue}
                                additionalInputContainerStyle={{
                                    flex: undefined,
                                }}
                                additionalInputTextStyle={{flex: undefined}}
                                keyboardType={undefined}
                                label={undefined}
                                placeholderTextColor={'#99a9ad'}
                            />
                        </View>
                        <View style={{gap: 16, paddingTop: 16}}>
                            {actionRows != undefined &&
                                actionRows.map((row, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={{
                                                flexDirection: 'row',
                                                gap: 4,
                                            }}>
                                            {Array.isArray(row) &&
                                                row.map((value, index) => {
                                                    return (
                                                        <View
                                                            key={index}
                                                            style={{flex: 1}}>
                                                            {DUpdatedButton(
                                                                value,
                                                            )}
                                                        </View>
                                                    );
                                                })}
                                            {!Array.isArray(row) && (
                                                <View style={{flex: 1}}>
                                                    {DUpdatedButton(row)}
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                        </View>
                    </View>
                </Card>
            </View>
        </BackModalLayer>
    );
}

const styles = StyleSheet.create({
    modalContainer: {width: '100%', padding: 20},

    title: {
        ...fonts.textSizeL28,
        color: colors.card.text.h2,
    },

    description: {
        ...fonts.textSizeSL,
        color: colors.card.text.mainContent,
    },
});
