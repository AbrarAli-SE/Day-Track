import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash/SplashScreen';
import OnboardingPages from '../screens/onboarding/OnboardingPages';
import BottomTabsNavigator from './BottomTabsNavigation';
// import AppDrawer from './DrawerNavigation';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgetPasswordScreen from '../screens/auth/ForgetPasswordScreen';
import ComingSoonScreen from '../screens/ComingSoonScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="Splash"
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="OnboardingPages" component={OnboardingPages} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
            <Stack.Screen name="MainScreen" component={BottomTabsNavigator} />
            <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
            
            {/* <Stack.Screen name="Main" component={AppDrawer} /> */}
        </Stack.Navigator>
    );
}