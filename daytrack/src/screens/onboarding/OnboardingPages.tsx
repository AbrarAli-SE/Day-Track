import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import screen1Icon from '../../../assets/images/onboarding/screenOne.png';
import screen1Blur from '../../../assets/images/onboarding/screenOneBlur.png';
import screen2Icon from '../../../assets/images/onboarding/screenTwo.png';
import screen2Blur from '../../../assets/images/onboarding/screenTwoBlur.png';
import screen3Icon from '../../../assets/images/onboarding/screenThree.png';
import screen3Blur from '../../../assets/images/onboarding/screenThreeBlur.png';
import strokeCombined from '../../../assets/images/onboarding/strokeCombined.png';
import onboardingStyles from '../../styles/onboardingStyles';

const { width } = Dimensions.get('window');

type Page = {
  icon: any;
  blur: any;
  title: string;
  subtitle: string;
};

export default function OnboardingPages() {
  const navigation = useNavigation<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [strokePosition] = useState(new Animated.Value(-150));
  const [dotIndicator] = useState(new Animated.Value(0));
  const [iconScale] = useState(new Animated.Value(1));

  const pages: { [key: number]: Page } = {
    1: {
      icon: screen1Icon,
      blur: screen1Blur,
      title: "Your Day,\nYour Way",
      subtitle: "Start organizing your life with clarity and control. Day Track helps you manage expenses, routines, and reminders—all in one place."
    },
    2: {
      icon: screen2Icon,
      blur: screen2Blur,
      title: "Track Your\nExpenses",
      subtitle: "Stay on top of your spending habits. Easily log daily expenses and visualize your financial journey."
    },
    3: {
      icon: screen3Icon,
      blur: screen3Blur,
      title: "Set Reminders\n& Routines",
      subtitle: "Never miss a beat. Schedule routines and reminders to keep your day organized and productive."
    }
  };

  const animateDots = (page: number) => {
    Animated.spring(dotIndicator, {
      toValue: (page - 1) * 22,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > 3) return;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setCurrentPage(newPage);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
    });

    const newPosition = -((newPage - 1) * width + 150);
    Animated.timing(strokePosition, {
      toValue: newPosition,
      duration: 400,
      useNativeDriver: true,
    }).start();

    animateDots(newPage);
  };

  const handleNext = () => {
    if (currentPage === 3) {
      navigation.replace('MainScreen');
    } else {
      changePage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  const handleSkip = () => {
    navigation.replace('MainScreen');
  };

  const current = pages[currentPage];

  return (
    <View style={onboardingStyles.wrapper}>
      <LinearGradient
        colors={['#f7feffff', '#eed6e4d4']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={onboardingStyles.container}
      >
        {/* Back Button */}
        {currentPage > 1 && (
          <TouchableOpacity
            style={onboardingStyles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
        )}

        {/* Background Stroke */}
        <View style={onboardingStyles.strokeContainer} pointerEvents="none">
          <Animated.Image
            source={strokeCombined}
            style={[
              onboardingStyles.backgroundStroke,
              { transform: [{ translateX: strokePosition }] }
            ]}
            resizeMode="stretch"
          />
        </View>

        {/* Icons */}
        <Animated.View
          style={{ transform: [{ scale: iconScale }] }}
          pointerEvents="none"
        >
          <Image
            source={current.blur}
            style={[onboardingStyles.icon, onboardingStyles.iconBlur]}
            resizeMode="contain"
          />
          <Image
            source={current.icon}
            style={onboardingStyles.icon}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={onboardingStyles.innerContainer}>
          {/* Text Content */}
          <Animated.View
            style={[onboardingStyles.textContainer, { opacity: fadeAnim }]}
          >
            <Text style={onboardingStyles.title}>{current.title}</Text>
            <Text style={onboardingStyles.subtitle}>{current.subtitle}</Text>
          </Animated.View>

          {/* Progress Dots - Fixed Position */}
          <View style={onboardingStyles.dotsWrapper}>
            <View style={onboardingStyles.dotsContainer}>
              {[1, 2, 3].map((_, index) => (
                <View
                  key={index}
                  style={onboardingStyles.progressDot}
                />
              ))}
            </View>
            <Animated.View
              style={[
                onboardingStyles.progressDotIndicator,
                { transform: [{ translateX: dotIndicator }] }
              ]}
            />
          </View>

          {/* Bottom Buttons */}
          <View style={[
            onboardingStyles.bottomRow,
            currentPage === 3 && onboardingStyles.bottomRowEnd
          ]}>
            {currentPage < 3 && (
              <TouchableOpacity
                style={onboardingStyles.skipButton}
                onPress={handleSkip}
                activeOpacity={0.7}
              >
                <Text style={onboardingStyles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={onboardingStyles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.20)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={onboardingStyles.nextButtonGradient}
              >
                <Text style={onboardingStyles.nextText}>
                  {currentPage === 3 ? 'Get Started' : 'Next'}
                </Text>
                <Ionicons
                  name={currentPage === 3 ? "checkmark" : "arrow-forward"}
                  size={20}
                  color="#000000"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
