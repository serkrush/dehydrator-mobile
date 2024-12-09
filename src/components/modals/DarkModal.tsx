import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import DButton from '../buttons/DButton';
import container from 'src/container';
import {Dropdown} from 'react-native-element-dropdown';
import DDropdown from '../DDropdown';
import dataFunc from 'src/utils/dropdownDataFunc';
import BackModalLayer from './BackModalLayer';
import DTextButton from '../buttons/DTextButton';

export default function DarkModal({
  visible,
  setVisible,
  title,
  message,
  onCancel = () => {},
  buttonText,
  onPress = () => {},
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
              borderColor: '#3164f4',
              borderWidth: 1,
              backgroundColor: 'black',
              padding: 16,
            }}>
            <Text style={{color: 'white', fontSize: 18}}>{title}</Text>
            <Text style={{color: '#e1e1e1', fontSize: 14}}>{message}</Text>
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
                  textStyle={{color: 'white', fontSize: 13}}
                  text={t('cancel')}
                  onPress={onCancelPress}
                />
              </View>
              <View style={{flex: 1}}>
                <DButton
                  style={{height: 38, backgroundColor: '#3164f4'}}
                  textStyle={{color: 'white'}}
                  text={buttonText}
                  onPress={onPress}
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
