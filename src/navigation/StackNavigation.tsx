import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash/SplashScreen';
import OnboardingPages from '../screens/onboarding/OnboardingPages';
import Login from '../screens/auth/Login';
import BottomTabsNavigator from './BottomTabsNavigation';
// import AppDrawer from './DrawerNavigation';

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
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="MainScreen" component={BottomTabsNavigator} />
            {/* <Stack.Screen name="Main" component={AppDrawer} /> */}
        </Stack.Navigator>
    );
}