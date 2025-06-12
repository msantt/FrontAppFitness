import React, { useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.25;

export default function WheelSelector({ data, selectedIndex, onSelect }) {
  const listRef = useRef(null);

  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    onSelect(index);
  };

  return (
    <FlatList
      ref={listRef}
      data={data}
      horizontal
      pagingEnabled={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.container}
      snapToInterval={ITEM_WIDTH}
      decelerationRate="fast"
      onMomentumScrollEnd={handleScrollEnd}
      initialScrollIndex={selectedIndex}
      getItemLayout={(_, index) => ({
        length: ITEM_WIDTH,
        offset: ITEM_WIDTH * index,
        index,
      })}
      renderItem={({ item, index }) => {
        const isSelected = index === selectedIndex;
        return (
          <View style={[styles.item, isSelected && styles.selectedItem]}>
            <Text style={isSelected ? styles.selectedText : styles.text}>
              {item}
            </Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
    marginVertical: 15,
    alignItems: 'center',
  },
  item: {
    width: ITEM_WIDTH,
    height: 80,
    marginHorizontal: -6,
    backgroundColor: '#ccc',
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
    transform: [{ scale: 0.9 }],
  },
  selectedItem: {
    backgroundColor: '#00D95F',
    opacity: 1,
  },
  text: {
    color: '#000',
    fontSize: 22,
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
