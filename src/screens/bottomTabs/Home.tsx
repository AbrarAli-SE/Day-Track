import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="home-outline" size={64} color="rgba(0, 0, 0, 0.15)" />
        </View>

        {/* Text */}
        <Text style={styles.mainText}>Home Coming Soon</Text>
        <Text style={styles.subText}>
          We're working on something amazing for your home screen!
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
    top: 80,
    right: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
  },

  decorativeCircle2: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
  },
});

