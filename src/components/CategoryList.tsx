import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CategoryItem from './CategoryItem';
import { mockCategories } from '../utils/mockData';

export default function CategoryList() {
  const [selectedId, setSelectedId] = useState<string>(mockCategories[0].id);

  return (
    <View style={styles.container}>
      <FlatList
        data={mockCategories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CategoryItem 
            category={item} 
            isSelected={item.id === selectedId}
            onPress={() => setSelectedId(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});
