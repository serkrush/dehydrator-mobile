import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import DButton from '../buttons/DButton';
import container from 'src/container';
import {Dropdown} from 'react-native-element-dropdown';
import DDropdown from '../DDropdown';
import dataFunc from 'src/utils/dropdownDataFunc';
import BackModalLayer from './BackModalLayer';
import DTextButton from '../buttons/DTextButton';
import DTextInput from '../DTextInput';

export default function ModalWithField({
    visible,
    setVisible,
    title,
    message,
    onCancel = () => {},
    buttonText,
    onPress = (value: string) => {},
    fieldTitle,
    fieldValue,
    setFieldValue,
}) {
    const t = container.resolve('t');
    const onCancelPress = () => {
        setVisible(false);
        onCancel();
    };

    return (
        visible && (
            <BackModalLayer>
                <View
                    style={{
                        width: '100%',
                        paddingHorizontal: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            // borderColor: '#3164f4',
                            // borderWidth: 1,
                            backgroundColor: 'white',
                            padding: 16,
                            borderRadius: 16,
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 18,
                                fontWeight: 'bold',
                            }}>
                            {title}
                        </Text>
                        <Text style={{color: 'black', fontSize: 14}}>
                            {message}
                        </Text>
                        <Text>{fieldTitle}</Text>
                        <DTextInput
                            textStyle={{
                                paddingHorizontal: 20,
                                paddingVertical: 8,
                                minHeight: 50,
                                height: 'auto',
                            }}
                            text={fieldValue}
                            placeholder={''}
                            onChangeText={setFieldValue}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 12,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                            <View style={{flex: 1}}>
                                <DTextButton
                                    textStyle={{color: 'black', fontSize: 13}}
                                    text={t('cancel')}
                                    onPress={onCancelPress}
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <DButton
                                    style={{
                                        height: 38,
                                        backgroundColor: 'black',
                                    }}
                                    textStyle={{color: 'white'}}
                                    text={buttonText}
                                    onPress={() => {
                                        onPress(fieldValue);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </BackModalLayer>
        )
    );
}

const styles = StyleSheet.create({});
