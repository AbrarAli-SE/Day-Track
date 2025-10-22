import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Todo() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkbox-outline" size={64} color="rgba(0, 0, 0, 0.15)" />
        </View>

        {/* Text */}
        <Text style={styles.mainText}>Todo Coming Soon</Text>
        <Text style={styles.subText}>
          Stay organized! Your task management feature is on its way.
        </Text>

        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FEFF',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  mainText: {
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'YaldeviColombo-SemiBold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },

  subText: {
    fontSize: 16,
    fontWeight: '300',
    fontFamily: 'YaldeviColombo-Light',
    color: 'rgba(0, 0, 0, 0.60)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },

  decorativeCircle1: {
    position: 'absolute',
    top: 100,
    right: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(78, 205, 196, 0.08)',
  },

  decorativeCircle2: {
    position: 'absolute',
    bottom: 140,
    left: 30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 159, 64, 0.08)',
  },
});