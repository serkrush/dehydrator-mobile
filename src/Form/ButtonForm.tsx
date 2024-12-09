import React from 'react';
import {Button, Pressable, StyleSheet, Text} from 'react-native';
import palette from 'src/theme/colors/palette';

interface ButtonFormProps {
    text: string;
    actionButton?: () => void;
    style?: object;
    styleText?: object;
}

export default function ButtonForm({
    text,
    actionButton,
    style = {},
    styleText = {},
}: ButtonFormProps) {
    return (
        <Pressable
            style={{
                ...{
                    backgroundColor: palette.orange,
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 12,

                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.25,
                    shadowRadius: 1,
                    elevation: 2,
                },
                ...style,
            }}
            onPress={actionButton}>
            <Text
                style={{
                    ...{fontSize: 16, color: 'white', fontWeight: 600},
                    ...styleText,
                }}>
                {text}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({});
