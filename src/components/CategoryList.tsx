import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CategoryItem from './CategoryItem';
import { Category } from '../types';

const ALL: Category = { id: 'all', slug: '', name: 'All', icon: '🍽️' };

interface CategoryListProps {
  categories: Category[];
  selectedSlug: string | null; // null = All
  onSelect: (slug: string | null) => void;
}

export default function CategoryList({ categories, selectedSlug, onSelect }: CategoryListProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={[ALL, ...categories]}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const slug = item.id === ALL.id ? null : item.slug;
          return (
            <CategoryItem
              category={item}
              isSelected={slug === selectedSlug}
              onPress={() => onSelect(slug)}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10, // give room for shadows
  },
});
