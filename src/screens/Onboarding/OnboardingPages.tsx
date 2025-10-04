import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import onboardingStyles from './onboardingStyles';

import screen1Icon from '../../../assets/images/onboarding/screenOne.png';
import screen1Blur from '../../../assets/images/onboarding/screenOneBlur.png';
import screen2Icon from '../../../assets/images/onboarding/screenTwo.png';
import screen2Blur from '../../../assets/images/onboarding/screenTwoBlur.png';
import screen3Icon from '../../../assets/images/onboarding/screenThree.png';
import screen3Blur from '../../../assets/images/onboarding/screenThreeBlur.png';
import strokeCombined from '../../../assets/images/onboarding/strokeCombined.png';

import backIcon from '../../../assets/images/onboarding/backIcon.png';

const { width } = Dimensions.get('window');

type Page = {
  icon: any;
  blur: any;
  title: string;
  subtitle: string;
};

export default function OnboardingPages({ navigation }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [strokePosition] = useState(new Animated.Value(-150));
  const [dotIndicator] = useState(new Animated.Value(0));

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
      title: "Track Your Expenses",
      subtitle: "Stay on top of your spending habits. Easily log daily expenses and visualize your financial journey."
    },
    3: {
      icon: screen3Icon,
      blur: screen3Blur,
      title: "Set Reminders & Routines",
      subtitle: "Never miss a beat. Schedule routines and reminders to keep your day organized and productive."
    }
  };

  const animateDots = (page: number) => {
    Animated.spring(dotIndicator, {
      toValue: (page - 1) * 16, 
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > 3) return;

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPage(newPage);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
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
      navigation.navigate('Login');
    } else {
      changePage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX < -50) {
        if (currentPage < 3) {
          changePage(currentPage + 1);
        } else {
          navigation.navigate('Login');
        }
      } else if (event.translationX > 50) {
        handleBack();
      }
    });

  const current = pages[currentPage];

  return (
    <GestureDetector gesture={panGesture}>
      <View style={onboardingStyles.wrapper}>
        <LinearGradient
          colors={['#f7feffff', '#eed6e4d4']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          style={onboardingStyles.container}
        >
          {currentPage > 1 && (
            <TouchableOpacity style={onboardingStyles.backIcon} onPress={handleBack}>
              <Image source={backIcon} style={onboardingStyles.backIconImage} />
            </TouchableOpacity>
          )}

          <View style={onboardingStyles.strokeContainer}>
            <Animated.Image
              source={strokeCombined}
              style={[
                onboardingStyles.backgroundStroke,
                { transform: [{ translateX: strokePosition }] }
              ]}
              resizeMode="stretch"
            />
          </View>

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

          <View style={onboardingStyles.innerContainer}>
            <Animated.View style={[onboardingStyles.textContainer, { opacity: fadeAnim }]}>
              <Text style={onboardingStyles.title}>{current.title}</Text>
              <Text style={onboardingStyles.subtitle}>{current.subtitle}</Text>
            </Animated.View>

            <View style={onboardingStyles.dotsWrapper}>
              <View style={onboardingStyles.dotsContainer}>
                <View style={onboardingStyles.progressDotInactive} />
                <View style={onboardingStyles.progressDotInactive} />
                <View style={onboardingStyles.progressDotInactive} />
              </View>

              <Animated.View
                style={[
                  onboardingStyles.progressDotActive,
                  { transform: [{ translateX: dotIndicator }] }
                ]}
              />
            </View>

            <View style={[
              onboardingStyles.bottomRow,
              currentPage === 3 && onboardingStyles.bottomRowEnd
            ]}>
              {currentPage < 3 && (
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={onboardingStyles.skip}>Skip</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={onboardingStyles.nextButton} onPress={handleNext}>
                <Text style={onboardingStyles.nextText}>
                  {currentPage === 3 ? 'Get Started' : 'Next'}
                </Text>
                <Text style={onboardingStyles.nextArrow}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    </GestureDetector>
  );
}