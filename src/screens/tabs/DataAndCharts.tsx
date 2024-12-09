import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import ContainerContext from 'src/ContainerContext';
import {connect} from 'react-redux';
import TitleHeader from 'src/components/Headers/TitleHeader';
import {useTranslation} from 'react-i18next';
import BaseScreenLayout from 'src/components/layouts/BaseScreenLayout';

export default function DataAndChartsScreen() {
  const {t} = useTranslation();
  return (
    <BaseScreenLayout>
      <View style={{paddingTop: 4}}>
        {TitleHeader(t('tab-data-and-charts'))}
      </View>
    </BaseScreenLayout>
  );
}

const styles = StyleSheet.create({});
