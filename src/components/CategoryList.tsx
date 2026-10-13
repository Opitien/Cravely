import React from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Category } from '../types';
import { makeStyles } from '../theme';
import { Text } from '../ui';

const ALL: Category = { id: 'all', slug: '', name: 'All', icon: '🍽️' };

interface CategoryListProps {
  categories: Category[];
  selectedSlug: string | null; // null = All
  onSelect: (slug: string | null) => void;
}

export default function CategoryList({ categories, selectedSlug, onSelect }: CategoryListProps) {
  const styles = useStyles();
  return (
    <FlatList
      data={[ALL, ...categories]}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const slug = item.id === ALL.id ? null : item.slug;
        const selected = slug === selectedSlug;
        return (
          <Pressable
            onPress={() => onSelect(slug)}
            style={styles.item}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={item.name}
          >
            <View style={[styles.circle, selected && styles.circleSelected]}>
              <Text style={styles.emoji}>{item.icon}</Text>
            </View>
            <Text variant="label" tone={selected ? 'primary' : 'secondary'}>
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const useStyles = makeStyles((t) => ({
  list: { paddingHorizontal: t.spacing.xl - 4, paddingVertical: t.spacing.lg, gap: t.spacing.xs },
  item: { alignItems: 'center', width: 72, gap: 6 },
  circle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: t.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...t.shadow(1),
  },
  circleSelected: { borderColor: t.colors.primary, backgroundColor: t.colors.primarySoft },
  emoji: { fontSize: 28, lineHeight: 34 },
}));
