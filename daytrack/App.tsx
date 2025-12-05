import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StackNavigator from './src/navigation/StackNavigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { requestStoragePermission } from './src/utils/permissions';

GoogleSignin.configure({
  webClientId: '969928830257-3ov5fhve3jdhgu70udl73ucl5p76k2n4.apps.googleusercontent.com',
});

export default function App() {
  // Request permissions on app start
  useEffect(() => {
    const initializePermissions = async () => {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        console.warn('Storage permission not granted');
      }
    };

    initializePermissions();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}