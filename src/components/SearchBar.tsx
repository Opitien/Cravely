import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  const t = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={t.colors.textMuted} />
      <TextInput
        style={styles.input}
        placeholder="Search restaurants or dishes"
        placeholderTextColor={t.colors.textMuted}
        selectionColor={t.colors.primary}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Search restaurants"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityLabel="Clear search">
          <Ionicons name="close-circle" size={20} color={t.colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm + 2,
    marginHorizontal: t.spacing.xl,
    marginTop: t.spacing.xl,
    paddingHorizontal: t.spacing.lg,
    height: 52,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
    ...t.shadow(1),
  },
  input: {
    flex: 1,
    fontFamily: t.fonts.medium,
    fontSize: 15,
    color: t.colors.text,
    height: '100%',
  },
}));
