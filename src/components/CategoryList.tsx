import React from 'react';
import { FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { Category } from '../types';
import { makeStyles, useTheme } from '../theme';
import { Pressable, Text, enter, useReduceMotion } from '../ui';

const ALL: Category = { id: 'all', slug: '', name: 'All', icon: '🍽️' };

interface CategoryListProps {
  categories: Category[];
  selectedSlug: string | null; // null = All
  onSelect: (slug: string | null) => void;
}

/** Horizontal category rail: emoji tiles that spring when selected, staggered entrance. */
export default function CategoryList({ categories, selectedSlug, onSelect }: CategoryListProps) {
  const t = useTheme();
  const styles = useStyles();
  const reduce = useReduceMotion();
  return (
    <FlatList
      data={[ALL, ...categories]}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item, index }) => {
        const slug = item.id === ALL.id ? null : item.slug;
        const selected = slug === selectedSlug;
        return (
          <MotiView {...enter(index, reduce)}>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync().catch(() => undefined);
                onSelect(slug);
              }}
              style={styles.item}
              pressScale={0.92}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={item.name}
            >
              <MotiView
                animate={{ scale: selected ? 1.06 : 1, backgroundColor: selected ? t.colors.primarySoft : t.colors.secondaryGroupedBackground, borderColor: selected ? t.colors.primary : 'transparent' }}
                transition={{ type: 'spring', damping: 12, stiffness: 220 }}
                style={styles.circle}
              >
                <Text style={styles.emoji}>{item.icon}</Text>
              </MotiView>
              <Text variant={selected ? 'footnoteStrong' : 'footnote'} tone={selected ? 'primary' : 'secondary'}>
                {item.name}
              </Text>
            </Pressable>
          </MotiView>
        );
      }}
    />
  );
}

const useStyles = makeStyles((t) => ({
  list: { paddingHorizontal: t.spacing.lg - 4, paddingVertical: t.spacing.lg, gap: t.spacing.xs },
  item: { alignItems: 'center', width: 72, gap: 6 },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    ...t.shadow(1),
  },
  emoji: { fontSize: 28, lineHeight: 34 },
}));
