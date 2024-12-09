import React from 'react';
import {View, StyleSheet, FlatList, ScrollView} from 'react-native';
import {windowWidth} from 'src/utils/size';

export default function GridList({
  items,
  numColumns,
  renderItem,
  rowGap,
  collumnGap,
  outsideHorizontalPadding = 0,
}) {
  enum Gap {
    left = 'left',
    center = 'center',
    right = 'right',
  }

  const Card = data => {
    const {child} = styles;
    let marginLeft = 0;
    let marginRight = 0;
    switch (data.gap) {
      case Gap.left:
        marginLeft = collumnGap / 2;
        break;
      case Gap.right:
        marginRight = collumnGap / 2;
        break;
      case Gap.center:
        marginLeft = collumnGap / 2;
        marginRight = collumnGap / 2;
        break;
    }
    return (
      <View
        key={data.key}
        style={[
          child,
          {
            width:
              (windowWidth -
                outsideHorizontalPadding -
                collumnGap * (numColumns - 1)) /
              numColumns,
          },
          {marginLeft, marginRight},
        ]}>
        {renderItem(data.item)}
      </View>
    );
  };
  const views = items.map((item, index) => {
    let gap = Gap.center;
    if (index % numColumns == 0) {
      gap = Gap.right;
    } else if ((index + 1) % numColumns == 0) {
      gap = Gap.left;
    }
    return Card({item, gap, key: index});
  });
  return <View style={[styles.container, {rowGap}]}>{views}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  child: {
    width: windowWidth / 2,
    alignItems: 'center',
  },
});
