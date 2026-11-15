import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { makeStyles, useTheme } from '../theme';
import { Icon } from '../ui';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

/** iOS search field: tertiary fill, 10pt corners, magnifying glass, animated clear button. */
export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  const t = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Icon name="search" size={18} color={t.colors.tertiaryLabel} weight="semibold" />
      <TextInput
        style={styles.input}
        placeholder="Restaurants or dishes"
        placeholderTextColor={t.colors.tertiaryLabel}
        selectionColor={t.colors.primary}
        cursorColor={t.colors.primary}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="never"
        accessibilityLabel="Search restaurants"
      />
      <AnimatePresence>
        {value.length > 0 && (
          <MotiView from={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: 'timing', duration: 140 }}>
            <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityLabel="Clear search" accessibilityRole="button">
              <Icon name="close-circle" size={18} color={t.colors.tertiaryLabel} />
            </Pressable>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    marginHorizontal: t.spacing.lg,
    marginTop: t.spacing.lg,
    paddingHorizontal: t.spacing.md,
    height: 40,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.tertiaryFill,
  },
  input: {
    flex: 1,
    ...t.type.body,
    color: t.colors.label,
    height: '100%',
    paddingVertical: 0,
  },
}));
