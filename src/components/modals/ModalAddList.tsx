import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import DText from '../DText';
import DButton from '../buttons/DButton';

export function ModalAddList({
  title,
  setShowAddList,
  indicator = false,
  list,
  onItemPress,
  itemKey,
  itemLabelKey,
}) {
  const {t} = useTranslation();

  return (
    <View style={styles.modalList}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 20,
        }}>
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}>
          <DText text={title} />
          {indicator && <ActivityIndicator />}
          {list &&
            list.map(item => {
              return (
                <View style={{width: '100%'}} key={item[itemKey]}>
                  <DButton
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                      height: 'auto',
                      minHeight: 50,
                    }}
                    text={item[itemLabelKey]}
                    onPress={() => {
                      onItemPress(item);
                      setShowAddList(false);
                    }}
                  />
                </View>
              );
            })}
        </View>
      </ScrollView>
      <View>
        <DButton
          text={t('cancel')}
          onPress={() => {
            setShowAddList(false);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalList: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    backgroundColor: '#000000EE',
  },
});
