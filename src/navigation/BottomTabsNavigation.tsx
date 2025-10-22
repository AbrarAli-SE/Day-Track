import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/bottomTabs/Home';
import Expense from '../screens/bottomTabs/Expense';
import Todo from '../screens/bottomTabs/Todo';

const BottomTab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Simple, professional color
const ACTIVE_COLOR = '#000000';
const INACTIVE_COLOR = 'rgba(0, 0, 0, 0.35)';
const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.08)';

type TabButtonProps = {
    focused: boolean;
    iconName: string;
    label: string;
    onPress: () => void;
};

const TabButton: React.FC<TabButtonProps> = ({
    focused,
    iconName,
    label,
    onPress,
}) => {
    const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.92)).current;
    const labelOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: focused ? 1 : 0.92,
                friction: 7,
                tension: 60,
                useNativeDriver: true,
            }),
            Animated.timing(labelOpacity, {
                toValue: focused ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [focused]);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabButton}
        >
            <Animated.View
                style={[
                    styles.tabContent,
                    {
                        transform: [{ scale: scaleAnim }],
                    }
                ]}
            >
                <Ionicons
                    name={iconName}
                    size={22}
                    color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
                />

                {focused && (
                    <Animated.Text
                        style={[
                            styles.activeLabel,
                            { opacity: labelOpacity }
                        ]}
                        numberOfLines={1}
                    >
                        {label}
                    </Animated.Text>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const overlayPosition = useRef(new Animated.Value(0)).current;
    const currentIndex = state.index;

    useEffect(() => {
        const tabWidth = width / 3;
        const overlayWidth = 100;
        const targetPosition = currentIndex * tabWidth + (tabWidth - overlayWidth) / 2;

        Animated.spring(overlayPosition, {
            toValue: targetPosition,
            friction: 8,
            tension: 60,
            useNativeDriver: true,
        }).start();
    }, [currentIndex]);

    return (
        <View style={styles.tabBarContainer}>
            {/* Simple Overlay */}
            <Animated.View
                style={[
                    styles.activeOverlay,
                    {
                        transform: [{ translateX: overlayPosition }]
                    }
                ]}
            />

            {/* Tab Buttons */}
            <View style={styles.tabsWrapper}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;
                    let iconName: string = '';
                    let label: string = '';

                    if (route.name === 'Home') {
                        iconName = isFocused ? 'home' : 'home-outline';
                        label = 'Home';
                    } else if (route.name === 'Expense') {
                        iconName = isFocused ? 'wallet' : 'wallet-outline';
                        label = 'Expense';
                    } else if (route.name === 'Todo') {
                        iconName = isFocused ? 'checkbox' : 'checkbox-outline';
                        label = 'Todo';
                    }

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <View key={route.key} style={styles.tabContainer}>
                            <TabButton
                                focused={isFocused}
                                iconName={iconName}
                                label={label}
                                onPress={onPress}
                            />
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default function BottomTabsNavigator() {
    return (
        <BottomTab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <BottomTab.Screen name="Home" component={Home} />
            <BottomTab.Screen name="Expense" component={Expense} />
            <BottomTab.Screen name="Todo" component={Todo} />
        </BottomTab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        height: 70,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 16,
        marginTop: -20,
        position: 'relative',
        paddingTop: 8,
        paddingBottom: 8,
    },

    activeOverlay: {
        position: 'absolute',
        top: 10,
        left: 0,
        width: 100,
        height: 50,
        backgroundColor: OVERLAY_COLOR,
        borderRadius: 12,
        zIndex: 1,
    },

    tabsWrapper: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        zIndex: 10,
        paddingHorizontal: 8,
    },

    tabContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },

    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
    },

    activeLabel: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'YaldeviColombo-SemiBold',
        color: ACTIVE_COLOR,
        letterSpacing: 0.2,
    },
});