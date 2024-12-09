import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import DButton from '../buttons/DButton';
import container from 'src/container';
import {Dropdown} from 'react-native-element-dropdown';
import DDropdown from '../DDropdown';
import dataFunc from 'src/utils/dropdownDataFunc';
import BackModalLayer from './BackModalLayer';

export default function LanguageModal({
  visible,
  setVisible,
  languages,
  language,
  setLanguage,
  saveButtonTap,
}) {
  const t = container.resolve('t');

  const data = dataFunc(languages, 'language');
  return (
    visible && (
      <BackModalLayer>
        <View style={{width: '100%', paddingHorizontal: 28}}>
          <View>
            <DDropdown
              data={data}
              value={language}
              setValue={setLanguage}
              placeholder={t('select-language').toUpperCase()}
            />
          </View>
          <View
            style={{
              paddingTop: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <DButton
              style={{width: '40%'}}
              onPress={() => {
                setVisible(false);
                saveButtonTap();
              }}
              text={t('save')}
            />
          </View>
        </View>
      </BackModalLayer>
    )
  );
}

const styles = StyleSheet.create({});
