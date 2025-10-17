import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/bottomTabs/Home';
import Expense from '../screens/bottomTabs/Expense';
import Todo from '../screens/bottomTabs/Todo';
const BottomTab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

type TabButtonProps = {
    focused: boolean;
    iconSource: any;
    label: string;
    color: string;
    onPress: () => void;
};

const TabButton: React.FC<TabButtonProps> = ({
    focused,
    iconSource,
    label,
    color,
    onPress,
}) => {
    const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.85)).current;
    const labelOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
    const labelWidth = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: focused ? 1 : 0.85,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(labelOpacity, {
                toValue: focused ? 1 : 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.spring(labelWidth, {
                toValue: focused ? 1 : 0,
                friction: 7,
                tension: 50,
                useNativeDriver: true,
            })
        ]).start();
    }, [focused]);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabButton}
        >
            <Animated.View
                style={{
                    transform: [{ scale: scaleAnim }],
                }}
            >
                <Image
                    source={iconSource}
                    style={[
                        styles.icon,
                        { tintColor: focused ? color : '#af9c9eff' }
                    ]}
                    resizeMode="contain"
                />
            </Animated.View>
            {focused && (
                <Animated.View
                    style={{
                        opacity: labelOpacity,
                        transform: [{ scaleX: labelWidth }],
                        transformOrigin: 'left center',
                        overflow: 'hidden',
                        marginLeft: 8,
                    }}
                >
                    <Text
                        style={[styles.activeLabel, { color }]}
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                </Animated.View>
            )}
        </TouchableOpacity>
    );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const overlayPosition = useRef(new Animated.Value(0)).current;
    const currentIndex = state.index;

    useEffect(() => {
        const screenWidth = width;
        const tabWidth = screenWidth / 3;
        const overlayWidth = 120;
        const targetPosition = currentIndex * tabWidth + (tabWidth - overlayWidth) / 2;

        Animated.spring(overlayPosition, {
            toValue: targetPosition,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, [currentIndex]);

    return (
        <View style={styles.tabBarContainer}>
            <View style={styles.overlayContainer}>
                <Animated.View
                    style={[
                        styles.greenOverlay,
                        {
                            transform: [{ translateX: overlayPosition }]
                        }
                    ]}
                />
            </View>

            <View style={styles.tabsWrapper}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;
                    let iconSource: any;
                    let label: string = '';

                    if (route.name === 'Home') {
                        iconSource = isFocused
                            ? require('./../../assets/images/bottomTabIcons/home-active.png')
                            : require('./../../assets/images/bottomTabIcons/home.png');
                        label = 'Home';
                    } else if (route.name === 'Expense') {
                        iconSource = isFocused
                            ? require('./../../assets/images/bottomTabIcons/expense-active.png')
                            : require('./../../assets/images/bottomTabIcons/expense.png');
                        label = 'Expense';
                    } else if (route.name === 'Todo') {
                        iconSource = isFocused
                            ? require('./../../assets/images/bottomTabIcons/todo-active.png')
                            : require('./../../assets/images/bottomTabIcons/todo.png');
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
                                iconSource={iconSource}
                                label={label}
                                color="#6C63FF"
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
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 20,
        position: 'relative',
        marginTop: -25,
        paddingTop: 0,
    },
    overlayContainer: {
        position: 'absolute',
        top: 0, 
        left: 7,
        right: 7,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: 'hidden',
        backgroundColor: '#F7FEFF',
    },
    greenOverlay: {
        width: 105,
        height: 46,
        backgroundColor: 'rgba(25, 16, 189, 0.15)',
        borderRadius: 23,
        position: 'absolute',
        left: 0,
        top: 12,
    },
    tabsWrapper: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        zIndex: 10,
    },
    tabContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 46,
        paddingHorizontal: 8,
    },
    icon: {
        width: 22,
        height: 22,
    },
    activeLabel: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'left',
        letterSpacing: 0.3,
    },
});