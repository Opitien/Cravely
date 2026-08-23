import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Category } from '../types';
import Colors from '../constants/Colors';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

export default function CategoryItem({ category, isSelected, onPress }: CategoryItemProps) {
  return (
    <Pressable 
      onPress={onPress} 
      style={[
        styles.container, 
        isSelected ? styles.selectedContainer : styles.unselectedContainer
      ]}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={[
        styles.name, 
        isSelected ? styles.selectedText : styles.unselectedText
      ]}>
        {category.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
  },
  selectedContainer: {
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  unselectedContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFF',
  },
  unselectedText: {
    color: '#333',
  },
});
