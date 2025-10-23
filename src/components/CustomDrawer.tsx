// CustomDrawer.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    Image,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../navigation/DrawerContext';
import { drawerStyles } from '../styles/drawerStyles';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

export default function CustomDrawer() {
    const { isDrawerOpen, closeDrawer } = useDrawer();
    const navigation = useNavigation<any>();
    const [modalVisible, setModalVisible] = useState(false);

    // Only 2 simple animations
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isDrawerOpen) {
            setModalVisible(true);

            // Slower opening animation (smoother feel)
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400, // Increased from 300
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 400, // Increased from 300
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Keep closing fast (was perfect)
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -DRAWER_WIDTH,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setModalVisible(false);
                // Reset to initial position for next open
                slideAnim.setValue(-DRAWER_WIDTH);
                overlayOpacity.setValue(0);
            });
        }
    }, [isDrawerOpen]);

    const handleNavigate = (screenName: string) => {
        closeDrawer();
        setTimeout(() => {
            navigation.navigate(screenName);
        }, 300);
    };

    const handleClose = () => {
        closeDrawer();
    };

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            {/* Overlay */}
            <Animated.View
                style={[drawerStyles.overlay, { opacity: overlayOpacity }]}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={handleClose}
                />
            </Animated.View>

            {/* Drawer - Simple slide animation with rounded corners */}
            <Animated.View
                style={[
                    drawerStyles.drawer,
                    {
                        width: DRAWER_WIDTH,
                        transform: [{ translateX: slideAnim }],
                    },
                ]}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    {/* Header */}
                    <View style={drawerStyles.header}>
                        <View style={drawerStyles.profileSection}>
                            <Image
                                source={require('../../assets/pic.png')}
                                style={drawerStyles.profileImage}
                            />
                            <View style={drawerStyles.profileInfo}>
                                <Text style={drawerStyles.userName}>Abrar Ali</Text>
                                <Text style={drawerStyles.userEmail}>abrar@example.com</Text>
                            </View>
                        </View>
                    </View>

                    {/* Close Button - Moved down to avoid notch */}
                    <TouchableOpacity
                        style={drawerStyles.closeButton}
                        onPress={handleClose}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={24} color="#000000" />
                    </TouchableOpacity>

                    {/* Menu Items - No animation, just static */}
                    <View style={drawerStyles.menuContainer}>
                        <MenuItem
                            icon="home-outline"
                            text="Home"
                            onPress={() => handleNavigate('Home')}
                        />

                        <MenuItem
                            icon="wallet-outline"
                            text="Expense"
                            onPress={() => handleNavigate('Expense')}
                        />

                        <MenuItem
                            icon="checkbox-outline"
                            text="Todo"
                            onPress={() => handleNavigate('Todo')}
                        />

                        <View style={drawerStyles.divider} />

                        <MenuItem
                            icon="settings-outline"
                            text="Settings"
                            onPress={() => handleNavigate('ComingSoon')}
                        />

                        <MenuItem
                            icon="person-outline"
                            text="Profile"
                            onPress={() => handleNavigate('ComingSoon')}
                        />

                        <MenuItem
                            icon="help-circle-outline"
                            text="Help & Support"
                            onPress={() => handleNavigate('ComingSoon')}
                        />

                        <View style={drawerStyles.divider} />

                        <MenuItem
                            icon="log-out-outline"
                            text="Logout"
                            onPress={handleClose}
                            isLogout
                        />
                    </View>

                    {/* Footer */}
                    <View style={drawerStyles.footer}>
                        <Text style={drawerStyles.footerText}>Day Track v1.0.0</Text>
                    </View>
                </ScrollView>
            </Animated.View>
        </Modal>
    );
}

// Simple Menu Item - NO animation
interface MenuItemProps {
    icon: string;
    text: string;
    onPress: () => void;
    isLogout?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    text,
    onPress,
    isLogout = false,
}) => {
    return (
        <TouchableOpacity
            style={drawerStyles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name={icon}
                size={22}
                color={isLogout ? '#FF3B30' : '#000000'}
            />
            <Text
                style={[
                    drawerStyles.menuText,
                    isLogout && { color: '#FF3B30' },
                ]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};