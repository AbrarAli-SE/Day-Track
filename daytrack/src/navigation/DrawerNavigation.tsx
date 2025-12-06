import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabsNavigator from './BottomTabsNavigation';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="MainScreen"
        component={BottomTabsNavigator}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}