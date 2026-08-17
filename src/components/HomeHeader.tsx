import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

export default function HomeHeader() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Good evening 👋</Text>
          <Text style={styles.subtitle}>What are you craving today?</Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }}
          style={styles.avatar}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.light.background,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.sizes.small,
    color: '#666',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 16,
  },
});
