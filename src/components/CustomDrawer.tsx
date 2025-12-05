// src/components/CustomDrawer.tsx (REPLACE ENTIRE FILE)

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
    Alert,
    Switch,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { useDrawer } from '../navigation/DrawerContext';
import { drawerStyles } from '../styles/drawerStyles';
import offlineStorageService from '../services/offlineStorageService';
import syncService from '../services/syncService';
import Colors from '../constants/colors';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

export default function CustomDrawer() {
    const { isDrawerOpen, closeDrawer } = useDrawer();
    const navigation = useNavigation<any>();
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [syncEnabled, setSyncEnabled] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStats, setSyncStats] = useState({ total: 0, pending: 0, synced: 0, failed: 0 });
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            loadSyncSettings();
        });

        return unsubscribe;
    }, []);

    // Load sync settings and stats
    const loadSyncSettings = async () => {
        const enabled = await offlineStorageService.isSyncEnabled();
        setSyncEnabled(enabled);

        const stats = await offlineStorageService.getSyncStats();
        setSyncStats(stats);

        const lastSync = await offlineStorageService.getLastSyncTime();
        setLastSyncTime(lastSync);
    };

    // Reload stats when drawer opens
    useEffect(() => {
        if (isDrawerOpen) {
            loadSyncSettings();
        }
    }, [isDrawerOpen]);

    useEffect(() => {
        if (isDrawerOpen) {
            setModalVisible(true);

            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
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

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout? Your offline data will remain safe.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await auth().signOut();
                            console.log('✅ User signed out successfully');
                            closeDrawer();
                        } catch (error) {
                            console.error('❌ Logout Error:', error);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleSignIn = () => {
        closeDrawer();
        setTimeout(() => {
            navigation.navigate('LoginScreen');
        }, 300);
    };

    // Handle cloud sync toggle
    const handleSyncToggle = async (value: boolean) => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to enable cloud sync.');
            return;
        }

        setSyncEnabled(value);
        await offlineStorageService.setSyncEnabled(value);

        if (value) {
            // Auto-sync when enabled
            Alert.alert(
                'Cloud Sync Enabled',
                'Your data will now sync with the cloud. Do you want to sync now?',
                [
                    { text: 'Later', style: 'cancel' },
                    {
                        text: 'Sync Now',
                        onPress: handleManualSync,
                    },
                ]
            );
        } else {
            Alert.alert(
                'Cloud Sync Disabled',
                'Your data will only be stored locally until you enable sync again.'
            );
        }
    };

    // Manual sync
    const handleManualSync = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to sync your data.');
            return;
        }

        if (!syncEnabled) {
            Alert.alert('Sync Disabled', 'Please enable cloud sync first.');
            return;
        }

        setIsSyncing(true);
        try {
            const result = await syncService.syncPendingTransactions();
            
            if (result.total === 0) {
                Alert.alert('Up to Date', 'All data is already synced!');
            } else if (result.failed === result.total) {
                // All items failed
                Alert.alert(
                    'Sync Failed',
                    `Failed to sync ${result.failed} item${result.failed > 1 ? 's' : ''}. Please check your internet connection and try again.`
                );
            } else if (result.failed > 0) {
                // Partial success
                Alert.alert(
                    'Partial Sync',
                    `Successfully synced ${result.success} out of ${result.total} items.\n${result.failed} item${result.failed > 1 ? 's' : ''} failed to sync.`
                );
            } else {
                // Complete success
                Alert.alert(
                    'Sync Complete',
                    `Successfully synced ${result.success} item${result.success > 1 ? 's' : ''}!`
                );
            }

            // Reload stats
            await loadSyncSettings();
        } catch (error) {
            console.error('Sync error:', error);
            Alert.alert('Sync Failed', 'Failed to sync data. Please try again.');
        } finally {
            setIsSyncing(false);
        }
    };

    const getUserName = () => {
        if (!user) return 'Guest User';
        return user.displayName || user.email?.split('@')[0] || 'User';
    };

    const getUserEmail = () => {
        if (!user) return 'Please sign in to continue';
        return user.email || 'No email';
    };

    const formatLastSync = () => {
        if (!lastSyncTime) return 'Never';
        
        const now = new Date();
        const diff = now.getTime() - lastSyncTime.getTime();
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <Animated.View
                style={[drawerStyles.overlay, { opacity: overlayOpacity }]}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={handleClose}
                />
            </Animated.View>

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
                            {user && user.photoURL ? (
                                <Image
                                    source={{ uri: user.photoURL }}
                                    style={drawerStyles.profileImage}
                                />
                            ) : (
                                <Image
                                    source={require('../../assets/pic.png')}
                                    style={drawerStyles.profileImage}
                                />
                            )}
                            <View style={drawerStyles.profileInfo}>
                                <Text style={drawerStyles.userName}>
                                    {getUserName()}
                                </Text>
                                <Text style={drawerStyles.userEmail} numberOfLines={1}>
                                    {getUserEmail()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={drawerStyles.closeButton}
                        onPress={handleClose}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={24} color="#000000" />
                    </TouchableOpacity>

                    {/* Cloud Sync Section */}
                    {user && (
                        <View style={styles.syncSection}>
                            <View style={styles.syncHeader}>
                                <View style={styles.syncTitleRow}>
                                    <Ionicons 
                                        name={syncEnabled ? "cloud-done-outline" : "cloud-offline-outline"} 
                                        size={20} 
                                        color={syncEnabled ? Colors.positiveColor : Colors.secondaryBlack} 
                                    />
                                    <Text style={styles.syncTitle}>Cloud Sync</Text>
                                </View>
                                <Switch
                                    value={syncEnabled}
                                    onValueChange={handleSyncToggle}
                                    trackColor={{ false: '#E0E0E0', true: Colors.positiveColor + '40' }}
                                    thumbColor={syncEnabled ? Colors.positiveColor : '#f4f3f4'}
                                />
                            </View>

                            {syncEnabled && (
                                <>
                                    <View style={styles.syncStats}>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statValue}>{syncStats.total}</Text>
                                            <Text style={styles.statLabel}>Total</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={[styles.statValue, { color: Colors.positiveColor }]}>
                                                {syncStats.synced}
                                            </Text>
                                            <Text style={styles.statLabel}>Synced</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={[styles.statValue, { color: '#FF9800' }]}>
                                                {syncStats.pending}
                                            </Text>
                                            <Text style={styles.statLabel}>Pending</Text>
                                        </View>
                                    </View>

                                    <View style={styles.lastSyncRow}>
                                        <Text style={styles.lastSyncLabel}>Last sync:</Text>
                                        <Text style={styles.lastSyncValue}>{formatLastSync()}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.syncButton}
                                        onPress={handleManualSync}
                                        disabled={isSyncing}
                                        activeOpacity={0.7}
                                    >
                                        {isSyncing ? (
                                            <ActivityIndicator color="#FFFFFF" size="small" />
                                        ) : (
                                            <>
                                                <Ionicons name="sync" size={16} color="#FFFFFF" />
                                                <Text style={styles.syncButtonText}>Sync Now</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </>
                            )}

                            {!syncEnabled && (
                                <Text style={styles.syncDisabledText}>
                                    Enable sync to backup your data to the cloud
                                </Text>
                            )}
                        </View>
                    )}

                    {/* Menu Items */}
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

                        {user && (
                            <>
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
                            </>
                        )}

                        <MenuItem
                            icon="help-circle-outline"
                            text="Help & Support"
                            onPress={() => handleNavigate('ComingSoon')}
                        />

                        <View style={drawerStyles.divider} />

                        {user ? (
                            <MenuItem
                                icon="log-out-outline"
                                text="Logout"
                                onPress={handleLogout}
                                isLogout
                            />
                        ) : (
                            <MenuItem
                                icon="log-in-outline"
                                text="Sign In / Sign Up"
                                onPress={handleSignIn}
                                isLogin
                            />
                        )}
                    </View>

                    {/* Footer */}
                    <View style={drawerStyles.footer}>
                        <Text style={drawerStyles.footerText}>Day Track v1.0.0</Text>
                        <Text style={styles.offlineModeText}>
                            {user ? (syncEnabled ? '☁️ Online Mode' : '📱 Offline Mode') : '👤 Guest Mode'}
                        </Text>
                    </View>
                </ScrollView>
            </Animated.View>
        </Modal>
    );
}

interface MenuItemProps {
    icon: string;
    text: string;
    onPress: () => void;
    isLogout?: boolean;
    isLogin?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    text,
    onPress,
    isLogout = false,
    isLogin = false,
}) => {
    const getColor = () => {
        if (isLogout) return '#FF3B30';
        if (isLogin) return '#34C759';
        return '#000000';
    };

    return (
        <TouchableOpacity
            style={drawerStyles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name={icon}
                size={22}
                color={getColor()}
            />
            <Text
                style={[
                    drawerStyles.menuText,
                    { color: getColor() },
                ]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const styles = {
    syncSection: {
        marginHorizontal: 20,
        marginTop: 8,
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
    },
    syncHeader: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: 12,
    },
    syncTitleRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 8,
    },
    syncTitle: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },
    syncStats: {
        flexDirection: 'row' as const,
        justifyContent: 'space-around' as const,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
        marginBottom: 12,
    },
    statItem: {
        alignItems: 'center' as const,
    },
    statValue: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-Bold',
        color: Colors.primaryBlack,
    },
    statLabel: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginTop: 2,
    },
    lastSyncRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        marginBottom: 12,
    },
    lastSyncLabel: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },
    lastSyncValue: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },
    syncButton: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: 6,
        backgroundColor: Colors.positiveColor,
        paddingVertical: 10,
        borderRadius: 10,
    },
    syncButtonText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
    },
    syncDisabledText: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        textAlign: 'center' as const,
        lineHeight: 18,
    },
    offlineModeText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginTop: 4,
        textAlign: 'center' as const,
    },
};