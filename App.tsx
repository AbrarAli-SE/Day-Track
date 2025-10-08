import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from './src/screens/splash/SplashScreen';
import Login from './src/screens/auth/Login';
import OnboardingPages from './src/screens/onboarding/OnboardingPages';
import TabsNavigator from './src/screens/bottomTabNavigator/TabsNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="Splash"
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="OnboardingPages" component={OnboardingPages} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="MainScreen" component={TabsNavigator} options={{
              animation: 'fade',
            }} />

          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}